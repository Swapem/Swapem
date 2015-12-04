'use strict';

var React = require('react-native');

var {
	AsyncStorage,
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
	checkmark: {
		alignSelf: 'flex-end',
		height: 20,
		marginLeft: 15,
		marginRight: 5,
		tintColor: '#3498DB',
		width: 20,
	},
	defaultPic:{
		height: 40,
		marginLeft: 5,
		marginRight: 15,
		tintColor: '#E0E0E0',
		width: 40,
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
	item: {
		fontSize: 20,
	},
	pic: {
		borderColor: '#E0E0E0',
		borderRadius: 20,
		borderWidth: 1.5,
		height: 40,
		marginLeft: 5,
		marginRight: 15,
		width: 40,
	},
	separator: {
		backgroundColor: '#E0E0E0',
		height: 1,
	},
});

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class SwapemVC2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: ds,
			pic: this.props.profileInfo[0].pic,
		};
	}
	componentDidMount() {
		this.setState({
			dataSource: ds.cloneWithRows(this.props.profileInfo),
		});
	}
	render() {
		return (
			<View style = {styles.content}>
			<ListView 
			dataSource = {this.state.dataSource}
			renderRow = {this.renderProfile.bind(this)}
			listView = {styles.listView}/>
			</View>
			);
	}
	renderProfile(profileItem) {
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
			underlayColor = '#2980B9'>
			<View>
			<View style = {styles.cell}>
			<Image
			source = {(() => {
				switch (profileType) {
					case 'email': return {uri: 'Email'};
					case 'facebook': return {uri: 'Facebook'};
					case 'linkedIn': return {uri: 'LinkedIn'};
					case 'name': return this.state.pic ? this.state.pic : {uri: 'Pic'};
					case 'notes': return {uri: 'Notes'};
					case 'phone': return {uri: 'Phone'};
					default: return;
				}})()}
			style = {(() => {
				switch (profileType) {
					case 'name': return this.state.pic ? styles.pic : styles.defaultPic;
					default: return styles.icon;
				}})()}/>
			<View style = {styles.content}>
			{(() => {
				switch (profileType) {
					case 'facebook': return <Text style = {styles.info}>facebook.com/</Text>;
					case 'linkedIn': return <Text style = {styles.info}>linkedin.com/in/</Text>;
					default: return;t
				}})()}
			<Text style = {styles.item}>
			{(() => {
				switch (profileType) {
					case 'email': return (profileItem.email);
					case 'facebook': return (profileItem.facebook);
					case 'linkedIn': return (profileItem.linkedIn);
					case 'name': return (profileItem.name);
					case 'notes': return (profileItem.notes);
					case 'phone': return (profileItem.phone);
					default: return;
				}})()}
			</Text>
			</View>
			<View>
			{this.renderCheckmark(profileType)}
			</View>
			</View>
			<View style = {styles.separator} />
			</View>
			</TouchableHighlight>
			);
		}
	}
	renderCheckmark(profileType) {
		return <Image source = {{uri: 'Checkmark'}} style = {styles.checkmark}/>
	}
}

module.exports = SwapemVC2;
