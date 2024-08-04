import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CharacterFeed.css"

interface Character {
  id: number;
  name: string;
  image: string;
}

interface CharacterFeedProps {
  episodeId: number | null;
}


const CharacterFeed: React.FC<CharacterFeedProps> = ({ episodeId }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState<number>(1);
  const [info, setInfo] = useState<{ pages: number; next: string | null; prev: string | null }>({ pages: 1, next: null, prev: null });

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
    console.log("episodeiddddddddddd",episodeId);

    if (episodeId) {
        console.log("episodeId", episodeId);
        
      axios.get(`https://rickandmortyapi.com/api/episode/${episodeId}`)
        .then(response => {
          console.log("c haracterlog", characters);
          console.log("character.name", response.data.characters.name);
          fetchCharacters(page)
          

          const characterUrls = response.data.characters;
          return Promise.all(characterUrls.map((url: string) => axios.get(url)));
        })
        .then(responses => setCharacters(responses.map(res => res.data)))   
        .catch(error => console.error(error));
    } 
  }, [episodeId]);


//   const pagination = () => {
//     axios.get(`https://rickandmortyapi.com/api/character?page=${page}`)
//     .then(response => {
//       setCharacters(response.data.results);
//       console.log("c haracterlog", characters);
      
 
//     })
//   }

  const handlePrevPage = () => {
    if (info.prev) {
      setPage(page - 1);
      fetchCharacters(page)

    }
    
  };

  const handleNextPage = () => {
    if (info.next) {
      setPage(page + 1);
      fetchCharacters(page)

    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
    fetchCharacters(pageNumber)

  };


  const fetchCharacters = (page: number) => {
    axios.get(`https://rickandmortyapi.com/api/character?page=${page}`)
      .then(response => {
        setCharacters(response.data.results);
        setInfo({
          pages: response.data.info.pages,
          next: response.data.info.next,
          prev: response.data.info.prev,
        });
      })
      .catch(error => console.error(error));
  };


  const pagesToShow = 10; 
  const startPage = Math.max(1, page - Math.floor(pagesToShow / 2));
  const endPage = Math.min(info.pages, page + Math.floor(pagesToShow / 2));
  

  return (
    <div className="w-3/4 p-4">
      <h2 style={{textAlign:"center"}} className="text-xl font-bold mb-4">Rick and Morty Character</h2>
      <div className="grid grid-cols-4 gap-4 mycalendar" style={{height:myHeight + 280}}>
        {characters.map(character => (
          <div key={character.id} className="bg-white p-4 shadow-md rounded-lg charcater_img">
            <img src={character.image} alt={character.name} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="text-lg font-bold mt-2">{character.name}</h3>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center mt-4">
          <div className="flex justify-between w-full mb-4">
            <button onClick={handlePrevPage} disabled={!info.prev} className="bg-gray-200 px-4 py-2 rounded-lg">
              Previous
            </button>
            <div className="flex items-center">
              <span className="mr-4">Page {page} of {info.pages}</span>
              <div className="flex space-x-2">
                {startPage > 1 && (
                  <>
                    <button
                      onClick={() => handlePageClick(1)}
                      className={`px-3 py-1 rounded-lg ${page === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      1
                    </button>
                    {startPage > 2 && <span className="px-3 py-1">...</span>}
                  </>
                )}
                {Array.from({ length: Math.min(pagesToShow, info.pages) }, (_, index) => {
                  const pageNumber = startPage + index;
                  if (pageNumber <= endPage) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                        className={`px-3 py-1 rounded-lg ${page === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  return null;
                })}
                {endPage < info.pages && (
                  <>
                    {endPage < info.pages - 1 && <span className="px-3 py-1">...</span>}
                    <button
                      onClick={() => handlePageClick(info.pages)}
                      className={`px-3 py-1 rounded-lg ${page === info.pages ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {info.pages}
                    </button>
                  </>
                )}
              </div>
            </div>
            <button onClick={handleNextPage} disabled={!info.next} className="bg-gray-200 px-4 py-2 rounded-lg">
              Next
            </button>
          </div>
    {/* //   )} */}
    </div>
    </div>

  );
};

export default CharacterFeed;

export {};
