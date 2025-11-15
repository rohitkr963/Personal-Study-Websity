const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, default: "" },
    tags: { type: [String], default: [] },
    done: { type: Boolean, default: false },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    starred: { type: Boolean, default: false },
    category: { 
      type: String,
      default: "all"
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    reviewLevel: { type: Number, default: 1 },
    lastReviewed: { type: Date, default: Date.now },
    collection: { type: String, default: "default" },
    trashed: { type: Boolean, default: false }, // for soft delete/trash
  },
  { timestamps: true }
);

questionSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id.toString();
    if (ret.createdAt instanceof Date) ret.createdAt = ret.createdAt.getTime();
    if (ret.updatedAt instanceof Date) ret.updatedAt = ret.updatedAt.getTime();
    if (ret.lastReviewed instanceof Date) ret.lastReviewed = ret.lastReviewed.getTime();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Question", questionSchema);
