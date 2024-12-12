import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Calculator from './src/components/calculator';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Calculator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
