/**
 * Starting view controller for Requests tab
 */
'use strict';

var React = require('react-native');
var RequestsVC1 = require('./RequestsVC1');

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

class RequestsRootVC extends Component {
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
        title: 'Requests',
        component: RequestsVC1.instance,
        leftButtonIcon: {uri: 'Refresh'},
        onLeftButtonPress: () => {
          this.refreshComponent();
        },
        rightButtonTitle: 'Accept',
      }}/>
    );
  }
  refreshComponent() {
    this.refs.nav.replace({
      title: 'Requests',
      component: RequestsVC1.instance,
      leftButtonIcon: {uri: 'Refresh'},
      onLeftButtonPress: () => {
        this.refreshComponent();
      },
      rightButtonTitle: 'Accept',
    });
  }
}

module.exports = RequestsRootVC;
