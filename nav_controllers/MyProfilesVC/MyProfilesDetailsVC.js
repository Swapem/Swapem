'use strict'

var React = require('react-native')
var DB = require('../../DB.js')

var {
  StyleSheet,
  Component,
  View,
  TextInput
} = React

let isExist = false

class MyProfilesDetailsVC extends Component{
	constructor(props) {
		super(props)
		DB.contacts.get({type: this.props.profileType}, (results) => {
			if(results && results[results.length-1] && results[results.length-1][this.props.label]) {
				this.setState({text: results[results.length-1][this.props.label]})
			}
		})
		if(!this.state) {
			this.state = {text: ''}
		}

		DB.contacts.get({type: this.props.profileType}, (results)=>{
			if(results.length>0){
				isExist = true
			} else {
				isExist = false
			}
		})
	}
	updateProfileField(event){
		if(!isExist){
			DB.contacts.add({type: this.props.profileType, [this.props.label]: event.nativeEvent.text}, (added_data) => {
				console.log(added_data)
			})
			isExist = true
		} else {
			DB.contacts.update({type: this.props.profileType}, {[this.props.label]: event.nativeEvent.text}, (updated) => {
				console.log(updated)
			})
		}
	}
	render(){
		return(
			<View>
				<TextInput
					placeholder={'Enter ' + this.props.label}
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
