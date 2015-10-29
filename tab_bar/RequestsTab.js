'use strict';

var React = require('react-native');
var RequestsRootViewController = require('../nav_controllers/RequestsViewControllers/RequestsRootViewController');

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

class RequestsTab extends Component {
  render() {
    return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'Requests',
        component: RequestsRootViewController,
      }}/>
      );
  }
}

module.exports = RequestsTab;
