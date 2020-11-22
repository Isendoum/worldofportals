/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';

import Map from './screens/Map';
import Battle from './screens/Battle';
import Shop from './screens/Shop';
import TownShop from './screens/TownShop';
import TownSkillShop from './screens/TownSkillShop';
import Login from './screens/Login';
import CharacterInfo from './screens/CharacterInfo';
import CharacterSkills from './screens/CharacterSkills';
import CharacterInventory from './screens/CharacterInventory';
import Town from './screens/Town';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Register from './screens/Register';
import CharacterQuests from './screens/CharacterQuests';


const Stack = createStackNavigator();


export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode={false} mode={"card"} screenOptions={{transitionSpec:{open:config,close:config}}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="CharacterInfo" component={CharacterInfo} />
          <Stack.Screen name="CharacterSkills" component={CharacterSkills} />
          <Stack.Screen name="CharacterInventory" component={CharacterInventory} />
          <Stack.Screen name="CharacterQuests" component={CharacterQuests} />
          <Stack.Screen name="Battle" component={Battle} />
          <Stack.Screen name="Shop" component={Shop} />
          <Stack.Screen name="Town" component={Town} />
          <Stack.Screen name="TownShop" component={TownShop} />
          <Stack.Screen name="TownSkillShop" component={TownSkillShop} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
