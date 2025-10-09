import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ViewScreen from './screens/ViewScreen';
import DashboardScreen from './screens/DashboardScreen';
import BunkerDetails from './screens/BunkerDetails'; // New screen

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs({ navigation }: any) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRole = async () => {
      const storedRole = await AsyncStorage.getItem('userRole');
      setRole(storedRole);
      setLoading(false);
    };
    getRole();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const normalizedRole = role?.toLowerCase();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#61aefb' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#f4f4f4' },
        tabBarActiveTintColor: '#0c63e7',
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          if (route.name === 'Dashboard') iconName = 'home-outline';
          else if (route.name === 'View') iconName = 'reader-outline';
          else if (route.name === 'BunkerDetails') iconName = 'boat-outline';
          else iconName = 'ellipse-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Dashboard Tab */}
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerTitleAlign: 'center',
          headerRight: () => (
            <Button
              mode="text"
              onPress={async () => {
                await AsyncStorage.clear();
                navigation.replace('Login');
              }}
            >
              Logout
            </Button>
          ),
        }}
      />

      {/* View Tab */}
      <Tab.Screen
        name="View"
        component={ViewScreen}
        options={{
          title: 'Tanker Records',
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={styles.iconButton}
            >
              <Ionicons name="add" size={20} color="#0c63e7" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Admin/Superadmin Only */}
      {(normalizedRole === 'superadmin' || normalizedRole.startsWith('admin')) && (
        <Tab.Screen
          name="BunkerDetails"
          component={BunkerDetails}
          options={{
            headerTitleAlign: 'center',
            title: 'Bunker Details',
          }}
        />
      )}
    </Tab.Navigator>
  );
}

const App = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const role = await AsyncStorage.getItem('userRole');
      if (role) setInitialRoute('MainTabs');
      else setInitialRoute('Login');
    };
    checkLogin();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: true,
              title: 'Add Tanker Record',
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 6,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#0c63e7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
