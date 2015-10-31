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
  item: {
  	fontSize: 20,
  },
});

class ContactsVC2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
		};
	}
	componentDidMount() {
		var contactInfo = this.props.contactInfo;
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(contactInfo)
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
	renderRequest(contactInfoItem) {
		return (
            <TouchableHighlight
            underlayColor = '#2980B9'>
                <View>
                    <View style = {styles.cell}>
                        <Image
                            source = {(() => {
                              switch (Object.keys(contactInfoItem).toString()) {
                                case 'name': return require('image!Person');
                                case 'phone': return require('image!Phone');
                                case 'email': return require('image!Email');
                                case 'facebook': return require('image!Facebook');
                                default: return require('image!Person');
                              }})()}
                            style = {styles.icon} />
                        <View style = {styles.content}>
                        <Text style = {styles.item}>
                        {(() => {
                          switch (Object.keys(contactInfoItem).toString()) {
                            case 'name': return (contactInfoItem.name);
                            case 'phone': return (contactInfoItem.phone);
                            case 'email': return (contactInfoItem.email);
                            case 'facebook': return (contactInfoItem.facebook);
                            default: return 'name';
                          }})()}
                        </Text>
                        </View>
                    </View>
                    <View style = {styles.separator} />
                </View>
            </TouchableHighlight>
            );
	}
}

module.exports = ContactsVC2;
