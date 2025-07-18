// const Collection = require("../models/CollectionModel");
// const Product = require("../models/ProductModel");

// // ========== 1. Create Collection (Creator only) ==========
// exports.createCollection = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const coverImage = req.file ? req.file.path : null;

//     const collection = new Collection({
//       title,
//       description,
//       coverImage,
//       creator: req.user._id,
//     });

//     await collection.save();

//     return res.status(201).json({
//       success: true,
//       message: "Collection created successfully",
//       data: collection,
//     });
//   } catch (err) {
//     console.error("Create Collection Error:", err);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ========== 2. Get My Collections (Creator) ==========
// exports.getMyCollections = async (req, res) => {
//   try {
//     const collections = await Collection.find({ creator: req.user._id }).sort({ createdAt: -1 });
//     return res.status(200).json({ success: true, data: collections });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ========== 3. Get All Collections (Admin only) ==========
// exports.getAllCollections = async (req, res) => {
//   try {
//     const collections = await Collection.find().populate("creator", "firstName lastName email");
//     return res.status(200).json({ success: true, data: collections });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ========== 4. Get Published Collections (Public/Consumer) ==========
// exports.getPublishedCollections = async (req, res) => {
//   try {
//     // Fetch only collections that have at least 1 published (onSale) product
//     const collections = await Collection.find()
//       .populate({
//         path: "creator",
//         select: "firstName lastName"
//       });

//     // Manually filter only those that have on-sale products
//     const visibleCollections = [];

//     for (const col of collections) {
//       const hasProducts = await Product.exists({ collection: col._id, onSale: true });
//       if (hasProducts) visibleCollections.push(col);
//     }

//     return res.status(200).json({ success: true, data: visibleCollections });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ========== 5. Delete Collection (Creator or Admin) ==========
// exports.deleteCollection = async (req, res) => {
//   try {
//     const collection = await Collection.findById(req.params.id);

//     if (!collection) {
//       return res.status(404).json({ success: false, message: "Collection not found" });
//     }

//     // Only creator or admin can delete
//     if (
//       req.user.role !== "admin" &&
//       String(collection.creator) !== String(req.user._id)
//     ) {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     // Delete all products inside this collection
//     await Product.deleteMany({ collection: collection._id });

//     await Collection.findByIdAndDelete(collection._id);

//     return res.status(200).json({ success: true, message: "Collection deleted" });
//   } catch (err) {
//     console.error("Delete Collection Error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
const Collection = require("../models/CollectionModel");
const Product = require("../models/ProductModel");
const mongoose = require("mongoose");


// ========== 1. Create Collection (Creator only) ==========
exports.createCollection = async (req, res) => {
  try {
    const { title, description } = req.body;
    const coverImage = req.file ? req.file.path : null;

    const collection = new Collection({
      title,
      description,
      coverImage,
      creator: req.user._id,
    });

    await collection.save();

    return res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: collection,
    });
  } catch (err) {
    console.error("Create Collection Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ========== 2. Get My Collections (Creator) ==========
exports.getMyCollections = async (req, res) => {
  try {
    const collections = await Collection.find({
      creator: req.user._id,
      isDeleted: { $ne: true }
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: collections });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========== 3. Get All Collections (Admin only) ==========
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find({
      isDeleted: { $ne: true }
    }).populate("creator", "firstName lastName email");

    return res.status(200).json({ success: true, data: collections });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========== 4. Get Published Collections (Public/Consumer) ==========
exports.getPublishedCollections = async (req, res) => {
  try {
    const collections = await Collection.find({
      isDeleted: { $ne: true }
    }).populate({
      path: "creator",
      select: "firstName lastName"
    });

    const visibleCollections = [];

    for (const col of collections) {
      const hasProducts = await Product.exists({
        collection: col._id,
        onSale: true
      });
      if (hasProducts) visibleCollections.push(col);
    }

    return res.status(200).json({ success: true, data: visibleCollections });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========== 5. Delete Collection (Creator or Admin) ==========
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }

    const isCreator = String(collection.creator) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (isAdmin) {
      // Soft delete for admins
      collection.isDeleted = true;
      await collection.save();
      return res.status(200).json({ success: true, message: "Collection soft-deleted by admin" });
    }

    // Creator trying to delete: check if any product is owned
    const hasSoldProduct = await Product.exists({
      collection: collection._id,
      owner: { $ne: null }
    });

    if (hasSoldProduct) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete collection. Some products have been sold."
      });
    }

    // Safe to delete: hard delete products + collection
    await Product.deleteMany({ collection: collection._id });
    await Collection.findByIdAndDelete(collection._id);

    return res.status(200).json({ success: true, message: "Collection deleted successfully" });
  } catch (err) {
    console.error("Delete Collection Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
//this is what's being used for fetching all the products of a particular collection 
// exports.getCollectionById = async (req, res) => {
//   try {
//     const collection = await Collection.findById(req.params.id);

//     if (!collection) {
//       return res.status(404).json({ success: false, message: "Collection not found" });
//     }

//     return res.status(200).json({ success: true, data: collection });
//   } catch (err) {
//     console.error("Error fetching collection:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
exports.getCollectionById = async (req, res) => {
  const { id } = req.params;

  // Check if valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid collection ID" });
  }

  try {
    const collection = await Collection.findById(id).populate("creator", "firstName lastName email");

    if (!collection || collection.isDeleted) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }

    return res.status(200).json({ success: true, data: collection });
  } catch (err) {
    console.error("Error fetching collection:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
