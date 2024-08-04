import React, { useState } from 'react';
import EpisodeList from './Episode/EpisodeList';
import CharacterFeed from './CharacterFeed/CharacterFeed';
import "./main.css"

const Main: React.FC = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const handleSelectEpisode = (id: number) => {
    setSelectedEpisode(id);
  };

  return (
    <div className='border_pixel'>
    <div className="flex the_flex">
     
      <EpisodeList onSelectEpisode={handleSelectEpisode} />
      <CharacterFeed episodeId={selectedEpisode} />
      </div>
    </div>
  );
};

export default Main;

export {};

