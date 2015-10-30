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

class SwapemViewController2 extends Component {
	render() {
		return (
			<TableView
			style = {styles.container}>
			<Section>
			{MyProfileItems.map(function(item, i) {
				return (
					<Item
					selected = {true}>
					{MyProfileItems[i]}
					</Item>
					);
			})}
			</Section>
			</TableView>
		);
	}
}

module.exports = SwapemViewController2;
