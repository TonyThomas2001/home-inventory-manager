const User = require("../models/User");
const Item = require("../models/Item");

const getStats = async (req, res) => {
  try {
    const [registeredUsers, totalItems] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
    ]);
    res.json({ registeredUsers, totalItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: 1 });

    const counts = await Item.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

    const usersWithCounts = users.map((u) => ({
      ...u.toJSON(),
      itemCount: countMap.get(u._id.toString()) || 0,
    }));

    res.json(usersWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user.id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    await user.deleteOne();

    await Item.deleteMany({ userId: req.params.id });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserItems = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const items = await Item.find({ userId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json({ user, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getUsers, deleteUser, getUserItems };
