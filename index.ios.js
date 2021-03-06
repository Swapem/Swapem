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
var DeviceUUID = require("react-native-device-uuid");
var ParseDB = require('./RemoteDataAccessManager');
var Keys = require('./Keys');


var {
  AppRegistry,
  Component,
  TabBarIOS,
} = React;

// Device specific UUID
// Update Geolocation of Device in Parse table upon startup
// TODO: check GPS permissions.
var uniqueIdentifier;
DeviceUUID.getUUID().then((uuid) => {
  var parse = new ParseDB(Keys.parseAppKey, Keys.parseJsKey);
  parse.initializeGPSLocation(uuid, (error, results) => {
      console.log("GPS location initialized")
    })
  });

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
      barTintColor = '#ECF0F1'
      tintColor = '#2980B9'>
      <TabBarIOS.Item
      title = ''
      icon = {{uri:'MyProfiles'}}
      selectedIcon = {{uri:'MyProfilesSelected'}}
      selected = {this.state.selectedTab === 'MyProfilesRootVC'}
      onPress = {() => {
        this.setState({
          selectedTab: 'MyProfilesRootVC',
        });
      }}>
      <MyProfilesRootVC/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      title = ''
      icon = {{uri:'Swapem'}}
      selectedIcon = {{uri:'SwapemSelected'}}
      selected = {this.state.selectedTab === 'SwapemRootVC'}
      onPress = {() => {
        this.setState({
          selectedTab: 'SwapemRootVC',
        });
      }}>
      <SwapemRootVC/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      title = ''
      icon = {{uri:'Requests'}}
      selectedIcon = {{uri:'RequestsSelected'}}
      selected = {this.state.selectedTab === 'RequestsRootVC'}
      onPress = {() => {
        this.setState({
          selectedTab: 'RequestsRootVC',
        });
      }}>
      <RequestsRootVC/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      title = ''
      icon = {{uri:'Contacts'}}
      selectedIcon = {{uri:'ContactsSelected'}}
      selected = {this.state.selectedTab === 'ContactsRootVC'}
      onPress = {() => {
        this.setState({
          selectedTab: 'ContactsRootVC',
        });
      }}>
      <ContactsRootVC/>
      </TabBarIOS.Item>
      <TabBarIOS.Item
      title = ''
      icon = {{uri:'Settings'}}
      selectedIcon = {{uri:'SettingsSelected'}}
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
