import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  statement: {
    type: String,
    trim: true,
    maxlength: 1000,
    required: true,
  },
  techniques: [{ type: String, trim: true }],
  education: { type: String, trim: true },
  website: { type: String, trim: true },
  socialMedia: {
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
  },
});

export type ArtistType = mongoose.InferSchemaType<typeof ArtistSchema> & { _id: string };

const Artist = mongoose.model("Artist", ArtistSchema);

export default Artist;
