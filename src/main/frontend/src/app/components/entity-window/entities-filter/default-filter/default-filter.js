import React, { Component } from 'react';
import { searchFormTypes } from '../../../../types/nemesis-types';
import FilterTextField from '../filter-fields/filter-text-field/filter-text-field';
import FilterDateField from '../filter-fields/filter-date-field/filter-date-field';
import FilterLocalizedTextField from '../filter-fields/filter-localized-text-field/filter-localized-text-field';
import FilterBooleanField from '../filter-fields/filter-boolean-field/filter-boolean-field';
import FilterNumberField from '../filter-fields/filter-number-field/filter-number-field';
import FilterBuilder from '../../../../services/filter-builder';
import _ from 'lodash';

export default class DefaultFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {appliedFilters: []};
  }

  render() {
    return (
      <div>
        {this.props.filterMarkup.map((filterItem, index) => this.getFilterItemRender(filterItem, index))}
        <button onClick={this.onSearchButtonClick.bind(this)}>Search</button> <button onClick={this.onClearButtonClick.bind(this)}>Clear</button>
      </div>
    )
  }

  getFilterItemRender(filterItem, renderIndex) {
    let reactElement;
    switch (filterItem.xtype) {
      case searchFormTypes.nemesisTextField: reactElement = FilterTextField; break;
      case searchFormTypes.nemesisDateField: reactElement = FilterDateField; break;
      case searchFormTypes.nemesisLocalizedTextField: reactElement = FilterLocalizedTextField; break;
      case searchFormTypes.nemesisBooleanField: reactElement = FilterBooleanField; break;
      case searchFormTypes.nemesisIntegerField:
      case searchFormTypes.nemesisDecimalField: reactElement = FilterNumberField; break;
      default: return <div key={renderIndex}>Not supported yet - {filterItem.xtype}</div>
    }

    return React.createElement(reactElement, {
      onFilterChange: this.onFilterChange.bind(this),
      key: renderIndex,
      filterItem: filterItem
    })
  }


  onFilterChange(filterObject) {
    let filterIndex = _.findIndex(this.state.appliedFilters, {id: filterObject.id});
    let appliedFilters = this.state.appliedFilters;

    if (filterIndex < 0) {
      appliedFilters.push(filterObject);
    } else {
      appliedFilters[filterIndex] = filterObject;
    }

    this.setState({appliedFilters: appliedFilters});
  }

  onSearchButtonClick() {
    //invoke filter build
    console.log(FilterBuilder.buildFilter(this.state.appliedFilters));
    this.props.onFilterApply();
  }

  onClearButtonClick() {
    this.setState({appliedFilters: []});
    this.props.onFilterApply();
  }
}