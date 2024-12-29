import React from 'react';
import { StatusBar } from 'expo-status-bar';
import StackNavigator from './StackNavigator';
import { MusicProvider } from './contexts/MusicContext';

export default function App() {
  return (
    <MusicProvider>
      <StatusBar style="light" />
      <StackNavigator />
    </MusicProvider>
  );
}
