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
} from 'react-native';

import * as Progress from 'react-native-progress';
import MapboxGL from '@react-native-mapbox-gl/maps';
import RNLocation from 'react-native-location';
import axios from 'react-native-axios';
import serverService from '../services/serverService';
import config from '../utils/config';
import MapUi from '../components/MapUi';

const ANNOTATION_SIZE = 45;
const { height, width } = Dimensions.get('window');
const localServer = serverService.localserver;
var metersTraveled = 0;
RNLocation.configure({
  desiredAccuracy: {
    ios: 'best',
    android: 'balancedPowerAccuracy',
  },
  interval: 5000,
  maxWaitTime: 6000,

});

MapboxGL.setAccessToken(config.get('accessToken'));

export default class Map extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      ts: 0,
      hasPermisionToUseLocation: false,
      mapMounted: false,
      playerMounted: false,
      worldStructuresMounted: false,
      areCreaturesMounted: false,
      worldCreatureButtonDisabled: false,
      loading: 0,
      currentLocationUpdates: 0,

      creatures: [],
      playerLocation: {
        latitude: 35.4876277,
        longitude: 24.06715,
        latitudeDelta: 0.01,
        longitudeDelta: 0.008,
      },
      playerInfo: {},
      token: this.props.route.params.token,
      id: this.props.route.params.id,
      worldStructures: [],
      locationsToAnimate: [],
    };

    this.unsubscribe = null;
    this.latestlocation = null;
    this.mapUi = null;
    this.playerMarker = null;
  }

  handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.getPlayerInfo();
      this.requestMapPermisions();
      this.sendUserLocation();
      this.getNearbyCreatures();
      this.getWorldStructures();

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
        loading: this.state.loading + 1
      });
    } catch (error) {
      console.log("Error getting player " + error)
    }
  }

  //sends user current location to server
  async sendUserLocation() {
    console.log("Sending location and updating player")
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    try {
      const response = await axios
        .post(
          localServer +
          'rest/player/' +
          this.state.playerInfo.id +
          '/updateLastLocation?latitude=' +
          this.state.playerLocation.latitude +
          '&longitude=' +
          this.state.playerLocation.longitude, null, config
        );
      this.setState({ playerInfo: response.data });
    }
    catch (error) {
      console.log("Error sending location " + error)
    }

  };

  //requests server for nearby worldStructures and sets worldStructures state and worldStructuresMounted state
  async getWorldStructures() {
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    try {
      console.log('Asking nearby structures');
      const response = await axios.get(
        localServer + 'rest/worldStructure/' + this.state.playerInfo.id, config
      );
      if (response.data !== null) {
        this.setState({
          worldStructures: response.data,
          worldStructuresMounted: true,
          loading: this.state.loading + 1
        });
      }
    } catch (error) {
      console.log('Error getting worldStructures!' + error);
    }
  };

  async getNearbyCreatures() {
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    try {
      console.log('asking for nearby creatures');
      const response = await axios.get(
        localServer +
        'rest/worldStructure/creatures/' +
        this.state.playerInfo.id, config
      );
      if (response.data !== null) {
        this.setState({ creatures: response.data, areCreaturesMounted: true, loading: this.state.loading + 1 });
      }
    } catch (error) {
      console.log('Error getting nearby creatures' + error);
    }
  };
  //requests to initiate a battle with clicked creature
  async requestBattle(creature) {
    let player = this.state.playerInfo;
    player.latitude = this.state.playerLocation.latitude;
    player.longitude = this.state.playerLocation.longitude;

    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    try {
      const response = await axios.post(localServer + 'rest/battle/init', { player, creature }, config);
      if (response.data !== '') {

        this.setState({
          mapMounted: false,
          playerMounted: false,
          worldStructuresMounted: false,
          areCreaturesMounted: false,
          loading: 0,
        });
        let battle = response.data;
        let token = this.state.token;
        this.props.navigation.push('Battle', { battle, token });
      }
    }
    catch (error) {
      Alert.alert('Too far from creature.');
      this.setState({ worldCreatureButtonDisabled: false });
      console.log('Request Battle error: ' + response);
    }

  };

  //requests maps permissions from user and gets current device location
  async requestMapPermisions() {
    try {
      const permisionResult = await MapboxGL.requestAndroidLocationPermissions();
      if (permisionResult) {
        RNLocation.getLatestLocation().then(
          (location) => {
            this.setState({
              playerlocation: {
                latitude: location.latitude,
                longitude: location.longitude,
              }

            });

          },
        );
        this.setState({ hasPermisionToUseLocation: permisionResult, mapMounted: true, loading: this.state.loading + 1 });


      }
    } catch (error) {
      console.error("Location error" + error);
    }
  }

  async goToTown() {
    await this.props.navigation.replace("Town", { token: this.state.token, id: this.state.id })
  }

  openShop(p) {
    this.setState({
      mapMounted: false,
      playerMounted: false,
      worldStructuresMounted: false,
      areCreaturesMounted: false,
    });
    clearInterval(this.getNearbyCreaturesInterval);
    clearInterval(this.sendLocationToServer);
    clearInterval(this.getWorldStructuresInterval);
    this.props.navigation.navigate('Shop', {
      playerInfo: this.state.playerInfo,
      shopInfo: p,
      token: this.state.token
    });
  };

  async getSurroundingsAndSendLocation(coords) {
    this.setState({ playerLocation: coords })


    if (metersTraveled == 20) {
      try {
        metersTraveled = 0;
        await this.getNearbyCreatures();
        await this.getWorldStructures();
        await this.sendUserLocation();
      } catch (error) {
        console.log("ERROR: Getting surroundings and sending location" + error);
      }
    } else {
      metersTraveled++;
    }

  }

  async focusListener() {
    await this.requestMapPermisions();
    await this.getPlayerInfo();
    await this.getNearbyCreatures();
    await this.getWorldStructures();
    await this.sendUserLocation();

  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => this.focusListener())
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    this.unsubscribe;
    this.getSurroundingsAndSendLocation;
    AppState.removeEventListener('change', this.handleAppStateChange);


  }


  showWorldStructureType(p) {
    if (p.structureModel.structureType === 'Portal') {
      return (
        <MapboxGL.MarkerView
          id={p.id}
          key={p.id}
          coordinate={[p.structureModel.longitude, p.structureModel.latitude]}
          x={0}
          y={0}>
          <Image source={require('../img/worldStructures/portal.png')} />
        </MapboxGL.MarkerView>
      );
    } else {
      return (
        <MapboxGL.MarkerView
          style={{
            alignItems: 'center',
          }}
          id={p.id}
          key={p.id}
          coordinate={[p.structureModel.longitude, p.structureModel.latitude]}
          x={0}
          y={0}>
          <TouchableOpacity isVisible={true} onPress={() => this.openShop(p)}>
            <Image source={require('../img/worldStructures/shop.png')} />
          </TouchableOpacity>
        </MapboxGL.MarkerView>
      );
    }
  }

  async triggerScreenChange() {
    this.setState({
      mapMounted: false,
      playerMounted: false,
      worldStructuresMounted: false,
      areCreaturesMounted: false,
      loading: 0
    });
  }

  render() {

    return (
      <View style={styles.container}>
        {this.state.hasPermisionToUseLocation &&
          this.state.playerMounted &&
          this.state.worldStructuresMounted &&
          this.state.areCreaturesMounted ? (
            <View style={styles.container}>
              <MapboxGL.MapView
                ref={(map) => {
                  this.map = map;
                }}
                style={styles.map}
                styleURL={
                  'mapbox://styles/isendoum/ckfgy1dgy2mq819p8ty4fqxdu?optimize=true'
                }
                pitchEnabled={false}
                scrollEnabled={false}
                logoEnabled={false}>
                <MapboxGL.Camera
                  ref={(camera) => {
                    this.camera = camera;
                  }}
                  maxZoomLevel={19.5}
                  minZoomLevel={18.5}
                  defaultSettings={{ zoomLevel: 18.5, pitch: 85 }}
                  followUserLocation={true}
                  followUserMode={"normal"}
                  followPitch={90}
                  animationMode={"easeTo"}
                  animationDuration={0}
                />
                <MapboxGL.UserLocation
                  ref={(userLocation) => this.userLocation = userLocation}
                  visible={false}
                  onUpdate={(location) => this.getSurroundingsAndSendLocation(location.coords)
                  }
                  minDisplacement={1}
                />

                <MapboxGL.MarkerView
                  ref={(playerMarker) => this.playerMarker = playerMarker}
                  style={{
                    maxWidth: "18%",
                    maxHeight: "15%",
                  }}
                  key={this.state.playerInfo.id}
                  id={this.state.playerInfo.id}
                  coordinate={[this.state.playerLocation.longitude, this.state.playerLocation.latitude]}
                  x={0}
                  y={0}>
                  <Image
                    style={{
                      flex: -1,
                      resizeMode: "contain"
                    }}
                    source={require('../img/warrior.png')}
                  />
                </MapboxGL.MarkerView>

                {this.state.worldStructures.map((p) =>
                  this.showWorldStructureType(p),
                )}

                {this.state.creatures.map((creature) => (
                  <MapboxGL.MarkerView
                    style={{
                      maxWidth: "18%",
                      maxHeight: "15%",

                    }}
                    key={creature.id}
                    id={creature.id}
                    coordinate={[creature.longitude, creature.latitude]}
                    x={0}
                    y={0}>
                    <TouchableOpacity
                      style={{ flex: -1, justifyContent: "center", alignItems: "center" }}
                      isVisible={true}
                      disabled={this.worldCreatureButtonDisabled}
                      onPress={() => { this.setState({ worldCreatureButtonDisabled: true }); this.requestBattle(creature) }
                      }>
                      <Image
                        style={{
                          flex: -1,
                          resizeMode: "contain"
                        }}
                        source={require('../img/creatures/skeletonWarrior.png')}
                      />
                    </TouchableOpacity>
                  </MapboxGL.MarkerView>
                ))}
              </MapboxGL.MapView>

              <MapUi ref={(mapUi) => {
                this.mapUi = mapUi;
              }} nav={this.props.navigation} token={this.state.token} playerInfo={this.state.playerInfo} triggerScreenChange={() => this.triggerScreenChange()} />
              <TouchableOpacity style={styles.playerInfoStateCoordsBubble} onPress={() => this.goToTown()}>
                <Text style={{ fontFamily: 'RomanAntique', fontSize: 25 }}>Visit Eternia</Text>
              </TouchableOpacity>


            </View>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center", flex: 1, flexDirection: 'column' }}>
              <Text>Loading</Text>
              <Progress.Bar style={{ marginTop: 2 }} borderColor={"#00000"} color={"#DC143C"} height={20} width={200} animated={true} progress={this.state.loading / 4} />
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  annotationContainer: {
    alignItems: 'center',

    justifyContent: 'center',

    width: ANNOTATION_SIZE,
  },
  creatureImage: {

  },
  bottomView: {
    width: width,
    height: height / 8,

    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  playerView: {
    justifyContent: 'center',
  },

  playerBoxImage: {
    alignSelf: 'flex-end',
    alignContent: 'center',
    width: 120,
    height: 60,
  },
  playerBoxText: {
    marginTop: 4,
    fontSize: 15,
    alignSelf: 'center',
    fontFamily: 'RomanAntique',
  },

  inventoryView: {
    justifyContent: 'flex-end',
  },
  inventoryImage: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },

  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  playerInfoStateCoordsBubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    position: 'absolute',
    top: 0,
  },
  playerLocationStateCoordsBubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    position: 'absolute',
    top: 25,
  },
});
