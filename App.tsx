/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text, Platform, PermissionsAndroid } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { PERMISSIONS, request } from 'react-native-permissions';
import { accelerometer, gyroscope, magnetometer } from 'react-native-sensors';
import { useEffect, useState } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent/>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [accel, setAccel] = useState({});
  const [gyro, setGyro] = useState({});
  const [mag, setMag] = useState({});

  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {

    const askPermissions = async () => {
      if ( Platform.OS === 'android' ) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.BODY_SENSORS,
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
        ]);
      } else {
        await request(PERMISSIONS.IOS.CAMERA);
        await request(PERMISSIONS.IOS.MOTION);
      }
    }

    askPermissions();

    const accelSub = accelerometer.subscribe(accel);
    const gyroSub = gyroscope.subscribe(gyro);
    const magSub = magnetometer.subscribe(mag);

    return () => {
      accelSub.unsubscribe();
      gyroSub.unsubscribe();
      magSub.unsubscribe();
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      /> */}
      <Text> Accel: {JSON.stringify(accel, null, 2)}</Text>
      <Text> Gyro: {JSON.stringify(gyro, null, 2)}</Text>
      <Text> Mag: {JSON.stringify(mag, null, 2)}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
