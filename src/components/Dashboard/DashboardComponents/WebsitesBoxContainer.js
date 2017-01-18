import { connect } from 'react-redux';
import { editBodyClick } from '../../../actions/EditingActions';
import { changeCurrProject } from '../../../actions/ProjectActions';
import WebsitesBox from './WebsitesBox';

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrProject: (id) => {
      dispatch(changeCurrProject(id));
    },
    editBodyClick: (id) => {
      dispatch(editBodyClick(id));
    }
  }
}

const WebsitesBoxContainer = connect(
  null,
  mapDispatchToProps
)(WebsitesBox);

export default WebsitesBoxContainer;
