import React from "react";
import { View, Text } from "react-native";

interface Room {
  id: string;
  name: string;
}

interface PalaceBlueprintProps {
  rooms: Room[];
}

const PalaceBlueprint: React.FC<PalaceBlueprintProps> = ({ rooms }) => {
  return (
    <View>
      <Text>PalaceBlueprint Dynamic Placeholder</Text>
      <Text>Total Rooms: {rooms.length}</Text>
    </View>
  );
};

export default PalaceBlueprint;
