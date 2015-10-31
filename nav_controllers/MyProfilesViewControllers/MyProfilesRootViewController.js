/**
 * Starting view controller for My Profiles tab
 */
'use strict';

var React = require('react-native');
var MyProfilesViewController1 = require('./MyProfilesViewController1');

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

class MyProfilesRootViewController extends Component {
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
        component: MyProfilesViewController1,
        leftButtonTitle: 'Edit',
        rightButtonIcon: require('image!Add'),
        }}/>
      );
  }
}

module.exports = MyProfilesRootViewController;
