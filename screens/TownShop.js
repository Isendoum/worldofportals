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
import Icon from 'react-native-vector-icons/EvilIcons';
import findImage from '../services/gearImageService.js';

const localServer = serverService.localserver;

const INTERVAL = 5000;

export default class TownShop extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: this.props.route.params.token,
      shopInfo: {},
      playerInfo: this.props.route.params.playerInfo,
      inventory: this.props.route.params.playerInfo.playerCharacter.inventory,
      currentView: [],
      currentViewType: 'shop',
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
        localServer + 'rest/town/askTownShop',
        config
      );

      this.setState({ shopInfo: response.data });
      console.log(this.state.shopInfo)
    } catch (error) {
      console.log(error);
    }

  }

  componentDidMount() {
    this.getTownShopAndSetShopInfoState();
  }

  componentWillUnmount() { }

  //Request to the server to flee from battle

  //Request to the server to attack the enemy

  buyItemFromShop = async (item) => {
    let wrappedObj = {
      player: this.state.playerInfo,
      itemId: item.id,
    };

    try {
      const config = {
        headers: {
          'Authorization': 'Bearer  ' + this.state.token
        }
      }
      const response = await axios.post(
        localServer + 'rest/town/townShop/buy',
        wrappedObj, config
      );

      this.setState({ playerInfo: response.data, inventory: response.data.playerCharacter.inventory });

    } catch (error) {
      console.log(error);
    }
  };

  sellItemToShop = async (item) => {
    let wrappedObj = {
      player: this.state.playerInfo,
      item: item,
    };
    try {
      const config = {
        headers: {
          'Authorization': 'Bearer  ' + this.state.token
        }
      }
      const response = await axios.post(
        localServer + 'rest/town/townShop/sell',
        wrappedObj, config
      );

      this.setState({ playerInfo: response.data, currentView: response.data.playerCharacter.inventory, inventory: response.data.playerCharacter.inventory });

    } catch (error) {
      console.log(error);
    }
  };

  //Function that goes back to previous screen
  goBack = () => {
    this.props.navigation.pop();
  };

  listItemSubTitleBasedOnItemType = (item) => {
    if (
      item.itemType === 'PANTS' ||
      item.itemType === 'BOOTS' ||
      item.itemType === 'HELMET' ||
      item.itemType === 'CHEST' ||
      item.itemType === 'SHOULDERS' ||
      item.itemType === 'GLOVES' ||
      item.itemType === 'WEAPON' ||
      item.itemType === 'AMULET' ||
      item.itemType === 'RING' ||
      item.itemType === 'OFFHAND'
    ) {
      return (
        <ListItem.Content style={styles.listItemContent}>
          <ListItem.Title style={styles.itemNameText}>
            {item.itemName}
          </ListItem.Title>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View style={{ flexDirection: 'column' }}>
              <ListItem.Subtitle style={styles.itemSubtitleText}>
                +{item.hpModifier} Hp
              </ListItem.Subtitle>
              <ListItem.Subtitle style={styles.itemSubtitleText}>
                +{item.attackModifier} Att.
              </ListItem.Subtitle>
              <ListItem.Subtitle style={styles.itemSubtitleText}>
                +{item.defenceModifier} Def.
              </ListItem.Subtitle>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <ListItem.Subtitle style={styles.itemSubtitleText}>
                +{item.magicAttackModifier} M. Att.
              </ListItem.Subtitle>
              <ListItem.Subtitle style={styles.itemSubtitleText}>
                +{item.magicDefenceModifier} M. Def.
              </ListItem.Subtitle>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <ListItem.Subtitle style={styles.itemSubtitleText}>
              Lvl required: {item.levelRequired}
            </ListItem.Subtitle>
            <ListItem.Subtitle style={styles.itemSubtitleText}>
              Sell value: {item.goldValue} g.
            </ListItem.Subtitle>
          </View>
        </ListItem.Content>
      );
    } else {
      return (
        <ListItem.Content style={styles.listItemContent}>
          <ListItem.Title style={styles.itemNameText}>
            {item.itemName} x{item.quantity}
          </ListItem.Title>
          <ListItem.Subtitle style={styles.itemSubtitleText}>
            {item.itemAbility.abilityDescription}
          </ListItem.Subtitle>
        </ListItem.Content>
      );
    }
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
        <Text style={styles.innTitle}>Soloman's Goods</Text>
        <Text style={styles.innTitle}>Gold:{" " + this.state.playerInfo.playerCharacter.gold}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: '5%',
          }}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                currentView: this.state.shopInfo.shopList,
                currentViewType: 'shop',
              })
            }>
            <Text style={styles.itemNameText}>Buy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.setState({
                currentView: this.state.inventory,
                currentViewType: 'inventory',
              })
            }>
            <Text style={styles.itemNameText}>Sell</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          fadingEdgeLength={20}
          style={{
            marginStart: '10%',
            marginEnd: '10%',
            maxHeight: '45%',
            marginTop: '3%',
          }}>
          {this.state.currentViewType === 'shop'
            ? this.state.currentView.map((item) => (
              <ListItem
                key={item.id}
                containerStyle={styles.listItem}
                onPress={() => this.buyItemFromShop(item)}
                onLongPress={() => console.log('long press pressed')}>
                <Avatar source={findImage(item.itemName)} />
                {this.listItemSubTitleBasedOnItemType(item)}
              </ListItem>
            ))
            : this.state.currentView.map((item) => (
              <ListItem
                key={item.id}
                containerStyle={styles.listItem}
                onPress={() => this.sellItemToShop(item)}
                onLongPress={() => console.log('long press pressed')}>
                <Avatar source={findImage(item.itemName)} />
                {this.listItemSubTitleBasedOnItemType(item)}
              </ListItem>
            ))}
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
    fontFamily: 'RomanAntique',
    fontSize: 26,
    alignSelf: 'center',
    color: '#F0F8FF',
  },
  innTitle: {

    fontFamily: 'RomanAntique',
    fontSize: 28,
    alignSelf: "center",
    color: '#F0F8FF',
  },
  innerkeeperText: {
    fontFamily: 'RomanAntique',
    fontSize: 20,
    alignSelf: 'center',
    color: '#F0F8FF',
  },
  itemNameText: {
    flexDirection: 'column',
    fontFamily: 'RomanAntique',
    fontSize: 22,
  },
  itemSubtitleText: {
    flexDirection: 'column',
    fontFamily: 'RomanAntique',
    fontSize: 18,
    color: '#ffffff',
  },
  bottomSheetButton: {
    fontSize: 20,
    fontFamily: 'RomanAntique',

    color: '#ffffff',
  },
});
