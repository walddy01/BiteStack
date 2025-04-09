import { Tabs } from "expo-router";
import { Home,  CookingPot, UserRound, ShoppingBasket } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#25292e',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
        backgroundColor: '#fff',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }: { color: string }) => (<Home color={color} />), headerShown: false}}/>
      <Tabs.Screen name="comidas" options={{ title: 'Comidas', tabBarIcon: ({ color }: { color: string }) => (<CookingPot color={color} />)}} />
      <Tabs.Screen name="lista" options={{ title: 'Lista', tabBarIcon: ({ color }: { color: string }) => (<ShoppingBasket color={color} />)}} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color }: { color: string }) => (<UserRound color={color} />)}} />
    </Tabs>
  )
}
