import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Episode.css";

interface Episode {
  id: number;
  name: string;
}

interface EpisodeListProps {
  onSelectEpisode: (id: number) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ onSelectEpisode }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [height, setHeight] = useState<number>(window.innerHeight);
  const [myHeight, setMyHeight] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const deviceWidth = window.innerWidth;
      const navElement = document.querySelector('.rui-navbar-sticky');
      const navHeight = navElement instanceof HTMLElement ? navElement.offsetHeight : 0;
      const newHeight = window.innerHeight - navHeight;
      setHeight(newHeight);
      console.log("myHeight",myHeight);
      

      if (deviceWidth < 600) {
        setMyHeight(newHeight / 2 - 50);
      } else {
        setMyHeight(newHeight / 2 - 100);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    axios.get('https://rickandmortyapi.com/api/episode')
      .then(response => {
        setEpisodes(response.data.results);
        // setSelectedEpisode(response.data.results[0].id); 
        onSelectEpisode(response.data.results[0].id);
      })
      .catch(error => console.error(error));
  }, [onSelectEpisode]);

  const handleSelectEpisode = (id: number) => {
    setSelectedEpisode(id);
    onSelectEpisode(id);
  };

  return (
    <div className="w-1/4 p-4 ep_section mycalendar" style={{ height: myHeight + 450 }} >
      <h2 className="text-xl font-bold mb-4">Episodes</h2>
      <div className='mycalendarr' style={{ height: myHeight + 350 }}>
      <ul>
        {episodes.map(episode => (
          <li
            key={episode.id}
            className={`p-2 cursor-pointer border_edit my_hover ${selectedEpisode === episode.id ? 'bg-gray-800 text-white' : 'bg-gray-200 my_hover'}`}
            onClick={() => handleSelectEpisode(episode.id)}
          >
            {episode.name}
          </li>
        ))}
      </ul>
      </div>
    </div>

  );
};

export default EpisodeList;
