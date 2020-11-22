import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, { PureComponent } from 'react';
import { ListItem, Overlay, Avatar, Tooltip } from 'react-native-elements';
import axios from 'react-native-axios';
import serverService from '../services/serverService';
import findSkillImage from '../services/skillImageService.js';
import findImage from '../services/gearImageService.js';
import Icon from 'react-native-vector-icons/EvilIcons';

const localServer = serverService.localserver;

export default class CharacterSkills extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.route.params.token,

      playerInfo: this.props.route.params.playerInfo,
      skills: this.props.route.params.playerInfo.playerCharacter.characterSkills,
    };
  }

  assignSkill = async (skill, slot) => {
    console.log(this.state.token)
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
        '/assignSkill?slotNumber=' +
        slot,
        skill, config
      )
      .then((response) => {
        this.setState({ playerInfo: response.data, skills: response.data.playerCharacter.characterSkills });
      })
      .catch((response) => {
        console.log(response.status);
      });
  };

  goBack = () => {
    this.props.navigation.pop();
  };


  render() {
    return (


      <ImageBackground
        style={{ ...StyleSheet.absoluteFillObject }}
        imageStyle={{ resizeMode: 'center', resizeMode: 'stretch' }}
        source={require('../img/backgrounds/characterStatsBg.png')}>
        <Text style={styles.titleText}>Skills</Text>
        <Text style={styles.skillPointsText}>Skill Points:{" " + this.state.playerInfo.playerCharacter.skillPoints}</Text>
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
        <View style={{ flex: 1 }}>
          <ScrollView
            fadingEdgeLength={20}
            style={{
              marginStart: '10%',
              marginEnd: '10%',
              marginBottom: '10%',
              flex: 1,
            }}>
            {this.state.skills.map((skill) => (
              <ListItem
                key={skill.characterSkillName}
                containerStyle={styles.listItem}
                onPress={() => console.log('onPress pressed')}
                onLongPress={() => console.log('skill loooong press')}>
                <Avatar source={findSkillImage(skill.characterSkillName)} />
                <Tooltip
                  closeOnlyOnBackdropPress={true}
                  height={100}
                  backgroundColor="#606060"
                  containerStyle={{
                    justifyContent: 'center',
                  }}
                  popover={
                    <View>
                      <TouchableOpacity
                        onPress={() => this.assignSkill(skill, 1)}
                        disabled={false}>
                        <Text style={styles.toolTipText}>
                          Set at slot 1
                            </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.assignSkill(skill, 2)}
                        disabled={false}>
                        <Text style={styles.toolTipText}>
                          Set at slot 2
                            </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.assignSkill(skill, 3)}
                        disabled={false}>
                        <Text style={styles.toolTipText}>
                          Set at slot 3
                            </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.assignSkill(skill, 4)}
                        disabled={false}>
                        <Text style={styles.toolTipText}>
                          Set at slot 4
                            </Text>
                      </TouchableOpacity>
                    </View>
                  }>
                  <ListItem.Content>
                    <ListItem.Title style={styles.itemNameText}>
                      {skill.characterSkillName}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.itemSubtitleText}>
                      {skill.skillDescription}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </Tooltip>
              </ListItem>
            ))}
          </ScrollView>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '75%',
                height: '35%',
                alignSelf: 'center',
              }}>
              {this.state.playerInfo.playerCharacter.skill1 ===
                null ? (
                  <View>
                    <Text style={styles.skillText}>Skill 1</Text>
                    <Text style={styles.skillText}>Empty</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.skillText}>Skill 1</Text>
                    <Image
                      style={styles.skillImage}
                      source={findSkillImage(
                        this.state.playerInfo.playerCharacter.skill1
                          .characterSkillName,
                      )}
                    />
                  </View>
                )}

              {this.state.playerInfo.playerCharacter.skill2 ===
                null ? (
                  <View>
                    <Text style={styles.skillText}>Skill 2</Text>
                    <Text style={styles.skillText}>Empty</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.skillText}>Skill 2</Text>
                    <Image
                      style={styles.skillImage}
                      source={findSkillImage(
                        this.state.playerInfo.playerCharacter.skill2
                          .characterSkillName,
                      )}
                    />
                  </View>
                )}
              {this.state.playerInfo.playerCharacter.skill3 ===
                null ? (
                  <View>
                    <Text style={styles.skillText}>Skill 3</Text>
                    <Text style={styles.skillText}>Empty</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.skillText}>Skill 3</Text>
                    <Image
                      style={styles.skillImage}
                      source={findSkillImage(
                        this.state.playerInfo.playerCharacter.skill3
                          .characterSkillName,
                      )}
                    />
                  </View>
                )}
              {this.state.playerInfo.playerCharacter.skill4 ===
                null ? (
                  <View>
                    <Text style={styles.skillText}>Skill 4</Text>
                    <Text style={styles.skillText}>Empty</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.skillText}>Skill 4</Text>
                    <Image
                      style={styles.skillImage}
                      source={findSkillImage(
                        this.state.playerInfo.playerCharacter.skill4
                          .characterSkillName,
                      )}
                    />
                  </View>
                )}
            </View>
          </View>
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
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 26,
    alignSelf: 'center',
    color: '#F0F8FF',
  },
  skillPointsText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 24,
    alignSelf: "flex-start",
    marginStart: "10%",
    color: '#F0F8FF',
  },
  itemNameText: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 22,
  },
  toolTipText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 18,
    color: '#ffffff',
  },
  itemSubtitleText: {
    maxWidth: "90%",
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 16,
    color: '#ffffff',
  },
  skillText: {
    alignSelf: 'center',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 16,
  },
  skillImage: {
    resizeMode: 'contain',
    flex: 0,
    width: '110%',
    height: '110%',
    alignSelf: 'center',
  },
});
