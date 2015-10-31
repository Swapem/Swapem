'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview')
var DeviceUUID = require("react-native-device-uuid");
var Section = TableView.Section;
var Item = TableView.Item;
var DataAccessManager = require('./../../RemoteDataAccessManager');
var SwapemViewController2 = require('./SwapemViewController2')
var SwapemViewController3 = require('./SwapemViewController3')


var {
  StyleSheet,
  Component,
} = React;

var MyProfileTitles = [
'Basic',
'School',
'Work'
];

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

var uniqueIdentifier;
DeviceUUID.getUUID().then((uuid) => {
  uniqueIdentifier = uuid;
});

var userInfo = {
	uuid: uniqueIdentifier,
	name: "InsertMyNameHere",
	searching: true
}

class SwapemViewController1 extends Component {
	render() {
		var profileTitle = MyProfileTitles[0];
		return (
			<TableView
			style = {styles.container}
			onPress = {(event) => {
				for (var i = 0; i < MyProfileTitles.length; i++) {
					this.showProfileDetails(MyProfileTitles[i]);
				}
			}}>
			<Section
			arrow = {true}>
			{MyProfileTitles.map(function(item, i) {
				return (
					<Item>
					{MyProfileTitles[i]}
					</Item>
					);
			})}
			</Section>
			</TableView>
		);
	}
	showProfileDetails(profileTitle) {
		this.props.navigator.push({
			title: 'Customize',
			component: SwapemViewController2,
			leftButtonIcon: require('image!Back'),
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			rightButtonTitle: 'Scan',
			onRightButtonPress: () => {
				this.showScanProgress();
				DataAccessManager.scan(userInfo);
				}
		})
	}
	showScanProgress() {
		this.props.navigator.push({
			component: SwapemViewController3,
			leftButtonIcon: require('image!Back'),
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
		})
	}
}

module.exports = SwapemViewController1;
