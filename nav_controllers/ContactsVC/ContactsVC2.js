'use strict';

var React = require('react-native');
var {
  NativeModules: {
    RNGeocoder
  }
} = require('react-native');

var {
	StyleSheet,
	Component,
	ListView,
	TouchableHighlight,
	View,
	Image,
	Text,
	MapView,
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
	separator: {
		backgroundColor: '#E0E0E0',
		height: 1,
	},
	item: {
		fontSize: 20,
	},
	map: {
    	height: 150,
    	margin: 10,
    	borderWidth: 1,
    	borderColor: '#000000',
  	},
  	mapAnnotation: {
		fontSize: 15,
	},
	mapAnnotationCell: {
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		paddingBottom: 10,
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
});

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var setRegion = 
{
	latitude: undefined,
	longitude: undefined,
	latitudeDelta: 0.008,
	longitudeDelta: 0.008
};

class ContactsVC2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: ds.cloneWithRows(this.props.contactInfo),
			latitude: this.props.contactInfo[7].location.latitude,
			longitude: this.props.contactInfo[7].location.longitude,
			title: {},
			pic: this.props.contactInfo[0].pic,
		}
		this.contactInfo = this.props.contactInfo;
		this.selectedInfo = this.contactInfo.slice();
		setRegion.latitude = this.props.contactInfo[7].location.latitude
		setRegion.longitude = this.props.contactInfo[7].location.longitude
	}
	componentDidMount(){
		let location = {latitude: undefined, longitude: undefined}
		location.latitude = this.props.contactInfo[7].location.latitude
		location.longitude = this.props.contactInfo[7].location.longitude
		RNGeocoder.reverseGeocodeLocation(location, (err, result) => {
			if (err) {
				console.log("Error is: " + err);
				return;
			}
			this.setState({
				title: result[0].name
			})
		})
	}
	render() {
		return (
			<ListView
			renderFooter = {()=>{return [<MapView 
				style={styles.map}
				region={setRegion}
          		annotations={[{latitude: this.state.latitude, longitude: this.state.longitude}]}
          		maxDelta={1}           		
          		/>,
          		 <View style = {styles.mapAnnotationCell}><Text style = {styles.mapAnnotation}>{this.state.title}</Text></View>];
          	}}
			dataSource = {this.state.dataSource}
			renderRow = {this.renderRequest.bind(this)}
			/>
		);
	}
	renderRequest(contactInfoItem,sectionID,rowID) {
		// e.g. contactInfoItem = {name: 'Ann Kim'}
		var contactInfoKey = Object.keys(contactInfoItem).toString();
		var index = this.contactInfo.indexOf(contactInfoItem);
		if(contactInfoKey === 'location'){
			return <View style={{height:0}}></View>
		}
		if(contactInfoKey === 'pic'){
			return <View style={{height:0}}></View>
		}
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
									case 'name': return this.state.pic ? {uri: this.state.pic.url} : {uri: 'Pic'};
									case 'email': return {uri:'Email'};
									case 'facebook': return {uri:'Facebook'};
									case 'linkedIn': return {uri: 'LinkedIn'};
									case 'notes': return {uri: 'Notes'};
									case 'phone': return {uri:'Phone'};
									default: return;
								}})()}
							style = {(() => {
								switch (contactInfoKey) {
									case 'name': return this.state.pic ? styles.pic : styles.defaultPic;
									default: return styles.icon;
							}})()}/>
						<View style = {styles.content}>
							{(() => {
								switch (contactInfoKey) {
									case 'facebook': return <Text style = {styles.info}>facebook.com/</Text>;
									default: return;
								}})()
							}
							<Text style = {styles.item}>
								{(() => {
								switch (contactInfoKey) {
									case 'name': return (contactInfoItem.name);
									case 'email': return (contactInfoItem.email);
									case 'facebook': return (contactInfoItem.facebook);
									case 'linkedIn': return (contactInfoItem.linkedIn);
									case 'notes': return (contactInfoItem.notes);
									case 'phone': return (contactInfoItem.phone);
									default: return;
								}})()}
							</Text>
						</View>
						<View>
						{this.renderCheckmark(contactInfoKey)}
						</View>
					</View>
					<View style = {styles.separator} />
				</View>
			</TouchableHighlight>
		);
	}
	renderCheckmark(contactInfoKey) {
		if ( (contactInfoKey === 'facebook') || (contactInfoKey === 'linkedIn') || (contactInfoKey === 'notes') ) {
			return;
		}
		else {
			return <Image source = {{uri: 'Checkmark'}} style = {styles.checkmark}/>
		}
	}
}

module.exports = ContactsVC2;
