'use strict';

var React = require('react-native');
var MyProfilesVC3 = require('./MyProfilesVC3')
var MyProfilesDetailsVC = require('./MyProfilesDetailsVC')

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
		height: 0.5,
	},
	item: {
		fontSize: 20,
	},
});

class MyProfilesVC2 extends Component {
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
	// e.g. profileItem = {name: 'Ann Kim'}
	var profileType = Object.keys(profileItem).toString();
	// e.g. profileType = 'name'
	return (
		<TouchableHighlight
		onPress = {() => this.showProfileDetails(profileItem, profileType)}
		underlayColor = '#2980B9'>
		<View>
		<View style = {styles.cell}>
		<Image
		source = {(() => {
			switch (profileType) {
				case 'email': return require('image!Email');
				case 'facebook': return require('image!Facebook');
				case 'name': return require('image!Person');
				case 'phone': return require('image!Phone');
				default: return require('image!Person');
			}})()}
			style = {styles.icon} />
			<View style = {styles.content}>
			{(() => {
				switch (profileType) {
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
					</View>
					<View style = {styles.separator} />
					</View>
					</TouchableHighlight>
					);
	}
	showProfileDetails(profileItem,profileType) {
		if (profileType === 'facebook') {
			this.props.navigator.push({
			component: MyProfilesVC3,
			backButtonTitle: 'Save',
			title: profileType,
		})}
		else {
			this.props.navigator.push({
				title: profileType,
				component: MyProfilesDetailsVC,
				backButtonTitle: 'Save',
				passProps: { label: profileType,
					profileType: profileType,
				},
			})}
	}
}

module.exports = MyProfilesVC2;
