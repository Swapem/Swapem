'use strict';

var React = require('react-native');
var MyProfilesRootViewController = require('../nav_controllers/MyProfilesViewControllers/MyProfilesRootViewController');

var {
  StyleSheet,
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
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'My Profiles',
        component: MyProfilesRootViewController,
      }}/>
      );
  }
}

module.exports = MyProfilesTab;
