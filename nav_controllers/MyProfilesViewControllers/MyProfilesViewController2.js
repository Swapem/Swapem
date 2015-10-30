'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;
var MyProfilesViewController3 = require('./MyProfilesViewController3')

var {
  StyleSheet,
  Component,
} = React;

var MyProfileItems = [
'Name',
'Phone',
'Email',
'Facebook',
];

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MyProfilesViewController2 extends Component {
	render() {
		return (
			<TableView
			style = {styles.container}
			editing = {this.props.editing}
			onPress = {(event) => {
				for (var i = 0; i < MyProfileItems.length; i++) {
					this.showProfileDetails(MyProfileItems[i]);
				}
			}}>
			<Section
			canMove = {true}
			canEdit = {true}>
			{MyProfileItems.map(function(item, i) {
				return (
					<Item>
					{MyProfileItems[i]}
					</Item>
					);
			})}
			</Section>
			<Section> 
			<Item>Add field</Item>
			</Section>
			</TableView>
		);
	}
	showProfileDetails(profileItem) {
		this.props.navigator.push({
			component: MyProfilesViewController3,
			backButtonTitle: ' ',
		})
	}
}

module.exports = MyProfilesViewController2;
