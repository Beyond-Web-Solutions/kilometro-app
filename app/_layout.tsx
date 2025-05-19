import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { adaptNavigationTheme, PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "@/lib/ui/theme";
import {
  ThemeProvider,
  DarkTheme as DarkNavigationTheme,
  DefaultTheme as DefaultNavigationTheme,
} from "@react-navigation/native";
import { Provider } from "react-redux";
import { AuthProvider } from "@/components/auth/provider";
import { store } from "@/lib/store/store";
import "@/lib/i18n/client";

// Prevent the splash screen from auto-hiding until we know the auth state
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useColorScheme();

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultNavigationTheme,
    reactNavigationDark: DarkNavigationTheme,
    materialLight: lightTheme,
    materialDark: darkTheme,
  });

  return (
    <PaperProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <ThemeProvider
        value={
          theme === "dark"
            ? { ...DarkTheme, fonts: DefaultNavigationTheme.fonts }
            : { ...LightTheme, fonts: DarkNavigationTheme.fonts }
        }
      >
        <Provider store={store}>
          <AuthProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
              {/*<Stack.Protected guard={}>*/}
              <Stack.Screen
                name="(protected)"
                options={{ animation: "none" }}
              />
              {/*</Stack.Protected>*/}

              <Stack.Screen name="(auth)" options={{ animation: "none" }} />
            </Stack>
          </AuthProvider>
        </Provider>
      </ThemeProvider>
    </PaperProvider>
  );
}
