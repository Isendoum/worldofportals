export default function findImage(name) {
  if (name.includes('Sword')) {
    return require('../img/Items/Sword.png');
  } else if (name.includes('Boots')) {
    return require('../img/Items/rustyBoots.png');
  } else if (name.includes('Helmet')) {
    return require('../img/Items/helmet.png');
  } else if (name.includes('Shield')) {
    return require('../img/Items/shieldSmall.png');
  } else if (name.includes('Chest')) {
    return require('../img/Items/chest.png');
  } else if (name.includes('Gloves')) {
    return require('../img/Items/rustyGloves.png');
  } else if (name.includes('Pants')) {
    return require('../img/Items/rustyPants.png');
  } else if (name.includes('Ring')) {
    return require('../img/Items/rustyRing.png');
  } else if (name === 'Potion') {
    return require('../img/Items/potion.png');
  }else if (name ==='Ip Potion') {
    return require('../img/Items/ippotion.png');
  } else if (name === 'Attack') {
    return require('../img/skills/attack.png');
  } else if (name === 'Wild Swing') {
    return require('../img/skills/wildSwing.png');
  } else if (name === 'Arcane Bolt') {
    return require('../img/skills/arcaneBolt.png');
  } else if (name === 'Magic Attack') {
    return require('../img/skills/magicAttack.png');
  }else if (name === 'Healing Touch') {
    return require('../img/skills/healingTouch.png');
  }else if (name === 'Burst of Power') {
    return require('../img/skills/burstOfPower.png');
  } else {
    return require('../img/Items/generic.png');
  }
}
