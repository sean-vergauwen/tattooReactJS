import mongoose, { Schema, Document, Types } from "mongoose";
import { USER_ROLES } from "../Utils/user.constant";

export interface ArtistInterface extends Document {
  userName: string;
  password: string;
  address: string;
  website: string;
  tattooStyle: string;
  role: string;
  tattoos: Types.ObjectId[];
}

const artistSchema: Schema<ArtistInterface> = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, minlength: 6, required: true },
    address: { type: String, minlength: 4, required: true },
    website: { type: String, required: true },
    tattooStyle: { type: String, required: true },
    role: { type: String, required: true, default: USER_ROLES.ADMIN },
    tattoos: { type: [Schema.Types.ObjectId], ref: "Tattoos", required: false },
  },
  {
    timestamps: true,
  }
);

// Add indexes if necessary
artistSchema.index({ userName: 1 });

const Artist = mongoose.model<ArtistInterface>("Artists", artistSchema);

export default Artist;
