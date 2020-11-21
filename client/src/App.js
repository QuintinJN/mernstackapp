
import React from 'react';
import Header from './pages/header';
import Login from './pages/login';
import FileUpload from './pages/fileUpload';


import './App.css';

class App extends React.Component {
  
  render() {
    //JSX
    return (
      <div className="app">
        <Header />
        <Login />
        <FileUpload />
      </div>
    );
  }
}



export default App;