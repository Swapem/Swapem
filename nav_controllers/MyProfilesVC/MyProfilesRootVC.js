/**
 * Starting view controller for My Profiles tab
 */
'use strict';

var React = require('react-native');
var MyProfilesVC1 = require('./MyProfilesVC1');

var {
  AlertIOS,
  AsyncStorage,
  Component,
  NavigatorIOS,
  StyleSheet,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

var testProfiles = [
{Basic: {name: 'Ann Kim', phone: '(778) 111-1111', email: 'annkim@cs410.com', facebook: 'annkim'}},
{School: {name: 'Ann Kim', phone: '(778) 111-1111', facebook: 'annkim'}},
{Work: {name: 'Ann Kim', phone: '(778) 111-1111', email: 'annkim@cs410.com'}},
];

class MyProfilesRootVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  // create myProfiles AsyncStorage the first time
  componentDidMount() {
    AsyncStorage.getItem('myProfiles').then((dbValue) => {
      if (dbValue == null) {
        AsyncStorage.setItem('myProfiles', JSON.stringify([]));
      }
    });
  }
	render() {
		return (
      <NavigatorIOS
      ref = 'nav'
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'My Profiles',
        component: MyProfilesVC1,
        leftButtonTitle: 'Edit',
        rightButtonIcon: {uri:'Add'},
        onRightButtonPress: () => {
          this.promptProfileName();
        },
      }}/>
      );
  }
  promptProfileName() {
    AlertIOS.prompt (
      'Enter profile name',
      '',
      [
      {text: 'Cancel'},
      {text: 'Save', onPress: this.saveProfileName.bind(this)},
      ]
      )
  }
  saveProfileName(promptValue) {
    AsyncStorage.getItem('myProfiles').then((dbValue) => {
      var profiles = JSON.parse(dbValue);
      profiles.push({
        [promptValue]: {name: '', phone: '', email: '', facebook: ''}
      });
      AsyncStorage.setItem('myProfiles', JSON.stringify(profiles));
      profiles = this.props.profiles;
      this.refs.nav.replace({
        title: 'My Profiles',
        component: MyProfilesVC1,
        leftButtonTitle: 'Edit',
        rightButtonIcon: {uri:'Add'},
        onRightButtonPress: () => {
          this.promptProfileName();
        },
      });
    }).done();
  }
}

module.exports = MyProfilesRootVC;
