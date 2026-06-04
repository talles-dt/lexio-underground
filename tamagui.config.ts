import { createTamagui } from "@tamagui/core";
import { getDefaultTamaguiConfig } from "@tamagui/config-default";

const tamaguiConfig = createTamagui(getDefaultTamaguiConfig("web"));

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default tamaguiConfig;
