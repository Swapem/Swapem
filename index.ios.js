/**
 * Tab bar view controller
 */
'use strict';

var React = require('react-native');
var MyProfilesRootVC = require('./nav_controllers/MyProfilesVC/MyProfilesRootVC');
var SwapemRootVC = require('./nav_controllers/SwapemVC/SwapemRootVC');
var RequestsRootVC = require('./nav_controllers/RequestsVC/RequestsRootVC');
var ContactsRootVC = require('./nav_controllers/ContactsVC/ContactsRootVC');
var SettingsRootVC = require('./nav_controllers/SettingsVC/SettingsRootVC');
var RemoteDataAccessManager = require('./RemoteDataAccessManager');
var DeviceUUID = require("react-native-device-uuid");

var {
  AppRegistry,
  Component,
  TabBarIOS,
} = React;

class Swapem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'MyProfilesRootVC'
    };
  }
  render() {
    return (
      <TabBarIOS
      translucent = {false}
      barTintColor = '#ECF0F1'
      tintColor = '#3498DB'>
      <TabBarIOS.Item
      icon = {require('image!MyProfiles')}
      selectedIcon = {require('image!MyProfilesSelected')}
      selected = {this.state.selectedTab === 'MyProfilesRootVC'}
      onPress = {() => {
        this.setState({
          selectedTab: 'MyProfilesRootVC',
        });
      }}>
      <MyProfilesRootVC/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Swapem')}
      selectedIcon = {require('image!SwapemSelected')}
      selected = {this.state.selectedTab === 'SwapemRootVC'}
      onPress = {() => {
        this.setState({
          selectedTab: 'SwapemRootVC',
        });
      }}>
      <SwapemRootVC/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Requests')}
      selectedIcon = {require('image!RequestsSelected')}
      selected = {this.state.selectedTab === 'RequestsRootViewController'}
      onPress = {() => {
        // Query if new contact requests were made.
        console.log(DeviceUUID.getUUID());
        RemoteDataAccessManager.checkForRecentContactsSent(DeviceUUID.getUUID());
        // TODO ****************************************************
        // ADD LOGIC TO STORE THE DATA, AND SHOW THEM IN LIST VIEW ON THE REQUESTS PAGE
        this.setState({
          selectedTab: 'RequestsRootViewController',
        });
      }}>
      <RequestsRootVC/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Contacts')}
      selectedIcon = {require('image!ContactsSelected')}
      selected = {this.state.selectedTab === 'ContactsRootVC'}
      onPress = {() => {
        this.setState({
          selectedTab: 'ContactsRootVC',
        });
      }}>
      <ContactsRootVC/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Settings')}
      selectedIcon = {require('image!SettingsSelected')}
      selected = {this.state.selectedTab === 'SettingsRootVC'}
      onPress = {() => {
        this.setState({
          selectedTab: 'SettingsRootVC',
        });
      }}>
      <SettingsRootVC/>
      </TabBarIOS.Item>
      </TabBarIOS>
      );
  }
}

AppRegistry.registerComponent('Swapem', () => Swapem);
