import mongoose, { Schema, Document, Types } from "mongoose";
import { USER_ROLES } from "../Utils/user.constant";

export interface UserInterface extends Document {
  userName: string;
  password: string;
  role: string;
  tattoos: Types.ObjectId[];
}

const userSchema: Schema<UserInterface> = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, minlength: 6, required: true },
    role: { type: String, required: true, default: USER_ROLES.USER },
    tattoos: {
      type: [Schema.Types.ObjectId],
      ref: "Tattoos",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes if necessary
userSchema.index({ userName: 1 });

const User = mongoose.model<UserInterface>("Users", userSchema);

export default User;
