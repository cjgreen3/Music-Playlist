import { useEffect, useState } from "react";
interface Song {
  id: number; // or string, depending on your API
  name: string;
}
function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songName, setSongName] = useState("");
  const [artistsName, setArtistsName] = useState("");
  const [newSongName, setNewSongName] = useState("");

  useEffect(() => {
    fetchSongs();
  }, []);

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1>Music Playlist Manager!</h1>

      <div
        style={{
          display: "flex",
          gap: "10px", // Adds spacing between input and button
          marginBottom: "20px", // Adds spacing below the input/button row
        }}
      >
        <input
          type="text"
          placeholder="Enter your Song Name"
          onChange={(e) => setSongName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter the Artist Name"
          onChange={(e) => setArtistsName(e.target.value)}
        />
        <button onClick={addSong}> Add Song </button>
      </div>

      <ul>
        {songs.map((song: any) => (
          <li
            key={song.id}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span>{song.name}</span>
            <span>{song.artist}</span>
            <input
              type="text"
              placeholder="Edit Name"
              onChange={(e) => setNewSongName(e.target.value)}
            />
            <button onClick={() => updateSongName(song.id)}>Change Name</button>
            <button onClick={() => deleteSong(song.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
