/**
 * Starting view controller for Settings tab
 */
'use strict';

var React = require('react-native');
var SettingsViewController1 = require('./SettingsViewController1');

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

class SettingsRootViewController extends Component {
  render() {
    return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'Settings',
        component: SettingsViewController1,
      }}/>
      );
  }
}

module.exports = SettingsRootViewController;
