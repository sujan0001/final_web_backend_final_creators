// const Product = require("../models/ProductModel");
// const Collection = require("../models/CollectionModel");

// // ===== 1. Create Product (creator only) =====
// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, originalPrice, collection } = req.body;
//     const image = req.file ? req.file.path : null;

//     const newProduct = new Product({
//       name,
//       description,
//       image,
//       originalPrice,
//       collection,
//       creator: req.user._id,
//     });

//     await newProduct.save();

//     return res.status(201).json({ success: true, message: "Product created", data: newProduct });
//   } catch (err) {
//     console.error("Create Product Error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===== 2. Get Products of Current Creator =====
// exports.getMyProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ creator: req.user._id }).populate("collection");
//     return res.status(200).json({ success: true, data: products });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===== 3. Get All Products (admin) =====
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate("creator collection owner");
//     return res.status(200).json({ success: true, data: products });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===== 4. Get Products in a Collection (Marketplace) =====
// exports.getCollectionProducts = async (req, res) => {
//   try {
//     const products = await Product.find({
//       collection: req.params.collectionId,
//       onSale: true,
//     }).populate("creator owner");

//     return res.status(200).json({ success: true, data: products });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===== 5. Delete Product (admin or creator) =====
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) return res.status(404).json({ success: false, message: "Product not found" });

//     await product.deleteOne();

//     return res.status(200).json({ success: true, message: "Product deleted" });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===== 6. Update Product (only if unsold) =====
// exports.updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) return res.status(404).json({ success: false, message: "Product not found" });
//     if (product.owner) return res.status(403).json({ success: false, message: "Cannot update after sale" });

//     const { name, description, originalPrice } = req.body;
//     if (name) product.name = name;
//     if (description) product.description = description;
//     if (originalPrice) product.originalPrice = originalPrice;
//     if (req.file) product.image = req.file.path;

//     await product.save();

//     return res.status(200).json({ success: true, message: "Product updated", data: product });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===== 7. Buy Product (consumer) =====
// exports.buyProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product || !product.onSale) {
//       return res.status(400).json({ success: false, message: "Product not available for sale" });
//     }

//     const pricePaid = product.resalePrice || product.originalPrice;

//     // Push to history
//     product.soldHistory.push({
//       owner: req.user._id,
//       price: pricePaid,
//     });

//     product.owner = req.user._id;
//     product.onSale = false;
//     product.resalePrice = undefined;

//     await product.save();

//     return res.status(200).json({ success: true, message: "Product purchased", data: product });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===== 8. Resell Product (owner only) =====
// exports.resellProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) return res.status(404).json({ success: false, message: "Product not found" });
//     if (!product.owner || product.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, message: "Only owner can resell" });
//     }

//     const { resalePrice } = req.body;
//     if (!resalePrice) return res.status(400).json({ success: false, message: "Resale price required" });

//     product.resalePrice = resalePrice;
//     product.onSale = true;

//     await product.save();

//     return res.status(200).json({ success: true, message: "Product listed for resale", data: product });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===== 9. Get My Owned Products (consumer) =====
// exports.getMyOwnedProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ owner: req.user._id }).populate("creator collection");
//     return res.status(200).json({ success: true, data: products });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
const Product = require("../models/ProductModel");
const Collection = require("../models/CollectionModel");

// ===== 1. Create Product (creator only) =====
exports.createProduct = async (req, res) => {
  try {
    const { name, description, originalPrice, collection } = req.body;
    const image = req.file ? req.file.path : null;

    const newProduct = new Product({
      name,
      description,
      image,
      originalPrice,
      collection,
      creator: req.user._id,
      onSale: true,
    });

    await newProduct.save();

    return res.status(201).json({ success: true, message: "Product created", data: newProduct });
  } catch (err) {
    console.error("Create Product Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// // ===== 2. Get Products of Current Creator =====
// exports.getMyProducts = async (req, res) => {
//   try {
//     const products = await Product.find({
//       creator: req.user._id,
//       isDeleted: { $ne: true },
//     }).populate("collection", "title coverImage");

//     return res.status(200).json({ success: true, data: products });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// ===== 2. Get Products of Current Creator in a Specific Collection =====
exports.getMyProducts = async (req, res) => {
  try {
    const { collectionId } = req.params;

    const products = await Product.find({
      creator: req.user._id,
      collection: collectionId,
      isDeleted: { $ne: true },
    }).populate("collection", "title coverImage");

    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== 3. Get All Products (admin) =====
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: { $ne: true },
    }).populate("creator collection owner");

    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== 4. Get Products in a Collection (Marketplace) =====
exports.getCollectionProducts = async (req, res) => {
  try {
    const products = await Product.find({
      collection: req.params.collectionId,
      onSale: true,
      isDeleted: { $ne: true },
    }).populate("creator owner");

    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== 5. Delete Product (Admin = soft, Creator = hard if unsold) =====
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isCreator = product.creator.toString() === req.user._id.toString();

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (isAdmin) {
      product.isDeleted = true;
      await product.save();
      return res.status(200).json({ success: true, message: "Product soft-deleted by admin" });
    }

    // Creator delete check: no owner and no sold history
    if (product.owner || product.soldHistory.length > 0) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete product that has been sold or owned",
      });
    }

    await Product.findByIdAndDelete(product._id);
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== 6. Update Product (only if unsold) =====
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.owner) {
      return res.status(403).json({ success: false, message: "Cannot update after sale" });
    }

    const { name, description, originalPrice } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (originalPrice) product.originalPrice = originalPrice;
    if (req.file) product.image = req.file.path;

    await product.save();

    return res.status(200).json({ success: true, message: "Product updated", data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== 7. Buy Product (consumer) =====
exports.buyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.onSale || product.isDeleted) {
      return res.status(400).json({ success: false, message: "Product not available for sale" });
    }

    const pricePaid = product.resalePrice || product.originalPrice;

    product.soldHistory.push({
      owner: req.user._id,
      price: pricePaid,
    });

    product.owner = req.user._id;
    product.onSale = false;
    product.resalePrice = undefined;

    await product.save();

    return res.status(200).json({ success: true, message: "Product purchased", data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== 8. Resell Product (owner only) =====
exports.resellProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (!product.owner || product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only owner can resell" });
    }

    const { resalePrice } = req.body;
    if (!resalePrice) {
      return res.status(400).json({ success: false, message: "Resale price required" });
    }

    product.resalePrice = resalePrice;
    product.onSale = true;

    await product.save();

    return res.status(200).json({ success: true, message: "Product listed for resale", data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== 9. Get My Owned Products (consumer) =====
exports.getMyOwnedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      owner: req.user._id,
      isDeleted: { $ne: true },
    }).populate("creator collection");

    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== 10. Get Product by ID =====
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("creator collection owner");

    if (!product || product.isDeleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Products That Are On Sale and NOT Sold
// "owners list is null" → product is available / not sold
exports.getAvailableProducts = async (req, res) => {
  try {
    const products = await Product.find({
      onSale: true,
      owner: null,
      isDeleted: { $ne: true }
    }).populate("creator");

    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error("Error fetching available products:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Products That Are On Sale and ALREADY Sold
// "owners list has some data" → product has been bought
exports.getSoldProducts = async (req, res) => {
  try {
    const products = await Product.find({
      onSale: true,
      owner: { $ne: null },
      isDeleted: { $ne: true }
    }).populate("creator owner");

    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error("Error fetching sold products:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

