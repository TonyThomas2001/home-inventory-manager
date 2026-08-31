const express = require("express");
const {
  getStats,
  getUsers,
  deleteUser,
  getUserItems,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/stats", protect, adminOnly, getStats);
router.get("/users", protect, adminOnly, getUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/users/:id/items", protect, adminOnly, getUserItems);

module.exports = router;
