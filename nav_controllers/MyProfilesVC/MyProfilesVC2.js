'use strict';

var React = require('react-native');

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
	listView: {
	},
	separator: {
		backgroundColor: '#E0E0E0',
		height: 0.5,
	},
});

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
		};
	}
	// populate tableview the first time
	componentDidMount() {
		var profileInfo = this.props.profileInfo;
		this.setState({
			dataSource: ds.cloneWithRows(profileInfo)
		});
	}
	// update tableview when new props are received,
	// i.e. this.props.navigator.replace() is called in MyProfilesVC1
	componentWillReceiveProps(nextProps) {
		if (nextProps.save) {
			if ( (this.state.newName !== this.state.oldName) ||
				(this.state.newPhone !== this.state.oldPhone) ||
				(this.state.newEmail !== this.state.oldEmail) ||
				(this.state.newFacebook !== this.state.oldFacebook) ) {
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
						if (storedProfileName === nextProps.profileName) {
							var newProfile = {name: this.state.newName, phone: this.state.newPhone, email: this.state.newEmail, facebook: this.state.newFacebook};
							storedProfile[storedProfileName] = newProfile;
							AsyncStorage.setItem('myProfiles', JSON.stringify(storedProfiles)).then(() => {
								alert('Profile saved');
							});
						}
					}
				});
			}
			else {
				alert('No change');
			}
		}
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
					case 'facebook': return <Text style = {styles.infoType}>facebook.com/</Text>;
					default: return;
				}})()}	
			{(() => {
				switch (profileType) {
					case 'facebook': return <Text style = {styles.info}>{this.state.newFacebook}</Text>;
					default: return <TextInput
					style = {styles.infoInput}
					placeholder = {(() => {
						switch (profileType) {
							case 'email': return 'Email';
							case 'name': return 'Name';
							case 'phone': return 'Phone';
							default: return 'Name';
						}})()}
					onChangeText = {(() => {
						switch (profileType) {
							case 'email': return (text) => this.setState({newEmail: text});
							case 'name': return (text) => this.setState({newName: text});
							case 'phone': return (text) => this.setState({newPhone: text});
							default: return (text) => this.setState({newName: text});
						}})()}
					value = {(() => {
						switch (profileType) {
							case 'email': return this.state.newEmail;
							case 'name': return this.state.newName;
							case 'phone': return this.state.newPhone;
							default: return this.state.newName;
						}})()} />;
				}})()}
			</View>
			</View>
			<View style = {styles.separator} />
			</View>
			</TouchableHighlight>
		);
	}
}

module.exports = MyProfilesVC2;
