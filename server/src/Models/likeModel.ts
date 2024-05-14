import mongoose, { Schema, Document, Types } from "mongoose";

export interface LikeInterface extends Document {
  tattooId: Types.ObjectId;
  userId: Types.ObjectId;
  like: boolean;
}

const likeSchema: Schema<LikeInterface> = new Schema(
  {
    tattooId: { type: Schema.Types.ObjectId, ref: "Tattoos", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    like: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model<LikeInterface>("Likes", likeSchema);

export default Like;
