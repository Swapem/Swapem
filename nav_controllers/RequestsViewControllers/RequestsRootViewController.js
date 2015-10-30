/**
 * Starting view controller for Requests tab
 */
'use strict';

var React = require('react-native');
var RequestsViewController1 = require('./RequestsViewController1');

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

class RequestsRootViewController extends Component {
  render() {
    return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'Requests',
        component: RequestsViewController1,
        rightButtonIcon: require('image!Refresh'),
      }}/>
      );
  }
}

module.exports = RequestsRootViewController;
