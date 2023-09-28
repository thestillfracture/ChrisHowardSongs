import Song from './Song';
const ManageSongsModal = (
  isPlaying,
  setMySongs,
  mySongs,
  setPlaying,
  yourSongs,
  startUp,
  rewind,
  pausePlaying,
  nextSongFn,
  bucket,
  setYourSongOrder,
  setYourSongs,
  yourSongOrder,
  curYourSongOrder,
  shuffle,
  setShuffle
) => {
  return (
    <div
      className={`song-list ${shuffle === true && 'show-desktop-shuffle'}`}
      id="your-songs-bucket"
    >
      <div className="close-song-list" onClick={() => setShuffle(false)}>
        Close
      </div>
      {yourSongOrder.map((orderId) => (
        <Song
          key={Math.random()}
          song={
            mySongs[
              mySongs
                .map(function (e) {
                  return e.id;
                })
                .indexOf(orderId)
            ]
          }
          isPlaying={isPlaying}
          setMySongs={setMySongs}
          mySongs={mySongs}
          setPlaying={setPlaying}
          yourSongs={yourSongs}
          startUp={startUp}
          rewind={rewind}
          pausePlaying={pausePlaying}
          nextSongFn={nextSongFn}
          bucket={bucket}
          setYourSongOrder={setYourSongOrder}
          setYourSongs={setYourSongs}
          yourSongOrder={yourSongOrder}
          curYourSongOrder={curYourSongOrder}
        />
      ))}
    </div>
  );
};

export default ManageSongsModal;
