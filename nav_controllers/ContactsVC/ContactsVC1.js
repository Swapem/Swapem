'use strict';

var React = require('react-native');
var ContactsVC2 = require('./ContactsVC2');
var DB = require('../../DB.js');

var {
  StyleSheet,
  Component,
  ListView,
  TouchableHighlight,
  View,
  Image,
  Text,
} = React;

var fakeContacts = [
{name: 'Junoh Lee', phone: '(778) 111-1111', email: 'junohlee@cs410.com', facebook: 'junohlee',},
{name: 'Lisa Wong', phone: '(778) 222-2222', email: 'lisawong@cs410.com', facebook: 'lisawong',},
{name: 'Ryan Lee', phone: '(778) 333-3333', email: 'ryanlee@cs410.com', facebook: 'ryanlee',},
];

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

let addressBookResult = {}

class ContactsVC1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
		};

	}
	componentDidMount() {
    // uncomment this to clear the addressbook
    //DB.addressbook.erase_db((dd)=>{})
    DB.addressbook.get({accepted: true}, (results) =>{
      addressBookResult = results
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(addressBookResult)
      })
    })
	}

  addToAddressBook(){
  DB.addressbook.add({name: 'Snoopy', phone: '3333', email: 'tttt', facebook:'SnoopyFacebook', accepted: true}, function(added_data){
    addressBookResult.push(added_data)
    alert(JSON.stringify(addressBookResult))
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(addressBookResult)
      })
  })
}
	render() {
		return (
      <View>
			<ListView
            dataSource = {this.state.dataSource}
            renderRow = {this.renderContact.bind(this)}
            style = {styles.listView}
            />
            <TouchableHighlight
            onPress={this.addToAddressBook}>
            <Text>Add Contacts</Text>
          </TouchableHighlight>
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