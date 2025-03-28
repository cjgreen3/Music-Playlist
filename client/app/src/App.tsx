import { useEffect, useState } from "react";
interface Song {
  id: number; // or string, depending on your API
  name: string;
  artist: string;
}
interface Playlist {
  id: number; // or string, depending on your API
  name: string;
}
function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songName, setSongName] = useState("");
  const [artistsName, setArtistsName] = useState("");
  const [newSongName, setNewSongName] = useState("");

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  const handleSelectedPlaylist = (playlistId: number) => {
    setSelectedPlaylist(playlistId);
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/playlists/");
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addPlaylist = async () => {
    try {
      const playlistData = { name: newPlaylistName };
      const response = await fetch(
        "http://127.0.0.1:8000/api/playlists/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playlistData),
        }
      );
      const data: Playlist = await response.json();
      setPlaylists((prevPlaylists: any) => [...prevPlaylists, data]);
      setNewPlaylistName("");
    } catch (error) {
      console.error(error);
    }
  };

  const addSongToPlaylist = async (song: Song) => {
    if (!selectedPlaylist) {
      alert("Please select a playlist");
      return;
    }
    const songData = {
      song_id: song.id,
    };
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/playlists/${selectedPlaylist}/add-song-to-playlist/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(songData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add song to playlist");
      }
      const updatedPlaylist = await response.json();

      // Update the playlists state with the updated playlist
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist
        )
      );

      // Update the songs state to reflect the new playlist association
      setSongs((prevSongs) =>
        prevSongs.map((s) =>
          s.id === song.id ? { ...s, playlist: selectedPlaylist } : s
        )
      );
      alert(`Song "${updatedPlaylist.name}" added to playlist!`);
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the song to the playlist.");
    }
  };

  const fetchSongs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/songs/");
      const data = await response.json();
      console.log(data);
      setSongs(data);
    } catch (error) {
      console.error(error);
    }
  };
  const addSong = async () => {
    const songData = {
      name: songName,
      artist: artistsName,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/songs/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(songData),
      });
      const data = await response.json();
      setSongs((prevSongs: any) => [...prevSongs, data]);
    } catch (error) {
      console.error(error);
    }
  };
  const updateSongName = async (pk: number) => {
    const songData = {
      name: newSongName,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/songs/${pk}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(songData),
      });
      const data = await response.json();
      setSongs((prevSongs: any) =>
        prevSongs.map((song: any) => {
          if (song.id === pk) {
            return data;
          } else {
            return song;
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  const deleteSong = async (pk: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/songs/${pk}/`, {
        method: "DELETE",
      });
      setSongs((prevSongs: any) =>
        prevSongs.filter((song: any) => song.id !== pk)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSongFromPlaylist = async (playlistId: number, songId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/playlists/${playlistId}/remove-song/${songId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove song from playlist");
      }

      // Update the songs state to reflect the removal
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song.id === songId ? { ...song, playlist: null } : song
        )
      );

      alert("Song removed from playlist successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while removing the song from the playlist.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem", color: "#333" }}>
        🎵 Music Playlist Manager 🎶
      </h1>

      {/* Add Song Section */}
      <section
        style={{
          width: "100%",
          maxWidth: "600px",
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ marginBottom: "15px", fontSize: "1.5rem", color: "#555" }}>
          Add a Song
        </h2>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Song Name"
            onChange={(e) => setSongName(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <input
            type="text"
            placeholder="Enter Artist Name"
            onChange={(e) => setArtistsName(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={addSong}
            style={{
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Song
          </button>
        </div>
      </section>

      {/* Songs List Section */}
      <section
        style={{
          width: "100%",
          maxWidth: "600px",
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ marginBottom: "15px", fontSize: "1.5rem", color: "#555" }}>
          Songs
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {songs.map((song: any) => (
            <li
              key={song.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>
                <strong>{song.name}</strong> by {song.artist}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Edit Name"
                  onChange={(e) => setNewSongName(e.target.value)}
                  style={{
                    padding: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <button
                  onClick={() => updateSongName(song.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#2196F3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSong(song.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#F44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => addSongToPlaylist(song)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#F44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add to Playlist
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Add Playlist Section */}
      <section
        style={{
          width: "100%",
          maxWidth: "600px",
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ marginBottom: "15px", fontSize: "1.5rem", color: "#555" }}>
          Add a Playlist
        </h2>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={addPlaylist}
            style={{
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Playlist
          </button>
        </div>
      </section>

      <section
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "15px", fontSize: "1.5rem", color: "#555" }}>
          Playlists
        </h2>

        {/* Select Playlist Dropdown */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <label
            htmlFor="playlist-select"
            style={{
              fontWeight: "bold",
              marginRight: "10px",
              fontSize: "1rem",
              color: "#333",
            }}
          >
            Select Playlist:
          </label>
          <select
            id="playlist-select"
            value={selectedPlaylist || ""}
            onChange={(e) => setSelectedPlaylist(Number(e.target.value))}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          >
            <option value="" disabled>
              Choose a playlist
            </option>
            {playlists.map((playlist: any) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
        </div>

        {/* Playlists and Songs */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {playlists.map((playlist: any) => (
            <li
              key={playlist.id}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              {/* Playlist Name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  {playlist.name}
                </span>
                <button
                  onClick={() => handleSelectedPlaylist(playlist.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor:
                      selectedPlaylist === playlist.id ? "#4CAF50" : "#2196F3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {selectedPlaylist === playlist.id ? "Selected" : "Select"}
                </button>
              </div>

              {/* Songs Under Playlist */}
              <ul style={{ listStyle: "none", padding: "10px 20px" }}>
                {songs
                  .filter((song: any) => song.playlist === playlist.id) // Filter songs by playlist ID
                  .map((song: any) => (
                    <li
                      key={song.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "5px 0",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <span>
                        {song.name} by {song.artist}
                      </span>
                      <button
                        onClick={() =>
                          deleteSongFromPlaylist(playlist.id, song.id)
                        }
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#F44336",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
