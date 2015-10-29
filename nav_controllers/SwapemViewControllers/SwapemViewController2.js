'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview')
var Section = TableView.Section;
var Item = TableView.Item;

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

class SwapemViewController2 extends Component {
	render() {
		var profileItem = MyProfileItems[3];
		return (
			<TableView
			style = {styles.container}>
			<Section>
			<Item>{profileItem.item}</Item>
			</Section>
			</TableView>
		);
	}
}

module.exports = SwapemViewController2;
