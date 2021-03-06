import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'
import { ChromePicker } from 'react-color';
import { Modal } from 'react-bootstrap';

const blackColorHex = '#000000';

export default class NemesisColorpickerField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = { ...this.state, displayColorPicker: false };
  }

  render() {

    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />{this.props.required ? <span className="required-star">*</span> : false}</div>
          <input type="text"
            className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
            value={this.state.value || ''}
            disabled={this.props.readOnly}
            onChange={(e) => this.onValueChange(e, e.target.value)} />
        </div>
        <i className="material-icons entity-navigation-icon" style={{ color: this.state.value }} onClick={this.handleClick}>color_lens</i>
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        <Modal size="small" show={this.state.displayColorPicker} onHide={this.handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Select color</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ChromePicker color={this.state.value || blackColorHex} disableAlpha={true} onChange={(color, event) => this.onValueChange(event, color.hex)} />
          </Modal.Body>
          <Modal.Footer>
            <button className="nemesis-button success-button" onClick={this.handleClose}>Done</button>
          </Modal.Footer>
        </Modal>
      </div>

    )
  }

  handleClick = () => {
    this.setState({ ...this.state, displayColorPicker: true });
  };

  handleClose = () => {
    this.setState({ ...this.state, displayColorPicker: false });
  };
}
