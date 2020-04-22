import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';

class App extends Component {
  render() {
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Tabula</h3>
        <div className="main">
          <Canvas />
        </div>
      </Fragment>
    );
  }
}

export default App;
