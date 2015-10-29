'use strict';

var React = require('react-native');
var SettingsRootViewController = require('../nav_controllers/SettingsViewControllers/SettingsRootViewController');

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

class SettingsTab extends Component {
  render() {
    return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'Settings',
        component: SettingsRootViewController,
      }}/>
      );
  }
}

module.exports = SettingsTab;
