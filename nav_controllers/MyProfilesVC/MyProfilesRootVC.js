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
        tintColor = '#2980B9'
        initialRoute = {{
          title: 'My Profiles',
          component: MyProfilesVC1,
          leftButtonTitle: 'Delete All',
          onLeftButtonPress: () => {
            this.onLeftButtonPress()
          },
          rightButtonIcon: {uri:'Add'},
          onRightButtonPress: () => {
            this.promptProfileName();
          },
        }} />
    );
  }
  onLeftButtonPress() {
    MyProfilesVC1.onLeftButtonPress()
  }
  promptProfileName() {
    AlertIOS.prompt (
      'Enter profile name',
      'School',
      [
        {text: 'Cancel'},
        {text: 'Save', onPress: this.saveProfileName.bind(this)},
      ]
    )
  }
  saveProfileName(promptValue) {
    MyProfilesVC1.insertNewProfile(promptValue)
  }
}

module.exports = MyProfilesRootVC;
