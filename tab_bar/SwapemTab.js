'use strict';

var React = require('react-native');
var SwapemRootViewController = require('../nav_controllers/SwapemViewControllers/SwapemRootViewController');

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

class SwapemTab extends Component {
  render() {
    return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: "Swap'em",
        component: SwapemRootViewController,
      }}/>
      );
  }
}

module.exports = SwapemTab;
