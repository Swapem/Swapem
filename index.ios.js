/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MyProfilesTab = require('./tab_bar/MyProfilesTab');
var SwapemTab = require('./tab_bar/SwapemTab');
var RequestsTab = require('./tab_bar/RequestsTab');
var ContactsTab = require('./tab_bar/ContactsTab');
var SettingsTab = require('./tab_bar/SettingsTab');
var {
  AppRegistry,
  Component,
  TabBarIOS,
} = React;

class Swapem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'MyProfilesTab'
    };
  }
  render() {
    return (
      <TabBarIOS
      translucent = {false}
      tintColor = '#3498DB'>
      <TabBarIOS.Item
      icon = {require('image!MyProfiles')}
      selectedIcon = {require('image!MyProfilesSelected')}
      selected = {this.state.selectedTab === 'MyProfilesTab'}
      onPress = {() => {
        this.setState({
          selectedTab: 'MyProfilesTab'
        });
      }}>
      <MyProfilesTab/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Swapem')}
      selectedIcon = {require('image!SwapemSelected')}
      selected = {this.state.selectedTab === 'SwapemTab'}
      onPress = {() => {
        this.setState({
          selectedTab: 'SwapemTab'
        });
      }}>
      <SwapemTab/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Requests')}
      selectedIcon = {require('image!RequestsSelected')}
      selected = {this.state.selectedTab === 'RequestsTab'}
      onPress = {() => {
        this.setState({
          selectedTab: 'RequestsTab'
        });
      }}>
      <RequestsTab/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Contacts')}
      selectedIcon = {require('image!ContactsSelected')}
      selected = {this.state.selectedTab === 'ContactsTab'}
      onPress = {() => {
        this.setState({
          selectedTab: 'ContactsTab'
        });
      }}>
      <ContactsTab/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      icon = {require('image!Settings')}
      selectedIcon = {require('image!SettingsSelected')}
      selected = {this.state.selectedTab === 'SettingsTab'}
      onPress = {() => {
        this.setState({
          selectedTab: 'SettingsTab'
        });
      }}>
      <SettingsTab/>
      </TabBarIOS.Item>
      </TabBarIOS>
      );
  }
}

AppRegistry.registerComponent('Swapem', () => Swapem);
