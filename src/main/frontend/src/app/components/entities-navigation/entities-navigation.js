import React, { Component } from 'react';
import EntitiesNavigationItem from './entity-navigation-item'
import { componentRequire } from '../../utils/require-util';
import {GridList, GridTile} from 'material-ui/GridList';
import _ from 'lodash';

export default class EntitiesNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {groupedEntities: []};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({groupedEntities: _.groupBy(nextProps.entities, 'entityId')});
  }

  render() {
    return (
      <GridList className="entity-navigation" cellHeight="auto" cols={2.2}>
        {_.map(this.state.groupedEntities, (value, key) =>
          <GridTile className="navigation-item-container" style={{width: 'auto'}} containerElement="span" key={key}>
            <EntitiesNavigationItem entityId={key}
                                    entities={value}
                                    onEntityWindowClose={this.props.onEntityWindowClose}
                                    onNavigationItemClick={this.props.onNavigationItemClick}/>
          </GridTile>
        )}
      </GridList>
    )
  }
}
