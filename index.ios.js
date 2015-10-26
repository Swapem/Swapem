/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
 AppRegistry,
 StyleSheet,
 Text,
 View,
} = React;

var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;

var Swapem = React.createClass({
 render: function() {
   // return (
   //   <View style={styles.container}>
   //     <Text style={styles.welcome}>
   //       Welcome to React Native!
   //     </Text>
   //     <Text style={styles.instructions}>
   //       To get started, edit index.ios.js
   //     </Text>
   //     <Text style={styles.instructions}>
   //       Press Cmd+R to reload,{'\n'}
   //       Cmd+D or shake for dev menu
   //     </Text>
   //   </View>
   // );
    var _this = this;
    return (
      <View style={styles.container}>
      <FBLogin style={{ marginBottom: 10, }}
        permissions={["email","user_friends"]}
        loginBehavior={FBLoginManager.LoginBehaviors.Native}
        onLogin={function(data){
          console.log("Logged in!");
          console.log(data);
          _this.setState({ user : data.credentials });
        }}
        onLogout={function(){
          console.log("Logged out.");
          _this.setState({ user : null });
        }}
        onLoginFound={function(data){
          console.log("Existing login found.");
          console.log(data);
          _this.setState({ user : data.credentials });
        }}
        onLoginNotFound={function(){
          console.log("No user logged in.");
          _this.setState({ user : null });
        }}
        onError={function(data){
          console.log("ERROR");
          console.log(data);
        }}
        onCancel={function(){
          console.log("User cancelled.");
        }}
        onPermissionsMissing={function(data){
          console.log("Check permissions!");
          console.log(data);
        }} />
        </View>
    );
 }
});

var styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#F5FCFF',
 },
 welcome: {
   fontSize: 20,
   textAlign: 'center',
   margin: 10,
 },
 instructions: {
   textAlign: 'center',
   color: '#333333',
   marginBottom: 5,
 },
});




AppRegistry.registerComponent('Swapem', () => Swapem);
