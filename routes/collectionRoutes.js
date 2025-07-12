const express = require("express");
const router = express.Router();
const {
  createCollection,
  getMyCollections,
  getAllCollections,
  getPublishedCollections,
  deleteCollection,
} = require("../controllers/collectionController");

const { 
  authenticateUser, 
  isAdmin, 
  isCreator, 
  isAdminOrCreatorOfCollection 
} = require("../middlewares/authorizedUsers");
const upload = require("../middlewares/fileupload");

// Create collection (with optional cover image)
router.post(
  "/create",
  authenticateUser,
  isCreator,
  upload.single("coverImage"),
  createCollection
);

// Get creator’s collections
router.get("/my", authenticateUser, isCreator, getMyCollections);

// Get all collections (admin)
router.get("/admin", authenticateUser, isAdmin, getAllCollections);

// Get public marketplace collections
router.get("/published", getPublishedCollections);

// Delete collection - only admin or creator of the collection can delete
router.delete("/:id", authenticateUser, isAdminOrCreatorOfCollection, deleteCollection);

module.exports = router;
