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
  AsyncStorage
} = React;

var fakeNearbyDevices = [
{name: 'Junoh Lee', uuid: '0000',},
{name: 'Lisa Wong', uuid: '1111',},
{name: 'Ryan Lee', uuid: '2222',},
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
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
    };
  }
  componentDidMount() {
    AsyncStorage.getItem('nearbyDevices').then((value) => {
       this.setState({'nearbyDevices': value});
       var nearbyUsers = JSON.parse(value);
       console.log("value of asyncStorage nearby users: " + nearbyUsers);
       
       this.setState({
          dataSource: this.state.dataSource.cloneWithRows(nearbyUsers)
        });
   }).done();
    
  }
  render() {
    return (
      <ListView
      dataSource = {this.state.dataSource}
      renderRow = {this.renderNearbyDevice.bind(this)}
      style = {styles.listView}
      />
      );
  }
  renderNearbyDevice(nearbyDevice) {
    // e.g. nearbyDevice = {name: 'Junoh Lee', uuid: '0000',}
    return (
      <TouchableHighlight
      underlayColor = '#2980B9'>
      <View>
      <View style = {styles.cell}>
      <Image
      source = {require('image!Person')}
      style = {styles.icon} />
      <View style = {styles.content}>
      <Text style = {styles.person}>{nearbyDevice.name}</Text>
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

module.exports = RequestsVC1;
