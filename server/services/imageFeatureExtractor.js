// services/imageFeatureExtractor.js
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs').promises;
const { createCanvas, loadImage } = require('canvas');

class ImageFeatureExtractor {
  constructor() {
    this.model = null;
  }

  async initialize() {
    if (!this.model) {
      console.log('⏳ Đang tải MobileNet model...');
      this.model = await mobilenet.load({
        version: 2,
        alpha: 1.0
      });
      console.log('✅ MobileNet model đã sẵn sàng!');
    }
  }

  async preprocessImage(imagePath) {
    try {
      const imageBuffer = await fs.readFile(imagePath);
      const image = await loadImage(imageBuffer);
      
      // Tạo canvas
      const canvas = createCanvas(224, 224);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, 224, 224);
      
      // Lấy ImageData
      const imageData = ctx.getImageData(0, 0, 224, 224);
      
      // Chuyển ImageData thành tensor theo format mà TensorFlow.js chấp nhận
      // Tạo tensor từ Uint8ClampedArray data
      const tensor = tf.tidy(() => {
        // Reshape data từ [224*224*4] thành [224, 224, 4]
        const pixels = tf.tensor3d(imageData.data, [224, 224, 4]);
        
        // Chỉ lấy 3 channels RGB (bỏ alpha channel)
        const rgb = pixels.slice([0, 0, 0], [224, 224, 3]);
        
        // Chuẩn hóa giá trị từ [0, 255] về [0, 1]
        const normalized = rgb.div(255.0);
        
        // Thêm batch dimension [1, 224, 224, 3]
        const batched = normalized.expandDims(0);
        
        return batched;
      });
      
      return tensor;
    } catch (error) {
      console.error('Lỗi xử lý ảnh:', error);
      throw error;
    }
  }

  async extractFeatures(imagePath) {
    await this.initialize();
    
    const tensor = await this.preprocessImage(imagePath);
    
    try {
      // Lấy embedding từ MobileNet
      const features = await this.model.infer(tensor, true);
      const featuresData = await features.data();
      
      // Giải phóng bộ nhớ
      tensor.dispose();
      features.dispose();
      
      // Chuẩn hóa vector
      const normalized = this.normalizeVector(Array.from(featuresData));
      return normalized;
    } catch (error) {
      tensor.dispose();
      throw error;
    }
  }

  normalizeVector(vector) {
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0)
    );
    return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
  }

  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }
    
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    
    return dotProduct;
  }
}

module.exports = new ImageFeatureExtractor();