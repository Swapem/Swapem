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

var fakeRequests = [
'Junoh Lee',
'Lisa Wong',
'Ryan Lee',
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
    marginRight: 10,
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

class RequestsViewController1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
		};
	}
	componentDidMount() {
		var requests = fakeRequests;
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(requests)
		});
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
		return (
            <TouchableHighlight
            underlayColor = '#2980B9'>
                <View>
                    <View style = {styles.cell}>
                        <Image
                            source = {require('image!Person')}
                            style = {styles.icon} />
                        <View style = {styles.content}>
                        <Text style = {styles.person}>{request}</Text>
                        </View>
                    </View>
                    <View style = {styles.separator} />
                </View>
            </TouchableHighlight>
            );
	}
}

module.exports = RequestsViewController1;
