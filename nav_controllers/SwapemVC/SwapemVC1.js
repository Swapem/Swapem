'use strict';

var React = require('react-native');
var RemoteDataAccessManager = require('./../../RemoteDataAccessManager');
var SwapemVC2 = require('./SwapemVC2')
var SwapemVC3 = require('./SwapemVC3')

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

var testNearbyDevices =[
{name: 'Junoh Lee', uuid: '0000',},
{name: 'Lisa Wong', uuid: '1111',},
{name: 'Ryan Lee', uuid: '2222',}
];

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class SwapemVC1 extends Component {
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
	// i.e. this.refs.nav.replace() is called in SwapemRootVC
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
			<View style={styles.content}>
			<ListView 
			dataSource = {this.state.dataSource}
			renderRow = {this.renderContact.bind(this)}
			/>
			</View>
		);
	}

	renderContact(profile) {
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

	//On press of a specific profile, show its details
	showProfileDetails(profile) {
		var profileType = Object.keys(profile).toString();

		var profileDetails = [
			{name: profile[profileType].name},
			{phone: profile[profileType].phone},
			{email: profile[profileType].email},
			{facebook: profile[profileType].facebook},
			{pic: profile[profileType].pic}
		];
		// profileDetails formatting is depended on by the next VC
		// this selectedProfileToSend is much easier to send.
		// TODO: Consolidate formatting into one.
		var selectedProfileToSend = 
			{name: profile[profileType].name, 
			phone: profile[profileType].phone, 
			email: profile[profileType].email, 
			pic: profile[profileType].pic,
			facebook: profile[profileType].facebook};

		this.props.navigator.push({

			title: 'Customize',
			component: SwapemVC2,
			leftButtonIcon: {uri:'Back'},
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			rightButtonTitle: 'Scan',
			onRightButtonPress: () => {
				alert("Searching for Nearby Users...");
				RemoteDataAccessManager.scanForNearbyUsers(profile[profileType].name)
					.then((promise) => {
						this.showResults(selectedProfileToSend);
					}).done();
		    },
			passProps: {
				profileDetails: profileDetails,
			},
		})
	}
	showResults(selectedProfileToSend) {
		this.props.navigator.push({
			title: 'Nearby Devices',
			component: SwapemVC3,
			leftButtonIcon: {uri:'Back'},
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			rightButtonTitle: 'Send',
			onRightButtonPress: () => {
				AsyncStorage.getItem('nearbyDevices').then((selectedUsers) => {
			       // Send contact information to chosen users
			       // TODO: Currently sending info to all nearby devices rather than selected
				   console.log("contact information sent to: " + JSON.stringify(selectedUsers));
				   RemoteDataAccessManager.sendContactInfoToSelectedUsers(selectedProfileToSend, selectedUsers);
			   }).done();
			},
		})
	}
}

module.exports = SwapemVC1;
