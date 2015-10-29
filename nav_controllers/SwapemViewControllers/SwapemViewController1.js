'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;
var SwapemViewController2 = require('./SwapemViewController2')
var SwapemViewController3 = require('./SwapemViewController3')

var {
  StyleSheet,
  Component,
} = React;

var MyProfileTitles = [
{title: 'Basic'},
{title: 'School'},
];

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class SwapemViewController1 extends Component {
	render() {
		var profileTitle = MyProfileTitles[0];
		return (
			<TableView
			style = {styles.container}
			onPress = {(event) => this.showProfileDetails()}>
			<Section>
			<Item>{profileTitle.title}</Item>
			</Section>
			</TableView>
		);
	}
	showProfileDetails(profileTitle) {
		this.props.navigator.push({
			title: 'Customize',
			component: SwapemViewController2,
			backButtonTitle: ' ',
			rightButtonTitle: 'Scan',
			onRightButtonPress: () => this.showScanProgress(),
		})
	}
	showScanProgress() {
		this.props.navigator.push({
			component: SwapemViewController3,
		})
	}
}

module.exports = SwapemViewController1;
