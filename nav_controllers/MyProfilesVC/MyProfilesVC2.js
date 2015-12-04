'use strict';

var React = require('react-native');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var FBSDKLogin = require('react-native-fbsdklogin');
var FBSDKCore = require('react-native-fbsdkcore');
var FBURL;
var FBName;
var str;
var res;

var {
	AsyncStorage,
	Component,
	Image,
	ListView,
	StyleSheet,
	Text,
	TextInput,
	TouchableHighlight,
	View,
	LinkingIOS,
} = React;

var {
	FBSDKLoginManager,
} = FBSDKLogin;

var {
  FBSDKAccessToken,
  FBSDKGraphRequest,
  FBSDKGraphRequestManager,
} = FBSDKCore;

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
		flexDirection:'column',
		justifyContent: 'space-between'
	},
	defaultPic:{
		height: 80,
		tintColor: 'E0E0E0',
		width: 80,
	},
	icon: {
		height: 40,
		marginLeft: 5,
		marginRight: 15,
		tintColor: '#3498DB',
		width: 40,
	},
	infoType: {
		color: '#2C3E50',
		fontSize: 15,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	info: {
		fontSize: 20,
	},
	infoInput: {
		fontSize: 20,
		height: 30,
	},
	pic: {
		borderColor: '#E0E0E0',
		borderRadius: 38.5,
		borderWidth: 3,
		height: 77,
		width: 77,
	},
	separator: {
		backgroundColor: '#E0E0E0',
		height: 1,
	},
});

// Specify any or all of these keys
var options = {
	title: 'Select photo', // specify null or empty string to remove the title
	cancelButtonTitle: 'Cancel',
	takePhotoButtonTitle: 'Take photo...', // specify null or empty string to remove this button
	chooseFromLibraryButtonTitle: 'Choose from library...', // specify null or empty string to remove this button
	customButtons: {
	},
	maxWidth: 200,
	maxHeight: 200,
	quality: 0.99,
	allowsEditing: false, // Built in iOS functionality to resize/reposition the image
	noData: false, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
	storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
		skipBackup: true, // image will NOT be backed up to icloud
		path: 'images' // will save image at /Documents/images rather than the root
	}
};

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var instance

class MyProfilesVC2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: ds,
			fbLogin: false,
			newEmail: this.props.profileInfo[2].email,
			newFacebook: this.props.profileInfo[3].facebook,
			newLinkedIn: this.props.profileInfo[4].linkedIn,
			newName: this.props.profileInfo[0].name,
			newNotes: this.props.profileInfo[5].notes,
			newPhone: this.props.profileInfo[1].phone,
			oldEmail: this.props.profileInfo[2].email,
			oldFacebook: this.props.profileInfo[3].facebook,
			oldName: this.props.profileInfo[0].name,
			oldPhone: this.props.profileInfo[1].phone,
			pic: this.props.profileInfo[6].pic,
			profileName: this.props.profileName,
		};

		instance = this
	}
	// populate tableview the first time
	componentDidMount() {
		var profileInfo = this.props.profileInfo;
		this.setState({
			dataSource: ds.cloneWithRows(profileInfo),
		})
		AsyncStorage.getItem('myProfiles').then((dbValue) => {
			var storedProfiles = JSON.parse(dbValue)
			for(let i = 0; i<storedProfiles.length; i++) {
				if(storedProfiles[i][this.props.profileName]) {
					this.setState({
						newEmail: storedProfiles[i][this.props.profileName].email,
						newFacebook: storedProfiles[i][this.props.profileName].facebook,
						newLinkedIn: storedProfiles[i][this.props.profileName].linkedin,
						newName: storedProfiles[i][this.props.profileName].name,
						newNotes: storedProfiles[i][this.props.profileName].notes,
						pic: storedProfiles[i][this.props.profileName].pic,
						newPhone: storedProfiles[i][this.props.profileName].phone,
					})
					break
				}
			}
		})
	}
	static saveProfileDetails(profileName) {
		AsyncStorage.getItem('myProfiles').then((dbValue) => {
			var storedProfiles;
			if (dbValue == null) {
				storedProfiles = [];
			}
			else {
				storedProfiles = JSON.parse(dbValue);	
			}
			for (var i = 0; i < storedProfiles.length; i++) {
				var storedProfile = storedProfiles[i];
				var storedProfileName = Object.keys(storedProfile).toString();
				if (storedProfileName === instance.state.profileName) {
					var newProfileInfo = {
						name: instance.state.newName,
						phone: instance.state.newPhone,
						email: instance.state.newEmail,
						facebook: instance.state.newFacebook,
						linkedin: instance.state.newLinkedIn,
						notes: instance.state.newNotes,
						pic: instance.state.pic};
					storedProfile[storedProfileName] = newProfileInfo;
					AsyncStorage.setItem('myProfiles', JSON.stringify(storedProfiles)).then(() => {
						alert('Profile saved');
					});
				}
			}
		});
	}
	render() {
		return (
			<View style={styles.content}>
			<ListView
			dataSource = {this.state.dataSource}
			renderHeader = {this.renderPic.bind(this)}
			renderRow = {this.renderProfileInfo.bind(this)}
			style = {styles.listView}/>
			</View>
			);
	}
	renderPic() {
		return (
			<TouchableHighlight
			activeOpacity = {1}
			onPress = {this.profilePic.bind(this)}>
			<View>
			<View style = {styles.cell}>
			{this.state.pic?
			<Image source = {this.state.pic}
			style = {styles.pic}/>
			:
			<Image source = {{uri: 'Pic'}}
			style = {styles.defaultPic}/>
			}
			</View>
			<View style = {styles.separator}/>
			</View>
			</TouchableHighlight>
		);
	}
	profilePic() {
		UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
			if (didCancel) {
				console.log('User cancelled image picker');
			}
			else {
				if (response.customButton) {
					console.log('User tapped custom button: ', response.customButton);
				}
				else {
					const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
					this.setState({
						pic: source,
					});
				}
			}
		})
	}
	renderProfileInfo(profileItem) {
	// e.g. profileItem = {name: 'Ann Kim'}
		var profileType = Object.keys(profileItem).toString();
		// e.g. profileType = 'name'
		if (profileType === 'pic') {
			return (
				<View>
				</View>
				)}
		else {
			return (
				<TouchableHighlight
				activeOpacity = {(() => {
					switch (profileType) {
						case 'facebook': return;
						case 'linkedIn': return;
						default: return 1;
					}})()}
				onPress = {(event) => {
					if (profileType === 'facebook') {
						if (!this.state.fbLogin) {
							this.logOutFacebook();
							this.setState({
								fbLogin: false});
							this.logIntoFacebook();
							this.setState({
								fbLogin: true,
							});
						}
						else {
							console.log("FBURL: "+FBURL);
							str = JSON.stringify(FBURL);
							res = str.substr(26);
							LinkingIOS.openURL(FBURL);
							// this.logOutFacebook();
							// this.setState({
							// 	fbLogin: false,
							// });
						}
					}
					else if (profileType === 'linkedIn') {
						// LinkedIn code
					}
					else {
						return;
					}
				}}
				underlayColor = {(() => {
					switch (profileType) {
						case 'facebook': return '#2980B9';
						case 'linkedIn': return '#2980B9';
						default: return;
					}})()}>
				<View>
				<View style = {styles.cell}>
				<Image
				source = {(() => {
					switch (profileType) {
						case 'email': return {uri: 'Email'};
						case 'facebook': return {uri: 'Facebook'};
						case 'linkedIn': return {uri: 'LinkedIn'};
						case 'name': return {uri: 'Person'};
						case 'phone': return {uri: 'Phone'};
						case 'notes': return {uri: 'Notes'};
						default: return;
					}})()}
				style = {styles.icon}/>
				<View style = {styles.content}>
				{this.renderProfile(profileType)}
				</View>
				</View>
				<View style = {styles.separator}/>
				</View>
				</TouchableHighlight>
			);
		}
	}

	logIntoFacebook() {
		// Attempt a login using the native login dialog asking for default permissions.
		FBSDKLoginManager.setLoginBehavior('native');
		FBSDKLoginManager.logInWithReadPermissions([], (error, result) => {
			if (error) {
				alert('Error logging in');
			} else {
				if (result.isCancelled) {
					alert('Login cancelled');
				} else {
					alert('Logged in');
					var token = new FBSDKAccessToken.getCurrentAccessToken(token => 
                      console.log (token, 'Type of Token is:' + typeof token));
					// FBSDKGraphRequestManager.batchRequests([fetchUrlRequest], function() {}, 60);
					// console.log("FBURL: "+FBURL);
					this.fetchFacebookURL();
				}
			}
		});
	}
	
	logOutFacebook() {
		FBSDKLoginManager.logOut();
	}


