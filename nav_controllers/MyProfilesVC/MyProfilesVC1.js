'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;
var MyProfilesVC2 = require('./MyProfilesVC2')

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

class MyProfilesVC1 extends Component {
	render() {
		return (
			<TableView
			style = {styles.container}
			editing = {this.props.editing}
			onPress = {(event) => {
				this.showProfileDetails(event.label)
			}}>
				<Section
				arrow = {true}>
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
			component: MyProfilesVC2,
			leftButtonIcon: require('image!Back'),
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			rightButtonTitle: 'Edit',
			passProps: {
				profileType: profileType},
		})
	}
}

module.exports = MyProfilesVC1;
