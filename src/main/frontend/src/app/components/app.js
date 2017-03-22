import React, { Component } from 'react';
import { componentRequire } from '../utils/require-util'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import counterpart from 'counterpart';
import AppBar from 'material-ui/AppBar';
import '../../styles/style.less';

injectTapEventPlugin();

const translationLanguages = {
 languages: [
   {value: 'en', labelCode: 'English'},
   {value: 'bg', labelCode: 'Bulgarian'},
 ],
 defaultLanguage: {value: 'en', labelCode: 'English'}
};

translationLanguages.languages.forEach(language => {
  let languageValue = language.value;
  counterpart.registerTranslations(languageValue, require('localesDir/' + languageValue));
});

counterpart.setLocale(translationLanguages.defaultLanguage.value);

let NavigationTree = componentRequire('app/components/navigation-tree/navigation-tree', 'navigation-tree');
let MainView = componentRequire('app/components/main-view/main-view', 'main-view');
let LanguageChanger = componentRequire('app/components/language-changer', 'language-changer');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedEntity: null};
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar style={{position: 'fixed'}} title="Nemesis Backend Console" iconElementRight={
            <LanguageChanger
              onLanguageChange={language => counterpart.setLocale(language)}
              availableLanguages={translationLanguages.languages}
              selectedLanguage={translationLanguages.defaultLanguage}
            />
          } iconStyleLeft={{display: 'none'}}/>
          <NavigationTree onEntityClick={this.onEntityClick.bind(this)}/>
          <MainView selectedEntity={this.state.selectedEntity}/>
        </div>
      </MuiThemeProvider>
    );
  }

  onEntityClick(entity) {
    this.setState({selectedEntity: entity});
  }
}