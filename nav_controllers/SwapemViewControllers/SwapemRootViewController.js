/**
 * Starting view controller for Swap'em tab
 */
'use strict';

var React = require('react-native');
var SwapemViewController1 = require('./SwapemViewController1');

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

class SwapemRootViewController extends Component {
  render() {
    return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'Select profile',
        component: SwapemViewController1,
      }}/>
      );
  }
}

module.exports = SwapemRootViewController;
