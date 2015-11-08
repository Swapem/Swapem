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
  componentDidMount() {
    // create myProfiles AsyncStorage only the first time
    AsyncStorage.getItem('myProfiles').then((dbValue) => {
      if (dbValue == null) {
        AsyncStorage.setItem('myProfiles', JSON.stringify([]));
      }
    }).done();
  }
	render() {
		return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'My Profiles',
        component: MyProfilesVC1,
        leftButtonTitle: 'Edit',
        rightButtonIcon: require('image!Add'),
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
      var newProfiles = JSON.parse(dbValue);
      newProfiles.push({
        [promptValue]: {name: '', phone: '', email: '', facebook: ''}
      });
      AsyncStorage.setItem('myProfiles', JSON.stringify(newProfiles));
      alert(JSON.stringify(newProfiles));
    }).done();
  }
}

module.exports = MyProfilesRootVC;
