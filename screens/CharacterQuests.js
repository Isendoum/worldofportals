import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Alert,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, { PureComponent } from 'react';
import { ListItem, Overlay, Button } from 'react-native-elements';
import axios from 'react-native-axios';
import serverService from '../services/serverService';
import findImage from '../services/gearImageService.js';

const localServer = serverService.localserver;

export default class CharacterQuests extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.route.params.token,
      playerInfo: this.props.route.params.playerInfo,
      questList: this.props.route.params.playerInfo.playerCharacter.questList,
      questInfo: null,
    };
  }


  getQuest = async () => {
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    try {
      const response = await axios
        .get(
          localServer +
          'rest/player/' +
          this.state.playerInfo.id +
          '/askQuest',
          config
        )
      this.setState({ questList: response.data.playerCharacter.questList })
    }
    catch (error) {
      console.log("Error getting quest " + response.status);
    }

  };

  completeQuest = async () => {

    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    await axios
      .get(
        localServer +
        'rest/player/' +
        this.state.playerInfo.id +
        '/completeQuest/' + this.state.questInfo.id,
        config
      )
      .then((response) =>
        this.setState({
          questList: response.data.playerCharacter.questList,
          questInfo: null
        }),
      )
      .catch((response) => {
        console.log(response.status);
      });
  };

  abandonQuest = async () => {

    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    await axios
      .get(
        localServer +
        'rest/player/' +
        this.state.playerInfo.id +
        '/abandonQuest/' + this.state.questInfo.id,
        config
      )
      .then((response) =>
        this.setState({

          questList: response.data.playerCharacter.questList,
          questInfo: null
        }),
      )
      .catch((response) => {
        console.log(response.status);
      });
  };

  createTwoButtonAlert = (quest) => {
    Alert.alert(
      quest.questName,
      'Use ' + quest.questName + '?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.usequestAndUpdatePlayerState(quest) },
      ],
      { cancelable: false },
    );
  };

  questInfoView = () => {
    if (this.state.questInfo === null) {
      return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No quest selected</Text>
      </View>
    }
    else {


      return (<ScrollView style={{ flex: 0, flexDirection: "column", maxHeight: "75%" }}>
        <Text style={styles.questNameText}>{this.state.questInfo.name}</Text>
        <Text style={styles.questDescriptionText}>{this.state.questInfo.description}</Text>
        {this.state.questInfo.objectiveList.map((objective) =>
          (
            <View key={objective.description}>
              <Text style={styles.questDescriptionText}>{objective.description}{": "}{objective.tasksDone}/{objective.maxTasks}</Text>
            </View>
          ))}
        <Text style={styles.questDescriptionText}>Rewards</Text>
        <Text style={styles.questDescriptionText}>Exp: {this.state.questInfo.exp}</Text>
        <Text style={styles.questDescriptionText}>Gold: {this.state.questInfo.gold}</Text>
        <View style={{ flex: 0, flexDirection: "row", justifyContent: "space-between", marginTop: "4%" }}>
          <TouchableOpacity onPress={this.abandonQuest} style={{ flex: 0, borderWidth: 2, borderRadius: 4 }}>
            <Text style={styles.questDescriptionText}>Abandon</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 0, borderWidth: 2, borderRadius: 4 }} onPress={this.completeQuest} disabled={!this.state.questInfo.questCompleted}>
            <Text style={styles.questDescriptionText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>)
    }
  }

  changeQuestInfoState = (quest) => {
    this.setState({ questInfo: quest });
  }


  componentWillUnmount() {
  }

  render() {
    return (


      <ImageBackground
        style={{ ...StyleSheet.absoluteFillObject }}
        imageStyle={{ resizeMode: 'center', resizeMode: 'stretch' }}
        source={require('../img/backgrounds/characterStatsBg.png')}>
        <Text style={styles.titleText}>
          Quests ({this.state.playerInfo.playerCharacter.questList.length}/20)
            </Text>

        <ScrollView
          fadingEdgeLength={20}
          style={{
            marginStart: '10%',
            marginEnd: '10%',
            marginBottom: '10%',
          }}>
          {this.state.questList.map((quest) =>
            (
              <ListItem
                key={quest.id}
                containerStyle={styles.listquest}
                onPress={() => this.changeQuestInfoState(quest)}
                onLongPress={() => console.log("long press")}>
                <ListItem.Title style={styles.questTitleOnListText}>
                  {quest.name} {quest.questCompleted ? <Text style={{ color: "#FFA500" }}>COMPLETED</Text> : (null)}
                </ListItem.Title>
              </ListItem>
            ))}
        </ScrollView>
        <View
          style={{
            flexDirection: 'column',

            width: '75%',
            height: '45%',
            alignSelf: 'center',
          }}>
          <Button title={"get quest"} onPress={this.getQuest} />
          {this.questInfoView()}
        </View>
      </ImageBackground>

    );
  }
}
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  overlay: {
    borderRadius: 5,
    backgroundColor: '#FFF8DC',
    alignSelf: 'center',
  },
  listquest: {
    borderRadius: 5,
    backgroundColor: '#999999',
    marginBottom: '3%',
  },
  listquestContent: {},
  screenNameText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 20,
    alignSelf: 'center',
    color: '#ffffff',
  },
  titleText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 24,
    alignSelf: 'center',
    color: '#ffffff',
  },
  questNameText: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 22,
    color: "#000000"
  },
  questTitleOnListText: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 20,
    color: "#000000"
  },
  questDescriptionText: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 18,
    color: '#000000',
  },
  bottomSheetButton: {
    fontSize: 20,
    fontFamily: 'RomanAntique',

    color: '#ffffff',
  },
});
