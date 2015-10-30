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
				this.showProfileDetails(event.label)
			}}>
				<Section
				arrow = {true}
				canMove = {true}
				canEdit = {true}>
					{MyProfileTitles.map((item, i) => {
						return (
							<Item key={i}>
								{item}
							</Item>
						);
					})}
				</Section>
			</TableView>
		);
	}
	showProfileDetails(profileType) {
		this.props.navigator.push({
			title: profileType,
			component: MyProfilesViewController2,
			rightButtonTitle: this.state.editing ? 'Done' : 'Edit',
			onRightButtonPress: () => {
				this.state.editing = !this.state.editing;
			},
			passProps: {
				editing: this.state.editing,
				profileType: profileType},
		})
	}
}

module.exports = MyProfilesViewController1;
