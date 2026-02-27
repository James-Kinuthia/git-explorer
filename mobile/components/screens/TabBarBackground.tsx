import { LinearGradient } from 'expo-linear-gradient';

const TabBarBackground = () => (
  <LinearGradient
    colors={['#111287', '#1f2937', '#111287']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ flex: 1 }}
  />
);

export default TabBarBackground;