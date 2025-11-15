const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true }, // for URL-safe name
    icon: { type: String, default: "Folder" }, // icon name from lucide
    color: { type: String, default: "indigo" }, // tailwind color
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isDefault: { type: Boolean, default: false }, // to identify default categories
    order: { type: Number, default: 0 }, // for ordering
  },
  { timestamps: true }
);

categorySchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Category", categorySchema);
