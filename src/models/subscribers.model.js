import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const SubscribersSchema = mongoose.Schema(
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

SubscribersSchema.plugin(mongooseAggregatePaginate);

export const Subscribers = mongoose.model("Subscribers", SubscribersSchema);
