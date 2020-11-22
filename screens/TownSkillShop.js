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
  Alert,
} from 'react-native';
import axios from 'react-native-axios';
import { ListItem, Overlay, Avatar } from 'react-native-elements';
import _ from 'lodash';
import serverService from '../services/serverService';
import Icon from 'react-native-vector-icons/EvilIcons';
import findImage from '../services/gearImageService.js';
import findSkillImage from '../services/skillImageService.js';

const localServer = serverService.localserver;

const INTERVAL = 5000;

export default class TownSkillShop extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: this.props.route.params.token,
      shopInfo: [],
      playerInfo: this.props.route.params.playerInfo,

    };

    // Set up touch handlers

    // Bind component methods
  }

  async getTownShopAndSetShopInfoState() {
    try {
      const config = {
        headers: {
          'Authorization': 'Bearer  ' + this.state.token
        }
      }
      const response = await axios.get(
        localServer + 'rest/town/askTownSkillShop',
        config
      );

      this.setState({ shopInfo: response.data.skills });

    } catch (error) {
      console.log(error);
    }

  }
  listItemSubTitleBasedOnItemType = (item) => {
    return (
      <ListItem.Content style={styles.listItemContent}>
        <ListItem.Title style={styles.itemNameText}>
          {item.characterSkillName}
        </ListItem.Title>
        <ListItem.Subtitle style={styles.itemSubtitleText}>
          {item.skillDescription}
        </ListItem.Subtitle>
        <ListItem.Subtitle style={styles.itemSubtitleText}>
          Crystals cost:{" " + item.crystalCost}
        </ListItem.Subtitle>
      </ListItem.Content>
    );

  };

  componentDidMount() {
    this.getTownShopAndSetShopInfoState();
  }

  componentWillUnmount() { }

  //Request to the server to flee from battle

  //Request to the server to attack the enemy

  buyItemFromShop = async (item) => {

    try {
      const config = {
        headers: {
          'Authorization': 'Bearer  ' + this.state.token
        }
      }
      const response = await axios.post(
        localServer + 'rest/town/townSkillShop/buySkill/' + this.state.playerInfo.id + "/" + item.characterSkillName, null,
        config
      );
      console.log(response.data)
      if (response.data !== "") {
        this.setState({ playerInfo: response.data });
      } else {
        Alert.alert("You already have that power or not enough crystals.")
      }


    } catch (error) {
      console.log(error);
    }
  };


  //Function that goes back to previous screen
  goBack = () => {
    this.props.navigation.pop();
  };



  //render function
  render() {
    return (
      <ImageBackground
        style={{ ...StyleSheet.absoluteFillObject, maxHeight: height }}
        imageStyle={{ resizeMode: 'stretch' }}
        source={require('../img/backgrounds/characterStatsBg.png')}>
        <Icon
          style={{
            alignSelf: 'flex-end',
            paddingTop: 5,
            marginBottom: 2,
            marginEnd: '10%',
          }}
          reverse={true}
          name="arrow-left"
          color="#F0F8FF"
          size={40}
          onPress={this.goBack}
        />
        <Text style={styles.innTitle}>Inner Powers</Text>
        <Text style={styles.innTitle}>Skill Points:{" " + this.state.playerInfo.playerCharacter.skillPoints}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: '5%',
          }}>


        </View>
        <ScrollView
          fadingEdgeLength={20}
          style={{
            marginStart: '10%',
            marginEnd: '10%',
            maxHeight: '45%',
            marginTop: '3%',
          }}>
          {this.state.shopInfo !== {} ?
            this.state.shopInfo.map((item) => (
              <ListItem
                key={item.characterSkillName}
                containerStyle={styles.listItem}
                onPress={() => this.buyItemFromShop(item)}
                onLongPress={() => console.log('long press pressed')}>
                <Avatar source={findSkillImage(item.characterSkillName)} />
                {this.listItemSubTitleBasedOnItemType(item)}
              </ListItem>
            )) : (null)
          }
        </ScrollView>
        <View style={{ flexDirection: 'column', width: '100%', height: '30%', flex: 0, alignSelf: "flex-end" }}>
          <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-around" }}>
            <Image
              style={{
                resizeMode: "stretch",
                height: '100%',
                width: '35%',

                flexDirection: "column"
              }}
              source={require('../img/npc/innkeeper.png')}
            />
            <Text style={styles.innerkeeperText}>Welcome traveler</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  listItem: {
    flex: 0,
    borderRadius: 5,
    backgroundColor: '#999999',
    marginBottom: '3%',
  },
  listItemContent: {},
  titleText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 18,
    alignSelf: 'center',
    color: '#F0F8FF',
  },
  innTitle: {

    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 26,
    alignSelf: "center",
    color: '#F0F8FF',
  },
  innerkeeperText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 20,
    alignSelf: 'center',
    color: '#F0F8FF',
  },
  itemNameText: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 17,
  },
  itemSubtitleText: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 15,
    color: '#ffffff',
  },
  bottomSheetButton: {
    fontSize: 20,
    fontFamily: 'RomanAntique',

    color: '#ffffff',
  },
});
