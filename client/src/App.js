import React, { Component } from 'react';
import './App.css';
import Navbar from './components/navbar/navbar'

class App extends Component {
  state = {
    test: null
  }

  auth = async ()=>{
    const response = await fetch('/auth/twitter');
    const body = await response.json();
    //mongdb error here...
    if(response.status !== 200) throw Error(body.message)
    return body
  }

  componentDidMount(){
    //determine if database is working
 
    this.auth() // makes a call to api/authenticate
      .then((res)=>{
        console.log(res)
        //if err render view that says app is down no mlab connection
        if(res.err)throw Error(res.err) //  change this
        this.setState({test: res.data})
      }).catch((err)=>{
        console.log(err)
      }) 
  };  
  
  
  render() {   

    return (
      <div className="App">
      <Navbar />      
         <a href="/auth/twitter">Sign in with Twitter</a> 
      </div>
    );
  }
}

export default App;
