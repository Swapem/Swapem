'use strict';

var React = require('react-native');
var MyProfilesRootViewController = require('../nav_controllers/MyProfilesRootViewController');

var {
  StyleSheet,
  Text,
  View,
  Component,
  NavigatorIOS,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MyProfilesTab extends Component {
	render() {
		return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      initialRoute = {{
        title: 'My Profiles',
        component: MyProfilesRootViewController,
      }}/>
      );
  }
}

module.exports = MyProfilesTab;
