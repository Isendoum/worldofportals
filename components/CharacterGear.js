import React, { PureComponent } from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Image,
} from 'react-native';
import { Tooltip } from 'react-native-elements';

import findImage from '../services/gearImageService.js';

export default class CharacterGear extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      characterInfo: this.props.characterInfo,
    };
  }

  componentDidUpdate() {
    console.log("character gear updated")
    this.gearView
  }
  componentWillUnmount() {
    this.tooltip
    this.gearView
  }

  gearView = (item) => {

    return (
      <View style={styles.itemGearView}>
        {item.itemName === null ? (
          <Text style={styles.text}>Empty</Text>
        ) : (
            <Tooltip
              ref={((tooltip) => this.tooltip = tooltip)}
              height={150}
              backgroundColor="#606060"
              containerStyle={{
                justifyContent: 'center',
              }}
              popover={
                <View>
                  <Text style={styles.text}>{item.itemName}</Text>
                  <Text style={styles.text}>Hp: {item.hpModifier}</Text>
                  <Text style={styles.text}>Attack: {item.attackModifier}</Text>
                  <Text style={styles.text}>Defence: {item.defenceModifier}</Text>
                  <Text style={styles.text}>
                    M. Attack: {item.magicAttackModifier}
                  </Text>
                  <Text style={styles.text}>
                    M. Defence: {item.magicDefenceModifier}
                  </Text>
                  <Text style={styles.text}>Lvl req: {item.levelRequired}</Text>
                </View>
              }>
              <Image style={styles.itemImage} source={findImage(item.itemName)} />
            </Tooltip>
          )}
      </View>
    );

  };


  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', maxHeight: height / 2, justifyContent: "space-between" }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignContent: "center",


          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
            }}>
            <Text style={styles.text}>Helmet</Text>
            {this.gearView(this.props.characterInfo.gear.helmet)}

            <Text style={styles.text}>Chest</Text>
            {this.gearView(this.props.characterInfo.gear.chest)}

            <Text style={styles.text}>Gloves</Text>
            {this.gearView(this.props.characterInfo.gear.gloves)}

            <Text style={styles.text}>Pants</Text>
            {this.gearView(this.props.characterInfo.gear.pants)}
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',

            }}>

            <Image style={{ resizeMode: "contain", flex: 1, maxWidth: "100%" }} source={require('../img/warrior.png')} />
            <View
              style={{
                flex: 0.3,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',

                }}>
                <Text style={styles.text}>Weapon</Text>
                {this.gearView(this.props.characterInfo.gear.weapon)}
              </View>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={styles.text}>Off-Hand</Text>
                {this.gearView(this.props.characterInfo.gear.offHand)}
              </View>
            </View>
          </View>

          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.text}>Shoulders</Text>
            {this.gearView(this.props.characterInfo.gear.shoulders)}

            <Text style={styles.text}>Boots</Text>
            {this.gearView(this.props.characterInfo.gear.boots)}

            <Text style={styles.text}>Amulet</Text>
            {this.gearView(this.props.characterInfo.gear.amulet)}

            <Text style={styles.text}>Ring 1</Text>
            {this.gearView(this.props.characterInfo.gear.ring1)}

            <Text style={styles.text}>Ring 2</Text>
            {this.gearView(this.props.characterInfo.gear.ring2)}
          </View>
        </View>
      </View>
    );
  }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  itemGearView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    borderColor: '#000000',
    borderRadius: 5,
    marginBottom: '5%',
  },
  itemImage: {
    flex: 1,

    resizeMode: 'contain',
  },

  text: {
    flexDirection: 'column',
    fontFamily: 'RomanAntique',
    fontSize: 13,
    color: '#F0F8FF',
    alignSelf: 'center',
  },
});
