'use strict';

var React = require('react-native');
var RemoteDataAccessManager = require('./../../RemoteDataAccessManager');
var SwapemVC2 = require('./SwapemVC2')
var SwapemVC3 = require('./SwapemVC3')

var {
	StyleSheet,
	Component,
	ListView,
	TouchableHighlight,
	View,
	Image,
	Text,
	AsyncStorage
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

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

/**
* Example data:
*	profile = {Basic: {name: 'Ann Kim', phone: '(778) 111-1111', email: 'annkim@cs410.com', facebook: 'annkim'}}
*	fakeNearbyDevices = [{name: 'Junoh Lee', uuid: '0000',},
*						 {name: 'Lisa Wong', uuid: '1111',},
*					     {name: 'Ryan Lee', uuid: '2222',}];
*/
class SwapemVC1 extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
			loaded: false,
		};
	}

	//Called once our app is loaded (once). 
	//Load profiles data from local storage and set loaded to true once the component has loaded
	componentDidMount() {
		AsyncStorage.getItem('myProfiles').then((dbValue) => {
			var profiles = JSON.parse(dbValue);
 	     	this.setState({
				dataSource: this.state.dataSource.cloneWithRows(profiles),
				loaded: true,
			});
 	     }).done();
	}

	render() {
		// Show loading view if state hasn't been loaded.
		if (!this.state.loaded) {
      		return this.renderLoadingView();
    	}
		return (
			<ListView
			dataSource = {this.state.dataSource}
			renderRow = {this.renderContact.bind(this)}
			style = {styles.listView}/>
		);
	}

	renderLoadingView() {
	    return (
	      <View style={styles.cell}>
	        <Text>
	          Loading profiles...
	        </Text>
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

	//On press of a specifi profile, show its details
	showProfileDetails(profile) {
		var profileType = Object.keys(profile).toString();
		var profileDetails = [
		{name: profile[profileType].name},
		{phone: profile[profileType].phone},
		{email: profile[profileType].email},
		{facebook: profile[profileType].facebook},
		];
		// profileDetails formatting is depended on by the next VC
		// this selectedProfileToSend is much easier to send.
		// TODO: Consolidate formatting into one.
		var selectedProfileToSend = 
			{name: profile[profileType].name, 
			phone: profile[profileType].phone, 
			email: profile[profileType].email, 
			facebook: profile[profileType].facebook};

		this.props.navigator.push({

			title: 'Customize',
			component: SwapemVC2,
			leftButtonIcon: require('image!Back'),
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			rightButtonTitle: 'Scan',
			onRightButtonPress: () => {
				// Note that an empty result value is a non-null object with length == 0
				RemoteDataAccessManager.prepareUserForScan(profile[profileType].name, function(usersNearby) {
					// Make sure that local temp storage is cleared (from previous scans)
					AsyncStorage.removeItem('nearbyDevices').then((value) => {
				      console.log('nearbyDevices table cleared');
				      var jsonArray = [];
				      	// Construct a jsonArray with the users who were found nearby.
						for (var i = 0; i < usersNearby.length; i++) {
					        var user = usersNearby[i];
					        jsonArray.push({
									        name: user.get('name'),
									        uuid: user.get('uuid'),
							});
					       }
					    // Store info of nearby users in local storage
				       AsyncStorage.setItem('nearbyDevices', JSON.stringify(jsonArray));
				     });
				})
				this.showResults(selectedProfileToSend);
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
			leftButtonIcon: require('image!Back'),
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
