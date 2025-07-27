// const express = require("express");
// const router = express.Router();
// const {
//   createProduct,
//   getMyProducts,
//   getAllProducts,
//   getCollectionProducts,
//   deleteProduct,
//   updateProduct,
//   getMyOwnedProducts,
//   resellProduct,
//   buyProduct,
//   getProductById,
//   getAvailableProducts,
//   getSoldProducts,
// } = require("../controllers/productController");

// const {
//   authenticateUser,
//   isAdmin,
//   isCreator,
//   isConsumer,
//   isAdminOrCreatorOfProduct,
// } = require("../middlewares/authorizedUsers");


// const upload = require("../middlewares/fileupload");

// // ========== PRODUCT ROUTES ==========

// // [1] Creator: Create Product
// router.post(
//   "/create",
//   authenticateUser,
//   isCreator,
//   upload.single("image"),
//   createProduct
// );

// // [2] Creator: Get My Products
// // router.get("/my", authenticateUser, isCreator, getMyProducts);
// router.get(
//   "/my/collection/:collectionId",
//   authenticateUser,
//   isCreator,
//   getMyProducts
// );
// // that is not sold to AnalyserNode, and are on sale
// router.get("/available", getAvailableProducts);
// //that is sold and consumers want to sell it again-it will go to secondary marketplace
// router.get("/sold", getSoldProducts);

// // [3] Admin: View All Products
// router.get("/admin", authenticateUser, isAdmin, getAllProducts);

// // [4] Public: Get Products in a Collection (onSale only)
// router.get("/collection/:collectionId", getCollectionProducts);





// // [5] Admin or Creator: Delete Product
// router.delete("/:id", authenticateUser, isAdminOrCreatorOfProduct, deleteProduct);

// // [6] Admin or Creator: Update Product (only if unsold)
// router.put("/:id", authenticateUser, isAdminOrCreatorOfProduct, upload.single("image"), updateProduct);

// // [7] Consumer: Buy Product
// router.post("/buy/:id", authenticateUser, isConsumer, buyProduct);

// // [8] Consumer: Resell Product
// router.put("/resell/:id", authenticateUser, isConsumer, resellProduct);

// // [9] Consumer: View Owned Products
// router.get("/ownership/my", authenticateUser, isConsumer, getMyOwnedProducts);


// // [10] Public: Get Product by ID (for detail page)
// router.get("/:id", getProductById); // 🚨 This must be last in the file

// module.exports = router;

// this is after the testing disrupted the frontend and backend so doing it again======================
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
  requestProductTransfer,
  respondToTransferRequest,
  getIncomingTransferRequests,
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

// [2] Creator: Get My Products in a Collection
router.get(
  "/my/collection/:collectionId",
  authenticateUser,
  isCreator,
  getMyProducts
);

// [3] Public: Available (onSale + never sold)
router.get("/available", getAvailableProducts);

// [4] Public: Sold + Reselling (secondary marketplace)
router.get("/sold", getSoldProducts);

// [5] Admin: View All Products
router.get("/admin", authenticateUser, isAdmin, getAllProducts);

// [6] Public: Get Products by Collection
router.get("/collection/:collectionId", getCollectionProducts);

// [7] Admin or Creator: Delete Product
router.delete("/:id", authenticateUser, isAdminOrCreatorOfProduct, deleteProduct);

// [8] Admin or Creator: Update Product (only if unsold)
router.put("/:id", authenticateUser, isAdminOrCreatorOfProduct, upload.single("image"), updateProduct);

// [9] Consumer: Buy Product (❌ deprecated if using request-transfer flow)
router.post("/buy/:id", authenticateUser, isConsumer, buyProduct);

// [10] Consumer: Resell Product
router.put("/resell/:id", authenticateUser, isConsumer, resellProduct);

// [11] Consumer: My Owned Products
router.get("/ownership/my", authenticateUser, isConsumer, getMyOwnedProducts);

// [12] Consumer: Request Transfer Instead of Direct Buy ✅
router.post("/request-transfer/:id", authenticateUser, isConsumer, requestProductTransfer);

// [13] Creator/Owner: Approve/Decline Transfer Request ✅
router.post("/respond-transfer/:id", authenticateUser, respondToTransferRequest);

// [14] Creator/Owner: View Incoming Transfer Requests ✅
router.get("/incoming-transfers", authenticateUser, getIncomingTransferRequests);

// [15] Public: Product by ID (keep last)
router.get("/:id", getProductById);

module.exports = router;

