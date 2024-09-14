import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      require: true,
    },
    descriptionShort: {
      type: String,
      require: true,
    },
    description: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0, // Đảm bảo giá không âm
    },
    // categoryId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    // },
    displayLocation: {
      type: String,
    },
    image: {
      type: String,
    },
    discount: {
      type: String,
      default: "0",
    },

    status: {
      type: String,
      enum: ["Hidden", "Active", "Delete"],
      default: "Hidden",
    },
  },
  {
    timestamps: true,
  },
  { versionKey: false }
);

export const Products = mongoose.model("product", productSchema);

// // Tạo index cho categoryId để tăng tốc tìm kiếm theo category
// productSchema.index({ categoryId: 1 });