// var fetchUrlRequest = new FBSDKGraphRequest ((error, result) => {fetch
//   if (error) {
//     alert('Error making request');
//     } else {
//       FBURL = (result.link);
//       FBName = (JSON.stringify(result.name));
//       }
//     }, 'me?fields=link,name');

	fetchFacebookURL() {
		var fetchUrlRequest = new FBSDKGraphRequest ((error, result) => {fetch
  			if (error) {
    		alert('Error making request');
    		} else {
     			FBURL = (result.link);
    		  	FBName = (JSON.stringify(result.name));
    		  }
    		}, 'me?fields=link,name');
		FBSDKGraphRequestManager.batchRequests([fetchUrlRequest], function() {}, 60);
		console.log("FBURL is:" + FBURL);
	}

	renderProfile(profileType) {
		if (profileType === "email"){
			return <TextInput
			style = {styles.infoInput}
			placeholder = 'Email'
			onChangeText = {(text) => this.setState({newEmail: text})}
			value = {this.state.newEmail}/>
		}
		else if (profileType === "facebook") {
			return [<Text key = {0} style = {styles.infoType}>
						facebook.com/</Text>,
			<Text key = {1} style = {styles.info}>{res}</Text>];
		} 
		else if (profileType === "linkedIn"){
			return [<Text key = {0} style = {styles.infoType}>linkedin.com/in/</Text>,
			<Text key = {1} style = {styles.info}>{this.state.newLinkedIn}</Text>];
		}
		else if (profileType === "name") {
			return <TextInput
			style = {styles.infoInput}
			placeholder = 'Name'
			onChangeText = {(text) => this.setState({newName: text})}
			value = {this.state.newName}/>
		}
		else if (profileType === "notes") {
			return <TextInput
			style = {styles.infoInput}
			placeholder = 'Notes'
			onChangeText = {(text) => this.setState({newNotes: text})}
			value = {this.state.newNotes}/>
		}
		else if (profileType === "phone") {
			return <TextInput
			style = {styles.infoInput}
			placeholder = 'Phone'
			onChangeText = {(text) => this.setState({newPhone: text})}
			value = {this.state.newPhone}/>
		}
		else {
			return;
		}
	}
}

module.exports = MyProfilesVC2;
