'use strict';

var React = require('react-native');
var ContactsRootViewController = require('../nav_controllers/ContactsViewControllers/ContactsRootViewController');

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

class ContactsTab extends Component {
  render() {
    return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'Contacts',
        component: ContactsRootViewController,
      }}/>
      );
  }
}

module.exports = ContactsTab;
