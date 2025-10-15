const Recipient = require('../models/Recipient');
const User = require('../models/User');

const recipient = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate('recipients')
      .select('recipients -_id');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ recipients: user.recipients });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const addRecipient = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data } = req.body;

    if (!data.name || !data.phone || !data.address || !data.type) {
      return res.status(400).json({
        message: "Missing recipient fields (name, phone or address)."
      });
    }

    const newRecipient = await Recipient.create({
      name: data.name,
      phone: data.phone,
      address: data.address,
      type: data.type
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.recipients.push(newRecipient._id);
    await user.save();

    return res.status(201).json({
      message: "Add address successful.",
      recipient: newRecipient
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error: " + err.message
    });
  }
};

const deleteRecipient = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipientId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.recipients.findIndex(id => id.toString() === recipientId);
    if (index === -1) {
      return res.status(404).json({ message: 'Recipient not found in user list' });
    }

    await Recipient.findByIdAndDelete(recipientId);

    user.recipients.splice(index, 1);
    await user.save();

    return res.status(200).json({ message: 'Recipient deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
};


const setDefaultRecipient = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { recipientId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exists = user.recipients.find(
      (id) => id.toString() === recipientId
    );
    if (!exists) {
      return res
        .status(404)
        .json({ message: 'Recipient not found in user list' });
    }

    await Recipient.updateMany(
      { _id: { $in: user.recipients } },
      { isDefault: false }
    );

    await Recipient.findByIdAndUpdate(recipientId, { isDefault: true });

    return res.status(200).json({ message: 'Set default address successful.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const editRecipient = async (req,res)=>{
  const {recipient}= req.body;
  if(!recipient){
    return res.status(400).json({
      message:"Recipient is required."
    });
  }
  try{
    const isRecipient = await Recipient.findById(recipient.id);
    if(!isRecipient){
      return res.status(404).json({
        message:"Recipient not found."
      });
    }
    const changeRecipient = await Recipient.findByIdAndUpdate(recipient.id,{
      $set:{
        name:recipient.name,
        phone:recipient.phone,
        address:recipient.address
      }
    })
    changeRecipient.save();
    return res.status(200).json({
      message:"Change recipient successful."
    })
  }catch(err){
    return res.status(500).json({
      message:"Server error: "+err.message
    });
  }

}
module.exports = { recipient, addRecipient, deleteRecipient , setDefaultRecipient , editRecipient };
