'use strict';

var React = require('react-native');
var DeviceUUID = require('react-native-device-uuid');
var ParseDB = require('../../RemoteDataAccessManager');

var {
  StyleSheet,
  Component,
  ListView,
  TouchableHighlight,
  View,
  Image,
  Text,
} = React;

var fakeRequests = [
{name: 'Junoh Lee', phone: '(778) 111-1111', email: 'junohlee@cs410.com', facebook: 'junohlee',},
{name: 'Lisa Wong', phone: '(778) 222-2222', email: 'lisawong@cs410.com', facebook: 'lisawong',},
{name: 'Ryan Lee', phone: '(778) 333-3333', email: 'ryanlee@cs410.com', facebook: 'ryanlee',},
];

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
  checkmark: {
    alignSelf: 'flex-end',
    height: 20,
    marginLeft: 15,
    marginRight: 5,
    tintColor: '#3498DB',
    width: 20,
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
  separator: {
    backgroundColor: '#E0E0E0',
    height: 0.5,
  },
  person: {
     fontSize: 20,
   },
 });

class RequestsVC1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    let myself = this
    DeviceUUID.getUUID().then((uuid) => {
      ParseDB.getRequestedContacts(uuid, (error, results) => {
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
      renderRow = {this.renderRequest.bind(this)}
      style = {styles.listView}
      />
      );
	}
	renderRequest(request) {
    // e.g. request = {name: 'Junoh Lee', phone: '(778) 111-1111', email: 'junohlee@cs410.com', facebook: 'junohlee',}
		return (
      <TouchableHighlight
      underlayColor = '#2980B9'>
      <View>
      <View style = {styles.cell}>
      <Image
      source = {require('image!Person')}
      style = {styles.icon} />
      <View style = {styles.content}>
      <Text style = {styles.person}>{request.name}</Text>
      </View>
      <View>
      <Image source = {require('image!Checkmark')} style = {styles.checkmark} />
      </View>
      </View>
      <View style = {styles.separator} />
      </View>
      </TouchableHighlight>
      );
	}
}

module.exports = {
  RequestsVC1: RequestsVC1,
  contacts: fakeRequests
}