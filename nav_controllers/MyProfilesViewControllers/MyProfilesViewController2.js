'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;
var MyProfilesViewController3 = require('./MyProfilesViewController3')
var MyProfilesDetailsVC = require('./MyProfilesDetailsVC')

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
  }
});

class MyProfilesViewController2 extends Component {
	render() {
		return (
			<TableView
			style = {styles.container}
			editing = {this.props.editing}
			onPress = {(event) => {
				// Push MyProfileDetailsVC with selectedIndex
				this.showProfileDetails(event.label)
			}}>
			<Section
			canMove = {true}
			canEdit = {true}>
			{MyProfileItems.map((item, i) => {
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
	showProfileDetails(selectedLabel) {		

		this.props.navigator.push({
			component: MyProfilesDetailsVC,
			backButtonTitle: 'Save',
			passProps: { label: selectedLabel,
				profileType: this.props.profileType
			},
			title: selectedLabel
		})
	}
}

module.exports = MyProfilesViewController2;
