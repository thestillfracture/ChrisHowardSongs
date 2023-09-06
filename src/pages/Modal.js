import { FaPlay } from 'react-icons/fa';

const Modal = ({ showModal, setModal, mySongs }) => {
  const goToEl = (hash) => {
    let element = document.querySelector('#' + hash);
    const topPos = element.getBoundingClientRect().top + window.pageYOffset;
    document.getElementById('modal').scrollTo({
      top: topPos - 20,
      behavior: 'smooth',
    });
  };

  const showToTop = (e) => {
    if (e.target.scrollTop > 200) {
      document.getElementById('to-top-link').style.display = 'block';
    } else {
      document.getElementById('to-top-link').style.display = 'none';
    }
  };

  const backToTop = () => {
    document.getElementById('modal').scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="modal" id="modal" onScroll={(e) => showToTop(e)}>
      <div onClick={() => setModal(false)} className="modal-close">
        Close
      </div>
      <div className="modal-content">
        <div style={{ marginBottom: '0', textAlign: 'center' }}>
          Chris Howard's Music Website
        </div>
        <h3
          style={{ marginBottom: '1.2em', textAlign: 'center', marginTop: '0' }}
        >
          You Can Download These Songs
        </h3>

        <div onClick={() => goToEl('how-does-it-work')} className="modal-nav">
          How Does it Work?
        </div>
        <div onClick={() => goToEl('what-is-it')} className="modal-nav">
          What is it?
        </div>
        <div onClick={() => goToEl('about-the-music')} className="modal-nav">
          About the Music
        </div>
        <div onClick={() => goToEl('song-credits')} className="modal-nav">
          Song Credits
        </div>

        <h4 id="how-does-it-work">How Does it Work?</h4>

        <ol>
          <li>
            <b>Listen to songs on the home page (&quot;Song Selector&quot;):</b>
            <ul>
              <li key={'m1'}>
                Listen to any song by clicking the Play{' '}
                <FaPlay style={{ fontSize: '0.6em' }} /> button
              </li>
              <li key={'m2'}>
                Select &quot;Play All&quot; to automatically continue playing
                the songs in the list
              </li>
              <li key={'m3'}>
                Show the Filters and toggle them to dial in the style of songs
                you want to select from
              </li>
              <li key={'m4'}>Sort the songs using the various Sort buttons</li>
            </ul>
          </li>

          <li>
            <b>Add songs you like to your playlist:</b>
            <ul>
              <li key={'m5'}>
                While listening to a song you can add it to your playlist if you
                like it
              </li>
              <li key={'m6'}>
                Once you've added a song to your playlist the link to your
                playlist will appear
              </li>
              <li key={'m7'}>
                You may add as many songs as you like to your playlist
              </li>
            </ul>
          </li>

          <li>
            <b>
              Go to Your Player to listen exclusively to your songs and download
              them:
            </b>
            <ul>
              <li key={'m8'}>
                Click on the &quot;Go to Your Playlist&quot; to go to your song
                player
              </li>
              <li key={'m9'}>
                You can listen to your playlist with the song player
              </li>
              <li key={'m10'}>
                You can change the order of your song by clicking
                &quot;Menu&quot; on mobile or &quot;Shuffle&quot; on desktop
              </li>
              <li key={'m11'}>
                You may download the songs by clicking &quot;Menu&quot; and then
                swipe-right to &quot;Download&quot; on mobile or simply clicking
                &quot;Download&quot; on desktop
              </li>
              <li key={'m12'}>
                The songs will download to your device in a zipped folder,
                ordered as you set them
              </li>
            </ul>
          </li>
        </ol>
        <p>
          Please Note: If you download my music I sincerely hope you continue to
          enjoy it, but please respect the fact all the songs are copyrighted
          and may not be plagiarized or used in any fashion for profit without
          express permission from me.
        </p>

        <h4 id="what-is-it">What is It?</h4>
        <p>
          This app was built from scratch as a ReactJS native project using only
          React functionality along with some ES6 vanilla JavaScript.
        </p>
        <p>
          There are no images on the site. Everything you see is generated via
          custom CSS and icons from the React icon library.{' '}
        </p>
        <p>
          99% of this is custom built but some bits of code were borrowed (but
          modified) such as the{' '}
          <a
            href="https://gist.github.com/c4software/981661f1f826ad34c2a5dc11070add0f"
            target="_blank"
          >
            downloading functionality
          </a>{' '}
          and much of the HTML canvas code for the{' '}
          <a
            href="https://blog.logrocket.com/audio-visualizer-from-scratch-javascript/"
            target="_blank"
          >
            song visualizer
          </a>{' '}
          on the desktop version of the playlist.
        </p>
        <p>
          More details will be provided on all of this in the future. I hope to
          make the code available soon for others to see and benefit from. Some
          more details are mentioned on my{' '}
          <a
            href="https://www.linkedin.com/in/chris-howard-105b8b14/"
            target="_blank"
          >
            LinkedIn Profile
          </a>
          .
        </p>

        <h4 id="about-the-music">About the Music</h4>

        <div>
          All songs are written, performed and recorded by myself, Chris Howard,
          with some exceptions noted below. I respectfully ask that you respect
          the copyrighted nature of the songs if you download them. <br />
          <br />
          You can download the songs from this site for free, but if you're
          feeling generous and would like to pay some amount (of your choosing)
          for them you can do so through{' '}
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=UTPDQ3YGPJGQ6"
            target="_blank"
          >
            PayPal (&quot;The Still Fracture&quot; is me)
          </a>
          . You can also find more of my music at{' '}
          <a
            href="https://thestillfracture.bandcamp.com/album/songs-for-america"
            target="_blank"
          >
            thestillfracture.bandcamp.com
          </a>
          .
        </div>

        <div style={{ display: 'none' }}>
          This website is built entirely using ReactJS. It is a work in
          progress. I intend to publish the code so that others can use parts of
          it. With all of that giving stuff away (songs, code, etc.) maybe
          someone will want to buy me a coffee so I'll put a link here for that
          when the site is done. If you have any questions for me regarding my
          music or the site here are some ways to find me: <br />
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/chris-howard-105b8b14/"
                target="_blank"
              >
                LinkedIn Profile
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/chris.howard.108889/"
                target="_blank"
              >
                Facebook
              </a>
            </li>
          </ul>
          I'll have a contact form on this site as well but until then those
          methods will have to do.
        </div>
        <div>
          <h4 id="song-credits">Song Credits:</h4>
          <ul>
            {mySongs.map(
              (song) =>
                song.notes != '' && (
                  <li>
                    <b>{song.title}:</b> {song.notes}
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
      <div className="to-top-link" id="to-top-link" onClick={() => backToTop()}>
        Back to Top
      </div>
    </div>
  );
};

export default Modal;
