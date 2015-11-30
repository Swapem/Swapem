'use strict';

var React = require('react-native');
var RequestsVC1 = require('../RequestsVC/RequestsVC1');
var ContactsVC2 = require('./ContactsVC2');
var DeviceUUID = require("react-native-device-uuid");
var ParseDB = require('../../RemoteDataAccessManager');
var Contacts = require('react-native-contacts');
var Keys = require('../../Keys');

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

var parseDB = new ParseDB(Keys.parseAppKey, Keys.parseJsKey);

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


class ContactsVC1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
      dataSource: ds.cloneWithRows([])
		}
	}

  componentDidMount() {
    let myself = this
    DeviceUUID.getUUID().then((uuid) => {
      parseDB.getAcceptedContacts("uitestuuid", (error, results) => {
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
      />
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
      source = {{uri:'Person'}}
      style = {styles.icon} />
      <View style = {styles.content}>
      <Text style = {styles.person}>{contact.name}</Text>
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
  showContactInfo(contact) {
    var contactInfo = [
    {name: contact.name},
    {phone: contact.phone},
    {email: contact.email},
    {facebook: contact.facebook},
    {pic: contact.pic},
    {location: contact.location},
    ];
    this.props.navigator.push({
      title: contact.name,
      component: ContactsVC2,
      leftButtonIcon: {uri:'Back'},
      onLeftButtonPress: () => {
        this.props.navigator.pop();
      },
      rightButtonTitle: 'Import',
      onRightButtonPress: () => {
        // Import button
        // (a) Properly format the contact information
        var newPerson = {
            givenName: contact.name,
            phoneNumbers: [ { number: contact.phone, label: 'mobile' } ],
            emailAddresses: [{
              label: "personal",
              email: contact.email,
            }]
          }
          Contacts.checkPermission( (err, permission) => {
            if(permission === 'undefined'){
              Contacts.requestPermission( (err, permission) => {
                console.log("Requesting addressbook for permissions")
              })
            }
            if(permission === 'authorized'){
              console.log("Addressbook permission has been granted")
              // (b) Import
                Contacts.addContact(newPerson, (err) => {
                  if(err && err.type === 'permissionDenied'){
                    alert("Permission to import contacts has been denied")
                  } else {
                    console.log("added Junoh Lee to contacts list")
                    alert(contact.name + " was imported successfully")
                  }
                })
            }
            if(permission === 'denied'){
              alert("Swap'em requires permission to use the addressbook")
            }
          })
      },
      passProps: {
        contactInfo: contactInfo,
      },
    })
  }
}

module.exports = ContactsVC1;
