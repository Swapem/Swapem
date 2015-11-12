/**
 * Starting view controller for Swap'em tab
 */
'use strict';

var React = require('react-native');
var SwapemVC1 = require('./SwapemVC1');

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

class SwapemRootVC extends Component {
  render() {
    return (
      <NavigatorIOS
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'Select profile',
        component: SwapemVC1,
      }}/>
      );
  }
}

module.exports = SwapemRootVC;
