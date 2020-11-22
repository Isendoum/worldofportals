import React, { PureComponent, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import axios from 'react-native-axios';
import { Input, Button } from 'react-native-elements';
import _ from 'lodash';
import serverService from '../services/serverService';
import RNLocation from 'react-native-location';
import MapboxGL from '@react-native-mapbox-gl/maps';






const localServer = serverService.localserver;


export default class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      latitude: "",
      longitude: "",
    };

    this.latestlocation = null;
  }

  async requestMapPermisionsTwo() {
    try {
      const permisionResult = await MapboxGL.requestAndroidLocationPermissions();
      if (permisionResult) {


        this.latestlocation = RNLocation.getLatestLocation().then(
          (location) => {
            console.log(location)
            this.setState({
              latitude: location.latitude,
              longitude: location.longitude,

            });

          },
        );

      }
    } catch (error) {
      console.error(error);
    }
  }

  async loginRequest() {
    let loginCreds = {
      username: this.state.username,
      password: this.state.password,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }


    const headers = {
      'Content-Type': 'application/json',
    }
    try {

      const response = await axios.post(localServer + "rest/player/signin", loginCreds, headers)
      if (response.status === 200) {

        this.props.navigation.replace("Map", response.data);
      }

    } catch (error) {
      Alert.alert("Wrong username or password");
      this.username.clear();
      this.password.clear();
    }
  }

  componentDidMount() {
    this.requestMapPermisionsTwo();
  }



  componentWillUnmount() {
    this.latestlocation;
  }

  //Request to the server to flee from battle

  //Request to the server to attack the enemy




  //render function
  render() {
    return (
      <ImageBackground
        style={{ maxHeight: height, flex: 1 }}
        imageStyle={{ resizeMode: 'stretch' }}
        source={require('../img/backgrounds/characterStatsBg.png')}>


        <View style={{ flex: 1 }}>
          <Image style={{ resizeMode: "contain", alignSelf: "center" }} source={require('../img/ui/logo.png')} />
          <Text style={{ alignSelf: "center" }}>alpha v0.1.0</Text>
          <View style={{ flex: 1.5, flexDirection: "column" }}>

            <Input ref={(username => this.username = username)} style={{ flex: 1 }} onChangeText={value => this.setState({ username: value })} placeholder="Username" />
            <Input ref={(pasword => this.password = pasword)} style={{ flex: 1 }} placeholder="Password" onChangeText={value => this.setState({ password: value })} secureTextEntry={true} />
            <Button onPress={() => this.loginRequest()} buttonStyle={{ alignSelf: "center", backgroundColor: "#303030" }} title="Login" />
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.push("Register")} style={{ alignSelf: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 16, alignSelf: "center", marginBottom: "5%" }}>Click here to create a new account</Text>

          </TouchableOpacity>
        </View>

      </ImageBackground>
    );
  }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({

});
