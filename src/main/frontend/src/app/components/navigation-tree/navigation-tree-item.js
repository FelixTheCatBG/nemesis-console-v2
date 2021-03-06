import React, { Component } from 'react';
import Translate from 'react-translate-component';
import {Modal} from 'react-bootstrap';

const alignStyle = {
  verticalAlign: 'middle'
};

export default class TreeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isChildrenVisible: !!this.props.initiallyOpen, openModalCreation: false, creationEntity: null};
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({...this.state, isChildrenVisible: nextProps.initiallyOpen})
  }

  render() {
    return (
      <div style={this.getContainerStyles(this.props.nestingLevel)}>
        <div className={'nav-tree-item' + (this.props.nestingLevel === 0 ? ' main-level' : ' nested-level') + (this.state.isChildrenVisible ? ' expanded-item' : '')}
             onClick={this.handleItemClick.bind(this)}
             style={this.getItemStyles(this.props.nestingLevel)}>
            <Translate component="span"
                       style={alignStyle}
                       content={'main.' + this.props.item.text}
                       fallback={this.props.item.text}/>
            {
              this.props.nestedItems && this.props.nestedItems.length > 0 && (this.props.isVisible || this.props.nestingLevel === 0) ?
                <i className={this.state.isChildrenVisible ? 'material-icons tree-item-icon reverse-icon' : 'material-icons tree-item-icon'}>keyboard_arrow_right</i> :
                false
            }
            {this.getAddNewItemIcon()}
        </div>
        {this.props.isVisible || this.props.nestingLevel === 0 ? this.props.nestedItems.map(this.renderChildren.bind(this)) : false}
        {this.state.openModalCreation ?
          <Modal show={this.state.openModalCreation} onHide={this.handleClose.bind(this)} animation={false}>
            <Modal.Header>
              <Modal.Title>Create Entity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Please select entity type</div>
                {this.getEntityCategories(this.state.creationEntity, 0).map((item, index) => {
                  return (
                    <div style={this.getRadioButtonStyle(item)} key={index}>
                      <label className="radio-inline" style={{marginBottom: '10px'}}>
                        <input className="nemesis-radio-button default-checked" type="radio" value={item.entityId} defaultChecked={index === 0} onChange={this.handleRadioChange.bind(this)} name={'new-entity'}/>
                        {item.text}
                      </label>
                    </div>
                  )
                })}
            </Modal.Body>
            <Modal.Footer>
              <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={this.handleClose.bind(this)}>Cancel</button>
              <button className="nemesis-button success-button" onClick={this.handleSelectCreateEntity.bind(this)}>Create</button>
            </Modal.Footer>
          </Modal> : false}
      </div>
    )
  };

  getContainerStyles(nestingLevel) {
    let styles = {transition: 'font-size .25s, margin .25s, padding .25s,opacity .25s'};
    if (nestingLevel > 0 && !this.props.isVisible) {
      styles = { fontSize: '0', margin: '0', padding: '0', opacity: '0', transition: 'font-size .5s .25s,margin .5s .25s,padding .5s .25s, opacity .5s .25s' }
    }

    return styles;
  }

  handleRadioChange(e) {
    this.selectedCreatingItem = e.target.value;
  }

  getAddNewItemIcon() {
    if ((!this.props.nestedItems || this.props.nestedItems.length === 0) && this.props.isVisible) {
      return <i className="material-icons add-icon">add</i>;
    }

    return false;
  }

  renderChildren(nestedItem, index) {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        initiallyOpen: this.props.initiallyOpen,
        isVisible: this.state.isChildrenVisible,
        key: index,
        item: nestedItem,
        nestingLevel: this.props.nestingLevel + 1,
        nestedItems: nestedItem.children || [],
        onEntityClick: this.props.onEntityClick,
        children: child
      })
    });
  }

  handleItemClick(event) {
    let entity = this.props.item;
    if (event.target.className.indexOf('add-icon') > -1) {
      this.onCreateEntityClick(entity);
      return;
    }

    if (this.props.onEntityClick && entity.leaf) {
      this.props.onEntityClick({entityId: entity.id});
      return;
    }
    this.setState({...this.state, isChildrenVisible: !this.state.isChildrenVisible});
  }


  getItemStyles(nestingLevel) {
    let paddingLeft = (nestingLevel * 20);
    let paddingTopBottom = this.props.isVisible || this.props.nestingLevel === 0 ? '10px' : 0;
    let paddingLeftActual = (20 + paddingLeft) + 'px';
    return {
      position: 'relative',
      textAlign: 'left',
      width: '100%',
      padding: `${paddingTopBottom} 14px ${paddingTopBottom} ${paddingLeftActual}`,
      cursor: 'pointer',
      transition: 'padding .25s'
    };
  }

  handleSelectCreateEntity() {
    this.setState({...this.state, openModalCreation: false}, () => {
      this.props.onEntityClick({
        isNew: true,
        entityId: this.state.creationEntity.id,
        entityName: this.selectedCreatingItem
      });
    });
  }

  onCreateEntityClick(entity) {
    this.selectedCreatingItem = entity.id;
    this.setState({...this.state, creationEntity: entity, openModalCreation: true})
  }

  handleClose() {
    this.setState({...this.state, openModalCreation: false});
  };

  getEntityCategories(entity, nestingLevel) {
    let result = [];
    if (!entity) {
      return result;
    }

    result.push({entityId: entity.id, text: entity.text, nestingLevel: nestingLevel});
    if (entity.childNodes && entity.childNodes.length > 0) {
      entity.childNodes.map(node => {
        result = result.concat(this.getEntityCategories(node, nestingLevel + 1))
      })
    }

    return result;
  }

  getRadioButtonStyle(item) {
    let marginValue = item.nestingLevel * 15;
    return {
      marginLeft: marginValue + 'px'
    }
  }
}