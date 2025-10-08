import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera } from 'react-native-image-picker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [role, setRole] = useState<string | null>(null);
  const [employeeName, setEmployeeName] = useState('');
  const [tankerImage, setTankerImage] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [shift, setShift] = useState<'Morning' | 'Night'>('Morning');

  const TOTAL_BRANCHES = 2;

  // Determine if current user is branch user
  const isBranchUser = role?.toLowerCase().includes('branch');

  // Load role and persistent work data
  useEffect(() => {
    const loadData = async () => {
      const storedRole = await AsyncStorage.getItem('userRole');
      setRole(storedRole);

      if (storedRole && storedRole.toLowerCase().includes('branch')) {
        const storedName = await AsyncStorage.getItem('employeeName');
        const storedImage = await AsyncStorage.getItem('tankerImage');
        const storedStartTime = await AsyncStorage.getItem('startTime');

        if (storedName) setEmployeeName(storedName);
        if (storedImage) setTankerImage(storedImage);
        if (storedStartTime) setStartTime(storedStartTime);
      }
    };
    loadData();
  }, []);

  const determineShift = () => {
    const now = new Date();
    const hour = now.getHours();
    setShift(hour >= 6 && hour < 18 ? 'Morning' : 'Night');
  };

  const handleLogout = async () => {
    navigation.replace('Login');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#0c63e7' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
          <Ionicons name="power" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
    determineShift();
  }, [navigation]);

  const handleCaptureTanker = async () => {
    if (!employeeName.trim()) {
      Alert.alert('Enter Name', 'Please enter your name before taking a picture.');
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: false,
    });

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri!;
      setTankerImage(uri);

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      setStartTime(time);

      // Save to AsyncStorage
      await AsyncStorage.setItem('employeeName', employeeName);
      await AsyncStorage.setItem('tankerImage', uri);
      await AsyncStorage.setItem('startTime', time);

      Alert.alert('Shift Started', `${employeeName} started ${shift} shift at ${time}`);
    }
  };

  const handleEndWork = async () => {
    if (!startTime) {
      Alert.alert('Shift Not Started', 'Please start your shift first.');
      return;
    }

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    setEndTime(time);

    Alert.alert('Shift Ended', `${employeeName} ended ${shift} shift at ${time}`);

    // Clear AsyncStorage after end work
    await AsyncStorage.removeItem('employeeName');
    await AsyncStorage.removeItem('tankerImage');
    await AsyncStorage.removeItem('startTime');

    // Reset local state
    setEmployeeName('');
    setTankerImage('');
    setStartTime('');
    setEndTime('');
  };

  const cards = [
    ...(isBranchUser
      ? [
          {
            id: '1',
            type: 'employee',
            title: 'Current Employee',
          },
        ]
      : []),
    ...(!isBranchUser
      ? [
          {
            id: '2',
            title: 'Total Branches',
            icon: 'business-outline',
            value: TOTAL_BRANCHES.toString(),
          },
        ]
      : []),
    {
      id: '3',
      title: 'Number of Tankers',
      icon: 'boat-outline',
      value: '12',
    },
    {
      id: '4',
      title: 'Total Quantity',
      icon: 'cube-outline',
      value: '2450 L',
    },
  ];

  const renderCard = ({ item }: any) => {
    if (item.type === 'employee') {
      if (!isBranchUser) return null; // Safety check

      return (
        <View style={styles.employeeCard}>
          {tankerImage ? (
            <Image source={{ uri: tankerImage }} style={styles.employeeImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={100} color="#0c63e7" />
          )}
          <TextInput
            value={employeeName}
            onChangeText={setEmployeeName}
            placeholder="Enter Name"
            style={styles.nameInput}
          />
          {startTime ? (
            <Text style={styles.startTime}>
              Shift: {shift} | Start: {startTime} {endTime ? `| End: ${endTime}` : ''}
            </Text>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.startWorkButton} onPress={handleCaptureTanker}>
              <Text style={styles.startWorkText}>Start Work</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.endWorkButton} onPress={handleEndWork}>
              <Text style={styles.endWorkText}>End Work</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name={item.icon} size={30} color="#0c63e7" />
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardValue}>{item.value}</Text>
      </View>
    );
  };

  if (!role) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome {role === 'adminA' || role === 'adminB' || role === 'SuperAdmin' ? 'Admin' : 'Branch User'}
      </Text>
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#0c63e7' },
  cardList: { paddingVertical: 10 },

  card: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f0f4ff',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  iconWrapper: {
    backgroundColor: '#e3f0ff',
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  cardTitle: { fontSize: 16, color: '#333', marginTop: 4 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: '#0c63e7' },

  employeeCard: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#d0e6ff',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  employeeImage: { width: 180, height: 180, borderRadius: 12, marginBottom: 10 },
  nameInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
  startTime: { fontSize: 16, fontWeight: 'bold', color: '#0c63e7', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  startWorkButton: {
    backgroundColor: '#0c63e7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 8,
  },
  startWorkText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  endWorkButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  endWorkText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});

export default DashboardScreen;
