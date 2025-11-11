import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

export const unstable_settings = {
  anchor: '(tabs)'
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <Stack initialRouteName='sensors'>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="map" options={{ presentation: 'modal', title: 'Floor Map' }} />
        <Stack.Screen name="sensors" options={{ presentation: 'modal', title: 'Sensor Measurement' }} />
      </Stack>
      <Link href="/map">
        <ThemedText type='link' style={{display:'flex', flex: 1, textAlign: 'center', margin: '20dp'}}>Go to map</ThemedText>
      </Link>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
