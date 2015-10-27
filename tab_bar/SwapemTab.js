'use strict';

var React = require('react-native');
var SwapemRootViewController = require('../nav_controllers/SwapemRootViewController');

var {
  StyleSheet,
  View,
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
      initialRoute = {{
        title: 'Swapem',
        component: SwapemRootViewController,
      }}/>
      );
  }
}

module.exports = SwapemTab;
