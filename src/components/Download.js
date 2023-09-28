import FileSaver from 'file-saver';
import { MdEject } from 'react-icons/md';
import JSZip from 'jszip';
import Promise from 'bluebird';
import DownloadModal from '../pages/DownloadModal';

const Download = ({
  mySongs,
  yourSongOrder,
  downloadClass,
  downloadId,
  showDownloadModal,
  setDownloadModal,
}) => {
  const zipAndDownload = () => {
    document
      .getElementsByClassName('disc-holder')[0]
      .classList.add('drawer-open');

    const download = (url) => {
      return fetch(url).then((resp) => resp.blob());
    };

    const downloadByGroup = (urls, files_per_group = 5) => {
      return Promise.map(
        urls,
        async (url) => {
          return await download(url);
        },
        { concurrency: files_per_group }
      );
    };

    const closeDrawer = () => {
      if (document.getElementsByClassName('disc-holder').length > 0) {
        setTimeout(function () {
          document
            .getElementsByClassName('disc-holder')[0]
            .classList.remove('drawer-open');
        }, 1200);
      }
    };

    const exportZip = (blobs) => {
      const zip = JSZip();
      blobs.forEach((blob, i) => {
        let j = i + 1;
        if (j < 10) {
          j = '0' + j;
        }
        const s = urls[i].replace(
          'https://www.chrishowardsongs.com/music-bucket/',
          ''
        );
        zip.file(`${j} ${s}`, blob);
      });
      zip.generateAsync({ type: 'blob' }).then((zipFile) => {
        // timestamp prevents caching...leave it in
        const currentDate = new Date()
          .toLocaleString()
          .replace(/ /g, '-')
          .replace(/\//g, '-')
          .replace(',', '-');
        const fileName = `Songs_by_Chris_Howard-${currentDate}.zip`;
        //const fileName = 'Songs_by_Chris_Howard.zip';
        return FileSaver.saveAs(zipFile, fileName);
      });
    };

    const downloadAndZip = (urls) => {
      // const songCount = mySongs.filter((song) => song.inYourSongs === true);
      const songCount = yourSongOrder;
      if (songCount.length > 0) {
        return downloadByGroup(urls, 5).then(exportZip).then(closeDrawer);
      } else {
        alert('You have no songs to Download');
      }
    };

    const yourSongDownload = [];
    yourSongOrder.map((yso) =>
      yourSongDownload.push(mySongs.filter((song) => song.id === yso))
    );
    var urls = yourSongDownload.map(
      (song) => 'https://www.chrishowardsongs.com/music-bucket/' + song[0].url
    );

    downloadAndZip(urls);
  };

  return (
    <div id={downloadId} className={`download-link ${downloadClass}`}>
      <button onClick={() => setDownloadModal(true)}>
        <MdEject className="eject-button" />
      </button>
      {showDownloadModal && (
        <DownloadModal
          setDownloadModal={setDownloadModal}
          zipAndDownload={zipAndDownload}
          yourSongOrder={yourSongOrder}
        />
      )}
    </div>
  );
};

export default Download;
