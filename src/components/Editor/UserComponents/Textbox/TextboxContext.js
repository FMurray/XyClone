import React, { Component } from 'react';
import { connect } from 'react-redux'
import { PropTypes } from 'react';
import { storage } from '../../../../cache/ComponentCache';
import saveToSessionStorage from '../../../../cache/StorageCache';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { SketchPicker } from 'react-color';

class TextboxContext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      css: {
        backgroundColor: '',
        color: '',
        width: '',
        height: '',
        margin: '',
        fontSize: '',
        fontFamily: '',
        border: '',
        borderRadius: ''
      },
      text: '',
      type: '',
      colorPickerButtonText: 'Background Color',
      openColorPicker: false,
      textColorPicker: 'Text Color',
      openTextColorPicker: false,
      fontFamilySelector: 'serif'
    }
  }

  componentDidMount (){
    // console.log('COMPONENT RECEIVED PROPS.', this.props);
    this.setState({
      name: this.props.currComponent.name,
      css: this.props.currComponent.css,
      type: this.props.currComponent.type,
      text: this.props.currComponent.text,
      fontFamilySelector: this.props.currComponent.css.fontFamily
    })
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      name: newProps.currComponent.name,
      css: newProps.currComponent.css,
      type: newProps.currComponent.type,
      text: newProps.currComponent.text,
      fontFamilySelector: newProps.currComponent.css.fontFamily
    })
  }

  prepForDispatch(e) {
    e.preventDefault();
    let newProps = this.state;
    let context = this;
    let dispatchHandler = new Promise(function(resolve, reject) {
      context.props.onChangeStyleClick(newProps, context.props.currComponentId, context.props.currComponent);
      resolve();
    })
    dispatchHandler.then(() => {
      saveToSessionStorage(context.props.components, context.props.currProject, context.props.loginStatus.id);
    })
  }

  // When enter key is pressed, update all the properties of the img that changed
  handleEnterKeyPress (e) {
    e.key === 'Enter' ? this.prepForDispatch(e) : null;
  }

  // Use this to update the properties of the component in state
  changeProp (propertyToSet, cssProp, context, val) {
    console.log('propertyToSet', propertyToSet);
    console.log('cssProp', cssProp);
    console.log('context', context);
    console.log('val', val);
    if (cssProp) {
      let cssObject = this.state.css;
      cssObject[cssProp] = val;
      this.setState({ css : cssObject });
    } else {
      this.setState({ [propertyToSet] : val });
    }
  }

  handleOpenColorPicker (e) {
    this.state.openColorPicker ?
      this.setState({colorPickerButtonText: 'Background Color'}) :
      this.setState({colorPickerButtonText: 'Close Color Picker'});
    this.setState({openColorPicker: !this.state.openColorPicker});
  }

  handleOpenTextColorPicker () {
    this.state.openTextColorPicker ?
      this.setState({textColorPicker: 'Text Color'}) :
      this.setState({textColorPicker: 'Close Color Picker'});
    this.setState({openTextColorPicker: !this.state.openTextColorPicker});
  }

  handleTextColor (color) {
    let cssObject = this.state.css;
    cssObject.color = color.hex;
    this.setState({css: cssObject});
    // this.prepForDispatch();
  }

  handleBackgroundColor (color) {
    let cssObject = this.state.css;
    cssObject.backgroundColor = color.hex;
    this.setState({css: cssObject});
    // this.prepForDispatch();
  }

  handleBackgroundColorComplete () {
    console.log('THIS IS BEING RUN DOE');

    let newProps = this.state;
    let context = this;
    let dispatchHandler = new Promise(function(resolve, reject) {
      context.props.onChangeStyleClick(newProps, context.props.currComponentId, context.props.currComponent);
      resolve();
    });
    dispatchHandler.then(() => {
      saveToSessionStorage(context.props.components, context.props.currProject, context.props.loginStatus.id);
    });
  }

  changeFontFamily (e, index, value) {
    this.setState({fontFamilySelector: value});
    this.changeProp('css', 'fontFamily', this, value);
  }

  deleteCurrComponent(e) {
    e.preventDefault();
    let context = this;
    let dispatchHandler = new Promise(function(resolve, reject) {
      context.props.deleteFocusedComponent(context.props.currComponentId, context.props.currComponent);
      resolve();
    })
    dispatchHandler.then(() => {
      let newComponents = context.props.components.filter((component) => { return component.componentId !== context.props.currComponentId});
      console.log(newComponents)
      saveToSessionStorage(newComponents, context.props.currProject, context.props.loginStatus.id);    })  }

  render() {
    let { type, name, css, text, colorPickerButtonText, openColorPicker, textColorPicker, openTextColorPicker } = this.state;

    if (type !== 'Textbox') {
      return (
        <div> SHIT IM NOT A TEXTBOX IM JUST NULL </div>
      )
    } else {
      return (
        <div className="imagecontext-container">
          <div>{type}</div>
          {/* <TextField value={name} floatingLabelText="Textbox Name" onChange={this.changeProp.bind(this, 'name', null)} onKeyPress={this.handleEnterKeyPress.bind(this)} fullWidth={true} /> */}
          <TextField
            value={text}
            floatingLabelText="Text"
            onChange={this.changeProp.bind(this, 'text', null)}
            onKeyPress={this.handleEnterKeyPress.bind(this)}
            fullWidth={true}
          />
          <SelectField
            floatingLabelText="Font Family"
            fullWidth={true}
            value={this.state.fontFamilySelector}
            onChange={this.changeFontFamily.bind(this)}
          >
            <MenuItem value={"serif"} primaryText="serif" />
            <MenuItem value={"sans-serif"} primaryText="sans-serif" />
            <MenuItem value={"monospace"} primaryText="monospace" />
            <MenuItem value={"cursive"} primaryText="cursive" />
            <MenuItem value={"fantasy"} primaryText="fantasy" />
          </SelectField>
          <TextField
            hintText="14px"
            value={css.fontSize}
            floatingLabelText="Font Size"
            onChange={this.changeProp.bind(this, 'css', 'fontSize')}
            onKeyPress={this.handleEnterKeyPress.bind(this)}
            fullWidth={true}
          />
          <div>Text Color: {css.color}</div>
          <RaisedButton
            label={textColorPicker}
            fullWidth={true}
            onClick={this.handleOpenTextColorPicker.bind(this)}
            style={{marginBottom: '10px', marginTop: '10px'}}
          />
          {
            openTextColorPicker &&
            <div onMouseUp={this.handleBackgroundColorComplete.bind(this)}>
              <SketchPicker
                color={css.color}
                onChange={this.handleTextColor.bind(this)}
              />
            </div>
          }
          <div>Background Color: {css.backgroundColor}</div>
          <RaisedButton
            label={colorPickerButtonText}
            fullWidth={true}
            onClick={this.handleOpenColorPicker.bind(this)}
            style={{marginBottom: '10px', marginTop: '10px'}}
          />
          {
            openColorPicker &&
            <div onMouseUp={this.handleBackgroundColorComplete.bind(this)}>
              <SketchPicker
                color={css.backgroundColor}
                onChange={this.handleBackgroundColor.bind(this)}
              />
            </div>
          }
          <TextField
            value={css.width}
            floatingLabelText="Width"
            onChange={this.changeProp.bind(this, 'css', 'width')}
            onKeyPress={this.handleEnterKeyPress.bind(this)}
            fullWidth={true}
          />
          <TextField
            value={css.height}
            floatingLabelText="Height"
            onChange={this.changeProp.bind(this, 'css', 'height')}
            onKeyPress={this.handleEnterKeyPress.bind(this)}
            fullWidth={true}
          />
          <TextField
            value={css.border}
            floatingLabelText="Border"
            onChange={this.changeProp.bind(this, 'css', 'border')}
            onKeyPress={this.handleEnterKeyPress.bind(this)}
            fullWidth={true}
          />
          <TextField
            value={css.borderRadius}
            floatingLabelText="Border Radius"
            onChange={this.changeProp.bind(this, 'css', 'borderRadius')}
            onKeyPress={this.handleEnterKeyPress.bind(this)}
            fullWidth={true}
          />
          <TextField
            value={css.margin}
            floatingLabelText="Margin"
            onChange={this.changeProp.bind(this, 'css', 'margin')}
            onKeyPress={this.handleEnterKeyPress.bind(this)}
            fullWidth={true}
          />
          <span>
            <RaisedButton
              label="Save"
              primary={true}
              onClick={this.prepForDispatch.bind(this)}
              style={{marginRight: '5px', marginBottom: '5px'}}
            />
            <RaisedButton
              label="Delete"
              secondary={true}
              onClick={this.deleteCurrComponent.bind(this)}
            />
          </span>
        </div>
      )
    }
  }
}

export default TextboxContext;
