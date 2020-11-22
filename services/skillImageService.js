export default function findSkillImage(name) {
   if (name === 'Attack') {
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
