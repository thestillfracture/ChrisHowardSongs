const Background = ({ bg, setModal }) => {
  return (
    <>
      <div className="background-container" id={bg}>
        {bg === 'home-bg' && <div className="top-bump"></div>}
        {bg === 'home-bg' && <div className="top-back"></div>}
        {bg === 'home-bg' && <div className="top-front"></div>}
        {bg === 'home-bg' && (
          <div className="build-your-playlist">
            <div>
              <div className="build1">Build / Download your Playlist:</div>
              <div className="build2">
                1. Listen <span>&amp;</span> Select
              </div>
              <div className="build3">2. Go to Your Songs</div>
              <div className="build4">
                3. Listen <span>&amp;</span> Download
              </div>
            </div>
          </div>
        )}
        {bg === 'home-bg' && (
          <>
            <div className="jukebox2"></div>
            <div className="jukebox"></div>
          </>
        )}
      </div>
      {bg === 'home-bg' && (
        <span className="coin-slot" onClick={() => setModal(true)}>
          <span></span>
        </span>
      )}
    </>
  );
};

export default Background;
