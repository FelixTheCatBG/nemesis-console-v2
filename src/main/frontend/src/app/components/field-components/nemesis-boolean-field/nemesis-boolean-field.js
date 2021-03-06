import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';

const styles = {
  container: {
    display: 'inline-block',
    width: 'auto',
    marginRight: '10px'
  },
  label: {
    color: '#9e9e9e',
    fontSize: '16px',
    lineHeight: '24px',
    verticalAlign: 'top'
  }
};

export default class NemesisBooleanField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          {this.props.showLabel && <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />{this.props.required ? <span className="required-star">*</span> : false}</div>}
          <div style={{ padding: '0 5px 15px', ...this.props.style }}>
            <label className="radio-inline" style={{ marginRight: '30px', paddingLeft: '25px' }}>
              <input className={"nemesis-radio-button" + ('true' === this.state.value ? ' active' : '')} type="radio" value="true" defaultChecked={'true' === this.state.value} onChange={this.handleRadioChange.bind(this)} disabled={this.props.readOnly} name={this.props.label} />
              True
            </label>
            <label className="radio-inline" style={{ marginRight: '30px', paddingLeft: '25px' }}>
              <input className={"nemesis-radio-button" + ('false' === this.state.value ? ' active' : '')} type="radio" value="false" defaultChecked={'false' === this.state.value} onChange={this.handleRadioChange.bind(this)} disabled={this.props.readOnly} name={this.props.label} />
              False
            </label>
            <label style={{ marginRight: '30px', paddingLeft: '25px', ...this.getNotAvailableButtonStyle() }} className="radio-inline" >
              <input className={"nemesis-radio-button" + ('null' === this.state.value ? ' active' : '')} type="radio" defaultChecked={'null' === this.state.value} onChange={this.handleRadioChange.bind(this)} disabled={this.props.readOnly} value="null" name={this.props.label} />
              N/A
            </label>
          </div>
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    )
  }

  handleRadioChange(e) {
    this.onValueChange(e, e.target.value);
    if (this.props.enableSaveButtons) {
      this.props.enableSaveButtons();
    };
  }

  setFormattedValue(value) {
    if (value === undefined) {
      return;
    }

    return value + '';
  }

  getFormattedValue(value) {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return null;
  }

  getNotAvailableButtonStyle() {
    let style = {};
    if (this.props.type !== nemesisFieldUsageTypes.edit) {
      style.display = 'none';
    }

    return style;
  }

  onValueChange(event, value) {
    this.setState((prevState) => ({ ...prevState, isDirty: true, value: value }));
    if (this.props.onValueChange && this.props.currentUnitId) {
      this.props.onValueChange(this.getFormattedValue(value), this.props.currentUnitId);
    } else if (this.props.onValueChange) {
      this.props.onValueChange(this.getFormattedValue(value));
    }
  };
}

NemesisBooleanField.defaultProps = {
  showLabel: true,
  enableSaveButtons: () => {}
}
