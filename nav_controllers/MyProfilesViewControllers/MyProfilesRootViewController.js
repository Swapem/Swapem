'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;
var MyProfilesViewController1 = require('./MyProfilesViewController1')

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

class MyProfilesRootViewController extends Component {
	render() {
		var profileTitle = MyProfileTitles[0];
		return (
			<TableView
			style = {styles.container}
			onPress = {(event) => this.showProfileDetail(profileTitle)}>
			<Section>
			<Item>{profileTitle.title}</Item>
			</Section>
			</TableView>
		);
	}
	showProfileDetail(profileTitle) {
		this.props.navigator.push({
			title: profileTitle.title,
			component: MyProfilesViewController1,
		})
	}
}

module.exports = MyProfilesRootViewController;
