'use strict';

var React = require('react-native');

var {
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
	separator: {
		backgroundColor: '#E0E0E0',
		height: 1,
	},
	item: {
		fontSize: 20,
	},
});

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ContactsVC2 extends Component {
	constructor(props) {
		super(props);
		this.contactInfo = this.props.contactInfo;
		this.selectedInfo = this.contactInfo.slice();
		this.state = {
			dataSource: ds.cloneWithRows(this.contactInfo),
		};
	}
	render() {
		return (
			<ListView
			dataSource = {this.state.dataSource}
			renderRow = {this.renderRequest.bind(this)}
			style = {styles.listView}/>
			);
	}
	renderRequest(contactInfoItem,sectionID,rowID) {
		// e.g. contactInfoItem = {name: 'Ann Kim'}
		var contactInfoKey = Object.keys(contactInfoItem).toString();
		var index = this.contactInfo.indexOf(contactInfoItem);
		return (
			<TouchableHighlight
			onPress = {(event) => {
				if (this.selectedInfo.includes(contactInfoItem)) {
					var index = this.selectedInfo.indexOf(contactInfoItem);
					this.selectedInfo.splice(index, 1);
				}
				else {
					this.selectedInfo.splice(index, 0, contactInfoItem);
				}
				// update tableview data
				this.setState({
					dataSource: ds.cloneWithRows(this.contactInfo),
				});
			}} 
			underlayColor = '#2980B9'>
			<View>
			<View style = {styles.cell}>
			<Image
			source = {(() => {
				switch (contactInfoKey) {
					case 'email': return {uri:'Email'};
					case 'facebook': return {uri:'Facebook'};
					case 'phone': return {uri:'Phone'};
					default: return {uri:'Person'};
				}})()}
				style = {styles.icon} />
				<View style = {styles.content}>
				{(() => {
					switch (contactInfoKey) {
						case 'facebook': return <Text style = {styles.info}>facebook.com/</Text>;
						default: return;
					}})()}
					<Text style = {styles.item}>
					{(() => {
						switch (contactInfoKey) {
							case 'email': return (contactInfoItem.email);
							case 'facebook': return (contactInfoItem.facebook);
							case 'phone': return (contactInfoItem.phone);
							default: return (contactInfoItem.name);
						}})()}
						</Text>
						</View>
						<View>
						{(() => {
							switch (this.selectedInfo.includes(contactInfoItem)) {
								case false: return;
								default: return <Image source = {{uri:'Checkmark'}} style = {styles.checkmark} />;
							}})()}
						</View>
						</View>
						<View style = {styles.separator} />
						</View>
						</TouchableHighlight>
						);
						}
}

module.exports = ContactsVC2;
