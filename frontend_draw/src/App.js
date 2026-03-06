import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home/home.jsx';
import Lobby from './Pages/Lobby/lobby.jsx';
import GameArea from './Componets/chat/GameArea.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/draw" element={<GameArea />} />
      </Routes>
    </Router>
  );
}

export default App;
