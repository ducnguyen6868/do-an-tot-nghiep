const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
  section: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  last_modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);
