// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String, 
//             required: true
//         },
//         description: {
//             type: String, 
//             required: true 
//         },
//         price: { 
//             type: Number,
//             required: true 
//         }, 
//         originalPrice: { 
//             type: Number,
//              required: true
//         }, 
//         discountPercent: { 
//             type: Number
//         },
//         youSave: { 
//             type: Number
//         },
//         quantity: { 
//             type: Number, 
//             required: true 
//         },
//         filepath: { 
//             type: String, 
//             required: true 
//         }, 
//         categoryId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Category",
//             required: true
//         },
//         ribbonId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Ribbon",
//             default: null
//         }
//     }, 
//     { 
//         timestamps: true 
//     }
// );

// module.exports = mongoose.model("Product", ProductSchema);


// start from here -----------------------------------------------------------------------------
// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   image: { type: String, required: true }, // image filepath
//   price: { type: Number, required: true },

//   // Relationships
//   creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null if not sold yet
//   onSale: { type: Boolean, default: false }, // IMPORTANT FOR MARKETPLACE DISPLAY

//   // Certification
//   certified: { type: Boolean, default: false },

//   // Ownership History
//   previousOwners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// }, { timestamps: true });

// module.exports = mongoose.model("Product", ProductSchema);

// end here ----------------------------------------------------------------------
// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   image: { type: String, required: true }, // image filepath
//   originalPrice: { type: Number, required: true }, // original creator price
//   resalePrice: { type: Number }, // optional - only present during resell

//   // Relationships
//   creator: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   collection: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Collection",
//     required: true,
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   }, // null if not sold yet

//   // Marketplace control
//   onSale: { type: Boolean, default: false }, // important for showing in marketplace
//   certified: { type: Boolean, default: false },

//   // Ownership history
//   soldHistory: [
//     {
//       owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       price: Number,
//       date: { type: Date, default: Date.now },
//     },
//   ],
// }, { timestamps: true });
// updating the code again-------------------------------------------------------------
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    description:  { type: String },
    image:        { type: String, required: true },
    originalPrice:{ type: Number, required: true },
    resalePrice:  { type: Number },

    // Relationships
    creator:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
    owner:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Marketplace and certification
    onSale:     { type: Boolean, default: false },
    certified:  { type: Boolean, default: false },

    // Ownership history
    soldHistory: [
      {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        price: Number,
        date: { type: Date, default: Date.now },
      },
    ],

    // 👇 New soft delete flag
    isDeleted:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
