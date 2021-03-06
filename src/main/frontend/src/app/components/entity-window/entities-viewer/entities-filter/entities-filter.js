import React, { Component } from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';

import SelectCustomArrow from '../../../../components/helper-components/select-custom-arrow';

import { componentRequire } from '../../../../utils/require-util';

let DefaultFilter = componentRequire('app/components/entity-window/entities-viewer/entities-filter/default-filter/default-filter', 'default-filter');

export default class EntitiesFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {filterMarkup: this.props.filterMarkup, selectedMenuIndex: 0};
  }

  render() {
    return (
      <div>
        <div className="paper-box entities-filter">
          <div style={this.getFilterSelectStyle()}>
            <label><Translate content={'main.Filter'} fallback={'Filter'}/></label>
            <Select style={{width: '265px'}}
                    className="select-filter"
                    clearable={false}
                    arrowRenderer={() => <SelectCustomArrow/>}
                    disabled={this.props.readOnly}
                    value={{value: this.state.selectedMenuIndex, label: this.getFilters()[this.state.selectedMenuIndex].filterName}}
                    onChange={this.handleFilterChange.bind(this)}
                    options={this.getFilters().map((item, index) => {
                      return {value: index, label: item.filterName}
                    })}/>
          </div>
          {this.getFilters().map(this.getFilterElement.bind(this))}
        </div>
      </div>
    )
  }

  handleFilterChange(item) {
    this.setState({...this.state, selectedMenuIndex: item.value});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({filterMarkup: nextProps.filterMarkup})
  }

  getFilters() {
    return [{filterName: 'Default filter', filterClass: DefaultFilter}];
  }

  getFilterSelectStyle() {
    let style = {display:'inline-block', marginBottom: '20px'};
    if (this.getFilters().length <= 1) {
      style = {display: 'none'};
    }

    return style;
  }

  getFilterElement(filter, index) {
    let config = {
      key: index,
      onFilterApply: this.props.onFilterApply,
      filterMarkup: this.state.filterMarkup,
      style: index === this.state.selectedMenuIndex ? {} : {display: 'none'},
      entity: this.props.entity,
      retakeEntityData: this.props.retakeEntityData
    };

    return React.createElement(filter.filterClass, config);
  }

}
