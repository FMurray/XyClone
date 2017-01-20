import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import { storage } from '../../cache/ComponentCache'
// import FB from '../../cache/CacheFB'
class FacebookLogin extends Component {
  componentDidMount() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '346047239113026',
        cookie     : true,  // enable cookies to allow the server to access
                          // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.8' // use version 2.1
      })
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  changeLoginState (response) {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(meInfo) {

      console.log('Successful login for: ' + meInfo.name);
      let assembledMe = Object.assign({}, meInfo, response);
      this.props.dispatchLoginUser(assembledMe);
      // REQUEST ENDPOINT FOR SAVING USERS
      // 'http://localhost:8000/saveUser'
      // ALSO SET SESSION FROM HERE IN FUTURE
      this.requestForStorage(response);

    }.bind(this));
  }

  requestForStorage (response) {
    console.log('RUNNING REQUEST FOR STORAGE');
    axios.post('/saveUser', {userId: response.authResponse.userID})
      .then((userData) => {
        //MOUNT ALL THE COMPONENTS/PROJECTS BELONGING TO THIS USER
          // result.project = projects. map through projects.
        // userdata.data is all the projects.
        // module.exports = mongoose.model('Project', new Schema({
        //   projectId: Number,
        //   title: String,
        //   components: Array,
        //   storage: Object,
        //   userId: String
        // }));
        console.log('ABOUT TO PUSH TO DASHBOARD, SETTING PROJECT STATES AND COUNTER');
        sessionStorage.setItem('projectStates', JSON.stringify([]));
        sessionStorage.setItem('counter', JSON.stringify(0));
        browserHistory.push('/dashboard');
        console.log('PUSHED TO DASHBOARD')
        let allProjects = []
        let allComponents = [];
        if (Object.keys(userData.data).length !== 0) {
          userData.data.forEach(function(project) {
            console.log(project, 'THIS IS PROJECT FROM LOGIN SCREEN');
            // ADD ALL THE PROJECTS THE USER HAS
            allProjects.push({
              projectId: project.projectId,
              title: project.title,
              description: project.description,
              imgUrl: project.imgUrl
            })

            // GRAB ALL THE COMPONENT REFERENCES THE USER HAS
            for (let i = 0; i < project.components.length; i++) {
              allComponents.push(project.components[i])
            }

            // UPDATE STORAGE CACHE TO CORRESPOND TO THE COMPONENTS FROM THE USER
            for (let key in project.storage) {
              storage[key] = project.storage[key];
              if ((!storage[key].parent) && key !== ('body' + project.projectId)) {
                storage[key].parent = {};
              }
            }

          });
          // weed out ALL component references
          // weed out ALL storage elements
          // weed out projects.
          // call this.props.updateStorageComponents(storage, components)
          this.props.updateStorageComponents(allComponents);
          this.props.updateProjectsStorage(allProjects);
          // call this.props.(make youro wn dispatch) for new projects)
        }
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
    });
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  checkLoginState () {
    FB.getLoginStatus(function(response) {
      // response tells us if we are loggred in or not
      this.statusChangeCallback(response);
    }.bind(this));
  }

  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback (response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      this.changeLoginState(response);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      // FB.login(this.checkLoginState());
    } else {

    }
  }

  handleClick () {
    FB.login(this.checkLoginState());
  }

  render () {
    return (
      <RaisedButton primary={true} label='Facebook Login' onClick={this.handleClick.bind(this)}/>
    )
  }
}

export default FacebookLogin;
