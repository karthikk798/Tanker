import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Calendar } from 'react-native-calendars';
import { TouchableWithoutFeedback } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

// ...imports remain the same
const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [showFollowupsModal, setShowFollowupsModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showDateEventsModal, setShowDateEventsModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedFollowUps, setSelectedFollowUps] = useState<any[]>([]);

  // Simulated follow-ups for calendar dates
  const agendaItems = {
    '2025-08-13': [{ name: 'Follow-up with Arun Kumar at 11:15AM' }],
    '2025-08-14': [{ name: 'Call Divya Sharma at 10:15AM' }],
    '2025-08-15': [{ name: 'Meeting with Ravi Verma at 2:30PM' }],
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => navigation.replace('Login'),
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#0c63e7' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => setShowCalendarModal(true)}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="calendar-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <Ionicons name="power" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const cards = [
    {
      id: '1',
      title: "Today's Follow-Ups",
      icon: 'calendar-outline',
      value: '5',
      onPress: () => setShowFollowupsModal(true),
    },
    {
      id: '2',
      title: 'Total Leads',
      icon: 'people-outline',
      value: '32',
    },
    {
      id: '3',
      title: 'Completed Follow-ups',
      icon: 'trophy-outline',
      value: '3',
    },
  ];

  const customerData = [
    { name: 'Arun Kumar', phone: '9876543210', time: '10:30 AM' },
    { name: 'Divya Sharma', phone: '9123456789', time: '11:45 AM' },
    { name: 'Ravi Verma', phone: '9988776655', time: '01:15 PM' },
    { name: 'Sneha Reddy', phone: '9012345678', time: '03:00 PM' },
    { name: 'Karan Patel', phone: '9876123450', time: '04:20 PM' },
  ];

  const renderCard = ({ item }: { item: typeof cards[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={item.onPress ? item.onPress : undefined}
    >
      <Ionicons name={item.icon} size={45} color="#0c63e7" />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardValue}>{item.value}</Text>
    </TouchableOpacity>
  );

  const handleDatePress = (day: any) => {
    const date = day.dateString;
    setSelectedDate(date);
    setSelectedFollowUps(agendaItems[date] || []);
    setShowDateEventsModal(true); // open events modal
  };


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Karthikk</Text>

        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cardList}
        />
      </View>

      {/* Today's Follow-Ups Modal */}
      <Modal
        visible={showFollowupsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFollowupsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Today's Follow-Ups</Text>

            {customerData.map((item, index) => (
              <View key={index} style={styles.customerItem}>
                <Ionicons name="person-circle-outline" size={24} color="#0c63e7" />
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>{item.name}</Text>
                  <Text style={styles.customerPhone}>{item.phone} | {item.time}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowFollowupsModal(false)}
            >
              <Ionicons name="close" size={24} color="#0c63e7" />
            </TouchableOpacity>

          </View>
        </View>
      </Modal>


     {/* Calendar Modal */}
<Modal
  visible={showCalendarModal}
  animationType="fade"
  transparent
  onRequestClose={() => setShowCalendarModal(false)}
>
  {/* Outer overlay closes modal when tapped */}
  <TouchableWithoutFeedback onPress={() => setShowCalendarModal(false)}>
    <View style={styles.modalOverlay}>
      {/* Inner container prevents closing when tapping inside */}
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.calendarContainer}>
          
          {/* Close icon on top-right */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setShowCalendarModal(false)}
          >
            <Ionicons name="close" size={24} color="#0c63e7" />
          </TouchableOpacity>

          {/* Calendar */}
          <Calendar
            onDayPress={handleDatePress}
            markedDates={{
              ...Object.keys(agendaItems).reduce((acc, date) => {
                acc[date] = { marked: true, dotColor: '#0c63e7' };
                return acc;
              }, {} as any),
              ...(selectedDate
                ? { [selectedDate]: { selected: true, selectedColor: '#0c63e7' } }
                : {}),
            }}
            theme={{
              todayTextColor: '#0c63e7',
              arrowColor: '#0c63e7',
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>

      <Modal
        visible={showDateEventsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDateEventsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedDate ? `Follow-Ups for ${selectedDate}` : ''}
            </Text>

            {selectedFollowUps.length > 0 ? (
              selectedFollowUps.map((item, index) => (
                <View key={index} style={styles.customerItem}>
                  <Ionicons name="person-circle-outline" size={24} color="#0c63e7" />
                  <View style={styles.customerDetails}>
                    <Text style={styles.customerName}>{item.name}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 16, marginTop: 10 }}>No events for this date.</Text>
            )}

            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowDateEventsModal(false)}
            >
              <Ionicons name="close" size={24} color="#0c63e7" />
            </TouchableOpacity>

          </View>
        </View>
      </Modal>


    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: 20 },
  content: { marginTop: 40, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  cardList: { paddingVertical: 10 },
  card: {
    width: 280,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f4ff',
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, marginTop: 8, color: '#333' },
  cardValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4, color: '#0c63e7' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 6,
    width: '100%',
    paddingHorizontal: 10,
  },
  customerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 10,
  },
  customerName: { fontSize: 16, flex: 1 },
  customerPhone: { fontSize: 16, textAlign: 'right', width: 160 },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#0c63e7',
    borderRadius: 8,
  },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
});

export default DashboardScreen;