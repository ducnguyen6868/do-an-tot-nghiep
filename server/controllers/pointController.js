const User = require('../models/User');
const Point = require('../models/Point');

const patch = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User is required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.checkIn = true;
    await user.save();

    const point = await Point.findById(user.point);
    if (!point) {
      return res.status(404).json({ message: 'User point not found.' });
    }

    const now = new Date();
    const lastCheckIn = new Date(point.lastCheckIn);

    const diffDays = Math.floor((now - lastCheckIn) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      point.streak += 1;
      if (point.streak >= point.table.length) {
        point.streak = 0;
      }
    } else if (diffDays > 1) {
      point.streak = 0;
    }

    const newPoint = point.table[point.streak] || 0;
    point.quantity += newPoint;

    point.lastCheckIn = now;

    point.history = point.history || [];
    point.history.push({
      point: newPoint,
      action: 'Daily Check-in',
    });

    await point.save();

    return res.status(200).json({
      message: 'Check-in successful.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { patch };
