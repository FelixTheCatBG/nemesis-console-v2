import React, {Component} from 'react';
import {entitySearchType, entityItemType} from '../../types/entity-types'
import EntitiesViewer from './entities-viewer/entities-viewer';
import EntitySections from './entity-sections/entity-sections'

export default class EntitiesWindow extends Component {
  constructor(props) {
    super(props);
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
        return <EntitySections entity={entity} onEntityWindowClose={this.props.onEntityWindowClose}/>
      }
      case entitySearchType: {
        return <EntitiesViewer entity={entity} onEntityItemClick={this.props.onEntityItemClick}/>
      }
      default: {
        return <div>INVALID ENTITY TYPE!!!</div>
      }
    }
  }
}
