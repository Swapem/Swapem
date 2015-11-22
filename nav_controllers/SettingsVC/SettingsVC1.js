'use strict';

var React = require('react-native');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var {
  StyleSheet,
  Component,
  View,
  Image,
  Text
} = React;

var styles = StyleSheet.create({
});

// Specify any or all of these keys
var options = {
  title: 'Select Avatar', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  customButtons: {
    'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
  },
  maxWidth: 100,
  maxHeight: 100,
  quality: 0.2,
  allowsEditing: false, // Built in iOS functionality to resize/reposition the image
  noData: false, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    path: 'images' // will save image at /Documents/images rather than the root
  }
};

class SettingsViewController1 extends Component {
	constructor(props){
		super(props)
		this.state ={
			avatarSource: ''
		}
	}
	componentDidMount(){
		// The first arg will be the options object for customization, the second is
// your callback which sends bool: didCancel, object: response.
//
// response.data is the base64 encoded image data
// response.uri is the uri to the local file asset on the device
// response.isVertical will be true if the image is vertically oriented
// response.width & response.height give you the image dimensions
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
      <Text>Hello</Text>
      <Text>Bear</Text>
      <Text>Hello</Text>
      <Image source={this.state.avatarSource} style={{width: 100, height:100}} />
      </View>
      );
  }
}

module.exports = SettingsViewController1;
