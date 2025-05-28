import Artist, { type ArtistType } from "~/server/models/artist";

export async function getAllArtist() {
  const artistData = await Artist.find().lean<ArtistType[]>();

  if (!artistData) {
    throw Error("artist Not Found on db");
  }

  const serializedArtistData = artistData.map((artist) => ({
    ...artist,
    id: artist._id.toString(),
  }));

  return serializedArtistData;
}
