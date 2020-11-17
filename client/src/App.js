import React from 'react';
import axios from 'axios'; 

import './App.css';

class App extends React.Component{
  constructor(props) {
      super(props);
      this.state ={
          file: ''
      };
      this.onFormSubmit = this.onFormSubmit.bind(this);
      this.onChange = this.onChange.bind(this);
  }
  onFormSubmit(e){
      e.preventDefault();
      const formData = new FormData();
      formData.append('myfile',this.state.file);
      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      };
      axios({
        url: '/api/upload',
        method: 'POST',
        data: formData
      })
      .then(() =>{
        console.log('Data has been sent to the server');
        this.resetUserInputs();
      })
      .catch(() =>{
        console.log('Internal server error');
      });
  }

  onChange(e) {
      this.setState({file:e.target.files});
  }

  state = {
    username: '',
    password: ''
  };

  handleChange = ({target}) => {
    const { name ,value } = target;
    this.setState({ [name]:value });
  };


  submit = (event) => {
    event.preventDefault();

    const payload = {
      username: this.state.username,
      password: this.state.password
    };

    axios({
      url: '/api/save',
      method: 'POST',
      data: payload
    })
    .then(() =>{
      console.log('Data has been sent to the server');
      this.resetUserInputs();
    })
    .catch(() =>{
      console.log('Internal server error');
    });
  };

  resetUserInputs = () => {
    this.setState({
      username: '',
      password: ''
    });
  };

  render(){

    console.log('State: ', this.state);
    //JSX
    return(
      <div className="app">
        <h1>Welcome to my Data Classification App</h1>
        <h2>Sign Up</h2>
        <form onSubmit={this.submit}>
          <div className="form-input">
            <input 
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleChange}
            />
          </div>
          <div className="form-input">
          <input 
            type="text"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
            />
          </div>
          <button>Submit</button>
        </form>
        <form onSubmit={this.onFormSubmit}>
              <h1>File Upload</h1>
              <input type="file" className="custom-file-input" name="myImage" onChange= {this.onChange} />
              {console.log(this.state.file)}
              <button className="upload-button" type="submit">Upload to DB</button>
          </form>
      </div>
    );
  }
}

export default App;