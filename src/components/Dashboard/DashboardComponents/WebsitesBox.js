import React from 'react';
import SettingsMenuContainer from './SettingsMenuContainer.js';
import { browserHistory } from 'react-router';
import {Card, CardActions, CardTitle, CardMedia} from 'material-ui/Card';
import { Divider } from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const WebsitesBox = ({ project, changeCurrProject, editBodyClick, handleDeleteProject, userId }) => {

  let enterEditor = () => {
    console.log(project);
    // send dispatch action to redux to change the current project
    changeCurrProject(project.projectId);
    // change
    editBodyClick(project.projectId);
    let sessionProjectId = JSON.parse(sessionStorage.getItem('projectStates')).length !== 0 ? JSON.parse(sessionStorage.getItem('projectStates'))[0].projectId : -1234
    if (project.projectId !== sessionProjectId) {
      sessionStorage.setItem('projectStates', JSON.stringify([]));
      sessionStorage.setItem('counter', JSON.stringify(0));
    }
    browserHistory.push('/editor');
  }

  return (
    <Card className='individual-website-block'>
      <CardMedia style={{
        // paddingTop: '5px',
        // paddingLeft: '5px',
        // paddingRight: '5px',
        // paddingBottom: '5px',
        backgroundColor: '#D3D3D3',
        textAlign: 'center'
      }}
      >
        <img src={ project.imgUrl } />

      </CardMedia>
      <CardTitle
        title={ project.title }
        subtitle={ project.description }
      />
      <CardActions className='individual-website-block-buttons'>
        <RaisedButton
          label="Edit Site"
          onClick={ enterEditor }
          primary={ true }
        />
        <SettingsMenuContainer
          project={ project }
          handleDeleteProject={ handleDeleteProject }
          userId={ userId }
        />
      </CardActions>
    </Card>
  )
};

export default WebsitesBox;



