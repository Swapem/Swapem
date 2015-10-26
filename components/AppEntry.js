var React = require('react-native');

// Make react global
window.React = React;

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} = React;

var Login = require('./Login');
var LoginMock = require('./LoginMock');

var Swapem = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        itemWrapperStyle={styles.allPages}
        initialRoute={{
          title: 'Login',
          component: Login,
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  allPages: {
    backgroundColor: '#EEE',
  },
});

AppRegistry.registerComponent('Swapem', () => Swapem);

module.exports = Swapem;
