/**
 * Starting view controller for Contacts tab
 */
'use strict';

var React = require('react-native');
var ContactsVC1 = require('./ContactsVC1');

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

class ContactsRootVC extends Component {
  // update tableview when new props are received,
  // i.e. new VC is selected for TabBarIOS.Item in index.ios
  componentWillReceiveProps() {
    this.refreshComponent();
  }
  render() {
    return (
      <NavigatorIOS
      ref = 'nav'
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#2980B9'
      initialRoute = {{
        title: 'Contacts',
        component: ContactsVC1,
        rightButtonTitle: 'Edit',
      }}/>
    );
  }
  refreshComponent() {
    this.refs.nav.popToTop();
    this.refs.nav.replace({
      title: 'Contacts',
      component: ContactsVC1,
      rightButtonTitle: 'Edit',
    });
  }
}

module.exports = ContactsRootVC;
