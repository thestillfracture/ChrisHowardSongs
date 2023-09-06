import Song from '../components/Song';
import { useEffect } from 'react';

const SongList = ({
  songs,
  bucket,
  setMySongs,
  mySongs,
  isPlaying,
  setPlaying,
  playAll,
  mySongRef,
  setPlayAll,
  startUp,
  rewind,
  pausePlaying,
  nextSongFn,
  songEnded,
  setBucket,
  yourSongOrder,
  setYourSongOrder,
  yourSongs,
  setYourSongs,
  curYourSongOrder,
}) => {
  useEffect(() => {
    if (isPlaying != null) {
      isPlaying.pause();
      setPlaying({});
    }

    // we really only want this to run once and only
    if (
      mySongs.length !== 0 &&
      bucket === 'my-song-bucket' &&
      localStorage.getItem('songs') != null
    ) {
      if (document.readyState == 'complete') {
        getLocalStorage();
      } else {
        window.addEventListener('load', getLocalStorage);
        return () => window.removeEventListener('load', getLocalStorage);
      }
    } else {
      setMySongs(mySongs.map((song) => ({ ...song, playStatus: 'no' })));
    }
  }, []);

  const getLocalStorage = () => {
    const existingSelected = JSON.parse(localStorage.getItem('songs'));

    setMySongs(
      mySongs.map((song) =>
        existingSelected.filter((sel) => sel === song.id).length > 0
          ? { ...song, inYourSongs: true }
          : { ...song }
      )
    );
  };

  return (
    <>
      <div className="song-list" id="my-song-bucket">
        {songs.map(
          (song) =>
            song.showSong === true && (
              <Song
                key={song.id}
                song={song}
                bucket={bucket}
                setBucket={setBucket}
                setMySongs={setMySongs}
                mySongs={mySongs}
                isPlaying={isPlaying}
                playAll={playAll}
                setPlaying={setPlaying}
                mySongRef={mySongRef}
                startUp={startUp}
                rewind={rewind}
                pausePlaying={pausePlaying}
                nextSongFn={nextSongFn}
                songEnded={songEnded}
                yourSongOrder={yourSongOrder}
                setYourSongOrder={setYourSongOrder}
                yourSongs={yourSongs}
                setYourSongs={setYourSongs}
                curYourSongOrder={curYourSongOrder}
              />
            )
        )}
      </div>
    </>
  );
};

export default SongList;
