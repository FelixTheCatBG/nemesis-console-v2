import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import ExpandableProperties from './admin-system-properties-expandable';
import _ from 'lodash';
import counterpart from 'counterpart';

export default class AdminSystemProperties extends Component {
  constructor(props) {
    super(props);
    this.state = {properties: {}, filteredProperties: {}}
  }

  componentDidMount() {
    PlatformApiCall.get('env').then(result => {
      let data = this.parseProperties(result.data);
      this.setState({properties: data, filteredProperties: data});
    })
  }

  render() {
    return (
      <div className="admin-system-properties">
        <div className="input-group">
          <input type="text"
                 placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search"/></span>
        </div>
        {this.getFilteredProperties().map(item => <ExpandableProperties name={item.name} key={item.name} properties={item.value}/>)}
      </div>
    );
  }

  parseProperties(data) {
    let result = {profiles: data.activeProfiles};
    _.forEach(data.propertySources, property => {
      let properties = {};
      _.forIn(property.properties, (value, key) => {
          properties[key] = value.value;
      });
      result[property.name] = properties
    });

    return result;
  }

  getFilteredProperties() {
    let result = [];
    _.forIn(this.state.filteredProperties, (value, key) => {
      result.push({name: key, value: value});
    });
    return result;
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let filteredProperties = this.state.properties;
    if (searchValue) {
      let resultObj = {};
      _.forIn(this.state.properties, (value, key) => {
        let filterValue = {};
        _.forIn(value, (value, key) => {
          if (key.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
            filterValue[key] = value;
          }
        });
        if (!_.isEmpty(filterValue)) {
          resultObj[key] = filterValue
        }
      });
      filteredProperties = resultObj;
    }

    this.setState({...this.state, filteredProperties: filteredProperties});
  }

}