import { MD3Theme, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { darkColors, lightColors } from "@/constants/ui/colors";

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: lightColors,
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: darkColors,
};
