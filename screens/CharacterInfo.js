import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, { PureComponent } from 'react';


import Icon from 'react-native-vector-icons/EvilIcons';
import CharacterGear from '../components/CharacterGear';

export default class CharacterInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playerInfo: this.props.route.params,
      currentView:"statistics"
    };
  }

  goBack = () => {
    this.props.navigation.pop();
  };
  
  setCurrentViewSate(view){
    this.setState({currentView:view})
  }

  componentDidUpdate(){
    
    
    
  }
  changeCurrentViewState(){
    if(this.state.currentView==="statistics"){
      return <View>
        <View style={styles.nameView}>
      <Text style={styles.nameText}>
        {this.state.playerInfo.playerCharacter.name}
      </Text>

      <Text style={styles.nameText}>
        Lvl: {this.state.playerInfo.playerCharacter.level}
      </Text>
    </View>
    <View>
      <Text style={styles.inBetweenText}>Character Info</Text>
    </View>

    <View style={styles.columnView}>
      
        <Text style={styles.text}>
          Race: {this.state.playerInfo.playerCharacter.characterRace.raceName}
        </Text>

        <Text style={styles.text}>
          Exp: {this.state.playerInfo.playerCharacter.exp}/{this.state.playerInfo.playerCharacter.expRequired}
        </Text>
      

      
        <Text style={styles.text}>
          Hp: {this.state.playerInfo.playerCharacter.currentHp}/
          {this.state.playerInfo.playerCharacter.maxHp}
        </Text>
        <Text style={styles.text}>
          {this.state.playerInfo.playerCharacter.resourceName + ': '}
          {this.state.playerInfo.playerCharacter.currentInnerPower}/
          {this.state.playerInfo.playerCharacter.maxInnerPower}
        </Text>
      
    </View>
    <View>
      <Text style={styles.inBetweenText}>Stats</Text>
    </View>

    
      <View style={styles.columnView}>
        <Text style={styles.text}>
          Attack: {this.state.playerInfo.playerCharacter.attack}
        </Text>
        <Text style={styles.text}>
          Defence: {this.state.playerInfo.playerCharacter.defence}
        </Text>
        <Text style={styles.text}>
          M.Attack: {this.state.playerInfo.playerCharacter.magicAttack}
        </Text>
        <Text style={styles.text}>
          M.Defence: {this.state.playerInfo.playerCharacter.magicDefence}
        </Text>
      </View>
    
    <View>
      <Text style={styles.inBetweenText}>Career</Text>
    </View>
    
      <View style={styles.careerColumnView}>
        <Text style={styles.text}>
          Distance traveled(km): {(this.state.playerInfo.career.distanceTraveled/1000).toPrecision(2)}
        </Text>
        <Text style={styles.text}>
          Creatures killed: {this.state.playerInfo.career.creaturesKilled}
        </Text>
        <Text style={styles.text}>
          Valor Tower top floor reached: {this.state.playerInfo.career.topValorTowerFloor}
        </Text>
        <Text style={styles.text}>
          Total deaths: {this.state.playerInfo.career.totalDeaths}
        </Text>
      

      
    </View>
    </View>
    }else{
      return <CharacterGear characterInfo={this.state.playerInfo.playerCharacter} />
    }
  }

  render() {
    return (
      
        <ImageBackground
          style={{...StyleSheet.absoluteFillObject}}
          imageStyle={{resizeMode: 'center', resizeMode: 'stretch'}}
          source={require('../img/backgrounds/characterStatsBg.png')}>
          <View style={{marginBottom: '15%', height: '100%'}}>
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
            <View style={{flexDirection:"row",justifyContent:"space-evenly"}}>
            <TouchableOpacity onPressIn={()=>this.setCurrentViewSate("statistics")}>
              <Text style={styles.tabText}>Character</Text>
            </TouchableOpacity>
            <TouchableOpacity onPressIn={()=>this.setCurrentViewSate("gear")}>
              <Text style={styles.tabText}>Gear</Text>
            </TouchableOpacity>
            </View>
            {this.changeCurrentViewState()}
          </View>
        </ImageBackground>
      
    );
  }
}
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  overlay: {
    borderRadius: 5,
    backgroundColor: '#778899',
    alignSelf: 'center',
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-around',

    borderStyle: 'solid',

    marginBottom: 8,
    marginStart: '10%',
    marginEnd: '10%',
  },
  nameText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 26,
    color: '#F0F8FF',
  },
  inBetweenText: {
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 24,
    marginStart: '10%',
    marginEnd: '10%',
    color: '#F0F8FF',
  },
  
  columnView: {
    flexDirection: "column",
    justifyContent: 'space-around',
    marginBottom: 10,
    borderColor: '#F0F8FF',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 7,
    marginStart: '10%',
    marginEnd: '10%',
    flex:0,
  },
  careerColumnView: {
    flexDirection: 'column',
    justifyContent: "flex-start",
    marginBottom: 10,
    borderColor: '#F0F8FF',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 7,
    marginStart: '10%',
    marginEnd: '10%',
  },
  text: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 18,
    color: '#F0F8FF',
  },
  tabText: {
    flexDirection: 'column',
    fontFamily: 'BruntsfieldCFBlackRegular',
    fontSize: 30,
    textDecorationLine:"underline",
    
    
  },
});
