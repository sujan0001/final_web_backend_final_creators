const express = require("express");
const router = express.Router();
const {
  createCollection,
  getMyCollections,
  getAllCollections,
  getPublishedCollections,
  deleteCollection,
  getCollectionById, // ✅ Add this
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

router.get("/allCollection", getAllCollections);
// Get creator’s collections
router.get("/my", authenticateUser, isCreator, getMyCollections);

// Get all collections (admin)
router.get("/admin", authenticateUser, isAdmin, getAllCollections);



// Get public marketplace collections
router.get("/published", getPublishedCollections);

// Delete collection - only admin or creator of the collection can delete
router.delete("/:id", authenticateUser, isAdminOrCreatorOfCollection, deleteCollection);

// ✅ This is being used to fetch all the products inside a particular collection
router.get("/:id", authenticateUser, isCreator, getCollectionById); 

// This allows /collections/:collectionId

module.exports = router;
