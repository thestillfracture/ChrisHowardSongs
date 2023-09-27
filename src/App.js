import './App.css';
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import YourSongs from './pages/YourSongs';
import NotFound from './pages/NotFound';
import Modal from './pages/Modal';
import { initVisualizer } from './functions/visualizer';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdKeyboardArrowUp } from 'react-icons/md';
// import { initializeApp } from 'firebase/app';
const App = () => {
  const [mySongs, setMySongs] = useState([]);
  const [playAll, setPlayAll] = useState(true);
  const [isPlaying, setPlaying] = useState(null); // audio object
  const [filters, setFilter] = useState([]);
  const [showModal, setModal] = useState(false);
  const [curSort, setSort] = useState('quality');
  const [yourSongs, setYourSongs] = useState(
    mySongs.filter((song) => song.inYourSongs === true)
  );
  const [bucket, setBucket] = useState('my-song-bucket');
  const [yourSongOrder, setYourSongOrder] = useState(
    JSON.parse(localStorage.getItem('songs')) ?? []
  );
  const [volume, setVolume] = useState(0.64);
  const [showDownloadModal, setDownloadModal] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  useEffect(() => {
    if (isPlaying != null) {
      isPlaying.volume = volume;
    }
  }, [volume, isPlaying]);

  useEffect(() => {
    const getSongs = async () => {
      //let res;
      // if (window.location.href.indexOf('localhost') > 0) {
      //   res = await fetch('http://localhost:5000/songs');
      //   let data = await res.json();
      //   if (localStorage.length != 0) {
      //     const getLocalStorage = JSON.parse(localStorage.getItem('songs'));
      //     let data = await data.map((song) =>
      //       getLocalStorage.filter((f, song) => f === song.id).length > 0
      //         ? { ...song, inYourSongs: true }
      //         : { ...song }
      //     );
      //   }
      //   initSort(data);
      //   findFilters(data);
      //   return;
      // }
      // res = await fetch('db.json');
      // let data = await res.json();
      // if (localStorage.length != 0) {
      //   const getLocalStorage = JSON.parse(localStorage.getItem('songs'));
      //   data.songs = await data.songs.map((song) =>
      //     getLocalStorage.filter((f, song) => f === song.id).length > 0
      //       ? { ...song, inYourSongs: true }
      //       : { ...song }
      //   );
      // }
      // initSort(data);
      // findFilters(data);

      let data;
      let res;
      if (window.location.href.indexOf('localhost') > 0) {
        res = await fetch('http://localhost:5000/songs');
        data = await res.json();
      } else {
        res = await fetch('db.json');
        data = await res.json();
        // if (localStorage.length != 0) {
        //   const getLocalStorage = JSON.parse(localStorage.getItem('songs'));
        //   data.songs = await data.songs.map((song) =>
        //     getLocalStorage.filter((f, song) => f === song.id).length > 0
        //       ? { ...song, inYourSongs: true }
        //       : { ...song }
        //   );
        // }
        data = data.songs;
      }
      if (localStorage.length != 0) {
        const getLocalStorage = JSON.parse(localStorage.getItem('songs'));
        data = await data.map((song) =>
          getLocalStorage.filter((f, song) => f === song.id).length > 0
            ? { ...song, inYourSongs: true }
            : { ...song }
        );
      }
      initSort(data);
      findFilters(data);

      // LOCAL - to start the server: npm run server - optional: comment out initVisualizer() instances to avoid CORS isses
      // } else {
      //   // PRODUCTION
      //   const res = await fetch('db.json');
      //   let data = await res.json();
      //   if (localStorage.length != 0) {
      //     const getLocalStorage = JSON.parse(localStorage.getItem('songs'));
      //     data.songs = await data.songs.map((song) =>
      //       getLocalStorage.filter((f, song) => f === song.id).length > 0
      //         ? { ...song, inYourSongs: true }
      //         : { ...song }
      //     );
      //   }
      //   initSort(data.songs);
      //   findFilters(data.songs);
      // }
    };

    getSongs();
  }, []);

  useEffect(() => {
    const getYourSongs = mySongs.filter((song) => song.inYourSongs === true);
    setYourSongs(getYourSongs);
    if (
      bucket === 'my-song-bucket' &&
      mySongs.filter((song) => song.playStatus === 'yes').length > 0 &&
      document.querySelector('.active-song') != null
    ) {
      if (isPlaying.currentTime === 0) {
        scrollToSong();
      }
    }
  }, [mySongs]);

  useEffect(() => {
    if (yourSongOrder.length !== 0) {
      // we don't want to wipe this out on a fresh page load
      // if (bucket === 'my-song-bucket') {
      localStorage.setItem('songs', JSON.stringify(yourSongOrder));
      // } else {
      // localStorage.setItem('songs', JSON.stringify(yourSongOrder));
      // }
    }
    setMySongs(
      mySongs.map((song) =>
        yourSongOrder.indexOf(song.id) >= 0
          ? { ...song, inYourSongs: true }
          : { ...song }
      )
    );
  }, [yourSongOrder]);

  // window.addEventListener('scroll', () => {
  //   window.location.pathname !== '/your-songs' && window.scrollY > 530
  //     ? (document.querySelector('.back-to-top').style.opacity = '1')
  //     : (document.querySelector('.back-to-top').style.opacity = '0');
  // });
  // window.onscroll = function(){
  //   if(window.scrollY >
  // }

  // current state of my songs - including after sorting
  const mySongRef = useRef({});
  mySongRef.current = mySongs;

  const playAllRef = useRef({});
  playAllRef.current = playAll;

  const curYourSongOrder = useRef({});
  curYourSongOrder.current = yourSongOrder;

  const setSorting = (newSort) => {
    // if (isPlaying != null) {
    //   //isPlaying.pause();
    // }
    switch (newSort) {
      case 'alpha':
        setMySongs((song) => [
          ...song.sort(function (a, b) {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
          }),
        ]);
        setSort('alpha');
        playingSort();

        break;
      case 'quality':
        setMySongs((song) => [
          ...song.sort(function (a, b) {
            if (a.quality < b.quality) {
              return -1;
            }
            if (a.quality > b.quality) {
              return 1;
            }
          }),
        ]);
        setSort('quality');
        playingSort();
        break;
      case 'tags':
        setMySongs((song) => [
          ...song.sort(function (a, b) {
            if (a.tags < b.tags) {
              return -1;
            }
            if (a.tags > b.tags) {
              return 1;
            }
          }),
        ]);
        setSort('tags');
        playingSort();
        break;
      case 'random':
        setMySongs((song) => [
          ...song.sort(function () {
            let aRan = Math.random();
            let bRan = Math.random();
            if (aRan < bRan) {
              return -1;
            }
            if (aRan > bRan) {
              return 1;
            }
          }),
        ]);
        setSort('random');
        playingSort();
        break;
      default:
      // for the sake of compliance...meh;
    }
  };

  const playingSort = () => {
    if (isPlaying != null) {
      const getCurSongId = Number(isPlaying.id.replace('audio', ''));
      const getCurSong = mySongs.filter((song) => song.id === getCurSongId)[0];
      isPlaying.onended = (e) =>
        songEnded(getCurSong, playAllRef, curYourSongOrder);
    }
  };

  useEffect(() => {
    setMySongs(
      mySongs.map((song) =>
        updateMySongs(filters, song) === true
          ? { ...song, showSong: true }
          : { ...song, showSong: false }
      )
    );
    // if (isPlaying != null) {
    //   // isPlaying.pause();
    // }
    const playingSong = mySongs.filter((song) => song.playStatus === 'yes');
    if (playingSong.length > 0) {
      if (updateMySongs(filters, playingSong[0]) !== true) {
        document
          .querySelector('.copyright')
          .classList.add('now-playing-showing');
        setPlayAll(false);
      }
    }
  }, [filters]);

  const initSort = (data) => {
    setMySongs(
      data.sort(function (a, b) {
        if (a.quality < b.quality) {
          return -1;
        }
        if (a.quality > b.quality) {
          return 1;
        }
        return 0;
      })
    );
  };

  // const checkLocalStorage = () => {
  //   setMySongs(
  //     mySongs.map((song) =>
  //       1 === 1 ? { ...song, inYourSongs: true } : { ...song }
  //     )
  //   );
  // };

  const findFilters = (filterData) => {
    const qual = [];
    const style = [];
    filterData.map((song) => qual.push(song.quality));
    filterData.map((song) => {
      song.tags.indexOf(',') > 0
        ? song.tags.split(',').map((type) => style.push(type))
        : style.push(song.tags);
    });

    const filterQual = [...new Set(qual)];
    const filterStyle = [...new Set(style)];
    const finalarr = [];
    for (let g of filterQual) {
      let showFilter = true;
      if (g === 'un-produced') {
        showFilter = false;
      }
      let ids = finalarr.map((i) => parseInt(`${i.id}`));
      ids = ids.map((j) => Number(j));
      const id = finalarr.length === 0 ? 1 : Math.max(...ids) + 1;
      finalarr.push({ id: id, name: g, checked: showFilter, type: 'quality' });
    }
    for (let t of filterStyle) {
      let showFilter = true;
      if (t === 'classical' || t === 'electronic') {
        showFilter = false;
      }
      let ids = finalarr.map((i) => parseInt(`${i.id}`));
      ids = ids.map((j) => Number(j));
      const id = finalarr.length === 0 ? 1 : Math.max(...ids) + 1;
      finalarr.push({ id: id, name: t, checked: showFilter, type: 'genre' });
    }
    setFilter(finalarr);
  };

  const updateMySongs = (filters, song) => {
    let tagStatus = false;
    let qualStatus = false;
    let tags = song.tags.split(',');
    for (const value of tags) {
      for (const key in filters) {
        if (filters[key].name === value && filters[key].checked === true) {
          tagStatus = true;
        }
      }
    }
    let quality = song.quality;
    for (const key in filters) {
      if (filters[key].name === quality && filters[key].checked === true) {
        qualStatus = true;
      }
    }

    if (tagStatus === true && qualStatus === true) {
      return true;
    }
  };

  const toggleFilter = (id, isChecked) => {
    setFilter(
      filters.map((filter) =>
        filter.id === id ? { ...filter, checked: !isChecked } : filter
      )
    );
    if (isPlaying != null) {
      //setPlayAll(false);
    }
  };

  const scrollToSong = () => {
    const scrollSong = document.querySelector('.active-song');
    scrollSong.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // SONG FUNCTIONS: startUp, rewind, pausePlaying, nextSong, songEnded
  const rewind = (clickedSong) => {
    isPlaying.pause();
    let _song2Play = new Audio(
      'https://www.chrishowardsongs.com/music-bucket/' + clickedSong.url
    );
    setPlaying(_song2Play);
    _song2Play.id = 'audio' + clickedSong.id;
    _song2Play.onended = (e) =>
      songEnded(clickedSong, playAllRef, curYourSongOrder);
    _song2Play.play();
    setMySongs(
      mySongs.map((song) =>
        song.id === clickedSong.id ? { ...song, playStatus: 'yes' } : song
      )
    );
    if (bucket === 'your-song-bucket') {
      initVisualizer(_song2Play, true);
      _song2Play.volume = volume;
    }
  };

  const nextSongFn = (lastSong, curYourSongOrder) => {
    if (bucket === 'my-song-bucket') {
      if (isPlaying != null) {
        isPlaying.pause();
      }
      const nextSongList = mySongRef.current.filter(
        (song) => song.showSong === true
      );
      const findCurSong = nextSongList
        .map(function (e) {
          return e.id;
        })
        .indexOf(lastSong.id);
      let newSong = nextSongList[findCurSong + 1];
      if (findCurSong === nextSongList.length - 1) {
        newSong = nextSongList[0];
      }
      let _song2Play = new Audio(
        'https://www.chrishowardsongs.com/music-bucket/' + newSong.url
      );
      setPlaying(_song2Play);
      _song2Play.id = 'audio' + newSong.id;
      _song2Play.onended = (e) =>
        songEnded(newSong, playAllRef, curYourSongOrder);
      _song2Play.play();
      setMySongs(
        mySongs.map((song) =>
          song.id === newSong.id
            ? curYourSongOrder.current.filter((num) => num === song.id).length >
              0
              ? {
                  ...song,
                  playStatus: 'yes',
                  showSong: mySongRef.current.filter((f) => f.id === song.id)[0]
                    .showSong,
                  inYourSongs: true,
                }
              : {
                  ...song,
                  showSong: mySongRef.current.filter((f) => f.id === song.id)[0]
                    .showSong,
                  playStatus: 'yes',
                }
            : curYourSongOrder.current.filter((num) => num === song.id).length >
              0
            ? {
                ...song,
                playStatus: 'no',
                showSong: mySongRef.current.filter((f) => f.id === song.id)[0]
                  .showSong,
                inYourSongs: true,
              }
            : {
                ...song,
                showSong: mySongRef.current.filter((f) => f.id === song.id)[0]
                  .showSong,
                playStatus: 'no',
              }
        )
      );
      document.title = `${newSong.title} | Songs by Chris Howard`;
    } else {
      if (isPlaying != null) {
        isPlaying.pause();
      }
      const lastSongIndex = curYourSongOrder.current.indexOf(lastSong.id);
      // get next song in yourSongs
      let newSong = null;
      if (lastSongIndex + 1 === curYourSongOrder.current.length) {
        newSong = mySongs.filter(
          (song) => song.id === curYourSongOrder.current[0]
        );
      } else {
        newSong = mySongs.filter(
          (song) => song.id === curYourSongOrder.current[lastSongIndex + 1]
        );
      }
      newSong = newSong[0];
      let _song2Play = new Audio(
        'https://www.chrishowardsongs.com/music-bucket/' + newSong.url
      );
      setPlaying(_song2Play);
      _song2Play.id = 'audio' + newSong.id;
      _song2Play.onended = (e) =>
        songEnded(newSong, playAllRef, curYourSongOrder);
      _song2Play.play();
      setMySongs(
        mySongs.map((song) =>
          song.id === newSong.id
            ? { ...song, playStatus: 'yes' }
            : { ...song, playStatus: 'no' }
        )
      );
      initVisualizer(_song2Play, true);
      _song2Play.volume = volume;
      document.title = `${newSong.title} | Songs by Chris Howard`;
    }
  };

  const startUp = (clickedSong, time) => {
    const isPlaying2 = mySongs.filter((song) => song.playStatus === 'yes');
    const isPaused = mySongs.filter((song) => song.playStatus === 'paused');
    let _song2Play = null;
    if (time) {
      isPlaying.onended = (e) =>
        songEnded(clickedSong, playAllRef, curYourSongOrder);
    } else {
      if (isPlaying2.length === 0 && isPaused.length === 0) {
        // nothing is playing or paused
        _song2Play = new Audio(
          'https://www.chrishowardsongs.com/music-bucket/' + clickedSong.url
        );
        setPlaying(_song2Play);
        _song2Play.id = 'audio' + clickedSong.id;
        _song2Play.onended = (e) =>
          songEnded(clickedSong, playAllRef, curYourSongOrder);
        _song2Play.play();
        setMySongs(
          mySongs.map((song) =>
            song.id === clickedSong.id ? { ...song, playStatus: 'yes' } : song
          )
        );
        if (bucket === 'your-song-bucket') {
          initVisualizer(_song2Play, true);
          _song2Play.volume = volume;
        }
      } else {
        // there is something playing or paused, let's find out what it is
        if (isPaused.length > 0) {
          // something was paused...is it the clicked song?
          if (
            mySongs.filter((song) => song.playStatus === 'paused')[0].id ===
            clickedSong.id
          ) {
            isPlaying.play();
            if (bucket === 'your-song-bucket') {
              _song2Play = isPlaying;
              initVisualizer(_song2Play, false);
              _song2Play.volume = volume;
            }
            setMySongs(
              mySongs.map((song) =>
                song.id === isPaused.id
                  ? { ...song, playStatus: 'yes' }
                  : { ...song, playStatus: 'no' }
              )
            );
          } else {
            setPlaying(null);
            _song2Play = new Audio(
              'https://www.chrishowardsongs.com/music-bucket/' + clickedSong.url
            );
            setPlaying(_song2Play);
            _song2Play.id = 'audio' + clickedSong.id;
            _song2Play.onended = (e) =>
              songEnded(clickedSong, playAllRef, curYourSongOrder);
            _song2Play.play();
          }
          setMySongs(
            mySongs.map((song) =>
              song.id === clickedSong.id
                ? { ...song, playStatus: 'yes' }
                : { ...song, playStatus: 'no' }
            )
          );
        } else {
          // it must be a whole new song that was clicked on
          if (isPlaying != null) {
            isPlaying.pause();
          }
          setPlaying(null);
          _song2Play = new Audio(
            'https://www.chrishowardsongs.com/music-bucket/' + clickedSong.url
          );
          setPlaying(_song2Play);
          _song2Play.id = 'audio' + clickedSong.id;
          _song2Play.onended = (e) =>
            songEnded(clickedSong, playAllRef, curYourSongOrder);
          _song2Play.play();
          setMySongs(
            mySongs.map((song) =>
              song.id === clickedSong.id
                ? { ...song, playStatus: 'yes' }
                : { ...song, playStatus: 'no' }
            )
          );
        }
      }
    }
    document.title = `${clickedSong.title} | Songs by Chris Howard`;
  };

  const pausePlaying = (clickedSong) => {
    isPlaying.pause();
    setMySongs(
      mySongs.map((song) =>
        song.id === clickedSong.id ? { ...song, playStatus: 'paused' } : song
      )
    );
  };

  const songEnded = (curSong, playAllRef, curYourSongOrder) => {
    const yourSongStatus = mySongRef.current.filter(
      (song) => song.id === curSong.id
    )[0].inYourSongs;
    const updatedSong = mySongRef.current.filter(
      (song) => song.id === curSong.id
    );
    if (
      mySongRef.current.filter((song) => song.showSong === true).length === 0
    ) {
      setMySongs(
        mySongs.map((song) =>
          song.id === curSong.id
            ? {
                ...song,
                showSong: false,
                inYourSongs: yourSongStatus,
                playStatus: 'no',
              }
            : { ...song, showSong: false, playStatus: 'no' }
        )
      );
    } else {
      if (playAllRef.current === true) {
        nextSongFn(curSong, curYourSongOrder);
      } else {
        setMySongs(
          mySongs.map((song) =>
            song.id === curSong.id
              ? {
                  ...song,
                  showSong: mySongRef.current.filter((f) => f.id === song.id)[0]
                    .showSong,
                  inYourSongs: yourSongStatus,
                  playStatus: 'no',
                }
              : {
                  ...song,
                  showSong: mySongRef.current.filter((f) => f.id === song.id)[0]
                    .showSong,
                  playStatus: 'no',
                }
          )
        );
        setPlaying(null);
        document.title = 'Songs by Chris Howard';
      }
    }
  };

  const keyFunc = (e) => {
    const curSong = mySongs.filter((song) => song.playStatus !== 'no');
    if (curSong.length > 0) {
      switch (e.keyCode) {
        case 32: // space bar = play/pause
          if (curSong[0].playStatus === 'paused') {
            startUp(curSong[0]);
          } else {
            pausePlaying(curSong[0]);
          }
          e.preventDefault();
          break;
        case 39: // forward arrow = next song
          if (bucket === 'my-song-bucket') {
            nextSongFn(curSong[0], curYourSongOrder);
          }
          break;
        case 37:
          rewind(curSong[0]);
          break;
        default:
        // silence is golden
      }
    } else {
      if (e.keyCode === 32 && bucket === 'my-song-bucket') {
        // setplay all and start first song
        // const songToStart = mySongs.filter((song) => )
      }
    }
  };

  return (
    <BrowserRouter>
      <div
        className="App"
        data-modal={
          showModal || showDownloadModal ? 'modal-open' : 'modal-closed'
        }
      >
        <div
          className="main-content"
          tabIndex={-1}
          onKeyDownCapture={(e) => keyFunc(e)}
        >
          <Switch>
            <Route path="/" exact>
              <Home
                playAll={playAll}
                setPlayAll={setPlayAll}
                mySongs={mySongs}
                setMySongs={setMySongs}
                filters={filters}
                isPlaying={isPlaying}
                setPlaying={setPlaying}
                toggleFilter={toggleFilter}
                setModal={setModal}
                showModal={showModal}
                setSort={setSort}
                curSort={curSort}
                setSorting={setSorting}
                mySongRef={mySongRef}
                startUp={startUp}
                rewind={rewind}
                pausePlaying={pausePlaying}
                nextSongFn={nextSongFn}
                songEnded={songEnded}
                bucket={bucket}
                setBucket={setBucket}
                yourSongs={yourSongs}
                setYourSongs={setYourSongs}
                yourSongOrder={yourSongOrder}
                setYourSongOrder={setYourSongOrder}
                curYourSongOrder={curYourSongOrder}
              />
            </Route>
            <Route path="/your-songs">
              <YourSongs
                playAll={playAll}
                filters={filters}
                setMySongs={setMySongs}
                mySongs={mySongs}
                isPlaying={isPlaying}
                setPlayAll={setPlayAll}
                setPlaying={setPlaying}
                startUp={startUp}
                rewind={rewind}
                pausePlaying={pausePlaying}
                nextSongFn={nextSongFn}
                yourSongs={yourSongs}
                setYourSongs={setYourSongs}
                bucket={bucket}
                setBucket={setBucket}
                yourSongOrder={yourSongOrder}
                setYourSongOrder={setYourSongOrder}
                volume={volume}
                setVolume={setVolume}
                curYourSongOrder={curYourSongOrder}
                showDownloadModal={showDownloadModal}
                setDownloadModal={setDownloadModal}
                mySongRef={mySongRef}
                shuffle={shuffle}
                setShuffle={setShuffle}
              />
            </Route>
            <Route component={NotFound} />
          </Switch>
          <div className="copyright">
            {bucket === 'my-song-bucket' &&
              isPlaying != null &&
              mySongs.filter(
                (song) =>
                  song.playStatus === 'paused' || song.playStatus === 'yes'
              ).length != 0 && (
                <div className={'now-playing-widget'}>
                  <span
                    className={
                      mySongs.filter(
                        (song) =>
                          song.playStatus === 'paused' ||
                          song.playStatus === 'yes'
                      ).length != 0 &&
                      mySongs.filter(
                        (song) =>
                          song.playStatus === 'paused' ||
                          song.playStatus === 'yes'
                      )[0].showSong === true
                        ? 'now-playing'
                        : 'now-playing not-showing'
                    }
                  >
                    Now playing:
                  </span>
                  <span
                    className="now-playing-title"
                    onClick={() => {
                      mySongs.filter(
                        (song) =>
                          song.playStatus === 'paused' ||
                          song.playStatus === 'yes'
                      )[0].showSong === true && scrollToSong();
                    }}
                  >
                    {mySongs.filter(
                      (song) =>
                        song.playStatus === 'paused' ||
                        song.playStatus === 'yes'
                    )[0] &&
                      `${
                        mySongs.filter(
                          (song) =>
                            song.playStatus === 'paused' ||
                            song.playStatus === 'yes'
                        )[0].title
                      }`}
                  </span>
                  <span className="now-playing-buttons">
                    {mySongs.filter((song) => song.playStatus === 'yes')
                      .length > 0 && (
                      <FaPause
                        onClick={() =>
                          pausePlaying(
                            mySongs.filter(
                              (song) => song.playStatus === 'yes'
                            )[0]
                          )
                        }
                      />
                    )}
                    {mySongs.filter((song) => song.playStatus === 'paused')
                      .length > 0 && (
                      <FaPlay
                        onClick={() =>
                          startUp(
                            mySongs.filter(
                              (song) => song.playStatus === 'paused'
                            )[0]
                          )
                        }
                      />
                    )}
                  </span>
                </div>
              )}
            <div className="copyright-div">
              {bucket === 'my-song-bucket' && (
                <div
                  className="back-to-top"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  <MdKeyboardArrowUp /> Top
                </div>
              )}
              All songs &copy;Chris Howard - all rights&nbsp;reserved
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal setModal={setModal} showModal={showModal} mySongs={mySongs} />
      )}
    </BrowserRouter>
  );
};

export default App;
