import { ThemeProvider } from '@/theme/theme-provider';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import 'react-native-reanimated';
import { store } from '@/store';



export default function RootLayout() {
  return (
    <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
              <Stack.Screen name='+not-found' />
            </Stack>
            <StatusBar style='auto' />
          </ThemeProvider>
        </GestureHandlerRootView>
    </Provider>

  );
}
