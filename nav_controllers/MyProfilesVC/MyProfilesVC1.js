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
	listView: {
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
		this.state = {
			dataSource: ds,
		};
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
	// update tableview when new props are received,
	// i.e. this.refs.nav.replace() in MyProfilesRootVC and this.props.navigator.pop() and this.refreshComponent(profileName,profileInfo) in MyProfilesVC1 are called
	componentWillReceiveProps() {
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
		var profileName = Object.keys(profile).toString();
		var profileInfo = [
		{name: profile[profileName].name},
		{phone: profile[profileName].phone},
		{email: profile[profileName].email},
		{facebook: profile[profileName].facebook},
		];
		this.props.navigator.push({
			title: profileName,
			component: MyProfilesVC2,
			leftButtonIcon: require('image!Back'),
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			rightButtonTitle: 'Save',
			onRightButtonPress: () => {
				this.refreshComponent(profileName);
			},
			passProps: {
				profileName: profileName,
				profileInfo: profileInfo,
			},
		});
	}
	refreshComponent(profileName) {
		this.props.navigator.replace({
			title: profileName,
			component: MyProfilesVC2,
			leftButtonIcon: require('image!Back'),
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			rightButtonTitle: 'Save',
			onRightButtonPress: () => {
				this.refreshComponent(profileName);
			},
			passProps: {
				profileName: profileName,
				save: true,
			},
		});
	}
}

module.exports = MyProfilesVC1;
