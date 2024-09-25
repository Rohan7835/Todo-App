import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const SubscribersSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

SubscribersSchema.plugin(mongooseAggregatePaginate);

export const Subscribers = mongoose.model("Subscribers", SubscribersSchema);
