import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import LanguageChanger from '../../language-changer';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';
import { Modal } from 'react-bootstrap';
import { main } from '../../../../locales/bg'

const translationLanguages = {
  languages: [
    { value: 'en', labelCode: 'English' },
    { value: 'bg_BG', labelCode: 'Bulgarian' },
  ],
  defaultLanguage: { value: 'en', labelCode: 'English' }
};

export default class NemesisLocalizedTextField extends NemesisBaseField {
  constructor(props) {
    super(props);
    let defaultLanguage = (this.props.defaultLanguage && this.props.defaultLanguage.value) || translationLanguages.defaultLanguage.value;
    this.state = {
      ...this.state,
      selectedLanguage: defaultLanguage,
      openTranslateDialog: false
    };
  }

  render() {
    return (
      <div className="entity-field-container">
        {this.state.availableLanguages &&
          <LanguageChanger
            readOnly={this.props.readOnly}
            label="language"
            showLabel={this.props.showLabels}
            selectClassName="entity-field"
            style={{ marginRight: '15px', ...this.props.style }}
            onLanguageChange={this.onLanguageChange}
            availableLanguages={this.state.availableLanguages}
            selectedLanguage={this.props.defaultLanguage || translationLanguages.defaultLanguage}
          />
        }
        <div className="entity-field-input-container">
          {this.props.showLabels && <div>
            <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
            {this.props.required ? <span className="required-star">*</span> : false}
          </div>}
          <input type="text"
            style={{ height: '36px' }}
            className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
            value={this.getTextFieldValue(this.state.selectedLanguage)}
            disabled={this.props.readOnly}
            onChange={(e) => this.onTextChange(e, e.target.value, this.state.selectedLanguage)} />
        </div>
        {this.props.type === nemesisFieldUsageTypes.edit ?
          (
            <i className={this.getOpenDialogIconClass()} onClick={this.handleTranslateIconClick.bind(this)} />
          ) :
          false}
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        {this.props.type === nemesisFieldUsageTypes.edit ?
          (
            <Modal show={this.state.openTranslateDialog}
              animation={false}
              size="lg"
              onHide={this.handleTranslateDialogClose.bind(this)}
              backdrop="static">
              <Modal.Header>
                <Modal.Title>Translate field</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {translationLanguages.languages.map(this.getDialogInputField)}
              </Modal.Body>
              <Modal.Footer>
                <button className="nemesis-button success-button"
                  onClick={this.handleTranslateDialogClose.bind(this)}>Done</button>
              </Modal.Footer>
            </Modal>
          ) :
          false}
      </div>
    )
  }

  componentDidMount() {
    let availableLanguages = [];
    for (const [key, value] of Object.entries(this.props.value)) {
      const labelCode = (main[key] !== undefined) ? main[key] : key;
      availableLanguages.push({ value: key, labelCode: labelCode })
    };

    this.setState({
      availableLanguages: availableLanguages
    });
  }

  getDialogInputField = (language, index) => {
    return (
      <div key={index} style={{ marginBottom: '20px' }}>
        <Translate component="label" content={'main.' + language.labelCode} fallback={language.labelCode} />
        <textarea className="entity-field form-control"
          rows={1}
          style={{ resize: 'vertical' }}
          value={this.getTextFieldValue(language.value)}
          disabled={this.props.readOnly}
          onChange={(e) => this.onTextChange(e, e.target.value, language.value)} />
      </div>
    )
  }

  getModalSize() {
    return null;
  }

  onLanguageChange = (language) => {
    this.setState({ ...this.state, selectedLanguage: language }, () => {
      if (this.props.onValueChange) {
        this.props.onValueChange(this.getFormattedValue(this.state.value || {}, language));
      }
    });
  }

  getTextFieldValue(language) {
    if (!this.state.value) {
      return '';
    }

    return (this.state.value[language] && this.state.value[language].value) || '';
  }

  onTextChange(event, value, language) {
    let actualValue = { ...this.state.value };
    if (!actualValue[language]) {
      actualValue[language] = {};
    }
    actualValue[language].value = value;
    this.onValueChange(event, actualValue);
  }

  getFormattedValue(value, language) {
    let languageActual = language || this.state.selectedLanguage;
    if (this.props.type !== nemesisFieldUsageTypes.edit) {
      let result = {};
      result.language = languageActual;
      result.value = value[languageActual] && value[languageActual].value;
      return result;
    }

    return value;
  }

  handleTranslateIconClick = () => {
    this.setState({ ...this.state, openTranslateDialog: true });
  };

  handleTranslateDialogClose = () => {
    this.setState({ ...this.state, openTranslateDialog: false });
  };

  getOpenDialogIconClass() {
    return 'fa fa-globe entity-navigation-icon entity-navigation-icon';
  }
}

NemesisLocalizedTextField.defaultProps = {
  showLabels: true
}