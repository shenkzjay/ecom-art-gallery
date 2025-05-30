import React from "react";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  image: string;
}

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  return (
    <div className="bg-white rounded-lg  overflow-hidden">
      <img src={artwork.image} alt={artwork.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{artwork.title}</h3>
        <p className="text-sm text-gray-500">{artwork.artist}</p>
      </div>
    </div>
  );
};

export default ArtworkCard;
