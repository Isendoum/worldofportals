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
import { ListItem, Overlay, Avatar } from 'react-native-elements';
import axios from 'react-native-axios';
import serverService from '../services/serverService';
import findImage from '../services/gearImageService.js';
import findGearItem from '../services/gearItemService.js';
import Icon from 'react-native-vector-icons/EvilIcons';
import _ from 'lodash';



const localServer = serverService.localserver;

export default class CharacterInventory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.route.params.token,
      playerInfo: this.props.route.params.playerInfo,
      inventory: this.props.route.params.playerInfo.playerCharacter.inventory,
      itemInfo: null,
      action: null,
      isOverlayVisible: false,

    };
  }



  removeItemAndUpdatePlayerState = async (item) => {
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    await axios
      .post(
        localServer +
        'rest/player/' +
        this.state.playerInfo.id +
        '/removeItem',
        item, config
      )
      .then((response) =>
        this.setState({
          playerInfo: response.data,
          inventory: response.data.playerCharacter.inventory,
          itemInfo: null
        }),
      )
      .catch((response) => {
        console.log(response.status);
      });
  };

  useItemAndUpdatePlayerState = async (item) => {
    const config = {
      headers: {
        'Authorization': 'Bearer  ' + this.state.token
      }
    }
    await axios
      .post(
        localServer + 'rest/player/' + this.state.playerInfo.id + '/useItem',
        item, config
      )
      .then((response) => {
        if (!_.isEqual(this.state.inventory, response.data.playerCharacter.inventory)) {
          this.setState({
            playerInfo: response.data,
            inventory: response.data.playerCharacter.inventory,
            itemInfo: null
          });
        } else { Alert.alert("Level requirement not met.") }
      },
      )
      .catch((response) => {
        console.log(response.status);
      });
  };

  closeOverlay = () => {
    this.setState({ action: null, isOverlayVisible: false })
  }

  useAndDiscardOverlay = (item) => {

    if (this.state.action === "use") {
      return <Overlay onBackdropPress={this.closeOverlay} isVisible={this.state.isOverlayVisible}>
        <View>
          <Text>Use {item.itemName}?</Text>
          <View style={{ flex: 0, flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={this.closeOverlay}><Text>cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { this.useItemAndUpdatePlayerState(item); this.closeOverlay() }}><Text>use</Text></TouchableOpacity>
          </View>
        </View>
      </Overlay>

    } else if (this.state.action === "equip") {
      const equipedItem = findGearItem(item.itemType, this.state.playerInfo.playerCharacter.gear)
      return <Overlay onBackdropPress={this.closeOverlay} isVisible={this.state.isOverlayVisible} >
        <View>
          <Text style={styles.overlayQuestion}>Equip {item.itemName}?</Text>
          <Text style={styles.overlayText}>{item.attackModifier - equipedItem.attackModifier} Attack </Text>
          <Text style={styles.overlayText}>{item.hpModifier - equipedItem.hpModifier} Hp </Text>
          <Text style={styles.overlayText}>{item.defenceModifier - equipedItem.defenceModifier} Defence </Text>
          <Text style={styles.overlayText}>{item.magicAttackModifier - equipedItem.magicAttackModifier} M.Attack </Text>
          <Text style={styles.overlayText}>{item.magicDefenceModifier - equipedItem.magicDefenceModifier} M.Defence </Text>
          <View style={{ flex: 0, flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={this.closeOverlay}><Text style={styles.equipDiscardText}>cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { this.useItemAndUpdatePlayerState(item); this.closeOverlay() }}><Text style={styles.equipDiscardText}>equip</Text></TouchableOpacity>
          </View>
        </View>
      </Overlay>
    }
    else {
      return <Overlay onBackdropPress={this.closeOverlay} isVisible={this.state.isOverlayVisible} >
        <View>
          <Text>Discard {item.itemName}?</Text>
          <View style={{ flex: 0, flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={this.closeOverlay}><Text style={styles.equipDiscardText}>cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { this.removeItemAndUpdatePlayerState(item); this.closeOverlay() }}><Text style={styles.equipDiscardText}>discard</Text></TouchableOpacity>
          </View>
        </View>
      </Overlay>
    }

  }

  //pops current screen from the stack
  goBack = () => {
    this.props.navigation.pop();
  };
  //returns item info jsx element
  itemInfo = () => {
    if (this.state.itemInfo === null) {
      return <View><Text>no item selected</Text></View>
    } else { return this.itemInfoBasedOnItemType(this.state.itemInfo) }
  }
  //sets the itemInfo jsx element by passing clicked item
  setItemInfoState = (item) => {
    this.setState({ itemInfo: item })
  }
  //returns a jsx element based on type
  itemInfoBasedOnItemType = (item) => {
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
        <View style={styles.listItemContent}>
          <Text style={styles.itemNameText}>
            {item.itemName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.itemSubtitleText}>{item.hpModifier} Hp</Text>
              <Text style={styles.itemSubtitleText}>
                {item.attackModifier} Att.
              </Text>
              <Text style={styles.itemSubtitleText}>
                {item.defenceModifier} Def
              </Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.itemSubtitleText}>
                {item.magicAttackModifier} M. Att.
              </Text>
              <Text style={styles.itemSubtitleText}>
                {item.magicDefenceModifier} M. Def.
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={styles.itemSubtitleText}>
              Lvl required: {item.levelRequired}
            </Text>
            <Text style={styles.itemSubtitleText}>
              Sell value: {item.goldValue} g.
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={() => this.setState({ isOverlayVisible: true, action: "discard" })}>
              <Text style={styles.equipDiscardText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ isOverlayVisible: true, action: "equip" })}>
              <Text style={styles.equipDiscardText}>Equip</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.listItemContent}>
          <Text style={styles.itemNameText}>
            {item.itemName} x{item.quantity}
          </Text>
          <Text style={styles.itemSubtitleText}>
            {item.itemAbility.abilityDescription}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={() => this.setState({ isOverlayVisible: true, action: "discard" })}>
              <Text style={styles.EquipDiscardText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ isOverlayVisible: true, action: "use" })}>
              <Text style={styles.EquipDiscardText}>Use</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <ImageBackground
        style={{ ...StyleSheet.absoluteFillObject }}
        imageStyle={{ resizeMode: 'center', resizeMode: 'stretch' }}
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
        <Text style={styles.titleText}>
          Inventory ({this.state.inventory.length}/20)
            </Text>

        <ScrollView
          fadingEdgeLength={20}
          style={{
            marginStart: '10%',
            marginEnd: '10%',
            marginBottom: '10%',
          }}>
          {this.state.inventory.map((item) => (
            <ListItem
              key={item.id}
              containerStyle={styles.listItem}
              onPress={() => this.setItemInfoState(item)}>
              <Avatar source={findImage(item.itemName)} />
              <ListItem.Title style={styles.itemNameText}>
                {item.itemName}{item.itemType === "CONSUMABLE" ? (<Text> x{item.quantity}</Text>) : (null)}
              </ListItem.Title>

            </ListItem>
          ))}
        </ScrollView>
        {this.state.itemInfo !== null ? (this.useAndDiscardOverlay(this.state.itemInfo)) : (null)}
        <View
          style={{
            flexDirection: 'column',
            width: '75%',
            height: '45%',
            alignSelf: 'center',
          }}>
          {this.itemInfo()}
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
  listItem: {
    borderRadius: 5,
    backgroundColor: '#999999',
    marginBottom: '3%',
  },
  listItemContent: {},
  titleText: {
    fontFamily: 'FFFTusj',
    fontSize: 24,
    alignSelf: 'center',
    color: '#F0F8FF',
  },
  itemNameText: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 20,
  },
  itemSubtitleText: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 18,
    color: '#ffffff',
  },
  equipDiscardText: {
    flexDirection: 'column',
    fontFamily: 'FFFTusj',
    fontSize: 18,
    color: '#000000',
  },
  overlayQuestion: {
    flexDirection: 'column',
    fontFamily: 'GranthamRoman',
    fontSize: 18,
    color: '#000000',
  },
  overlayText: {
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
