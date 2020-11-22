import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import * as Animatable from "react-native-animatable";
import axios from 'react-native-axios';
import serverService from '../services/serverService';
import * as Progress from 'react-native-progress';
const localServer = serverService.localserver;

const { height, width } = Dimensions.get('window');

export default class MapUi extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token,
      questAnimationIterations: 1,

    };
    this.questAnimation = null;
  }

  goToCharacterScreen = async () => {
    this.props.triggerScreenChange();
    this.props.nav.push('CharacterInfo', this.props.playerInfo)
  }
  goToSkillsScreen = async () => {
    this.props.triggerScreenChange();
    this.props.nav.push('CharacterSkills', { token: this.state.token, playerInfo: this.props.playerInfo })
  }

  goToInventoryScreen = async () => {
    this.props.triggerScreenChange();
    this.props.nav.push('CharacterInventory', { token: this.state.token, playerInfo: this.props.playerInfo })
  }

  goToQuestsScreen = async () => {
    this.props.triggerScreenChange();
    this.props.nav.push('CharacterQuests', { token: this.state.token, playerInfo: this.props.playerInfo })
  }

  componentDidMount() {
    this.updateQuestImageAnimationIterationsIfQuestIsCompleted();
  }

  componentWillUnmount() {

  }
  updateQuestImageAnimationIterationsIfQuestIsCompleted() {
    let isAnyQuestCompleted = false;
    if (this.props.playerInfo.playerCharacter.questList.length !== 0) {
      this.props.playerInfo.playerCharacter.questList.map(quest => {
        if (quest.questCompleted) {
          isAnyQuestCompleted = true;
        }
      });
      if (!isAnyQuestCompleted) {
        this.questAnimation.stopAnimation();
      }
    } else {
      this.questAnimation.stopAnimation();
    }

  }

  render() {
    return (
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <View style={styles.bottomView}>

          <View style={{ flex: 0, flexDirection: "column", alignSelf: "flex-end" }}>


            <TouchableOpacity
              style={styles.playerView}
              onPress={this.goToCharacterScreen}>

              <Text style={styles.playerBoxText}>
                Lvl:{" " + this.props.playerInfo.playerCharacter.level + " " + this.props.playerInfo.playerCharacter.name}
              </Text>
              <Progress.Bar style={{ marginTop: 2, alignSelf: "center" }} borderColor={"#000000"} color={"#DC143C"} height={10} width={135} animated={true} progress={this.props.playerInfo.playerCharacter.currentHp / this.props.playerInfo.playerCharacter.maxHp} />
              <Progress.Bar style={{ marginTop: 2, alignSelf: "center" }} borderColor={"#000000"} color={"#00008B"} height={10} width={135} animated={true} progress={this.props.playerInfo.playerCharacter.currentInnerPower / this.props.playerInfo.playerCharacter.maxInnerPower} />

              <Text style={styles.playerBoxText}>
                Gold: {this.props.playerInfo.playerCharacter.gold}
              </Text>


            </TouchableOpacity>

          </View>

          <View style={styles.playerMenuView}>
            <TouchableOpacity onPress={this.goToQuestsScreen}>
              <Animatable.Image
                ref={questAnimation => this.questAnimation = questAnimation}

                iterationCount={"infinite"}
                animation={"shake"}
                direction={"normal"}
                style={styles.inventoryImage}
                source={require('../img/ui/quest.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.goToSkillsScreen}>
              <Image
                style={styles.inventoryImage}
                source={require('../img/ui/tome.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.goToInventoryScreen}>
              <Image
                style={styles.inventoryImage}
                source={require('../img/ui/backpack.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

Animatable.initializeRegistryWithDefinitions({

  myFancyAnimation: {

    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  }
});
const styles = StyleSheet.create({
  bottomView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  playerView: {
    flex: -0,

  },
  playerBoxText: {
    alignSelf: 'center',
    flex: 0,
    marginTop: 4,
    fontSize: 18,
    fontFamily: 'RomanAntique',
    color: "#ffffff",
    textShadowColor: "#000000",
    textShadowRadius: 5,
    textShadowOffset: { width: 0, height: 2 }

  },
  playerMenuView: {
    flex: 0,
    justifyContent: 'flex-end',
    flexDirection: "row",
  },
  inventoryImage: {
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
