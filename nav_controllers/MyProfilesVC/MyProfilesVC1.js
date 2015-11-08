'use strict';

var React = require('react-native');
var MyProfilesVC2 = require('./MyProfilesVC2')

var {
	AsyncStorage,
	Component,
	Image,
	ListView,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
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
	next: {
		alignSelf: 'flex-end',
		height: 20,
		marginLeft: 15,
		marginRight: 5,
		tintColor: '#E0E0E0',
		width: 20,
	},
	separator: {
		backgroundColor: '#E0E0E0',
		height: 0.5,
	},
	person: {
		fontSize: 20,
	},
});

var testProfiles = [
{Basic: {name: 'Ann Kim', phone: '(778) 111-1111', email: 'annkim@cs410.com', facebook: 'annkim'}},
{School: {name: 'Ann Kim', phone: '(778) 111-1111', facebook: 'annkim'}},
{Work: {name: 'Ann Kim', phone: '(778) 111-1111', email: 'annkim@cs410.com'}},
];

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class MyProfilesVC1 extends Component {
	constructor(props) {
		super(props);
		this.profiles = [];
		this.state = {
			dataSource: ds,
		};
	}
	componentDidMount() {
		// populate tableview
		AsyncStorage.getItem('myProfiles').then((dbValue) => {
			if (dbValue == null) {
			}
			else {
				this.profiles = JSON.parse(dbValue);	
			}
			this.setState({
				dataSource: ds.cloneWithRows(this.profiles),
			});
		}).done();
	}
	render() {
		return (
			<ListView
			dataSource = {this.state.dataSource}
			renderRow = {this.renderProfile.bind(this)}
			style = {styles.listView}/>
			);
	}
	renderProfile(profile) {
		// e.g. profile = {Basic: {name: 'Ann Kim', phone: '(778) 111-1111', email: 'annkim@cs410.com', facebook: 'annkim'}
		return (
			<TouchableHighlight
			onPress = {() => this.showProfileDetails(profile)}
			underlayColor = '#2980B9'>
			<View>
			<View style = {styles.cell}>
			<Image
			source = {require('image!Profile')}
			style = {styles.icon} />
			<View style = {styles.content}>
			<Text style = {styles.person}>{Object.keys(profile).toString()}</Text>
			</View>
			<View>
			<Image
			source = {require('image!Next')}
			style = {styles.next} />
			</View>
			</View>
			<View style = {styles.separator} />
			</View>
			</TouchableHighlight>
			);
	}
	showProfileDetails(profile) {
		var profileType = Object.keys(profile).toString();
		var profileDetails = [
		{name: profile[profileType].name},
		{phone: profile[profileType].phone},
		{email: profile[profileType].email},
		{facebook: profile[profileType].facebook},
		];
		this.props.navigator.push({
			title: profileType,
			component: MyProfilesVC2,
			leftButtonIcon: require('image!Back'),
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			rightButtonTitle: 'Edit',
			passProps: {
				profileDetails: profileDetails,
			},
		})
	}
}

module.exports = MyProfilesVC1;
