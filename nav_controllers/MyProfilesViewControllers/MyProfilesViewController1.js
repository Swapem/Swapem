'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;
var MyProfilesViewController2 = require('./MyProfilesViewController2')



var {
  StyleSheet,
  Component,
} = React;

var MyProfileItems = [
{item: 'Name'},
{item: 'Phone'},
{item: 'Email'},
{item: 'Facebook'},
];

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MyProfilesViewController1 extends Component {
	render() {
		var profileItem = MyProfileItems[3];
		return (
			<TableView
			style = {styles.container}
			onPress = {(event) => this.showProfileDetail(profileItem)}>
			<Section>
			<Item>{profileItem.item}</Item>
			</Section>
			</TableView>
		);
	}
	showProfileDetail(profileItem) {
		this.props.navigator.push({
			title: profileItem.item,
			component: MyProfilesViewController2,
		})
	}
}

module.exports = MyProfilesViewController1;
