/**
 * Starting view controller for Contacts tab
 */
'use strict';

var React = require('react-native');
var ContactsVC1 = require('./ContactsVC1');
var DB = require('../../DB.js');

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

    //     var ahahnbh= DB.addressbook.get({accepted: true}, (results) =>{
    //   alert(JSON.stringify(results))
    // })

class ContactsRootVC extends Component {
  render() {
      return <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'Contacts',
        component: ContactsVC1,
        rightButtonTitle: 'Edit'
      }}/>

  }
}

module.exports = ContactsRootVC;
