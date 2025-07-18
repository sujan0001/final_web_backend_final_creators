const express = require("express");
const router = express.Router();
const {
  createProduct,
  getMyProducts,
  getAllProducts,
  getCollectionProducts,
  deleteProduct,
  updateProduct,
  getMyOwnedProducts,
  resellProduct,
  buyProduct,
  getProductById,
  getAvailableProducts,
  getSoldProducts,
} = require("../controllers/productController");

const {
  authenticateUser,
  isAdmin,
  isCreator,
  isConsumer,
  isAdminOrCreatorOfProduct,
} = require("../middlewares/authorizedUsers");


const upload = require("../middlewares/fileupload");

// ========== PRODUCT ROUTES ==========

// [1] Creator: Create Product
router.post(
  "/create",
  authenticateUser,
  isCreator,
  upload.single("image"),
  createProduct
);

// [2] Creator: Get My Products
// router.get("/my", authenticateUser, isCreator, getMyProducts);
router.get(
  "/my/collection/:collectionId",
  authenticateUser,
  isCreator,
  getMyProducts
);
// that is not sold to AnalyserNode, and are on sale
router.get("/available", getAvailableProducts);
//that is sold and consumers want to sell it again-it will go to secondary marketplace
router.get("/sold", getSoldProducts);

// [3] Admin: View All Products
router.get("/admin", authenticateUser, isAdmin, getAllProducts);

// [4] Public: Get Products in a Collection (onSale only)
router.get("/collection/:collectionId", getCollectionProducts);





// [5] Admin or Creator: Delete Product
router.delete("/:id", authenticateUser, isAdminOrCreatorOfProduct, deleteProduct);

// [6] Admin or Creator: Update Product (only if unsold)
router.put("/:id", authenticateUser, isAdminOrCreatorOfProduct, upload.single("image"), updateProduct);

// [7] Consumer: Buy Product
router.post("/buy/:id", authenticateUser, isConsumer, buyProduct);

// [8] Consumer: Resell Product
router.put("/resell/:id", authenticateUser, isConsumer, resellProduct);

// [9] Consumer: View Owned Products
router.get("/ownership/my", authenticateUser, isConsumer, getMyOwnedProducts);


// [10] Public: Get Product by ID (for detail page)
router.get("/:id", getProductById); // 🚨 This must be last in the file

module.exports = router;