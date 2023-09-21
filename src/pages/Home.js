import HeaderBlock from '../components/HeaderBlock';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Filters from '../components/Filters';
import SongList from './SongList';
import Background from '../components/Background';
import Sort from '../components/Sort';

const Home = ({
  playAll,
  setPlayAll,
  mySongs,
  setMySongs,
  filters,
  isPlaying,
  setPlaying,
  toggleFilter,
  setModal,
  showModal,
  setSort,
  curSort,
  setSorting,
  setBucket,
  bucket,
  startUp,
  rewind,
  pausePlaying,
  nextSongFn,
  yourSongs,
  yourSongOrder,
  setYourSongOrder,
  setYourSongs,
  curYourSongOrder,
}) => {
  const [filtersShowing, setFiltersShowing] = useState(false);

  useEffect(() => {
    document.title = 'Songs by Chris Howard';
    setBucket('my-song-bucket');

    const el = document.querySelector('.songlist-header');
    const observer = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('is-pinned', e.intersectionRatio < 1),
      { threshold: [1] }
    );

    observer.observe(el);

    window.onscroll = function () {
      if (document.querySelector('.active-song') != null) {
        const t = document
          .querySelector('.active-song')
          .getBoundingClientRect().top;
        if (t < 0 || t > window.innerHeight - 50) {
          // document
          //   .querySelector('.now-playing-widget')
          //   .classList.add('show-now-playing-widget');
          document
            .querySelector('.copyright')
            .classList.add('now-playing-showing');
        } else {
          // document
          //   .querySelector('.now-playing-widget')
          //   .classList.remove('show-now-playing-widget');
          document
            .querySelector('.copyright')
            .classList.remove('now-playing-showing');
        }
      }
      window.scrollY > 530
        ? document.querySelector('body').classList.add('scrolled-page')
        : document.querySelector('body').classList.remove('scrolled-page');
    };

    // window.addEventListener('scroll', () => {
    //   window.location.pathname !== '/your-songs' && window.scrollY > 530
    //     ? (document.querySelector('.back-to-top').style.opacity = '1')
    //     : (document.querySelector('.back-to-top').style.opacity = '0');
    // });
  }, []);

  const playAllClickEvent = () => {
    if (playAll == true) {
      setPlayAll(false);
    } else {
      setPlayAll(true);
      const checkIsPlaying = mySongs.filter((song) => song.playStatus == 'yes');
      const checkIsPaused = mySongs.filter(
        (song) => song.playStatus == 'paused'
      );
      if (
        checkIsPlaying.length == 0 &&
        checkIsPaused == 0 &&
        bucket == 'my-song-bucket'
      ) {
        const findFirst = mySongs.filter((song) => song.showSong === true);
        if (findFirst.length != 0) {
          startUp(findFirst[0]);
        }
      }
    }
  };

  return (
    <div id="home-page" className="bucket-container">
      <Background bg={'home-bg'} setModal={setModal} showModal={showModal} />

      <div className="top-div">
        <div className="record-div">
          <div className="shine"></div>
          <div className="album-text">
            <div
              className={
                mySongs.filter((song) => song.playStatus == 'yes').length > 0
                  ? 'rotate-text rotating'
                  : 'rotate-text'
              }
            >
              <span
                style={{ transform: 'rotate(8deg)', transformOrigin: 'left' }}
                className="upper-span"
              >
                M
              </span>
              <span style={{ transform: 'rotate(34deg)' }}>y</span>
              <span style={{ transform: 'rotate(43deg)' }}> </span>
              <span
                style={{ transform: 'rotate(63deg)' }}
                className="upper-span"
              >
                S
              </span>
              <span style={{ transform: 'rotate(80deg)' }}>o</span>
              <span style={{ transform: 'rotate(89deg)' }}>n</span>
              <span style={{ transform: 'rotate(98deg)' }}>g</span>
              <span style={{ transform: 'rotate(107deg)' }}> </span>
              <span
                style={{ transform: 'rotate(134deg)' }}
                className="upper-span"
              >
                M
              </span>
              <span style={{ transform: 'rotate(144deg)' }}>a</span>
              <span style={{ transform: 'rotate(153deg)' }}>c</span>
              <span style={{ transform: 'rotate(162deg)' }}>h</span>
              <span style={{ transform: 'rotate(168deg)' }}>i</span>
              <span style={{ transform: 'rotate(178deg)' }}>n</span>
              <span style={{ transform: 'rotate(187deg)' }}>e</span>
            </div>
          </div>
        </div>
        <header>
          <h1>My Song Machine</h1>
        </header>

        <div className="controllers-checkbox">
          <span>Show/Hide Filters</span>
          <input
            type="checkbox"
            onChange={(e) => setFiltersShowing(!filtersShowing)}
          ></input>
          <label></label>
        </div>
      </div>

      <div
        className={`controllers ${
          filtersShowing == true ? 'show-controllers' : ''
        }`}
      >
        <div className="filters">
          <Filters
            mySongs={mySongs}
            filters={filters}
            toggleFilter={toggleFilter}
            setFiltersShowing={setFiltersShowing}
          />
        </div>
      </div>
      <div className="selector-sort">
        <Sort
          setSorting={setSorting}
          setSort={setSort}
          curSort={curSort}
          setMySongs={setMySongs}
          mySongs={mySongs}
        />
      </div>

      <div className="bucket">
        <div className="songlist-header">
          <HeaderBlock title="Song Selector" />
          <div className="play-all-switch">
            <div
              className={playAll == true ? 'play-all-on' : 'play-all-off'}
              onClick={() => playAllClickEvent()}
            ></div>
            <div className="play-all-label">
              {playAll == true ? (
                <span className="play-all-label-on">Play All&nbsp;On</span>
              ) : (
                <span className="play-all-label-off">Play All</span>
              )}
            </div>
          </div>
          {mySongs.filter((song) => song.inYourSongs == true).length > 0 ||
          (localStorage.getItem('songs') !== null &&
            localStorage.getItem('songs') !== '[]') ? (
            <Link to="/your-songs" className="go-to-your-songs">
              Go to Your Playlist{' '}
              <FaExternalLinkAlt className="large-playlist-icon" />
            </Link>
          ) : (
            <div className="add-song-message">
              To download songs, first add them to your playlist
            </div>
          )}
          <div className="clear"></div>
        </div>
        {mySongs.filter((song) => song.showSong == true).length > 0 ? (
          <SongList
            songs={mySongs}
            setMySongs={setMySongs}
            mySongs={mySongs}
            isPlaying={isPlaying}
            setPlaying={setPlaying}
            setPlayAll={setPlayAll}
            startUp={startUp}
            rewind={rewind}
            pausePlaying={pausePlaying}
            nextSongFn={nextSongFn}
            bucket={bucket}
            yourSongs={yourSongs}
            setYourSongs={setYourSongs}
            yourSongOrder={yourSongOrder}
            setYourSongOrder={setYourSongOrder}
            curYourSongOrder={curYourSongOrder}
          />
        ) : (
          <div className="no-songs">
            No Songs With Your Choice Of Filters, Please Try Other Options
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
