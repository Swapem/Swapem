/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MyProfilesTab = require('./tab_bar/MyProfilesTab');
var SwapemTab = require('./tab_bar/SwapemTab');
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
      </TabBarIOS>
      );
  }
}

AppRegistry.registerComponent('Swapem', () => Swapem);
