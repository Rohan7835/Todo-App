import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CategorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    priority: {
      type: String,
      default: "low",
      enum: ["low", "medium", "high", "critical"],
    },
  },
  { timestamps: true }
);

CategorySchema.plugin(mongooseAggregatePaginate);

export const Category = mongoose.model("Category", CategorySchema);
