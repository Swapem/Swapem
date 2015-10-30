'use strict';
// Login UI components
exports.FBSDKLoginButton = require('../../node_modules/react-native-fbsdklogin/js-ui/FBSDKLoginButton.ios.js');

// Login native modules
exports.FBSDKLoginManager = require('../../node_modules/react-native-fbsdklogin/js-modules/FBSDKLoginManager.ios.js');

var React = require('react-native');
var FBSDKCore = require ('react-native-fbsdkcore');
var FBSDKLogin = require('react-native-fbsdklogin');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;

var {
	FBSDKLoginButton,
  	FBSDKLoginManager,
} = FBSDKLogin;

var {
  FBSDKAccessToken,
  FBSDKGraphRequest,
  FBSDKGraphRequestManager,
} = FBSDKCore;

var {
  Text,
  StyleSheet,
  Component,
  View
} = React;

var styles = StyleSheet.create({
});

var fetchURL = new FBSDKGraphRequest ((error, result) => {
  console.log('FBSDKGraphRequest', error, result);
  }, 'me?fields=link');
FBSDKGraphRequestManager.batchRequests([fetchURL], function() {}, 60);


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
                var token = new FBSDKAccessToken.getCurrentAccessToken(token => console.log (token, 'Type of Token is:' + typeof token));              
                <Text style={styles.appendURL}>
  Welcome to React Native!
</Text>
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



var styles = StyleSheet.create({
  appendURL: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

FBSDKLoginManager.setLoginBehavior('native');
FBSDKLoginManager.logInWithReadPermissions([], (error, result) => {
  if (error) {
    alert('Error logging in.');
  } else {
    if (result.isCanceled) {
      alert('Login cancelled.');
    } else {
      alert('Logged in.');
    }
  }
});


module.exports = MyProfilesViewController3;
