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

class MyProfilesViewController1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
		};
	}
	render() {
		return (
			<TableView
			style = {styles.container}
			editing = {this.props.editing}
			onPress = {(event) => {
				for (var i = 0; i < MyProfileTitles.length; i++) {
					this.showProfileDetails(MyProfileTitles[i]);
				}
			}}>
			<Section
			arrow = {true}
			canMove = {true}
			canEdit = {true}>
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
			title: profileTitle,
			component: MyProfilesViewController2,
			backButtonTitle: ' ',
			rightButtonTitle: this.state.editing ? 'Done' : 'Edit',
			onRightButtonPress: () => {
				this.state.editing = !this.state.editing;
			},
			passProps: {
				editing: this.state.editing},
		})
	}
}

module.exports = MyProfilesViewController1;
