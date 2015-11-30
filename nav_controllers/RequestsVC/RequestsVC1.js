'use strict';

var React = require('react-native');
var DeviceUUID = require("react-native-device-uuid");
var ParseDB = require('../../RemoteDataAccessManager');
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

var fakeRequests = [
{name: 'Junoh Lee', phone: '(778) 111-1111', email: 'junohlee@cs410.com', facebook: 'junohlee',},
{name: 'Lisa Wong', phone: '(778) 222-2222', email: 'lisawong@cs410.com', facebook: 'lisawong',},
{name: 'Ryan Lee', phone: '(778) 333-3333', email: 'ryanlee@cs410.com', facebook: 'ryanlee',},
];

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var parseDB = new ParseDB(Keys.parseAppKey, Keys.parseJsKey);

var checkedNames = []

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
    height: 1,
  },
  person: {
     fontSize: 20,
   },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  lview:{
    flex:1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 50

  }
 });

class RequestsVC1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows([]),
    }
  }
  
  componentDidMount() {
    let myself = this
    DeviceUUID.getUUID().then((uuid) => {
      parseDB.getRequestedContacts(uuid, (error, results) => {
        myself.setState({
          dataSource: ds.cloneWithRows(JSON.parse(JSON.stringify((results))))
        })
      })
    })
  }

  handleAcceptButton(){
    DeviceUUID.getUUID().then((uuid) => {
      for(let i=0; i<checkedNames.length; i++){
        parseDB.updateContactToAccepted(uuid, checkedNames[i], (error, result) =>{
          if(error){
            alert(error)
          }
          else{
            alert("Contacts saved");
          }
        })
      }
    })
  }

	render() {
		return (
      <View style={styles.lview}>
			<ListView
      dataSource = {this.state.dataSource}
      renderRow = {this.renderRequest.bind(this)}
      style = {styles.listView}
      />
      <TouchableHighlight style={styles.button}
        onPress={this.handleAcceptButton}>
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableHighlight>
      </View>
      );
	}
	renderRequest(request) {
    // e.g. request = {name: 'Junoh Lee', phone: '(778) 111-1111', email: 'junohlee@cs410.com', facebook: 'junohlee',}
		return (
      <ContactRow request={request} />
    )
	}
}

class ContactRow extends Component{
  constructor(props) {
    super(props)
    this.state = {
      check: false
    }
  }

  render(){
    return(
      <TouchableHighlight
        onPress={() => {
          if(!this.state.check){
            checkedNames.push(this.props.request.name)
          }
          else{
            let indexOfName = checkedNames.indexOf(this.props.request.name)
            checkedNames.splice(indexOfName, 1)
          }
          this.setState({check:!(this.state.check)});
        }
        }
        underlayColor = '#2980B9'>
        <View>
          <View style = {styles.cell}>
            <Image
            source = {{uri:'Person'}}
            style = {styles.icon} />
            <View style = {styles.content}>
              <Text style = {styles.person}>{this.props.request.name}</Text>
            </View>
            {this.state.check? 
              <View>
                <Image source = {{uri:'Checkmark'}} style = {styles.checkmark} />
              </View> 
              :
              null
            }
          </View>
          <View style = {styles.separator} />
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = {
  instance: RequestsVC1,
  contacts: fakeRequests
}