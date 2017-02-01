import React, {Component} from 'react';
import {entitySearchType, entityItemType} from '../../types/entity-types'
import ApiCall from '../../services/api-call';
import _ from 'lodash';
import EnititiesFilter from './entities-filter/entities-filter';
import EnititiesViewer from './entities-viewer/entities-viewer';
import Translate from 'react-translate-component';

export default class EntitiesWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {searchResult: [], itemResult: {}, page: {}};
  }

  componentWillMount() {
    this.getDataByEntityType(this.props.entity, 1, 20);
  }

  render() {
    let styles = {
      height: 'calc(100vh - 120px)',
      overflowY: 'auto'
    };
    if (!this.props.entity.isVisible) {
      styles.display = 'none';
    }

    return (
      <div style={styles}>
        {this.renderEntityByType(this.props.entity)}
      </div>
    )
  }

  renderEntityByType(entity) {
    switch (entity.type) {
      case entityItemType: {
        return (
          <div>{entity.entityId}</div>
        );
      }
      case entitySearchType: {
        return (
          <div>
            <Translate component="h2" content={'main.' + entity.entityId} fallback={entity.entityId}/>
            <EnititiesFilter filterMarkup={this.props.entity.data.filter} onFilterApply={this.onFilterApply.bind(this)}/>
            <EnititiesViewer entities={this.state.searchResult}
                             entitiesMarkup={this.props.entity.data.result}
                             onPagerChange={this.onPagerChange.bind(this)}
                             page={this.state.page}
                             onEntityItemClick={this.onEntityItemClick.bind(this)}/>
          </div>
        );
      }
      default: {
        return <div>INVALID ENTITY TYPE!!!</div>
      }
    }
  }

  onEntityItemClick(item) {
    this.props.onEntityItemClick(item, this.props.entity.entityId)
  }

  onFilterApply() {

  }

  onPagerChange(page, pageSize) {
    this.getDataByEntityType(this.props.entity, page, pageSize);
  }

  getDataByEntityType(entity, page, pageSize) {
    switch (entity.type) {
      case entityItemType: {
        ApiCall.get(entity.entityId + '/' + entity.itemId).then(result => console.log(result));
        return;
      }
      case entitySearchType: {
        ApiCall.get(entity.entityId, {page: page, size: pageSize}).then(result => {
          let data = [];
          _.forIn(result.data._embedded, (value) => data = data.concat(value));
          this.setState({...this.state, searchResult: data, page: result.data.page});
        });
        return;
      }
      default: {
        throw 'INVALID ENTITY TYPE!!!';
      }
    }
  }
}