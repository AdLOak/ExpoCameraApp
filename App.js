import React from 'react';
import { Text, View ,TouchableOpacity,Platform, Alert, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';



export default class App extends React.Component {
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
  }

  async componentDidMount() {
    this.getPermissionAsync() //calls the function getPermissionAysnc()
  };

  getPermissionAsync = async () => {
    //Asks for permission to use camera and cameraroll
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('This app requires the use of the cameraRoll for image viewing and image storage.');
      }
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  };

  takeAndStoreImage = async () => {
    //takes picture and then stores it to the devices media library
    console.log('New image has been taken');
    const { uri } = await this.camera.takePictureAsync();
    console.log('uri', uri);
    const asset = await MediaLibrary.createAssetAsync(uri);
    console.log('asset', asset);
  };

  timedImageMode = () => {
    this.interval = setInterval(() => this.takeAndStoreImage(), 5000)
  };

  viewGallery = async () => {
    let gallery = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
  };


  render(){
    const { hasPermission } = this.state
    if (hasPermission === null) {
      return <View />;
    }
    else if (hasPermission === false) {
      return <Text>This app can't continue without permission to access the camera.</Text>;
    }
    else {
      return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.cameraType}  ref={ref => {this.camera = ref}}>
              <View style={appearance.topView}>
                <TouchableOpacity
                  style={appearance.topRow}
                  onPress={()=>Alert.alert("App Info", "\nCamera Button: Takes one single image and stores it to the photo " +
                      "library. \n \nTimer-On Button: Takes and stores one image every five seconds continuously. \n \n Timer-Off Button: " +
                      "stops the Timer-On function. ")}
                >
                  <MaterialCommunityIcons
                    name="cellphone-information"
                    style={appearance.icontop} />
                </TouchableOpacity>
              </View>
              <View style={appearance.lowerView}>

                <TouchableOpacity
                  style={appearance.bottomRow}
                  onPress={()=>this.viewGallery()}>
                  <Ionicons
                      name="images-sharp"
                      style={appearance.icons}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={appearance.bottomRow}
                  onPress={()=>this.takeAndStoreImage()}
                  >
                  <FontAwesome
                      name="camera-retro"
                      style={appearance.icons}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                      style={appearance.bottomRow}
                  onPress={()=>this.timedImageMode()}
                >
                  <MaterialCommunityIcons
                      name="timer-outline"
                      style ={appearance.icons}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                style={appearance.bottomRow}
                onPress={()=> clearInterval(this.interval)}
                >
                  <MaterialCommunityIcons
                    name="timer-off-outline"
                    style={appearance.icons} />
                </TouchableOpacity>
              </View>
            </Camera>
        </View>
      );
    }
  }
}

const appearance = StyleSheet.create({
  icons: {
    color: "#e3fffc",
    fontSize: 50
  },
  icontop:{
    color: "#e3fffc",
    fontSize: 35
  },
  bottomRow: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  topRow:{
    backgroundColor: 'transparent'
  },
  lowerView:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    margin:50
  },
  topView:{
    flex:1,
    flexDirection:"column",
    justifyContent:"space-between",
    margin:35
  },
});
