/**
 * Starting view controller for Swap'em tab
 */
'use strict';

var React = require('react-native');
var SwapemVC1 = require('./SwapemVC1');

var {
  Component,
  NavigatorIOS,
  StyleSheet,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class SwapemRootVC extends Component {
  // update tableview when new props are received,
  // i.e. new VC is selected for TabBarIOS.Item in index.ios
  componentWillReceiveProps() {
    this.refreshComponent();
  }
  render() {
    return (
      <NavigatorIOS
      ref = 'nav'
      translucent = {false}
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#2980B9'
      initialRoute = {{
        title: 'Select profile',
        component: SwapemVC1,
      }}/>
    );
  }
  refreshComponent() {
  	this.refs.nav.popToTop();
    this.refs.nav.replace({
      title: 'Select profile',
      component: SwapemVC1,
    });
  }
}

module.exports = SwapemRootVC;
