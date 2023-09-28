import Song from '../components/Song';
import { useEffect } from 'react';

const SongList = ({
  songs,
  bucket,
  setMySongs,
  mySongs,
  isPlaying,
  setPlaying,
  startUp,
  rewind,
  pausePlaying,
  nextSongFn,
  yourSongOrder,
  setYourSongOrder,
  yourSongs,
  setYourSongs,
  curYourSongOrder,
}) => {
  useEffect(() => {
    if (isPlaying != null && isPlaying.ended != true) {
      isPlaying.pause();
      setPlaying({});
    }
    setMySongs(mySongs.map((song) => ({ ...song, playStatus: 'no' })));
  }, []);

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
                setMySongs={setMySongs}
                mySongs={mySongs}
                isPlaying={isPlaying}
                startUp={startUp}
                rewind={rewind}
                pausePlaying={pausePlaying}
                nextSongFn={nextSongFn}
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
