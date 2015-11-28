/**
 * Starting view controller for Settings tab
 */
'use strict';

var React = require('react-native');
var SettingsVC1 = require('./SettingsVC1');

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

class SettingsRootVC extends Component {
  render() {
    return (
      <NavigatorIOS
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#2980B9'
      initialRoute = {{
        title: 'Settings',
        component: SettingsVC1,
      }}/>
      );
  }
}

module.exports = SettingsRootVC;
