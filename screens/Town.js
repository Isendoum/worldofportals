import React, { PureComponent } from 'react';
import {
  AppState,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Button,
} from 'react-native';
import axios from 'react-native-axios';
import serverService from '../services/serverService';
import MapUi from '../components/MapUi';
import { Input, Overlay } from 'react-native-elements';

const ANNOTATION_SIZE = 45;
const { height, width } = Dimensions.get('window');
const localServer = serverService.localserver;




export default class Town extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      ts: 0,
      playerMounted: false,
      chatMessage: "",
      messages: [],
      playerInfo: {},
      touchableDisabled: false,
      token: this.props.route.params.token,
      id: this.props.route.params.id,
      valorOverlay: false,

    };




    this.unsubscribe = null;
    this.screenBlurListener = null;


  }

  handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/active/) &&
      nextAppState === 'inactive' || nextAppState === 'background'

    ) {
      this.setState({ messages: [] })
      this.sendMessage("disconnect")
    }
    else if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.connectAndOpenChatWs()
      this.getPlayerInfo();

      console.log('App has come to the foreground!');
    }
    this.setState({ appState: nextAppState });
  };

  //receives player information from server and sets playerInfo state and playerMounted state
  async getPlayerInfo() {

    console.log('Asking for player');
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }

    try {
      const response = await axios.get(
        localServer + 'rest/player/' + this.state.id, config
      );

      this.setState({
        playerInfo: response.data,
        playerMounted: true,
      });
      this.sendMessage("connected");
    } catch (error) {
      console.log("Error getting player " + error)
    }
  }


  //requests to initiate a battle with clicked creature
  requestTowerBattle = async () => {

    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    try {
      const response = await axios
        .get(localServer + 'rest/battle/initTowerBattle/' + this.state.playerInfo.id, config)
      console.log('Requested Tower battle');

      if (response.data != '') {
        let battle = response.data;
        let token = this.state.token;

        this.props.navigation.push('Battle', { battle, token });
      } else {
        Alert.alert("You are currently fainted.")
      }
    }
    catch (error) {
      console.log('Request Tower Battle error: ' + error);
    }

  };

  requestTowerFloorReset = async () => {

    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    try {
      const response = await axios
        .get(localServer + 'rest/player/' + this.state.playerInfo.id + '/resetValorTower', config)
      console.log('Requested Tower floor reset');

      if (response.data != '') {
        this.setState({ playerInfo: response.data })
      } else {
        Alert.alert("You are currently fainted.")
      }
    }
    catch (error) {
      console.log('Request Tower reset error: ' + error);
    }

  };

  chat = (messages) => {
    let i = 0;
    return <ScrollView onContentSizeChange={() => this.messageBoard.scrollToEnd({ animated: true })} ref={messageBoard => this.messageBoard = messageBoard} contentContainerStyle={{ justifyContent: "flex-start" }} style={{ flex: 0, maxHeight: "75%" }}>
      {messages.map(message => <Text style={{ flex: 1, fontSize: 16 }} key={i++}>{message}</Text>)}
    </ScrollView>
  }

  triggerScreenChange() {

    this.setState({
      mapMounted: false,
      playerMounted: false,
      worldStructuresMounted: false,
      areCreaturesMounted: false,
      messages: [],
    });
  }

  sendMessage = (message) => {
    if (message === "") {

    } else {
      this.socket.send('{user:' + this.state.playerInfo.playerCharacter.name + ',message:' + message + '}');
    }
  }

  navigateTo = (screen) => {
    this.props.navigation.navigate(screen, {
      playerInfo: this.state.playerInfo,
      token: this.state.token
    })
  }

  functionsToRunOnScreenFocus = () => {
    this.getPlayerInfo()
    this.connectAndOpenChatWs()
    this.setState({ touchableDisabled: false })
  }

  functionsToRunOnScreenBlur = () => {
    this.setState({ messages: [] })
    this.sendMessage("disconnect")
  }

  connectAndOpenChatWs() {
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token, 'Connection': 'keep-alive'
      }
    }
    this.socket = new WebSocket('wss://wopbackend.herokuapp.com/rest/chat', null, config);
    this.socket.onmessage = (data) => {
      let updatedMessages = this.state.messages;
      updatedMessages.push(data.data);
      this.setState({ messages: updatedMessages })
      this.forceUpdate();
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', this.functionsToRunOnScreenFocus);
    this.screenBlurListener = this.props.navigation.addListener('blur', this.functionsToRunOnScreenBlur)
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token, 'Connection': 'keep-alive'
      }
    }
    this.socket = new WebSocket('ws://192.168.1.7:8080/rest/chat', null, config);
    this.socket.onmessage = (data) => {
      let updatedMessages = this.state.messages;
      updatedMessages.push(data.data);
      this.setState({ messages: updatedMessages })
      this.forceUpdate();
    };
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    this.unsubscribe;
    this.screenBlurListener;
    this.sendMessage("disconnect");
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  onPressTouchable(touchablePress) {
    this.setState({ touchableDisabled: true })
    switch (touchablePress) {
      case "map":
        this.props.navigation.replace("Map", { token: this.state.token, id: this.state.id });
        break;
      case "battle":
        this.setState({ valorOverlay: true })

        break;
      case "skillShop":
        this.navigateTo('TownSkillShop');
        break;
      case "itemShop":
        this.navigateTo("TownShop");
        break;
      default:
        break;
    }
  }

  overlay = (player) => {

    return <Overlay isVisible={this.state.valorOverlay}>
      <View>
        <Text style={styles.titleText}>Valor tower</Text>
        <Text style={styles.detailsText}>Valor tower has 100 floors. Each floor has increased difficulty. Every 5 floors player will encounter a Boss that drops a power crystal.</Text>
        <Text style={styles.detailsText}>Current floor: {player.career.currentValorTowerFloor}</Text>
        <Text style={styles.detailsText}>Top floor: {player.career.topValorTowerFloor}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Text onPress={() => { this.setState({ valorOverlay: false }); this.setState({ touchableDisabled: false }); }}>Cancel</Text>
          <Text onPress={() => this.requestTowerFloorReset()}>Reset progress({player.career.valorTowerAvailableResets})</Text>
          <Text onPress={() => { this.requestTowerBattle(); this.setState({ valorOverlay: false }); }}>Enter</Text>
        </View>
      </View>
    </Overlay>
  }

  render() {

    return (
      <View style={styles.container}>
        {
          this.state.playerMounted ? (
            <ImageBackground
              style={styles.container}
              imageStyle={{ resizeMode: 'center', resizeMode: 'stretch' }}
              source={require('../img/backgrounds/backgroundTown.png')}>

              <TouchableOpacity disabled={this.state.touchableDisabled} onPressIn={() => this.onPressTouchable("map")} style={styles.portalTouchableStyle}>
                <Image style={{ resizeMode: "contain", flex: -1, alignSelf: "center" }} source={require('../img/townBuildings/townPortal.png')} />
              </TouchableOpacity>

              <TouchableOpacity disabled={this.state.touchableDisabled} onPressIn={() => this.onPressTouchable("battle")} style={styles.valorTowerTouchableStyle}>
                <Image style={{ resizeMode: "contain", flex: -1, alignSelf: "center" }} source={require('../img/townBuildings/valorTower.png')} />
              </TouchableOpacity>

              <TouchableOpacity disabled={this.state.touchableDisabled} onPressIn={() => this.onPressTouchable("skillShop")} style={styles.skillShopTouchableStyle}>
                <Image style={{ resizeMode: "contain", flex: -1, alignSelf: "center" }} source={require('../img/townBuildings/townSkillShop.png')} />
              </TouchableOpacity>

              <TouchableOpacity disabled={this.state.touchableDisabled} onPressIn={() => this.onPressTouchable("itemShop")}
                style={styles.shopTouchableStyle}>
                <Image style={{ resizeMode: "contain", flex: -1, alignSelf: "center" }} source={require('../img/worldStructures/shop.png')} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View style={{ flex: 0, backgroundColor: "#ffffff", alignSelf: "flex-start", height: "20%", justifyContent: "space-between" }}>
                  {this.chat(this.state.messages)}
                  <View style={{ flex: -1, flexDirection: "row", justifyContent: "flex-start", borderColor: "#000000", borderWidth: 2 }}>
                    <Input inputContainerStyle={{ borderBottomWidth: 0 }} containerStyle={{ maxWidth: "85%", maxHeight: "20%" }} onChangeText={(value) => this.setState({ chatMessage: value })} />
                    <Button title={"send"} style={{ flex: -1 }} onPress={() => this.sendMessage(this.state.chatMessage)} />
                  </View>
                </View>

                {this.overlay(this.state.playerInfo)}
                <MapUi ref={(mapUi) => {
                  this.mapUi = mapUi;
                }}
                  nav={this.props.navigation}
                  token={this.state.token}
                  playerInfo={this.state.playerInfo}
                  triggerScreenChange={() => this.triggerScreenChange()} />
              </View>
            </ImageBackground>
          ) : (
              <View style={{ flexDirection: 'column', flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
                <Text>loading. . .</Text>
                <Text>Player: {this.state.playerMounted.toString()}</Text>
              </View>
            )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",

  },

  portalTouchableStyle: {
    position: "absolute",
    flex: -1,
    maxHeight: "50%",
    maxWidth: "30%",

    top: height / 1.7,
    left: width / 5.5,
  },
  valorTowerTouchableStyle: {
    position: "absolute",
    flex: -1,
    maxHeight: "30%",
    maxWidth: "25%",

    top: height / 3.5,
    left: width / 2,
  },

  skillShopTouchableStyle: {
    position: "absolute",
    flex: -1,
    maxHeight: "30%",
    maxWidth: "25%",

    top: height / 1.4,
    left: width / 3,
  },
  shopTouchableStyle: {
    position: "absolute",
    flex: -1,
    maxHeight: "100%",
    maxWidth: "25%",

    top: height / 1.8,
    left: width / 1.3,
  },
  titleText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 26,
    alignSelf: 'center',
    color: '#000000',
  },
  detailsText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 20,

    color: '#000000',
  },



});
