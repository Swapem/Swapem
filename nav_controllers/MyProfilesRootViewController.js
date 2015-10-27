'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;

var {
  StyleSheet,
  View,
  Component,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MyProfilesRootViewController extends Component {
	render() {
		return (
			<TableView
			style = {styles.container}
			onPress={(event) => console.log(event)}>
			<Section>
			<Item>Basic</Item>
			<Item>Work</Item>
			<Item>School</Item>
			</Section>
			</TableView>
		);
	}
}

module.exports = MyProfilesRootViewController;
