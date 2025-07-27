
// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     name:         { type: String, required: true },
//     description:  { type: String },
//     image:        { type: String, required: true },
//     originalPrice:{ type: Number, required: true },
//     resalePrice:  { type: Number },

//     // Relationships
//     creator:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
//     owner:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     // Marketplace and certification
//     onSale:     { type: Boolean, default: false },
//     certified:  { type: Boolean, default: false },

//     // Ownership history
//     soldHistory: [
//       {
//         owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         price: Number,
//         date: { type: Date, default: Date.now },
//       },
//     ],
//     // Inside ProductSchema
//     pendingTransfer: {
//       isPending: { type: Boolean, default: false },
//       buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//     },


//     // 👇 New soft delete flag
//     isDeleted:   { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", ProductSchema);


const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    description:   { type: String },
    image:         { type: String, required: true },
    originalPrice: { type: Number, required: true },
    resalePrice:   { type: Number },

    // Relationships
    creator:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
    owner:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Marketplace and certification
    onSale:     { type: Boolean, default: false },
    certified:  { type: Boolean, default: false },

    // Pending transfer logic (new)
    pendingTransfer: {
      isPending: { type: Boolean, default: false },
      buyer:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },

    // Ownership history
    soldHistory: [
      {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        price: Number,
        date: { type: Date, default: Date.now },
      },
    ],

    // Soft delete flag
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
