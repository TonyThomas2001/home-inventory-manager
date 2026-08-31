const Item = require("../models/Item");

const getItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  const { name, category, quantity, price, location, description } = req.body;

  if (
    !name ||
    !category ||
    quantity === undefined ||
    price === undefined ||
    !location
  ) {
    return res
      .status(400)
      .json({
        message: "Name, category, quantity, price, and location are required",
      });
  }

  try {
    const item = await Item.create({
      userId: req.user.id,
      name,
      category,
      quantity,
      price,
      location,
      description,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  const { name, category, quantity, price, location, description } = req.body;
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this item" });
    }

    item.name = name || item.name;
    item.category = category || item.category;
    item.quantity = quantity !== undefined ? quantity : item.quantity;
    item.price = price !== undefined ? price : item.price;
    item.location = location || item.location;
    item.description =
      description !== undefined ? description : item.description;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this item" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
