import React, { PureComponent, useRef } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  Easing,
  ScrollView,
  ImageBackground,
} from 'react-native';
import axios from 'react-native-axios';
import { ListItem, Overlay, Avatar } from 'react-native-elements';
import _ from 'lodash';
import serverService from '../services/serverService';
import findImage from '../services/gearImageService.js';
import findSkillImage from '../services/skillImageService.js';
import * as Animatable from "react-native-animatable";
import * as Progress from 'react-native-progress';

const localServer = serverService.localserver;

const { height, width } = Dimensions.get('window');
const INTERVAL = 5000;

export default class Battle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: this.props.route.params.token,
      arePlayerButtonDisabled: false,
      endBattleOverlay: false,
      battleState: this.props.route.params.battle,
      hasCameraPermission: null,
      isSkillDisabled: false,
      battleEnded: false,
      loot: this.props.route.params.battle.creature.items,
      creatureMaxHp: this.props.route.params.battle.creature.hp,
    };

    // Set up touch handlers

    // Bind component methods
    this.animatedRotateValue = new Animated.Value(0);
    this.animatedPlayerXValue = new Animated.Value(0);
    this.animatedPlayerYValue = new Animated.Value(0);
    this.animatedCreatureXValue = new Animated.Value(0);
    this.animatedCreatureYValue = new Animated.Value(0);
    this.creatureTimeout = null;
  }

  creatureAttackAnimation = async () => {
    console.log('Animating creature');
    // Animation consists of a sequence of steps
    Animated.sequence([
      // start rotation in one direction (only half the time is needed)
      Animated.timing(this.animatedCreatureXValue, {
        toValue: 0.0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      // rotate in other direction, to minimum value (= twice the duration of above)
      Animated.timing(this.animatedCreatureXValue, {
        toValue: -130.0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // return to begin position
      Animated.timing(this.animatedCreatureXValue, {
        toValue: 0.0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  playerAttackAnimation = async () => {
    console.log('Animating player');
    // Animation consists of a sequence of steps

    Animated.sequence([
      // start rotation in one direction (only half the time is needed)
      Animated.timing(this.animatedPlayerXValue, {
        toValue: 0.0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      // rotate in other direction, to minimum value (= twice the duration of above)
      Animated.timing(this.animatedPlayerXValue, {
        toValue: 130.0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // return to begin position
      Animated.timing(this.animatedPlayerXValue, {
        toValue: 0.0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();




    Animated.sequence([
      // start rotation in one direction (only half the time is needed)
      Animated.timing(this.animatedRotateValue, {
        toValue: 2.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // rotate in other direction, to minimum value (= twice the duration of above)
      Animated.timing(this.animatedRotateValue, {
        toValue: -2.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // return to begin position
      Animated.timing(this.animatedRotateValue, {
        toValue: 0.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedRotateValue, {
        toValue: 2.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // rotate in other direction, to minimum value (= twice the duration of above)
      Animated.timing(this.animatedRotateValue, {
        toValue: -2.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedRotateValue, {
        toValue: 0.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedRotateValue, {
        toValue: 2.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // rotate in other direction, to minimum value (= twice the duration of above)
      Animated.timing(this.animatedRotateValue, {
        toValue: -2.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // return to begin position
      Animated.timing(this.animatedRotateValue, {
        toValue: 0.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedRotateValue, {
        toValue: 2.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // rotate in other direction, to minimum value (= twice the duration of above)
      Animated.timing(this.animatedRotateValue, {
        toValue: -2.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedRotateValue, {
        toValue: 0.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();

  };

  componentDidMount() {
    this.hasEnoughInnerPower();
    console.log(this.state.token);
  }

  componentDidUpdate() { }

  componentWillUnmount() {

  }

  //Request to the server to flee from battle
  fleeRequest = async () => {

    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    await axios
      .delete(
        localServer + 'rest/battle/' + this.state.battleState.id + '/flee', config
      )
      .then(() => this.props.navigation.pop());
  };
  //Request to the server to attack the enemy

  async attackRequest(skill) {

    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    try {
      const response = await axios.post(
        localServer + 'rest/battle/' + this.state.battleState.id + '/attack',
        skill, config
      );
      console.log(response.data);
      if (response.data === "") {

      } else
        if (response.data.battleMessage !== "Not enough ip") {
          this.setState({ battleState: response.data });
          this.setState({ isSkillDisabled: true });
          this.playerAttackAnimation();
          this.creatureTimeout = setTimeout(() => this.creatureAttack(), 1000);
          if (this.state.battleState.creature.hp <= 0) {
            this.setState({
              endBattleOverlay: true,
              arePlayerButtonDisabled: true,
              battleEnded: true,
              isSkillDisabled: true,
            });
          }
        } else {
          this.setState({ battleState: response.data })

        }
    } catch (error) {
      console.error('Player Attack request ' + error);
      this.setState({
        endBattleOverlay: true,
        arePlayerButtonDisabled: true,
        battleEnded: true,
        isSkillDisabled: true,
      });
    }

  }

  addItemToInventory = async (item) => {
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    await axios
      .post(
        localServer +
        'rest/player/' +
        this.state.battleState.player.id +
        '/addItem',
        item, config
      )
      .then((response) => {
        let idx = this.state.loot.indexOf(item);

        let newList = this.state.loot.filter((item, index) => index !== idx);
        this.setState({ loot: newList });
      })
      .catch((response) => {
        console.log(response.status);
      });
  };

  async creatureAttack() {
    if (!this.state.battleEnded) {
      try {
        const config = {
          headers: {
            'Authorization': 'Bearer  ' + this.state.token
          }
        }
        const response = await axios.get(
          localServer +
          'rest/battle/' +
          this.state.battleState.id +
          '/creatureAttack', config
        );

        if (response.data.player.playerCharacter.currentHp <= 0) {
          this.setState({
            endBattleOverlay: true,
            arePlayerButtonDisabled: true,
            battleEnded: true,
            isSkillDisabled: true,
          });
          clearTimeout(this.creatureTimeout);
        } else {
          this.creatureAttackAnimation();
          this.setState({ battleState: response.data });
          this.setState({ isSkillDisabled: false });

          clearTimeout(this.creatureTimeout);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      clearTimeout(this.creatureTimeout);
    }
  }

  //Function that goes back to previous screens
  goBack = () => {
    this.setState({ endBattleOverlay: false });
    this.props.navigation.pop();
  };

  hasEnoughInnerPower(innerPower) {
    if (innerPower === null) {
      return false;
    } else if (
      innerPower <=
      this.state.battleState.player.playerCharacter.currentInnerPower
    ) {
      return true;
    } else return false;
  }

  isAttackDisabled(innerPower) {
    if (
      this.state.battleState.currentTurn ===
      this.state.battleState.player.name &&
      this.hasEnoughInnerPower(innerPower)
    ) {
      return false;
    } else if (
      this.state.battleState.currentTurn ===
      this.state.battleState.creature.name
    ) {
      return true;
    }
  }

  endOverlay() {
    if (this.state.battleState.creature.hp <= 0) {
      return (
        <Animatable.View animation={"zoomIn"} iterationCount={1} style={{ minWidth: "60%" }}>
          <Text style={styles.endBattleText}>You won!</Text>
          <Text style={styles.endBattleText}>
            Experience gained: {this.state.battleState.creature.exp}
          </Text>
          <Text style={styles.endBattleText}>
            Gold looted: {this.state.battleState.creature.gold}
          </Text>
          <Text style={styles.endBattleText}>Loot</Text>
          <ScrollView
            fadingEdgeLength={20}
            style={{
              marginStart: '10%',
              marginEnd: '10%',
            }}>
            {this.state.loot.map((item) => (
              <ListItem
                ref={(listItem) => {
                  this.listItem = listItem;
                }}
                key={item.id}
                containerStyle={styles.listItem}
                onPress={() => this.addItemToInventory(item)}>
                <Avatar source={findImage(item.itemName)} />
                <Text style={styles.endBattleText}>{item.itemName}</Text>
              </ListItem>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={() => this.goBack()} disabled={false}>
            <Text style={{ fontSize: 22, fontFamily: 'RomanAntique' }}>
              Go back
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      );
    } else {
      return (
        <View>
          <Text style={styles.infoText}>You fainted</Text>
          <TouchableOpacity onPress={() => this.goBack()} disabled={false}>
            <Text style={{ fontSize: 22, fontFamily: 'RomanAntique' }}>
              Go back
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  skillButton = (skill) => {
    if (skill !== null) {
      return (
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <TouchableOpacity

            ref={(skillBtn) => (this.skillBtn = skillBtn)}
            style={{ flex: 1, alignItems: 'center' }}
            onPressIn={() => this.attackRequest(skill)}

            disabled={this.isAttackDisabled(skill.innerPowerConsume)}>
            <Image
              style={{
                resizeMode: 'contain',
                flex: 0.9,
              }}
              source={findSkillImage(skill.characterSkillName)}
            />
          </TouchableOpacity>
        </View>
      );
    } else
      return (
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          disabled={true}>
          <Text style={{ fontSize: 20, fontFamily: 'RomanAntique' }}>
            No skill
          </Text>
        </TouchableOpacity>
      );
  };

  buffs(battle) {
    return <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
      {battle.buffedTurnsRemainingAttack > 0 ? <Text>Att</Text> : (null)}
      {battle.buffedTurnsRemainingDefence > 0 ? <Text>Def</Text> : (null)}
      {battle.buffedTurnsRemainingMagicAttack > 0 ? <Text>M.Att</Text> : (null)}
      {battle.buffedTurnsRemainingMagicDefence > 0 ? <Text>M.Def</Text> : (null)}
    </View>
  }

  //render function
  render() {
    return (
      <ImageBackground
        style={styles.background}
        source={require('../img/backgrounds/postApocalypticTown.gif')}>
        <StatusBar animated hidden />

        <TouchableOpacity
          onPress={() => this.fleeRequest()}
          disabled={this.state.arePlayerButtonDisabled}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'RomanAntique',
              color: '#ffffff',
            }}>
            Run
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 0, backgroundColor: "#0000FF", borderColor: "#000000", borderWidth: 3 }}>
          <Text style={{ color: '#ffffff', fontSize: 22, alignSelf: 'center' }}>
            Round: {this.state.battleState.turn}
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 18, alignSelf: "center" }}>
            {this.state.battleState.battleMessage}
          </Text>
        </View>


        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          {!this.state.battleEnded ? (
            <View style={styles.playerView}>

              <View style={{ flex: 0, maxHeight: "100%", maxWidth: "100%" }}>
                <Animated.Image
                  style={{
                    flex: -1,
                    resizeMode: 'contain',
                    aspectRatio: 0.7,
                    transform: [
                      {
                        translateX: this.animatedPlayerXValue,
                      },
                      {
                        translateY: this.animatedPlayerYValue,
                      },
                    ],
                  }}
                  source={require('../img/warrior.png')}
                />
              </View>

            </View>
          ) : null}
          {!this.state.battleEnded ? (
            <View style={styles.creatureView}>
              <View style={{ flex: 0, maxHeight: "100%", maxWidth: "100%" }}>
                <Animated.Image
                  style={{
                    flex: -1,
                    aspectRatio: 0.7,
                    resizeMode: 'contain',
                    alignSelf: 'flex-end',
                    transform: [
                      {
                        rotate: this.animatedRotateValue.interpolate({
                          inputRange: [-5, 5],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                      {
                        translateX: this.animatedCreatureXValue,
                      },
                      {
                        translateY: this.animatedCreatureYValue,
                      },
                    ],
                  }}
                  source={require('../img/creatures/skeletonWarrior.png')}
                />
              </View>
            </View>


          ) : null}

        </View>
        <View style={styles.infoView}>
          <View>
            <Text style={styles.infoText}>
              {this.state.battleState.player.playerCharacter.name}
            </Text>
            <Progress.Bar style={{ marginTop: 2, alignSelf: "center" }} borderColor={"#000000"} color={"#DC143C"} height={8} width={100} animated={true}
              progress={this.state.battleState.player.playerCharacter.currentHp / this.state.battleState.player.playerCharacter.maxHp} />
            <Progress.Bar style={{ marginTop: 2, alignSelf: "center" }} borderColor={"#000000"} color={"#00008B"} height={8} width={100} animated={true}
              progress={this.state.battleState.player.playerCharacter.currentInnerPower / this.state.battleState.player.playerCharacter.maxInnerPower} />
            {this.buffs(this.state.battleState)}
          </View>
          <View>
            <Text style={styles.infoText}>
              {this.state.battleState.creature.name}
            </Text>
            <Progress.Bar style={{ marginTop: 2, alignSelf: "center" }} borderColor={"#000000"} color={"#DC143C"} height={8} width={100} animated={true}
              progress={this.state.battleState.creature.hp / this.state.creatureMaxHp} />

          </View>

        </View>
        <View style={styles.playerCommandsView}>
          {this.skillButton(
            this.state.battleState.player.playerCharacter.skill1,
          )}
          {this.skillButton(
            this.state.battleState.player.playerCharacter.skill2,
          )}
          {this.skillButton(
            this.state.battleState.player.playerCharacter.skill3,
          )}
          {this.skillButton(
            this.state.battleState.player.playerCharacter.skill4,
          )}
        </View>
        <Overlay
          onBackdropPress={() => null}
          isVisible={this.state.endBattleOverlay}
          overlayStyle={{ height: '50%' }}>
          {this.endOverlay()}
        </Overlay>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,

  },

  playerView: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: '90%',
  },
  creatureView: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: '90%',
  },

  playerCommandsView: {
    flexDirection: 'row',
    flex: 0.10,
    justifyContent: 'space-between',

  },
  infoView: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 0,
    backgroundColor: '#ffffff90',
    borderRadius: 5,
  },
  infoText: {
    alignSelf: 'center',
    fontFamily: 'RomanAntique',
  },
  endBattleText: {
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'RomanAntique',
  },

  listItem: {
    borderRadius: 5,
    backgroundColor: '#999999',
    marginBottom: '3%',
  },
});
