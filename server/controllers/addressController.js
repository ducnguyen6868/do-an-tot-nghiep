const Address = require('../models/Address');
const User = require('../models/User');

const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate('addresses')
      .select('addresses -_id');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const postAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data } = req.body;

    if (!data.name || !data.phone || !data.address || !data.type) {
      return res.status(400).json({
        message: "Missing address fields (name, phone or address)."
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    let newAddress;
    if (user.addresses.length === 0) {
      newAddress = await Address.create({
        name: data.name,
        phone: data.phone,
        address: data.address,
        type: data.type,
        isDefault: true
      });
    } else {
      newAddress = await Address.create({
        name: data.name,
        phone: data.phone,
        address: data.address,
        type: data.type
      });
    }
    user.addresses.push(newAddress._id);
    await user.save();

    return res.status(201).json({
      message: "Add address successful.",
      address: newAddress
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error: " + err.message
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.addresses.findIndex(id => id.toString() === addressId);
    if (index === -1) {
      return res.status(404).json({ message: 'Address not found in user list' });
    }

    await Address.findByIdAndDelete(addressId);

    user.addresses.splice(index, 1);
    await user.save();

    return res.status(200).json({ message: 'Address deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
};


const patchAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exists = user.addresses.find(
      (id) => id.toString() === addressId
    );
    if (!exists) {
      return res
        .status(404)
        .json({ message: 'Address not found in user list' });
    }

    await Address.updateMany(
      { _id: { $in: user.addresses } },
      { isDefault: false }
    );

    await Address.findByIdAndUpdate(addressId, { isDefault: true });

    return res.status(200).json({ message: 'Set default address successful.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const putAddress = async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({
      message: "Address is required."
    });
  }
  try {
    const isAddress = await Address.findById(address.id);
    if (!isAddress) {
      return res.status(404).json({
        message: "Address not found."
      });
    }
    const changeAddress = await Address.findByIdAndUpdate(address.id, {
      $set: {
        name: address.name,
        phone: address.phone,
        address: address.address
      }
    })
    changeAddress.save();
    return res.status(200).json({
      message: "Change address successful."
    })
  } catch (err) {
    return res.status(500).json({
      message: "Server error: " + err.message
    });
  }

}
module.exports = { getAddress, postAddress, deleteAddress, patchAddress, putAddress };
