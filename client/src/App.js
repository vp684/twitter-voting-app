import React, { Component } from 'react';
import './App.css';
import Navbar from './components/navbar/navbar'
import TwitterLogin from './components/navbar/Twitterlogin'

class App extends Component {
  state = {
    test: null, 
    isAuthenticated: false,
    user: null, 
    token: ''
  }

 

  componentDidMount(){
   // this.twitter()
 
   
  };  


  onSuccess = (response) => {
    console.log('onSuccess')
    const token = response.headers.get('x-auth-token');
   
    response.json().then(user => {
      if (token) {
        this.setState({isAuthenticated: true, user: user, token: token});
      }
    });
  };

  onFailed = (error) => {
    console.log('onFailed')
    console.log(error);
  };
  
  
  render() {   
    let content = this.state.isAuthenticated ?
    (
      <div>
        <Navbar />                                 
          <p>Authenticated</p>          
          <div>
            <button onClick={this.logout} className="button" >
              Log out
            </button>
          </div>   
      </div>
    ) :
    (
        <div>
          <Navbar />              

           
            <TwitterLogin loginUrl="https://voting-app-vp.herokuapp.com:5000/auth/twitter/callback"
              onFailure={this.onFailed} onSuccess={this.onSuccess}
              requestTokenUrl="https://voting-app-vp.herokuapp.com:5000/auth/twitter"/>        
                
        </div>  

    )

    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
