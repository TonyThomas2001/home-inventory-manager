const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, maxlength: 20 },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0, max: 999999 },
    location: { type: String, required: true },
    description: { type: String, maxlength: 150 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);
