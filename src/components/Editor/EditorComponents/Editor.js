import React, { Component } from 'react';
import { PropTypes } from 'react';
import UserComponent from './UserComponent';
import { storage } from '../../../cache/ComponentCache';
require("../../../Basic.less");

class Editor extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {
    // console.log('NEW PROPS FOR EDITOR HAS BEEN RECEIVED!', newProps);
  }

  render() {
    let { components, onEditorClick, onEditorBodyClick, currProjectId, currPage }  = this.props
    let stopBubble = (e) => {
      // console.log('STOP BUBBLE IS CALLED');
      e.stopPropagation();
      onEditorClick(this.componentId);
    };

    let preHandleBodyClick = () => {
      onEditorBodyClick(currProjectId);
    }
    console.log('COMPONENTS PRE FILTER:::', components);
    components = components.filter((component) => {
      return (component.projectId === currProjectId &&
              component.page === currPage);
    });
    console.log('COMPONENTS::::', components);
    console.log(storage, 'THIS IS THE STORAGE THAT WE ARE NOW MOUNTING');
    let bodyCss = storage['body' + currProjectId].css;

    return (
      <div style={bodyCss} onClick={preHandleBodyClick}>
        {components.map(component => {
          console.log('RENDERING A COMPONENT', component);
          return (
            <UserComponent
              key={component.componentId}
              componentId={component.componentId}
              type={component.type}
              onEditorClick={() => onEditorClick(component.componentId)}
            />
          )}
        )}
      </div>
    )
  }
}

Editor.propTypes = {
  components: React.PropTypes.array.isRequired,
  onEditorClick: React.PropTypes.func.isRequired
}


export default Editor;
