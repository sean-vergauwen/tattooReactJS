import mongoose, { Schema, Document, Types } from "mongoose";

export interface CommentInterface extends Document {
  tattooId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  comment: string;
}

const commentSchema: Schema<CommentInterface> = new Schema(
  {
    tattooId: { type: Schema.Types.ObjectId, ref: "Tattoos", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    userName: { type: String, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<CommentInterface>("Comments", commentSchema);

export default Comment;
