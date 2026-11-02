
import React, { useEffect, useRef, useState } from 'react';

const songs = [
  {
    id: 1,
    title: 'Final Level',
    artist: 'HoliznaCC0',
    language: 'English',
    file: '/songs/HoliznaCC0 - Final Level.mp3',
  },
];

const languages = [
  'All', 'Telugu', 'Hindi', 'Tamil',
  'Malayalam', 'Kannada', 'English',
];

const formatTime = (time) => {
  if (!Number.isFinite(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const buttonStyle = {
  border: 'none',
  cursor: 'pointer',
  color: 'white',
  background: '#8545d7',
  borderRadius: 10,
  padding: '12px 18px',
  margin: 5,
};

export default function App() {
  const audioRef = useRef(null);

  const [view, setView] = useState('Home');
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('All');

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tunexa-favorites') || '[]');
    } catch {
      return [];
    }
  });

  const [currentIndex, setCurrentIndex] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [premiumSelected, setPremiumSelected] = useState(false);

  const currentSong =
    currentIndex !== null ? songs[currentIndex] : null;

  useEffect(() => {
    localStorage.setItem('tunexa-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentIndex === null || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = encodeURI(songs[currentIndex].file);
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    audio.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [currentIndex]);

  const playSong = (index) => {
    setCurrentIndex(index);
    setView('Player');
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (audio.paused) {
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const stopSong = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setPlaying(false);
  };

  const nextSong = () => {
    if (currentIndex === null || songs.length <= 1) return;
    setCurrentIndex((currentIndex + 1) % songs.length);
  };

  const previousSong = () => {
    if (currentIndex === null || songs.length <= 1) return;
    setCurrentIndex(
      (currentIndex - 1 + songs.length) % songs.length
    );
  };

  const seekSong = (event) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    const newTime = Number(event.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFavorite = (id) => {
    setFavorites((old) =>
      old.includes(id)
        ? old.filter((item) => item !== id)
        : [...old, id]
    );
  };

  const filteredSongs = songs
    .map((song, index) => ({ ...song, index }))
    .filter((song) => {
      const matchesSearch =
        song.title.toLowerCase().includes(search.toLowerCase()) ||
        song.artist.toLowerCase().includes(search.toLowerCase());

      const matchesLanguage =
        language === 'All' || song.language === language;

      const matchesFavorites =
        view !== 'Favorites' || favorites.includes(song.id);

      return matchesSearch && matchesLanguage && matchesFavorites;
    });

  const renderSongCards = (list) => (
    <div className="song-grid">
      {list.length === 0 && <p>No songs found.</p>}

      {list.map((song) => (
        <div className="song-card" key={song.id}>
          <div className="song-cover">♫</div>
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
          <small>{song.language}</small>

          <div>
            <button
              style={buttonStyle}
              onClick={() => playSong(song.index)}
            >
              ▶ Play
            </button>

            <button
              style={{
                ...buttonStyle,
                background: favorites.includes(song.id)
                  ? '#d34d83'
                  : '#39264f',
              }}
              onClick={() => toggleFavorite(song.id)}
            >
              {favorites.includes(song.id) ? '♥' : '♡'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Demo advertisement for Free users
  const renderDemoAd = () => {
    if (premiumSelected) return null;

    return (
      <div className="demo-ad">
        <small>ADVERTISEMENT • DEMO</small>
        <h2>🎧 Discover Something New!</h2>
        <p>
          This is a sample advertisement on TUNEXA Free.
        </p>
        <button
          style={buttonStyle}
          onClick={() => alert('This is a demo advertisement.')}
        >
          Learn More
        </button>
      </div>
    );
  };

  return (
    <div className="app">
      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #100b1d;
          font-family: Arial, sans-serif;
        }

        .app {
          min-height: 100vh;
          background: #100b1d;
          color: white;
          padding-bottom: 35px;
        }

        .sidebar {
          width: 220px;
          position: fixed;
          inset: 0 auto 0 0;
          padding: 25px;
          background: #190f2b;
          z-index: 2;
        }

        .sidebar button {
          display: block;
          width: 100%;
          text-align: left;
          margin: 8px 0;
          padding: 13px;
          color: white;
          border: none;
          border-radius: 9px;
          background: transparent;
          cursor: pointer;
        }

        .sidebar button.active,
        .sidebar button:hover {
          background: #7135b5;
        }

        .main {
          margin-left: 220px;
          padding: 35px;
        }

        .song-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
        }

        .song-card {
          background: #211532;
          padding: 17px;
          border-radius: 16px;
          width: 220px;
        }

        .song-card p { color: #b9a9ce; }
        .song-card small { color: #b77aff; }

        .song-cover {
          height: 130px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          font-size: 65px;
          background: linear-gradient(135deg, #f18abf, #6942bd, #26205c);
        }

        .player-page {
          min-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background:
            radial-gradient(ellipse at 20% 20%, #e87bb9 0%, transparent 40%),
            radial-gradient(ellipse at 80% 80%, #6256c9 0%, transparent 45%),
            linear-gradient(135deg, #281b50, #a64c9e, #29265f);
          border-radius: 22px;
        }

        .player-card {
          width: 100%;
          max-width: 390px;
          padding: 22px;
          border-radius: 23px;
          text-align: center;
          color: #211532;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          backdrop-filter: blur(20px);
        }

        .album-art {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: white;
          font-size: 110px;
          background: linear-gradient(140deg, #ed8cba, #8157d5, #252c70);
          box-shadow: 0 8px 22px rgba(40,20,70,0.2);
        }

        .progress {
          width: 100%;
          accent-color: #24152f;
          cursor: pointer;
        }

        .time-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #55465f;
          margin-top: 4px;
        }

        .player-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 17px;
          margin: 18px 0;
        }

        .control {
          border: none;
          background: transparent;
          color: #171222;
          font-size: 28px;
          cursor: pointer;
        }

        .control.play {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          color: white;
          background: #7135b5;
          font-size: 22px;
        }

        .control.stop {
          font-size: 21px;
        }

        .back-button {
          background: #7135b5;
          color: white;
          border: none;
          padding: 11px 17px;
          border-radius: 10px;
          cursor: pointer;
          margin-bottom: 15px;
        }

        .premium-container {
          max-width: 850px;
          margin: 25px auto;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .premium-card {
          background: #211532;
          border: 1px solid #49345f;
          border-radius: 18px;
          padding: 25px;
        }

        .premium-card.featured {
          border: 1px solid #b77aff;
          background: linear-gradient(145deg, #392052, #211532);
        }

        .premium-price {
          font-size: 32px;
          font-weight: bold;
          color: #d5a5ff;
        }

        .premium-card li {
          margin: 13px 0;
          color: #d0c1df;
        }

        .premium-button {
          width: 100%;
          padding: 13px;
          margin-top: 15px;
          border: none;
          border-radius: 10px;
          background: #8545d7;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .premium-note {
          color: #b9a9ce;
          font-size: 13px;
          margin-top: 20px;
        }

        .demo-ad {
          background: linear-gradient(120deg, #302044, #57228c);
          border: 1px solid #b77aff;
          border-radius: 15px;
          padding: 20px;
          margin: 25px 0;
          max-width: 650px;
        }

        .demo-ad small {
          color: #d5a5ff;
          letter-spacing: 2px;
        }

        .demo-ad p {
          color: #d0c1df;
        }

        @media (max-width: 700px) {
          .sidebar {
            position: static;
            width: 100%;
            padding: 12px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
          }

          .sidebar h1, .sidebar p {
            width: 100%;
            margin: 6px;
          }

          .sidebar button {
            width: auto;
            margin: 3px;
            font-size: 12px;
          }

          .main {
            margin-left: 0;
            padding: 18px;
          }

          .song-card {
            width: calc(50% - 10px);
            min-width: 145px;
          }

          .player-page {
            min-height: 70vh;
            padding: 12px;
          }

          .premium-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <aside className="sidebar">
        <h1 style={{ color: '#b77aff', letterSpacing: 3 }}>
          TUNEXA
        </h1>
        <p style={{ color: '#9f8bb7', fontSize: 12 }}>
          A Universe of Music
        </p>

        {['Home', 'Music Library', 'Favorites', 'AI Song Studio', 'Premium'].map(
          (item) => (
            <button
              key={item}
              className={view === item ? 'active' : ''}
              onClick={() => setView(item)}
            >
              {item === 'Home' && '⌂ '}
              {item === 'Music Library' && '♫ '}
              {item === 'Favorites' && '♥ '}
              {item === 'AI Song Studio' && '✦ '}
              {item === 'Premium' && '👑 '}
              {item}
            </button>
          )
        )}
      </aside>

      <main className="main">
        {view === 'Home' && (
          <>
            <h1>Welcome to TUNEXA</h1>
            <p style={{ color: '#b9a9ce' }}>
              Your music universe starts here.
            </p>

            <div style={{
              background: 'linear-gradient(120deg, #57228c, #25133d)',
              padding: 30,
              borderRadius: 20,
              margin: '25px 0',
            }}>
              <h1>Feel Every Beat 🎧</h1>
              <p>Discover music from different languages.</p>
              <button
                style={buttonStyle}
                onClick={() => setView('Music Library')}
              >
                Explore Music
              </button>
            </div>

            {renderDemoAd()}

            <h2>Your Music</h2>
            {renderSongCards(
              songs.map((song, index) => ({ ...song, index }))
            )}
          </>
        )}

        {view === 'Music Library' && (
          <>
            <h1>Music Library 🎵</h1>

            {renderDemoAd()}

            <input
              placeholder="Search songs or artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: 13,
                width: '100%',
                maxWidth: 450,
                background: '#241936',
                color: 'white',
                border: '1px solid #49345f',
                borderRadius: 10,
                marginBottom: 15,
              }}
            />

            <div style={{ marginBottom: 20 }}>
              {languages.map((item) => (
                <button
                  key={item}
                  style={{
                    ...buttonStyle,
                    background: language === item ? '#8b45e9' : '#302040',
                  }}
                  onClick={() => setLanguage(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {renderSongCards(filteredSongs)}
          </>
        )}

        {view === 'Favorites' && (
          <>
            <h1>♥ Your Favorites</h1>
            {renderSongCards(filteredSongs)}
          </>
        )}

        {view === 'Player' && currentSong && (
          <>
            <button
              className="back-button"
              onClick={() => setView('Music Library')}
            >
              ← Back to Music
            </button>

            <div className="player-page">
              <div className="player-card">
                <div className="album-art">♫</div>

                <h2 style={{ marginBottom: 5 }}>
                  {currentSong.title}
                </h2>
                <p style={{ color: '#66566f', marginTop: 5 }}>
                  {currentSong.artist}
                </p>

                <input
                  className="progress"
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={Math.min(currentTime, duration || 0)}
                  onChange={seekSong}
                  aria-label="Song progress"
                />

                <div className="time-row">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="player-controls">
                  <button
                    className="control"
                    onClick={previousSong}
                    title="Previous song"
                    disabled={songs.length <= 1}
                  >
                    ⏮
                  </button>

                  <button
                    className="control play"
                    onClick={togglePlay}
                    title={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? 'Ⅱ' : '▶'}
                  </button>

                  <button
                    className="control"
                    onClick={nextSong}
                    title="Next song"
                    disabled={songs.length <= 1}
                  >
                    ⏭
                  </button>

                  <button
                    className="control stop"
                    onClick={stopSong}
                    title="Stop"
                  >
                    ■
                  </button>
                </div>

                <p style={{ color: '#66566f', fontSize: 12 }}>
                  {currentSong.language} • TUNEXA Player
                </p>
              </div>
            </div>
          </>
        )}

        {view === 'AI Song Studio' && (
          <>
            <h1>✦ AI Song Studio</h1>
            <div style={{
              background: '#211532',
              padding: 25,
              borderRadius: 15,
              maxWidth: 650,
            }}>
              <h2>Song Creator</h2>
              <textarea
                placeholder="Write your song lyrics here..."
                style={{
                  width: '100%',
                  height: 150,
                  padding: 12,
                  background: '#241936',
                  color: 'white',
                  borderRadius: 10,
                }}
              />

              <p>Choose language</p>
              <select style={{ padding: 10, width: '100%' }}>
                {languages.filter((l) => l !== 'All').map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>

              <p>Choose voice</p>
              <select style={{ padding: 10, width: '100%' }}>
                <option>Male Voice</option>
                <option>Female Voice</option>
              </select>

              <p>Choose music style</p>
              <select style={{ padding: 10, width: '100%' }}>
                <option>Melody</option>
                <option>DJ</option>
                <option>Mass</option>
                <option>Devotional</option>
                <option>Romantic</option>
                <option>Folk</option>
              </select>

              <button
                style={buttonStyle}
                onClick={() => alert('AI song generation is not connected yet.')}
              >
                Generate Song
              </button>

              <p style={{ color: '#b9a9ce', fontSize: 13 }}>
                AI generation is currently a demo interface.
                A music generation service must be connected.
              </p>
            </div>
          </>
        )}

        {view === 'Premium' && (
          <>
            <h1>👑 TUNEXA Premium</h1>
            <p style={{ color: '#b9a9ce' }}>
              Enjoy your music without interruptions.
            </p>

            <div className="premium-container">
              <div className="premium-card">
                <h2>Free Plan</h2>
                <p className="premium-price">₹0</p>
                <p style={{ color: '#b9a9ce' }}>Forever free</p>

                <ul>
                  <li>Listen to licensed songs</li>
                  <li>Advertisements included</li>
                  <li>Create playlists</li>
                  <li>Save favourite songs</li>
                  <li>Standard listening experience</li>
                </ul>

                <button
                  className="premium-button"
                  onClick={() => setPremiumSelected(false)}
                >
                  {premiumSelected ? 'Switch to Free' : 'Current Plan'}
                </button>
              </div>

              <div className="premium-card featured">
                <h2>👑 Premium Plan</h2>
                <p className="premium-price">₹99/month</p>
                <p style={{ color: '#d5a5ff' }}>For music lovers</p>

                <ul>
                  <li>Listen to licensed songs</li>
                  <li>Ad-free listening</li>
                  <li>Unlimited skips</li>
                  <li>Create unlimited playlists</li>
                  <li>Premium listening experience</li>
                </ul>

                <button
                  className="premium-button"
                  onClick={() => setPremiumSelected(true)}
                >
                  {premiumSelected
                    ? 'Premium Demo Active'
                    : 'Activate Premium Demo'}
                </button>
              </div>
            </div>

            <p className="premium-note">
              This is a preview of TUNEXA membership plans.
              No payment is collected. Premium demo mode only hides
              sample advertisements. Real membership and payment
              systems are not connected yet.
              Music playback will require appropriate music licences.
            </p>
          </>
        )}
      </main>

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </div>
  );
}
