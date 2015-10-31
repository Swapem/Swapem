/**
 * Starting view controller for Contacts tab
 */
'use strict';

var React = require('react-native');
var ContactsViewController1 = require('./ContactsViewController1');

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

class ContactsRootViewController extends Component {
  render() {
    return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'Contacts',
        component: ContactsViewController1,
        rightButtonTitle: 'Edit',
      }}/>
      );
  }
}

module.exports = ContactsRootViewController;
