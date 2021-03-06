import React, {Component} from 'react';
import Translate from 'react-translate-component';

import Select from 'react-select';

import {Modal} from 'react-bootstrap';
import PropTypes from "prop-types";
import SelectCustomArrow from "../../../../../helper-components/select-custom-arrow";
import {nemesisFieldTypes} from "../../../../../../types/nemesis-types";

export default class NestedFilterPopup extends Component {
  constructor(props, context) {
    super(props, context);
    let selectedItems = this.props.nestedFilters.length === 1 ? [...this.props.nestedFilters] : [...this.props.nestedFilters.slice(0, -1)];
    let selectedItem = this.props.nestedFilters.length === 1 ? null : {...this.props.nestedFilters[this.props.nestedFilters.length - 1]};
    this.state = {selectedItems: selectedItems, selectedItem: selectedItem};
  }

  render() {
    return (
      <Modal className="nested-filter-popup" show={this.props.openNestedFilterPopup} onHide={this.handleModalClose.bind(this)} animation={false}>
        <Modal.Header>
          <Modal.Title>Select nested filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{this.state.selectedItems.map(item => item.fieldLabel).join(' / ')}<i className="fa fa-times-circle remove-icon" onClick={this.handleRemoveIconClick.bind(this)}/></div>
          <label><Translate content={'main.selectField'} fallback={'Select field'} /></label>
          <div>
            <div style={{display: 'inline-block'}}>
              <Select style={{width: '300px'}}
                      className="entity-field-select entity-field"
                      clearable={false}
                      arrowRenderer={() => <SelectCustomArrow />}
                      value={this.state.selectedItem ? {value: this.state.selectedItem, label: this.state.selectedItem.fieldLabel } : null}
                      onChange={(item) => this.handleChange(item.value)}
                      options={this.getOptions()}/>
            </div>
            {this.getNavigationNextIcon()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={this.handleModalClose.bind(this)}>Cancel</button>
          <button className="nemesis-button success-button" disabled={!this.state.selectedItem} onClick={this.handleFilterApply.bind(this)}>Apply</button>
        </Modal.Footer>
      </Modal>
    )
  }

  handleFilterApply() {
    this.props.onNestedFilterApply([...this.state.selectedItems, this.state.selectedItem]);
  }

  handleRemoveIconClick() {
    if (this.state.selectedItems.length === 1) {
      this.props.onNestedFilterApply(null);
    } else {
      this.setState({selectedItem: null, selectedItems: [...this.state.selectedItems.slice(0, -1)]})
    }
  }

  getNavigationNextIcon() {
    if (!this.state.selectedItem || [nemesisFieldTypes.nemesisCollectionField, nemesisFieldTypes.nemesisEntityField].indexOf(this.state.selectedItem.xtype) === -1) {
      return false;
    }
    return <i className={'material-icons nested-filter-icon-popup'} onClick={this.selectDeepper.bind(this)}>navigate_next</i>
  }

  handleChange(item) {
    this.setState({selectedItem: item});
  }

  selectDeepper() {
    let selectedItems = [...this.state.selectedItems];
    selectedItems.push(this.state.selectedItem);
    this.setState({selectedItems: selectedItems, selectedItem: null});
  }

  getOptions() {
    let latestFilterItem = this.state.selectedItems[this.state.selectedItems.length - 1];
    let filterItemsForSelect = this.context.markupData[latestFilterItem.entityId].filter;

    return filterItemsForSelect.filter(item => nemesisFieldTypes.nemesisLocalizedTextField !== item.xtype).map(item => {
      return {value: item, label: item.fieldLabel};
    })
  }

  handleModalClose() {
    this.props.onModalCancel();
  }
}

NestedFilterPopup.contextTypes = {
  markupData: PropTypes.object
};