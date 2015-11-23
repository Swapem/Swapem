'use strict';

var React = require('react-native');

var {
	StyleSheet,
	Component,
	ListView,
	TouchableHighlight,
	View,
	Image,
	Text,
} = React;

var styles = StyleSheet.create({
	cell: {
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 10,
	},
	content: {
		flex: 1,
	},
	checkmark: {
		alignSelf: 'flex-end',
		height: 20,
		marginLeft: 15,
		marginRight: 5,
		tintColor: '#3498DB',
		width: 20,
	},
	icon: {
		height: 40,
		marginLeft: 5,
		marginRight: 15,
		tintColor: '#3498DB',
		width: 40,
	},
	info: {
		color: '#2C3E50',
		fontSize: 15,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	separator: {
		backgroundColor: '#E0E0E0',
		height: 1,
	},
	item: {
		fontSize: 20,
	},
});

class SwapemVC2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
		};
	}
	componentDidMount() {
		var profileDetails = this.props.profileDetails;
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(profileDetails)
		});
	}
	render() {
		return (
			<ListView
			dataSource = {this.state.dataSource}
			renderRow = {this.renderRequest.bind(this)}
			style = {styles.listView}/>
			);
	}
	renderRequest(profileItem) {
		return (
			<TouchableHighlight
			underlayColor = '#2980B9'>
			<View>
			<View style = {styles.cell}>
			<Image
			source = {(() => {
				switch (Object.keys(profileItem).toString()) {
					case 'email': return {uri:'Email'};
					case 'facebook': return {uri:'Facebook'};
					case 'name': return {uri:'Person'};
					case 'phone': return {uri:'Phone'};
					default: return {uri:'Person'};
				}})()}
				style = {styles.icon} />
				<View style = {styles.content}>
				{(() => {
					switch (Object.keys(profileItem).toString()) {
						case 'facebook': return <Text style = {styles.info}>facebook.com/</Text>;
						default: return;t
					}})()}
					<Text style = {styles.item}>
					{(() => {
						switch (Object.keys(profileItem).toString()) {
							case 'email': return (profileItem.email);
							case 'facebook': return (profileItem.facebook);
							case 'name': return (profileItem.name);
							case 'phone': return (profileItem.phone);
							default: return (profileItem.name);
						}})()}
						</Text>
						</View>
						<View>
						<Image source = {{uri:'Checkmark'}} style = {styles.checkmark} />
						</View>
						</View>
						<View style = {styles.separator} />
						</View>
						</TouchableHighlight>
						);
	}
}

module.exports = SwapemVC2;
