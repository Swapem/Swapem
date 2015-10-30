'use strict'

var React = require('react-native')
var DB = require('../../DB.js')

var {
  StyleSheet,
  Component,
  View,
  TextInput
} = React

class MyProfilesDetailsVC extends Component{
	constructor(props) {
		super(props)
		DB.contacts.get({type: this.props.profileType}, (results) => {
			if(results && results[results.length-1] && results[results.length-1][this.props.label]) {
				this.setState({text: results[results.length-1][this.props.label]})
			}
		})
		if(!this.state) {
			this.state = {text: 'loading...'}
		}
	}
	updateProfileField(event){
	DB.contacts.add({type: this.props.profileType, [this.props.label]: event.nativeEvent.text}, (added_data) => {
			console.log(added_data)
		})
	}
	render(){
		return(
			<View>
				<TextInput
					style={{height: 40, borderColor: 'gray', borderWidth: 1}}
					onChangeText={(text) => this.setState({text})}
					value={this.state.text}
					onEndEditing={(event)=>{this.updateProfileField(event)}}
  				/>
			</View>
		)
	}
}

module.exports = MyProfilesDetailsVC
