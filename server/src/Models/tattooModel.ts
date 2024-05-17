import mongoose, { Schema, Document, Types } from "mongoose";

export interface TattooInterface extends Document {
  name: string;
  description: string;
  image: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  tattooStyle: string;
}

const tattooSchema: Schema<TattooInterface> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    likes: { type: [Schema.Types.ObjectId], ref: "Likes", required: false },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comments",
      required: false,
    },
    tattooStyle: { type: String },
  },
  {
    timestamps: true,
  }
);

const Tattoo = mongoose.model<TattooInterface>("Tattoos", tattooSchema);

export default Tattoo;
