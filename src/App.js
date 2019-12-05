import React from 'react';

import './App.css';
import Title from './components/Title/Title.js'
import Canvas from './components/Canvas/Canvas.js'
import Instructions from './components/Instructions/Instructions.js'


function App() {
  return (
    <div className="App">
      <Title />
      <Instructions />
      <Canvas />
    </div>
  );
}

export default App;
