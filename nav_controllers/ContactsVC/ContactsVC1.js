'use strict';

var React = require('react-native');
var RequestsVC1 = require('../RequestsVC/RequestsVC1');
var ContactsVC2 = require('./ContactsVC2');
var DeviceUUID = require('react-native-device-uuid');
var ParseDB = require('../../RemoteDataAccessManager')

var {
  StyleSheet,
  Component,
  ListView,
  TouchableHighlight,
  View,
  Image,
  Text,
} = React;

var fakeContacts = RequestsVC1.contacts;

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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

class ContactsVC1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
      dataSource: ds.cloneWithRows([])
		}
	}

  componentDidMount() {
    //var contacts = fakeContacts;
    let myself = this
    DeviceUUID.getUUID().then((uuid) => {
      ParseDB.checkForRecentContactsSent(uuid, (error, results) => {
        myself.setState({
          dataSource: ds.cloneWithRows(JSON.parse(JSON.stringify((results))))
        })
      })
    })
  }

	render() {
		return (
			<ListView
      dataSource = {this.state.dataSource}
      renderRow = {this.renderContact.bind(this)}
      style = {styles.listView}/>
      );
	}
	renderContact(contact) {
    // e.g. contact = {name: 'Junoh Lee', phone: '(778) 111-1111', email: 'junohlee@cs410.com', facebook: 'junohlee',}
		return (
      <TouchableHighlight
      onPress = {() => this.showContactInfo(contact)}
      underlayColor = '#2980B9'>
      <View>
      <View style = {styles.cell}>
      <Image
      source = {require('image!Person')}
      style = {styles.icon} />
      <View style = {styles.content}>
      <Text style = {styles.person}>{contact.name}</Text>
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
  showContactInfo(contact) {
    var contactInfo = [
    {name: contact.name},
    {phone: contact.phone},
    {email: contact.email},
    {facebook: contact.facebook},
    ];
    this.props.navigator.push({
      title: contact.name,
      component: ContactsVC2,
      leftButtonIcon: require('image!Back'),
      onLeftButtonPress: () => {
        this.props.navigator.pop();
      },
      rightButtonTitle: 'Import',
      passProps: {
        contactInfo: contactInfo,
      },
    })
  }
}

module.exports = ContactsVC1;
