'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Component,
  View,
  Image,
  Text
} = React;

var styles = StyleSheet.create({
    wrapper: {
    marginTop: 80
  },
});


class SettingsViewController1 extends Component {
	constructor(props){
		super(props)
		this.state ={
			
		}
	}
	componentDidMount(){

	}
  render() {
    return (
      <View style={styles.wrapper}>
      <Text>Hello</Text>
      <Text>Bear</Text>
      <Text>Hello</Text>
      </View>
      );
  }
}

module.exports = SettingsViewController1;
