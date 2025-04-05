import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PizzaDetector } from './components/PizzaDetector';
import './polyfills';
import './global.css';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <PizzaDetector />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
