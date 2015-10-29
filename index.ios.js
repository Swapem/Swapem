/**
 * Tab bar view controller
 */
'use strict';

var React = require('react-native');
var MyProfilesRootViewController = require('./nav_controllers/MyProfilesViewControllers/MyProfilesRootViewController');
var SwapemRootViewController = require('./nav_controllers/SwapemViewControllers/SwapemRootViewController');
var RequestsRootViewController = require('./nav_controllers/RequestsViewControllers/RequestsRootViewController');
var ContactsRootViewController = require('./nav_controllers/ContactsViewControllers/ContactsRootViewController');
var SettingsRootViewController = require('./nav_controllers/SettingsViewControllers/SettingsRootViewController');
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
      selectedTab: 'MyProfilesRootViewController'
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
      selected = {this.state.selectedTab === 'MyProfilesRootViewController'}
      onPress = {() => {
        this.setState({
          selectedTab: 'MyProfilesRootViewController'
        });
      }}>
      <MyProfilesRootViewController/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Swapem')}
      selectedIcon = {require('image!SwapemSelected')}
      selected = {this.state.selectedTab === 'SwapemRootViewController'}
      onPress = {() => {
        this.setState({
          selectedTab: 'SwapemRootViewController'
        });
      }}>
      <SwapemRootViewController/>
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
          selectedTab: 'RequestsRootViewController'
        });
      }}>
      <RequestsRootViewController/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Contacts')}
      selectedIcon = {require('image!ContactsSelected')}
      selected = {this.state.selectedTab === 'ContactsRootViewController'}
      onPress = {() => {
        this.setState({
          selectedTab: 'ContactsRootViewController'
        });
      }}>
      <ContactsRootViewController/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Settings')}
      selectedIcon = {require('image!SettingsSelected')}
      selected = {this.state.selectedTab === 'SettingsRootViewController'}
      onPress = {() => {
        this.setState({
          selectedTab: 'SettingsRootViewController'
        });
      }}>
      <SettingsRootViewController/>
      </TabBarIOS.Item>
      </TabBarIOS>
      );
  }
}

AppRegistry.registerComponent('Swapem', () => Swapem);
