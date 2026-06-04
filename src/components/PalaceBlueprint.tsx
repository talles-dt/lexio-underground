import React from "react";
import { Text } from "react-native";
// Type declarations for stub
interface Room {
  id: string;
  name: string;
}

interface PalaceBlueprintProps {
  rooms: Room[];
}

const dynamicComponent: React.FC<PalaceBlueprintProps> = ({ rooms }) => (
  <Text>PalaceBlueprint Dynamic Placeholder (rooms: {rooms.length})</Text>
);

export default dynamicComponent;
