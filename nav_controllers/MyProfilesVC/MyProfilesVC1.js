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
		height: 1,
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

var instance

class MyProfilesVC1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: ds,
		};
		instance = this
	}
	// populate tableview the first time
	componentDidMount() {
		AsyncStorage.getItem('myProfiles').then((dbValue) => {
			var profiles;
			if (dbValue == null) {
				profiles = [];
			}
			else {
				profiles = JSON.parse(dbValue);	
			}
			this.setState({
				dataSource: ds.cloneWithRows(profiles),
			});
		});
	}
	static insertNewProfile(profileName) {
	    AsyncStorage.getItem('myProfiles').then((dbValue) => {
			var profiles = dbValue?JSON.parse(dbValue): [];
			profiles.push({
				[profileName]: {name: '', phone: '', email: '', facebook: '', linkedIn: '', notes: '', pic:''}
			});
			AsyncStorage.setItem('myProfiles', JSON.stringify(profiles));
			instance.setState({
				dataSource: ds.cloneWithRows(profiles),
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
			source = {{uri:'Profile'}}
			style = {styles.icon} />
			<View style = {styles.content}>
			<Text style = {styles.person}>{Object.keys(profile).toString()}</Text>
			</View>
			<View>
			<Image
			source = {{uri:'Next'}}
			style = {styles.next} />
			</View>
			</View>
			<View style = {styles.separator} />
			</View>
			</TouchableHighlight>
			);
	}
	static onLeftButtonPress() {
		AsyncStorage.removeItem('myProfiles')
		instance.setState({
			dataSource: ds.cloneWithRows([]),
		});
	}
	showProfileDetails(profile) {
		var profileName = Object.keys(profile).toString();
		var profileInfo = [
		{name: profile[profileName].name},
		{phone: profile[profileName].phone},
		{email: profile[profileName].email},
		{facebook: profile[profileName].facebook},
		{linkedIn: profile[profileName].linkedIn},
		{notes: profile[profileName].notes},
		{pic: profile[profileName].pic},
		];
		this.props.navigator.push({
			title: profileName,
			component: MyProfilesVC2,
			leftButtonIcon: {uri:'Back'},
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			rightButtonTitle: 'Save',
			onRightButtonPress: () => {
				this.saveProfileDetails(profileName);
			},
			passProps: {
				profileName: profileName,
				profileInfo: profileInfo,
			},
		});
	}
	saveProfileDetails(profileName) {
		MyProfilesVC2.saveProfileDetails(profileName)
	}
}

module.exports = MyProfilesVC1;
