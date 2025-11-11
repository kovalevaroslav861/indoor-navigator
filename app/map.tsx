import { Link } from 'expo-router';
import { StyleSheet, Image } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/floor-map.png')} style={styles.img}/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
});
