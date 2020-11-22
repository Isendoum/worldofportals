export default function findGearItem(itemType,playerGear) {

  switch (itemType){
  case "WEAPON":
    return playerGear.weapon;
    
  case "OFFHAND":
    return playerGear.offHand;

  case "HELMET":
    return playerGear.helmet;
  
  case "CHEST":
    return playerGear.chest;    
  
  case "GLOVES":
    return playerGear.gloves;

  case "PANTS":
    return playerGear.pants;

  case "SHOULDERS":
    return playerGear.shoulders;
  
  case "BOOTS":
    return playerGear.boots;
  
  case "AMULET":
    return playerGear.amulet;
  
  case "RING":
    return playerGear.ring1;
  
  }

}
