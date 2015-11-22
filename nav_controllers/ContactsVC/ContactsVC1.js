'use strict';

var React = require('react-native');
var RequestsVC1 = require('../RequestsVC/RequestsVC1');
var ContactsVC2 = require('./ContactsVC2');
var DeviceUUID = require("react-native-device-uuid");
var ParseDB = require('../../RemoteDataAccessManager');
var Contacts = require('react-native-contacts');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

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

// Specify any or all of these keys
var options = {
  title: 'Select Avatar', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  customButtons: {
    //'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
  },
  maxWidth: 100,
  maxHeight: 100,
  quality: 0.5,
  allowsEditing: false, // Built in iOS functionality to resize/reposition the image
  noData: false, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    path: 'images' // will save image at /Documents/images rather than the root
  }
};

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
      ParseDB.getAcceptedContacts(uuid, (error, results) => {
        myself.setState({
          dataSource: ds.cloneWithRows(JSON.parse(JSON.stringify((results))))
        })
      })
    })

    UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
  console.log('Response = ', response);

  if (didCancel) {
    console.log('User cancelled image picker');
  }
  else {
    if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      // You can display the image using either:
      //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
      var source = {uri: response.uri.replace('file://', ''), isStatic: true};

      this.setState({
        avatarSource: source
      });
    }
  }
});
  }

	render() {
		return (
      <View>
      <ListView
      dataSource = {this.state.dataSource}
      renderRow = {this.renderContact.bind(this)}
      style = {styles.listView}/>
      <Image source={this.state.avatarSource} style={{width: 100, height:100}} />
      </View>
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
