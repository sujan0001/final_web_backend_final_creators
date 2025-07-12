// // models/CollectionModel.js

// const mongoose = require("mongoose");

// const CollectionSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//     },
//     coverImage: {
//       type: String, // store file path or URL
//     },
//     creator: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     certified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Collection", CollectionSchema);
const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String },
    coverImage:  { type: String },
    creator:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    certified:   { type: Boolean, default: false },

    // 👇 New soft delete flag
    isDeleted:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", CollectionSchema);
