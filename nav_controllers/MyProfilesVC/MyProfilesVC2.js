'use strict';

var React = require('react-native');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

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
		flexDirection:'column',
		justifyContent: 'space-between'
	},
	defaultPic:{
		height: 80,
		tintColor: '#3498DB',
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

class MyProfilesVC2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: ds,
			newEmail: this.props.profileInfo[2].email,
			newFacebook: this.props.profileInfo[3].facebook,
			newName: this.props.profileInfo[0].name,
			newPhone: this.props.profileInfo[1].phone,
			oldEmail: this.props.profileInfo[2].email,
			oldFacebook: this.props.profileInfo[3].facebook,
			oldName: this.props.profileInfo[0].name,
			oldPhone: this.props.profileInfo[1].phone,
			pic: this.props.profileInfo[4].pic,
			profileName: this.props.profileName,
		};
	}
	// populate tableview the first time
	componentDidMount() {
		var profileInfo = this.props.profileInfo;
		this.setState({
			dataSource: ds.cloneWithRows(profileInfo),
		});
	}
	// update tableview when new props are received,
	// i.e. this.props.navigator.replace() is called in MyProfilesVC1
	componentWillReceiveProps(nextProps) {
		if (nextProps.save) {
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
						if (storedProfileName === this.state.profileName) {
							var newProfileInfo = {name: this.state.newName, phone: this.state.newPhone, email: this.state.newEmail, facebook: this.state.newFacebook, pic: this.state.pic};
							storedProfile[storedProfileName] = newProfileInfo;
							this.setState({
								oldEmail: this.state.newEmail,
								oldFacebook: this.state.newFacebook,
								oldName: this.state.newName,
								oldPhone: this.state.newPhone,
							});
							AsyncStorage.setItem('myProfiles', JSON.stringify(storedProfiles)).then(() => {
								alert('Profile saved');
							});
						}
					}
				});
		}
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
						default: return 1;
					}})()}
				underlayColor = {(() => {
					switch (profileType) {
						case 'facebook': return '#2980B9';
						default: return;
					}})()}>
				<View>
				<View style = {styles.cell}>
				<Image
				source = {(() => {
					switch (profileType) {
						case 'email': return {uri: 'Email'};
						case 'facebook': return {uri: 'Facebook'};
						case 'name': return {uri: 'Person'};
						case 'phone': return {uri: 'Phone'};
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
	renderProfile(profileType) {
		if (profileType === "email"){
			return <TextInput
			style = {styles.infoInput}
			placeholder = 'Email'
			onChangeText = {(text) => this.setState({newEmail: text})}
			value = {this.state.newEmail}/>
		}
		else if (profileType === "facebook"){
			return [<Text style = {styles.infoType} key={0}>facebook.com/</Text>,
			<Text style = {styles.info} key={1}>{this.state.newFacebook}</Text>]
		}
		else if (profileType === "name"){
			return <TextInput
			style = {styles.infoInput}
			placeholder = 'Name'
			onChangeText = {(text) => this.setState({newName: text})}
			value = {this.state.newName}/>
		}
		else if (profileType === "phone"){
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
