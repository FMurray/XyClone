import { connect } from 'react-redux'
import { changeStyle } from '../actions/EditingActions'
import TextboxContext from '../contextComponents/TextboxContext'

const mapStateToProps = (state) => {
  console.log('MAPPING TO EDITORCOMPONENTCONTAINERASDFASDFASDF', state)
  return {
    currComponent: state.xyclone.currComponent,
    currComponentId: state.xyclone.currComponentId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeStyleClick: (newProps, id) => {
      dispatch(changeStyle(newProps, id))
    }
  }
}

const TextboxContextContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TextboxContext)

export default TextboxContextContainer;