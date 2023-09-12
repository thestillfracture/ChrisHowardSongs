import {
  FaSort,
  FaPlay,
  FaPause,
  FaForward,
  FaHeart,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { MdOutlineReplay, MdCancel } from 'react-icons/md';
import { DndProvider } from 'react-dnd';
import Timer from '../components/Timer';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Song = ({
  song,
  bucket,
  setMySongs,
  mySongs,
  isPlaying,
  setPlaying,
  startUp,
  rewind,
  pausePlaying,
  nextSongFn,
  yourSongs,
  setYourSongOrder,
  setYourSongs,
  yourSongOrder,
  curYourSongOrder,
}) => {
  useEffect(() => {}, []);

  const removeSong = (songToRemove) => {
    setMySongs(
      mySongs.map((song) =>
        song.id === songToRemove.id ? { ...song, inYourSongs: false } : song
      )
    );
    setYourSongOrder(yourSongOrder.filter((song) => song !== songToRemove.id));
    const getLocalStorage = JSON.parse(localStorage.getItem('songs'));
    const newLocalStorage = getLocalStorage.filter(
      (song) => song != songToRemove.id
    );
    const newLocalStoragePush = JSON.stringify(newLocalStorage);
    localStorage.clear();
    localStorage.setItem('songs', newLocalStoragePush);
    console.log(newLocalStorage);
  };

  const addSongToPlaylist = (e) => {
    const addThisSong = song.id;
    setMySongs(
      mySongs.map((song) =>
        song.id === addThisSong ? { ...song, inYourSongs: true } : song
      )
    );
    setYourSongOrder([...yourSongOrder, song.id]);
    e.stopPropagation();
  };

  const trackerClick = (e, song) => {
    if (song.playStatus === 'paused' || song.playStatus === 'yes') {
      const rect = e.target.getBoundingClientRect();
      const findLeft = e.clientX - rect.left;
      const leftPercent = findLeft / rect.width;
      const newPosition = isPlaying.duration * leftPercent;
      isPlaying.pause();
      if (isPlaying.currentTime > 0) {
        isPlaying.currentTime = newPosition;
      }
      isPlaying.play();
    }
  };

  const mobileSortStart = (e, song) => {
    if (bucket === 'your-song-bucket') {
      if (e.target.parentElement.className === 'remove-x') {
        removeSong(song);
        return;
      }
      if (mySongs.filter((song) => song.inYourSongs === true).length > 1) {
        let firstCont;
        if (document.getElementById('your-songs-bucket').scrollTop <= 79) {
          firstCont = 79;
        } else {
          firstCont = 0;
        }

        document.getElementById('your-songs-page').classList.add('song-moving');
        e.currentTarget.classList.add('moving-song');
        const findLast = document
          .querySelector('.song-container:last-child')
          .classList.contains('moving-song');
        let contHeight;
        if (findLast) {
          const penultimate = document.querySelector(
            '.song-container:nth-last-child(2)'
          );
          contHeight =
            penultimate.getBoundingClientRect().top +
            parseFloat(
              getComputedStyle(penultimate, null).height.replace('px', '')
            );
        } else {
          const last = document.querySelector('.song-container:last-child');
          contHeight =
            last.getBoundingClientRect().top +
            parseFloat(getComputedStyle(last, null).height.replace('px', ''));
        }
        let touchLocation = e.targetTouches[0].clientY;

        if (touchLocation > firstCont && touchLocation < contHeight) {
          document
            .querySelector('.song-container')
            .classList.remove('first-song-hovered');
          e.currentTarget.style.top = touchLocation + 'px';
          document
            .querySelectorAll('.song-container:not(.moving-song)')
            .forEach((el) => {
              const h =
                parseFloat(
                  getComputedStyle(el, null).height.replace('px', '')
                ) / 2;
              const p = el.getBoundingClientRect().top;
              if (touchLocation > p + h && touchLocation < p + h + h) {
                el.classList.add('hovered-song');
              } else {
                el.classList.remove('hovered-song');
              }
            });
        } else if (touchLocation <= firstCont) {
          // it will go at the start if you let go above the list
          e.currentTarget.style.top = firstCont + 'px';
          const checkFirst = document
            .querySelector('.close-song-list')
            .nextElementSibling.classList.contains('moving-song');
          if (checkFirst) {
            document
              .querySelector('.close-song-list')
              .nextElementSibling.nextElementSibling.classList.add(
                'hovered-song'
              );
            document
              .querySelector('.close-song-list')
              .nextElementSibling.nextElementSibling.classList.add(
                'first-song-hovered'
              );
          } else {
            document
              .querySelector('.close-song-list')
              .nextElementSibling.classList.add('hovered-song');
            document
              .querySelector('.close-song-list')
              .nextElementSibling.classList.add('first-song-hovered');
          }
        } else {
          e.currentTarget.style.top = contHeight + 'px';
          document.querySelectorAll('.song-container').forEach((el) => {
            el.classList.remove('first-song-hovered');
          });
          if (findLast) {
            document
              .querySelector('.song-container:nth-last-child(2)')
              .classList.add('hovered-song');
          } else {
            document
              .querySelector('.song-container:last-child')
              .classList.add('hovered-song');
          }
        }
      }
    }
  };

  const mobileSortEnd = (e) => {
    if (
      bucket === 'your-song-bucket' &&
      document.querySelector('.moving-song') != null &&
      document.querySelector('.hovered-song') != null
    ) {
      let songPos = document.querySelector('.moving-song').style.top;
      const movingSong = document.querySelector('.moving-song');
      movingSong.removeAttribute('style');
      if (document.querySelectorAll('.first-song-hovered').length) {
        const firstItem = document.querySelector('.first-song-hovered');
        document
          .querySelector('.song-list')
          .insertBefore(movingSong, firstItem);
      } else {
        const hoveredItem = document.querySelector('.hovered-song');
        document
          .querySelector('.song-list')
          .insertBefore(movingSong, hoveredItem.nextSibling);
      }
      document
        .getElementById('your-songs-page')
        .classList.remove('song-moving');
      document.querySelectorAll('.song-container').forEach((el) => {
        el.classList.remove('hovered-song');
        el.classList.remove('first-song-hovered');
        el.classList.remove('moving-song');
      });

      reSortSongs();
    } else if (
      bucket === 'your-song-bucket' &&
      document.querySelector('.moving-song') != null
    ) {
      document.querySelector('.moving-song').removeAttribute('style');
      document.querySelector('.moving-song').classList.remove('moving-song');
      document
        .getElementById('your-songs-page')
        .classList.remove('song-moving');
    }
  };

  const desktopSortStart = (e, song) => {
    e.currentTarget.closest('.song-container').classList.add('moving-song');
    e.currentTarget.closest('.song-container').style.position = 'absolute';
    document.getElementById('your-songs-page').classList.add('song-moving');
    const firstCont = 79;

    const findLast = document
      .querySelector('.song-container:last-child')
      .classList.contains('moving-song');
    let contHeight;
    if (findLast) {
      const penultimate = document.querySelector(
        '.song-container:nth-last-child(2)'
      );
      contHeight =
        penultimate.getBoundingClientRect().top +
        parseFloat(
          getComputedStyle(penultimate, null).height.replace('px', '')
        );
    } else {
      const last = document.querySelector('.song-container:last-child');
      contHeight =
        last.getBoundingClientRect().top +
        parseFloat(getComputedStyle(last, null).height.replace('px', ''));
    }

    if (e.clientY <= firstCont) {
      e.currentTarget.closest('.song-container').style.top = firstCont + 'px';
    } else if (e.clientY >= contHeight) {
      e.currentTarget.closest('.song-container').style.top =
        contHeight +
        document.getElementById('your-songs-bucket').scrollTop +
        'px';
    } else {
      e.currentTarget.closest('.song-container').style.top =
        e.clientY +
        document.getElementById('your-songs-bucket').scrollTop -
        10 +
        'px';
    }

    if (e.clientY !== 0) {
      if (e.clientY > firstCont && e.clientY < contHeight) {
        document
          .querySelector('.song-container')
          .classList.remove('first-song-hovered');
        e.currentTarget.style.top = e.clientY + 'px';
        document
          .querySelectorAll('.song-container:not(.moving-song)')
          .forEach((el) => {
            const h =
              parseFloat(getComputedStyle(el, null).height.replace('px', '')) /
              2;
            const p = el.getBoundingClientRect().top;
            if (e.clientY > p + h && e.clientY < p + h + h) {
              el.classList.add('hovered-song');
            } else {
              el.classList.remove('hovered-song');
            }
          });
      } else if (e.clientY <= firstCont) {
        // it will go at the start if you let go above the list
        e.currentTarget.style.top = firstCont + 'px';
        const checkFirst = document
          .querySelector('.close-song-list')
          .nextElementSibling.classList.contains('moving-song');
        if (checkFirst) {
          document
            .querySelector('.close-song-list')
            .nextElementSibling.nextElementSibling.classList.add(
              'hovered-song'
            );
          document
            .querySelector('.close-song-list')
            .nextElementSibling.nextElementSibling.classList.add(
              'first-song-hovered'
            );
        } else {
          document
            .querySelector('.close-song-list')
            .nextElementSibling.classList.add('hovered-song');
          document
            .querySelector('.close-song-list')
            .nextElementSibling.classList.add('first-song-hovered');
        }
      } else {
        e.currentTarget.style.top = contHeight + 'px';
        document.querySelectorAll('.song-container').forEach((el) => {
          el.classList.remove('first-song-hovered');
        });
        if (findLast) {
          document
            .querySelector('.song-container:nth-last-child(2)')
            .classList.add('hovered-song');
        } else {
          document
            .querySelector('.song-container:last-child')
            .classList.add('hovered-song');
        }
      }
    }
  };

  const desktopSortEnd = (e) => {
    const movingSong = document.querySelector('.moving-song');
    const checkFirst = document.querySelector('.hovered-song');
    const list = document.querySelector('.song-list');
    if (checkFirst) {
      if (checkFirst.classList.value.indexOf('first-song-hovered') > 0) {
        list.insertBefore(movingSong, checkFirst);
      } else {
        list.insertBefore(movingSong, checkFirst.nextElementSibling);
      }
    }

    e.currentTarget.style.opacity = '1';
    e.currentTarget.closest('.song-container').classList.remove('moving-song');
    document.getElementById('your-songs-page').classList.remove('song-moving');
    document.querySelectorAll('.song-container').forEach((song) => {
      song.removeAttribute('style');
    });
    e.currentTarget.removeAttribute('style');

    reSortSongs();
  };

  const desktopMouseDown = (e) => {
    e.currentTarget.style.opacity = '0';
  };

  const reSortSongs = () => {
    let newYourSongs = [];
    document.querySelectorAll('.song-container').forEach((el) => {
      let newYourSongsId = el.id;
      newYourSongsId = Number(newYourSongsId.replace('song-id-', ''));
      newYourSongs.push(newYourSongsId);
    });
    setYourSongOrder(newYourSongs);
    const newYourSongsSongs = [];
    newYourSongs.forEach(function (e) {
      const findMySong =
        mySongs[
          mySongs
            .map(function (e) {
              return e.id;
            })
            .indexOf(e)
        ];
      newYourSongsSongs.push(findMySong);
    });
    setYourSongs(newYourSongsSongs);
  };

  // const mobileTouchStart = (e) => {
  //   if (bucket === 'your-song-bucket') {
  //     e.preventDefault();
  //   }
  // };

  return (
    <div
      className="song-container"
      id={['song-id-', song.id].join('').replace(',', '')}
      key={song.id}
      onTouchMove={(e) => mobileSortStart(e, song)}
      onTouchEnd={(e) => mobileSortEnd(e)}
    >
      <div
        className={`${
          song.playStatus === 'yes' || song.playStatus === 'paused'
            ? ['song', 'active-song', 'song-id-' + song.id].join(' ')
            : ['song', 'song-id-' + song.id].join(' ')
        } 
            ${song.inYourSongs === true ? 'added-to-playlist' : ''}`}
        onClick={
          song.playStatus !== 'yes'
            ? () => {
                bucket === 'my-song-bucket' && startUp(song);
              }
            : () => {}
        }
      >
        {bucket === 'your-song-bucket' && (
          <>
            <FaSort className="sort" />
            <div
              className="desktop-sort-handle"
              onDrag={(e) => desktopSortStart(e, song)}
              onDragEnd={(e) => desktopSortEnd(e)}
              onMouseDown={(e) => desktopMouseDown(e)}
              draggable
            ></div>
          </>
        )}
        {bucket === 'your-song-bucket' && (
          <div className="track-num">
            Track{' '}
            {song.inYourSongs === true &&
              yourSongs !== undefined &&
              yourSongOrder.indexOf(song.id) + 1}
          </div>
        )}
        {bucket === 'your-song-bucket' && (
          <div className="remove-x" onClick={() => removeSong(song)}>
            <MdCancel />
          </div>
        )}

        <div className="song-title" data-href={song.url}>
          &ldquo;{song.title}&rdquo;
        </div>
        {bucket === 'my-song-bucket' && (
          <div className="song-genre" data-href={song.url}>
            <Timer isPlaying={isPlaying} />
            <span>
              {song.tags.replace(',', ', ')} - {song.quality}
            </span>
            {song.playStatus !== 'no' && (
              <div
                className="tracker-click-div"
                onClick={(e) => trackerClick(e, song)}
              ></div>
            )}
          </div>
        )}
      </div>
      {bucket === 'my-song-bucket' && (
        <>
          <div className="song-buttons">
            {song.inYourSongs === false &&
              (song.playStatus === 'yes' || song.playStatus === 'paused') && (
                <button
                  className="add-to-playlist-button"
                  onClick={(e) => addSongToPlaylist(e)}
                >
                  Add to Your Playlist <FaHeart className="add-song-icon" />
                </button>
              )}

            {(song.inYourSongs === true ||
              (localStorage.length != 0 &&
                JSON.parse(localStorage.getItem('songs')).filter(
                  (f) => f === song.id
                ).length > 0)) && (
              <div className="song-added" key={song.id}>
                <span
                  className="my-songs-remove"
                  onClick={() => removeSong(song)}
                >
                  <MdCancel />
                </span>
                <Link to="/your-songs" className="song-added-playlist-link">
                  In Your Playlist{' '}
                  <FaExternalLinkAlt className="song-added-playlist-icon" />
                </Link>
              </div>
            )}
            {song.playStatus === 'yes' && (
              <MdOutlineReplay
                className="rewind"
                onClick={() => rewind(song)}
              />
            )}
            {song.playStatus === 'yes' && (
              <FaForward
                className="forward"
                onClick={() => nextSongFn(song, curYourSongOrder)}
              />
            )}
          </div>
          <div
            className={`control-button ${
              song.playStatus === 'yes' || song.playStatus === 'paused'
                ? 'song-is-playing'
                : ''
            }`}
          >
            {song.playStatus === 'yes' ? (
              <span onClick={() => pausePlaying(song)}>
                <FaPause className="pause" />
              </span>
            ) : (
              <span onClick={() => startUp(song)}>
                <FaPlay className="play" />
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Song;
