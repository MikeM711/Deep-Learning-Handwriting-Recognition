import React from 'react';
import './App.css';
import Header from './components/Header/Header.js'
import Canvas from './components/Canvas/Canvas.js'


function App() {
  return (
    <div className="App">
      <h1 className="center">Handwriting Recognition</h1>
      <Header />
      <Canvas />
    </div>
  );
}

export default App;
