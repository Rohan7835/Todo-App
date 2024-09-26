import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const ProfileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    favourite_blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    bio: {
      type: String,
    },
    instagram_link: String,
    theme_preference: {
      type: String,
      enum: ["Dark", "Light"],
      default: "Dark",
    },
  },
  { timestamps: true }
);

ProfileSchema.plugin(mongooseAggregatePaginate);

export const Profile = mongoose.model("Profile", ProfileSchema);
