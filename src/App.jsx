import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import SelectPlaylistPage from "./components/SelectPlaylistPage";
import SelectSongsPage from "./components/SelectSongsPage";
import PlayPage from "./components/PlayPage";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/playlists" element={<SelectPlaylistPage />} />
          <Route exact path="/songs/*" element={<SelectSongsPage />} />
          <Route exact path="/play" element={<PlayPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
