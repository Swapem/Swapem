/**
 * Starting view controller for My Profiles tab
 */
'use strict';

var React = require('react-native');
var MyProfilesVC1 = require('./MyProfilesVC1');

var {
  StyleSheet,
  Component,
  NavigatorIOS,
  AlertIOS,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MyProfilesRootVC extends Component {
	render() {
		return (
      <NavigatorIOS
      translucent = {false}
      style = {styles.container}
      barTintColor = '#ECF0F1'
      titleTextColor = '#2C3E50'
      tintColor = '#3498DB'
      initialRoute = {{
        title: 'My Profiles',
        component: MyProfilesVC1,
        leftButtonTitle: 'Edit',
        rightButtonIcon: require('image!Add'),
        onRightButtonPress: () => {
          this.prompt();
        },
      }}/>
      );
  }
  prompt() {
    AlertIOS.prompt (
      'Enter profile name',
      '',
      [
      {text: 'Cancel'},
      {text: 'Save', onPress: this.save.bind(this)},
      ]
      )
  }
  save(value) {
    alert(value);
  }
}

module.exports = MyProfilesRootVC;
