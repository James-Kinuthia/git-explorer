import { Tabs, useRouter } from "expo-router";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import '../global.css';
import Header from "@/components/ui/header";
import { SearchCode, UserSearch } from "lucide-react-native";
import { View } from "react-native";
import TabBarBackground from "@/components/screens/TabBarBackground";

export default function RootLayout() {
  const router = useRouter();

  /**
   * the set active Offset x activated only on horizontal movement
   * if vertical movement is detected first, gesture fails
  */
  const swipe = Gesture.Pan().activeOffsetX([-20, 20]).failOffsetY([-10, 10]).onEnd((e) => {
    if (e.translationX < -50) router.push({ pathname: '/explorer' });
    if (e.translationX > 50) router.push({ pathname: '/' });
  }).runOnJS(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={swipe}>
        <View collapsable={false} style={{ flex: 1 }}>
          <Tabs screenOptions={{
            header: () => <Header />,
            tabBarActiveTintColor: '#2563eb',
            tabBarStyle: {
              backgroundColor: 'transparent',
              borderTopWidth: 0,
            },
            tabBarBackground: () => <TabBarBackground />
          }}>
            <Tabs.Screen name='index' options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <UserSearch color={color} size={size} />
            }} />
            <Tabs.Screen name='explorer' options={{
              title: 'Explorer',
              tabBarIcon: ({ color, size }) => <SearchCode color={color} size={size} />
            }} />
          </Tabs>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}