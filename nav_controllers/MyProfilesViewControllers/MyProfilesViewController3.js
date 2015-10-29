'use strict';
// Login UI components
exports.FBSDKLoginButton = require('../../node_modules/react-native-fbsdklogin/js-ui/FBSDKLoginButton.ios.js');

// Login native modules
exports.FBSDKLoginManager = require('../../node_modules/react-native-fbsdklogin/js-modules/FBSDKLoginManager.ios.js');

var React = require('react-native');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;
var FBSDKLogin = require('react-native-fbsdklogin');
var {
	FBSDKLoginButton,
  	FBSDKLoginManager,
} = FBSDKLogin;

var {
  StyleSheet,
  Component,
  View
} = React;

var styles = StyleSheet.create({
});

class MyProfilesViewController3 extends Component {
	render() {
    return (
      <View>
        <FBSDKLoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              alert('Error logging in.');
            } else {
              if (result.isCanceled) {
                alert('Login cancelled.');
              } else {
                alert('Logged in.');
              }
            }
          }}
          onLogoutFinished={() => alert('Logged out.')}
          readPermissions={[]}
          publishPermissions={['publish_actions']}/>
      </View>
    );
  }
}

// FBSDKLoginManager.setLoginBehavior(GlobalStore.getItem('behavior', 'native'));
// FBSDKLoginManager.logInWithReadPermissions([], (error, result) => {
//   if (error) {
//     alert('Error logging in.');
//   } else {
//     if (result.isCanceled) {
//       alert('Login cancelled.');
//     } else {
//       alert('Logged in.');
//     }
//   }
// });

module.exports = MyProfilesViewController3;
