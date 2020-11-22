import React, { PureComponent, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import axios from 'react-native-axios';
import { Input, Button } from 'react-native-elements';
import _ from 'lodash';
import serverService from '../services/serverService';

const localServer = serverService.localserver;


export default class Register extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      roles: ["user"]
    };


  }
  goBack = () => {
    this.props.navigation.pop();
  };

  async registerRequest() {
    let registerCreds = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      roles: this.state.roles
    }
    const headers = {
      'Content-Type': 'application/json',

    }
    try {
      const response = await axios.post(localServer + "rest/player/signup", registerCreds, headers)
      if (response.status === 200) {
        this.goBack()
      }

    } catch (error) {
      Alert.alert("Email or username already exists.")
    }
  }

  componentDidMount() { }

  componentDidUpdate() { }

  componentWillUnmount() { }

  //Request to the server to flee from battle

  //Request to the server to attack the enemy




  //render function
  render() {
    return (
      <ImageBackground
        style={{ ...StyleSheet.absoluteFillObject, maxHeight: height }}
        imageStyle={{ resizeMode: 'stretch' }}
        source={require('../img/backgrounds/characterStatsBg.png')}>
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
          <Input onChangeText={value => this.setState({ username: value })} placeholder="Username" />
          <Input textContentType="emailAddress" onChangeText={value => this.setState({ email: value })} placeholder="Email" />
          <Input placeholder="Password" onChangeText={value => this.setState({ password: value })} secureTextEntry={true} />
          <Button onPress={() => this.registerRequest()} buttonStyle={{ alignSelf: "center", backgroundColor: "#303030" }} title="Register" />
        </View>


      </ImageBackground>
    );
  }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({

});
