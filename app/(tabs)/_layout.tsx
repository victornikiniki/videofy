import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Built-in icons

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#8A2BE2' }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Map', 
          tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="record" 
        options={{ 
          title: 'Record', 
          tabBarIcon: ({ color }) => <Ionicons name="videocam" size={24} color={color} /> 
        }} 
      />
       <Tabs.Screen 
        name="discover" 
        options={{ 
          title: 'Feed', 
          tabBarIcon: ({ color }) => <Ionicons name="play" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}