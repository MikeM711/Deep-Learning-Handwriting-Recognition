import React from 'react';
import './App.css';
import Header from './components/Header/Header.js'
import Canvas from './components/Canvas/Canvas.js'
import Instructions from './components/Instructions/Instructions.js'


function App() {
  return (
    <div className="App">
      <h1 className="center">ConvNet Handwriting Recognition</h1>
      <Header />
      <Instructions />
      <Canvas />
    </div>
  );
}

export default App;
