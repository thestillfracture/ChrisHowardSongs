const DownloadModal = ({ setDownloadModal, zipAndDownload, yourSongOrder }) => {
  return (
    <div className="modal download-modal" style={{ zIndex: 40000 }}>
      <div onClick={() => setDownloadModal(false)} className="modal-close">
        Cancel
      </div>
      <div className="download-modal-content">
        <p>
          <span style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>
            You may download these songs for free...
          </span>
          <br />
          <br />
          ...but if you're feeling generous and would like to give some amount
          of your choosing you can do so through{' '}
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=UTPDQ3YGPJGQ6"
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            <span className="paypal-logo">
              <i>Pay</i>
              <i>Pal</i>
            </span>{' '}
          </a>{' '}
          or through Venmo @thestillfracture (&quot;The Still Fracture&quot; is
          me) .
          <br />
          <br />
          You can also find more of my music at{' '}
          <a
            href="https://thestillfracture.bandcamp.com/album/songs-for-america"
            target="_blank"
          >
            thestillfracture.bandcamp.com
          </a>
          . Either way, I sincerely hope you enjoy my music.
        </p>
        <p>
          Songs will be downloaded in a zipped file after clicking the
          &quot;DOWNLOAD SONGS&quot; button.
        </p>
        <div
          onClick={() => (zipAndDownload(), setDownloadModal(false))}
          className="modal-download-link"
        >
          Download Songs
        </div>
        <p style={{ fontStyle: 'italic', fontSize: '0.8em' }}>
          Please respect the fact that these songs are copyrighted. Do not use
          them in any way for profit without my express consent.
        </p>
        <p style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>
          Save/Share Playlist:
        </p>
        <p>
          If you would like to save or share this playlist, you can copy this
          link:
          <br />
          <span
            style={{
              userSelect: 'all',
              border: '1px dashed',
              padding: '0.1em 0.4em',
              fontSize: '0.8em',
            }}
          >
            https://www.chrishowardsongs.com/your-songs?song-list=
            {yourSongOrder.map((num) => {
              if (num === yourSongOrder[yourSongOrder.length - 1]) {
                return num;
              } else {
                return num + ',';
              }
            })}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DownloadModal;
