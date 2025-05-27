import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
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

const Artist = mongoose.model("Artist", ArtistSchema);

export default Artist;
