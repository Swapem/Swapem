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
	TextInput,
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
			email: '',
			facebook: '',
			name: '',
			phone: '',
		};
	}
	// populate tableview the first time
	componentDidMount() {
		var profileInfo = this.props.profileInfo;
		this.setState({
			dataSource: ds.cloneWithRows(profileInfo)
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
	var profileName = Object.keys(profileItem).toString();
	// e.g. profileName = 'name'
		return (
			<TouchableHighlight
			activeOpacity = {1}>
			<View>
			<View style = {styles.cell}>
			<Image
			source = {(() => {
				switch (profileName) {
					case 'email': return require('image!Email');
					case 'facebook': return require('image!Facebook');
					case 'name': return require('image!Person');
					case 'phone': return require('image!Phone');
					default: return require('image!Person');
				}})()}
			style = {styles.icon} />
			<View style = {styles.content}>
			{(() => {
				switch (profileName) {
					case 'facebook': return <Text style = {styles.infoType}>facebook.com/</Text>;
					default: return;
				}})()}	
			{(() => {
				switch (Object.keys(profileItem).toString()) {
					case 'facebook': return <Text style = {styles.info}>{this.state.facebook}</Text>;
					default: return <TextInput
					style = {styles.infoInput}
					placeholder = {(() => {
						switch (Object.keys(profileItem).toString()) {
							case 'email': return 'Email';
							case 'name': return 'Name';
							case 'phone': return 'Phone';
							default: return 'Name';
						}})()}
						onChangeText = {(() => {
							switch (Object.keys(profileItem).toString()) {
								case 'email': return (text) => this.setState({email: text});
								case 'name': return (text) => this.setState({name: text});
								case 'phone': return (text) => this.setState({phone: text});
								default: return (text) => this.setState({name: text});
							}})()}
							value = {(() => {
								switch (Object.keys(profileItem).toString()) {
									case 'email': return this.state.email;
									case 'name': return this.state.name;
									case 'phone': return this.state.phone;
									default: return this.state.name;
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
