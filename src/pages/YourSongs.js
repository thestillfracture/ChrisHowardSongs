import Download from '../components/Download';
import {
  FaPlay,
  FaForward,
  FaBackward,
  FaPause,
  FaPowerOff,
  FaApple,
  FaMusic,
  FaBatteryFull,
} from 'react-icons/fa';
import { TiArrowShuffle } from 'react-icons/ti';
import Song from '../components/Song';
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Background from '../components/Background';
import { volumeKnob } from '../functions/volumeKnob';
import Timer from '../components/Timer';
import { swipeFn } from '../functions/swipe';

const YourSongs = ({
  setMySongs,
  mySongs,
  isPlaying,
  setPlayAll,
  setPlaying,
  playAll,
  startUp,
  rewind,
  pausePlaying,
  nextSongFn,
  yourSongs,
  setYourSongs,
  bucket,
  setBucket,
  yourSongOrder,
  setYourSongOrder,
  volume,
  setVolume,
  curYourSongOrder,
  showDownloadModal,
  setDownloadModal,
}) => {
  const yourSongRef = useRef({});
  yourSongRef.current = mySongs;

  const yourPlayAllRef = useRef({});
  yourPlayAllRef.current = playAll;

  const [shuffle, setShuffle] = useState(false);
  const [menu, setMenu] = useState(false);
  const [marquee, setMarquee] = useState(false);
  const history = useHistory();

  useEffect(() => {
    document.title = 'Your Playlist | Songs by Chris Howard';
    if (isPlaying != null) {
      isPlaying.pause();
      setMySongs(mySongs.map((song) => ({ ...song, playStatus: 'no' })));
      setPlaying(null);
    }
    setBucket('your-song-bucket');
    setSongOrder();
    if (mySongs.length > 0) {
      volumeKnob(volume, setVolume);
    }
  }, []);

  useEffect(() => {
    const checkSongs = yourSongOrder;
    if (checkSongs.length === 0 || mySongs.length === 0) {
      const searchVal = window.location.search;
      if (searchVal != '') {
        const checkQuery = searchVal.indexOf('song-list');
        if (checkQuery) {
          let getSongs = searchVal.split('=');
          let songPush = [];
          getSongs = getSongs[1];
          getSongs = getSongs.split(',');
          getSongs.forEach(function (num) {
            num = parseInt(num);
            songPush.push(num);
          });
          setYourSongOrder(songPush);
          localStorage.setItem('songs', JSON.stringify(songPush));
        }
      }
      history.push('/');
    }
  }, [history]);

  useEffect(() => {
    setMarquee(false);
    setTimeout(function () {
      if (document.getElementById('mrp') != null) {
        const overflowX =
          document.getElementById('mrp').offsetWidth <
          document.getElementById('mrp').scrollWidth;
        if (overflowX) {
          setMarquee(true);
        } else {
          setMarquee(false);
        }
      }
    }, 5000);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying != null && shuffle === true) {
      setSongOrder();
      isPlaying.pause();
      setMySongs(mySongs.map((song) => ({ ...song, playStatus: 'no' })));
      setPlaying(null);
    }
  }, [shuffle]);

  useEffect(() => {
    if (document.getElementById('slider-content') != null) {
      swipeFn(midSlide, leftSlide, rightSlide);
      //let vol = typeof volume;
    }
  }, [menu]);

  const setSongOrder = () => {
    const tempSongOrder = [];
    if (yourSongOrder.length == 0) {
      const grabYourSongs = mySongs.filter((song) => song.inYourSongs == true);
      grabYourSongs.forEach(function (e) {
        tempSongOrder.push(e.id);
      });
      setYourSongOrder(tempSongOrder);
    }
  };

  const mobileMenu = () => {
    if (isPlaying != null) {
      isPlaying.pause();
      setMySongs(mySongs.map((song) => ({ ...song, playStatus: 'no' })));
      setPlaying(null);
    }
    setSongOrder();
    setMenu(!menu);
  };

  const wipeOut = () => {
    if (isPlaying != null) {
      isPlaying.pause();
    }
    setPlaying(null);
    //setPlayAll(false);
    setMySongs(mySongs.map((song) => ({ ...song, playStatus: 'no' })));
  };

  const newVolume = (opt) => {
    if (mySongs.length > 0) {
      if (opt === 'down') {
        if (volume !== 0) {
          if (volume <= 0.1) {
            setVolume(0);
          } else {
            setVolume(volume - 0.1);
          }
        }
      } else {
        if (volume !== 1) {
          if (volume >= 0.9) {
            setVolume(1);
          } else {
            setVolume(volume + 0.1);
          }
        }
      }
    }
  };

  // Your Song Song Functions
  const yourSongPlay = (s) => {
    if (s === null) {
      // this is shuffle mode
      if (!shuffle) {
        const checkPaused = mySongs.filter(
          (song) => song.playStatus == 'paused'
        );
        if (checkPaused.length > 0) {
          startUp(checkPaused[0]);
        } else {
          const getSongToPlay = mySongs.filter(
            (song) => song.id == yourSongOrder[0]
          );
          setPlayAll(true);
          startUp(getSongToPlay[0]);
        }
      } else {
        alert('Finish shuffling to play');
      }
    } else {
      // this is mobile menu only
      const getSongToPlay = mySongs.filter((song) => song.id == s);
      setPlayAll(true);
      startUp(getSongToPlay[0]);
      setMenu(false);
    }
  };

  const yourSongPause = () => {
    const findSongToPause = mySongs.filter((song) => song.playStatus == 'yes');
    pausePlaying(findSongToPause[0]);
  };

  const yourSongRewind = () => {
    let findSongToRewind = mySongs.filter(
      (song) => song.playStatus == 'yes'
    )[0];
    if (findSongToRewind == undefined) {
      findSongToRewind = mySongs.filter(
        (song) => song.playStatus == 'paused'
      )[0];
    }
    if (findSongToRewind != undefined) {
      const checkBeginning = isPlaying.currentTime;
      if (checkBeginning < 5) {
        // sets the threshold (in seconds) for when the previous song should be played or current restarted
        const songToRewindIndex = yourSongOrder.indexOf(findSongToRewind.id);
        let newSongToRewindId;
        if (songToRewindIndex > 0) {
          newSongToRewindId = yourSongOrder[songToRewindIndex - 1];
        } else {
          newSongToRewindId = yourSongOrder[yourSongOrder.length - 1];
        }
        startUp(mySongs.filter((song) => song.id === newSongToRewindId)[0]);
      } else {
        rewind(findSongToRewind);
      }
    }
  };

  const yourSongForward = () => {
    let findSongToForward = mySongs.filter(
      (song) => song.playStatus === 'yes'
    )[0];
    if (findSongToForward === undefined) {
      findSongToForward = mySongs.filter(
        (song) => song.playStatus === 'paused'
      )[0];
    }
    if (findSongToForward !== undefined) {
      nextSongFn(findSongToForward, curYourSongOrder);
    }
  };

  const trackerClick = (e) => {
    if (isPlaying !== null) {
      const rect = e.target.getBoundingClientRect();
      const findLeft = e.clientX - rect.left;
      const leftPercent = findLeft / rect.width;
      const newPosition = isPlaying.duration * leftPercent;
      isPlaying.pause();
      isPlaying.currentTime = newPosition;
      isPlaying.play();
    }
  };

  const midSlide = () => {
    const sw1 = document.getElementById('swiper-1');
    const sw2 = document.getElementById('swiper-2');
    const sw3 = document.getElementById('swiper-3');
    const check = sw1.className.indexOf('swiper-focused');
    if (check > 0) {
      sw1.classList.replace('swiper-focused', 'swiper-left');
      sw2.classList.replace('swiper-right', 'swiper-focused');
      sw3.classList.replace('swiper-far-right', 'swiper-right');
    } else {
      sw1.classList.replace('swiper-far-left', 'swiper-left');
      sw2.classList.replace('swiper-left', 'swiper-focused');
      sw3.classList.replace('swiper-focused', 'swiper-right');
    }
  };
  const leftSlide = () => {
    const sw1 = document.getElementById('swiper-1');
    const sw2 = document.getElementById('swiper-2');
    const sw3 = document.getElementById('swiper-3');
    sw1.classList.replace('swiper-left', 'swiper-focused');
    sw2.classList.replace('swiper-focused', 'swiper-right');
    sw3.classList.replace('swiper-right', 'swiper-far-right');
  };

  const rightSlide = () => {
    const sw1 = document.getElementById('swiper-1');
    const sw2 = document.getElementById('swiper-2');
    const sw3 = document.getElementById('swiper-3');
    sw1.classList.replace('swiper-left', 'swiper-far-left');
    sw2.classList.replace('swiper-focused', 'swiper-left');
    sw3.classList.replace('swiper-right', 'swiper-focused');
  };

  return (
    <div id="your-songs-page" className="bucket-container">
      {mySongs.length != 0 && (
        <>
          <Background bg={'your-songs-bg'} />
          <div className="top-div"></div>
          <div className="bucket">
            <div className="songlist-header desktop-songlist-header">
              <header>
                <h1>Your Songs</h1>
              </header>
              <div className="songlist-header-top">
                <Link
                  to="/"
                  className="desktop-back-button"
                  onClick={() => wipeOut()}
                >
                  <FaPowerOff />
                  &nbsp;Back to Song Machine
                  <div></div>
                </Link>
                <div className="readout">
                  <div className="desktop-time">
                    <Timer isPlaying={isPlaying} />
                  </div>
                  <div className="canvas-container">
                    <canvas
                      id="canvas"
                      width="800"
                      height="50"
                      style={{ backgroundColor: '#000' }}
                    ></canvas>
                  </div>
                  <audio
                    controls
                    id="audio"
                    style={{ display: 'none' }}
                  ></audio>
                  <div className="readout-playing">
                    {shuffle ? (
                      <span className="blink">shuffling</span>
                    ) : isPlaying === null ? (
                      <span></span>
                    ) : (
                      <span>
                        Track{' '}
                        {yourSongOrder.indexOf(
                          mySongs.filter((song) => song.playStatus != 'no')[0]
                            .id
                        ) + 1}
                        :&nbsp;
                      </span>
                    )}
                    <span className="current-song-title">
                      {mySongs.map((song) =>
                        song.playStatus === 'paused' ||
                        song.playStatus === 'yes' ? (
                          <span
                            key={song.id}
                            className={
                              mySongs.filter(
                                (song) => song.playStatus == 'paused'
                              ).length > 0
                                ? 'blink'
                                : ''
                            }
                          >
                            {song.title}
                          </span>
                        ) : (
                          ''
                        )
                      )}
                    </span>
                    <br />
                    {isPlaying && (
                      <span className="desktop-album-title">
                        Album: Songs by Chris Howard
                      </span>
                    )}
                  </div>
                </div>
                <div id="volume-control">
                  <div className="knob">
                    <div
                      className="top"
                      style={{ transform: 'rotate(231deg)' }}
                    ></div>
                    <div className="base"></div>
                  </div>
                </div>
              </div>
              <div
                className={`mobile-screen ${
                  menu === true ? 'mobile-menu-showing' : ''
                }`}
              >
                <div className="mobile-screen-top">
                  {isPlaying !== null && (
                    <div className="play-pause-indicator">
                      {mySongs.filter((song) => song.playStatus === 'paused')
                        .length > 0 ? (
                        <>
                          <FaPause className="mobile-play-pause-icon" />
                        </>
                      ) : (
                        <></>
                      )}
                      {mySongs.filter((song) => song.playStatus === 'yes')
                        .length > 0 ? (
                        <>
                          <FaPlay className="mobile-play-pause-icon" />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}

                  <FaBatteryFull className="battery" />
                </div>
                <div
                  className={`mobile-readout mobile-left ${
                    menu === true ? 'mobile-menu' : ''
                  }`}
                >
                  {shuffle === false &&
                    isPlaying !== null &&
                    menu === false && (
                      <div className="music-box">
                        <FaMusic className="note1" />
                        <FaMusic className="note2" />
                      </div>
                    )}
                  {menu === true && (
                    <div className="mobile-song-list show-mobile-menu">
                      {yourSongOrder.map((yso) => (
                        <div
                          className="mobile-song"
                          key={yso}
                          onClick={() => yourSongPlay(yso)}
                        >
                          {
                            mySongs[
                              mySongs
                                .map(function (e) {
                                  return e.id;
                                })
                                .indexOf(yso)
                            ].title
                          }
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {shuffle === false && isPlaying === null && menu === false && (
                  <div className="apple-icon">
                    <FaApple />
                  </div>
                )}
                <div className="mobile-right">
                  <audio
                    controls
                    id="audio"
                    style={{ display: 'none' }}
                  ></audio>
                  {shuffle === false && isPlaying !== null && (
                    <div className="mobile-readout-playing" id="mrp">
                      <div
                        className={`current-song-title ${
                          marquee === true ? 'marquee' : ''
                        }`}
                      >
                        {mySongs.map((song) =>
                          song.playStatus != 'no' ? (
                            <span
                              key={song.id}
                              className={
                                mySongs.filter(
                                  (song) => song.playStatus == 'paused'
                                ).length > 0
                                  ? 'blink'
                                  : ''
                              }
                            >
                              {song.title}
                            </span>
                          ) : (
                            ''
                          )
                        )}
                      </div>
                      <div>
                        Chris Howard
                        <br />
                        Your Playlist
                        <br />
                        &nbsp;
                        <br />
                        {yourSongOrder.indexOf(
                          mySongs.filter((song) => song.playStatus != 'no')[0]
                            .id
                        ) + 1}{' '}
                        of {yourSongOrder.length}
                      </div>
                    </div>
                  )}
                  {menu === true && (
                    <div id="slider-content">
                      <div
                        id="swiper-1"
                        className="manage-button swiper-slide swiper-left"
                        onClick={(e) => setShuffle(!shuffle)}
                      >
                        <TiArrowShuffle
                          className={`shuffle-button ${
                            shuffle === true && 'shuffle-active'
                          }`}
                        />
                      </div>
                      <div
                        className="swipe-sub-text-left swipe-sub-text"
                        onClick={() => midSlide()}
                      >
                        Download &gt;
                      </div>
                      <Download
                        mySongs={mySongs}
                        yourSongOrder={yourSongOrder}
                        downloadClass="swiper-slide swiper-focused"
                        downloadId="swiper-2"
                        showDownloadModal={showDownloadModal}
                        setDownloadModal={setDownloadModal}
                      />
                      <div className="swipe-sub-text-mid swipe-sub-text">
                        <div onClick={() => leftSlide()}>&lt; Manage Songs</div>{' '}
                        | <div onClick={() => rightSlide()}>Volume &gt;</div>
                      </div>
                      <div
                        id="swiper-3"
                        className="mobile-volume swiper-slide swiper-right"
                      >
                        <span
                          className="volume-down"
                          onClick={(e) => newVolume('down')}
                        >
                          -
                        </span>
                        <span
                          className="volume-up"
                          onClick={(e) => newVolume('up')}
                        >
                          +
                        </span>
                        <div className="volume-tracker">
                          <div
                            style={{ width: 'calc(' + volume + ' * 100%)' }}
                          ></div>
                        </div>
                      </div>
                      <div
                        className="swipe-sub-text-right swipe-sub-text"
                        onClick={() => midSlide()}
                      >
                        &lt; Download
                      </div>
                    </div>
                  )}
                </div>
                <div className="mobile-tracker-container">
                  <Timer isPlaying={isPlaying} />
                  <div
                    className="tracker-click-div"
                    onClick={(e) => trackerClick(e)}
                  ></div>
                </div>
              </div>
              <div className="disc-holder">
                <div></div>
                <div style={{ position: 'relative', zIndex: '-1' }}>
                  <div className="disc-tray">
                    <div>
                      <div className="disc">
                        <span className="chris">Songs by Chris Howard</span>
                        <span className="disc-songs">
                          {yourSongOrder.map((yso) => (
                            <span key={yso}>
                              {
                                mySongs[
                                  mySongs
                                    .map(function (e) {
                                      return e.id;
                                    })
                                    .indexOf(yso)
                                ].title
                              }
                            </span>
                          ))}
                        </span>
                        <span className="disc-copyright">
                          All songs &copy;Chris Howard
                          <br />
                          All Rights Reserved
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="disc-drawer"></div>
                </div>
                <div></div>
              </div>
              <div className="lower-controls">
                <div className="playlist-buttons">
                  <div
                    className="manage-button"
                    onClick={(e) => setShuffle(!shuffle)}
                  >
                    <TiArrowShuffle
                      className={`shuffle-button ${
                        shuffle === true && 'shuffle-active'
                      }`}
                    />
                  </div>
                  <div className="download-button">
                    <Download
                      mySongs={mySongs}
                      yourSongOrder={yourSongOrder}
                      downloadClass="desktop-downloader"
                      downloadId=""
                      showDownloadModal={showDownloadModal}
                      setDownloadModal={setDownloadModal}
                    />
                  </div>
                  <div className="clear"></div>
                  <div className="playlist-buttons-title">Playlist Actions</div>
                </div>
                <div className="play-pause-rew">
                  <div
                    className="mobile-manage-button"
                    onClick={(e) => mobileMenu()}
                  >
                    MENU
                  </div>
                  <Link
                    to="/"
                    className="mobile-back-button"
                    onClick={() => wipeOut()}
                  >
                    BACK TO
                    <br />
                    SONGS
                    <div></div>
                  </Link>
                  <div
                    className="your-rewind-button"
                    onClick={() => yourSongRewind()}
                  >
                    <FaBackward />
                  </div>
                  {mySongs.filter((song) => song.playStatus == 'yes').length ==
                  0 ? (
                    <div
                      className="your-play-button"
                      onClick={() => (yourSongPlay(null), setMenu(false))}
                    >
                      <FaPlay />
                    </div>
                  ) : (
                    <div
                      className="your-pause-button"
                      onClick={() => yourSongPause()}
                    >
                      <FaPause />
                    </div>
                  )}
                  <div
                    className="your-forward-button"
                    onClick={() => yourSongForward()}
                  >
                    <FaForward />
                  </div>
                </div>
              </div>

              <div className="clear"></div>
            </div>
            <div
              className={`song-list ${
                shuffle === true && 'show-desktop-shuffle'
              }`}
              id="your-songs-bucket"
            >
              <div
                className="close-song-list"
                onClick={() => setShuffle(false)}
              >
                Close
              </div>
              {yourSongOrder.length == 0
                ? mySongs.map(
                    (song) =>
                      song.inYourSongs === true && (
                        <Song
                          key={song.id}
                          song={song}
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
                      )
                  )
                : yourSongOrder.map((orderId) => (
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
            <div className="mobile-songlist-header"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default YourSongs;
