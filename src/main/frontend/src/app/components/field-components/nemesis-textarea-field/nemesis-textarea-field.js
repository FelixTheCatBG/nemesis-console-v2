import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

export default class NemesisTextAreaField extends NemesisBaseField {
  constructor(props) {
    super(props);

    this.state = {...this.state, openFullScreenDialog: false};

  }

  render() {
    const actions = [
      <FlatButton
        label="Done"
        primary={true}
        onTouchTap={this.handleDialogClose.bind(this)}
      />
    ];
    return (
      <div className="entity-field-container">
        <div style={{width: '256px', display: 'inline-block'}}>
          <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
          <input type="text"
                 className="entity-field form-control"
                 value={this.state.value || ''}
                 disabled={this.props.readOnly}
                 onChange={(e) => this.onValueChange(e, e.target.value)} />
        </div>
        <i className="material-icons entity-navigation-icon" onClick={this.handleFullscreenClick.bind(this)}>fullscreen</i>
        <Dialog
          title="Edit text area"
          actions={actions}
          modal={true}
          open={this.state.openFullScreenDialog}
        >
          <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
          <textarea className="entity-field form-control"
                    rows="10"
                    value={this.state.value || ''}
                    disabled={this.props.readOnly}
                    onChange={(e) => this.onValueChange(e, e.target.value)}/>
        </Dialog>
      </div>
    )
  }

  handleFullscreenClick = () => {
    this.setState({...this.state, openFullScreenDialog: true });
  };

  handleDialogClose = () => {
    this.setState({...this.state, openFullScreenDialog: false });
  };
}