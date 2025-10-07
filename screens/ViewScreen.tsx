import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const leads = [
  {
    id: '1',
    date: '18-07-2024',
    customerName: 'Pragada Krishna',
    email: 'Krishnapragada37@gmail.com',
    mobile: '7981852212',
    executive: 'Ramana',
    model: 'APACHE RTR 160 2V RM DRUM',
    branch: 'HEADOFFICE',
    enquiryType: 'DIRECT',
    leadState: 'FOLLOW UP',
    address: 'Payakarao peta',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    status: 'CLOSE',
    leadType: 'MANUAL',
  },
  {
    id: '2',
    date: '19-07-2024',
    customerName: 'Satish',
    email: 'satish@gmail.com',
    mobile: '7894561236',
    executive: 'Jack Nicholson',
    model: 'RTR 310 BASIC YL',
    branch: 'HEADOFFICE',
    enquiryType: 'WALK-IN',
    leadState: 'ENQUIRY',
    address: 'Vizag',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    status: 'OPEN',
    leadType: 'MANUAL',
  },
   {
    id: '3',
    date: '19-07-2024',
    customerName: 'Satish',
    email: 'satish@gmail.com',
    mobile: '7894561236',
    executive: 'Jack Nicholson',
    model: 'RTR 310 BASIC YL',
    branch: 'HEADOFFICE',
    enquiryType: 'WALK-IN',
    leadState: 'ENQUIRY',
    address: 'Vizag',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    status: 'OPEN',
    leadType: 'MANUAL',
  },
   {
    id: '4',
    date: '19-07-2024',
    customerName: 'Satish',
    email: 'satish@gmail.com',
    mobile: '7894561236',
    executive: 'Jack Nicholson',
    model: 'RTR 310 BASIC YL',
    branch: 'HEADOFFICE',
    enquiryType: 'WALK-IN',
    leadState: 'BOOKING',
    address: 'Vizag',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    status: 'OPEN',
    leadType: 'MANUAL',
  },
   {
    id: '5',
    date: '19-07-2024',
    customerName: 'Satish',
    email: 'satish@gmail.com',
    mobile: '7894561236',
    executive: 'Jack Nicholson',
    model: 'RTR 310 BASIC YL',
    branch: 'HEADOFFICE',
    enquiryType: 'WALK-IN',
    leadState: 'SALE',
    address: 'Vizag',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    status: 'OPEN',
    leadType: 'MANUAL',
  },
];

const getStatusStyle = (leadState: string) => {
  switch (leadState.toUpperCase()) {
    case 'ENQUIRY':
      return { backgroundColor: '#DBEAFE', color: '#1D4ED8', borderColor: '#3B82F6' };
    case 'FOLLOW UP':
      return { backgroundColor: '#FEF9C3', color: '#92400E', borderColor: '#FACC15' };
    case 'BOOKING':
      return { backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#e0da67ff' };
    case 'SALE':
      return { backgroundColor: '#FECACA', color: '#B91C1C', borderColor: '#05e66eff' };
    default:
      return { backgroundColor: '#E0E7FF', color: '#3730A3', borderColor: '#555556ff' };
  }
};

const ViewLeadsScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const openModal = (item: any) => {
    setSelectedLead(item);
    setModalVisible(true);
  };

  const handleUpdate = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    const statusStyle = getStatusStyle(item.leadState);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.name}>{item.customerName}</Text>
    <TouchableOpacity onPress={() => openModal(item)} style={{ marginLeft: 8 }}>
      <Ionicons name="create-outline" size={18} color="#2563EB" />
    </TouchableOpacity>
  </View>

  {['FOLLOW UP', 'ENQUIRY'].includes(item.leadState.toUpperCase()) ? (
    <TouchableOpacity
      onPress={() => navigation.navigate('FollowUpScreen' as never)}
      style={[
        styles.statusTag,
        {
          backgroundColor: statusStyle.backgroundColor,
          borderColor: statusStyle.borderColor,
        },
      ]}
    >
      <Text style={[styles.statusText, { color: statusStyle.color }]}>
        {item.leadState}
      </Text>
    </TouchableOpacity>
  ) : (
    <View
      style={[
        styles.statusTag,
        {
          backgroundColor: statusStyle.backgroundColor,
          borderColor: statusStyle.borderColor,
        },
      ]}
    >
      <Text style={[styles.statusText, { color: statusStyle.color }]}>
        {item.leadState}
      </Text>
    </View>
  )}
</View>



        <Text style={styles.text}>Date: {item.date}</Text>
        <Text style={styles.text}>Mobile: {item.mobile}</Text>
        <Text style={styles.text}>Executive: {item.executive}</Text>
        <Text style={styles.text}>Model: {item.model}</Text>
        <Text style={styles.text}>Status: {item.status}</Text>

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 20 }}
      />

      {selectedLead && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContentWrapper}>
              <ScrollView
  style={styles.modalContent}
  contentContainerStyle={{ paddingBottom: 16 }}
>
  <Text style={styles.modalTitle}>Edit Lead Details</Text>

  <Text style={styles.label}>Enquiry Date</Text>
  <TextInput style={styles.input} value={selectedLead.date} />

  <Text style={styles.label}>Branch Name</Text>
  <TextInput style={styles.input} value={selectedLead.branch} />

  <Text style={styles.label}>Enquiry Type</Text>
  <TextInput style={styles.input} value={selectedLead.enquiryType} />

  <Text style={styles.label}>Lead State</Text>
  <TextInput style={styles.input} value={selectedLead.leadState} />

  <Text style={styles.label}>Executive Name</Text>
  <TextInput style={styles.input} value={selectedLead.executive} />

  <Text style={styles.label}>Model Name</Text>
  <TextInput style={styles.input} value={selectedLead.model} />

  <Text style={styles.label}>Customer Name</Text>
  <TextInput style={styles.input} value={selectedLead.customerName} />

  <Text style={styles.label}>Email ID</Text>
  <TextInput style={styles.input} value={selectedLead.email} />

  <Text style={styles.label}>Mobile Number</Text>
  <TextInput style={styles.input} value={selectedLead.mobile} />

  <Text style={styles.label}>Address</Text>
  <TextInput style={styles.input} value={selectedLead.address} />

  <Text style={styles.label}>State Name</Text>
  <TextInput style={styles.input} value={selectedLead.state} />

  <Text style={styles.label}>District Name</Text>
  <TextInput style={styles.input} value={selectedLead.district} />

  <Text style={styles.label}>Lead Status</Text>
  <TextInput style={styles.input} value={selectedLead.status} />

  <Text style={styles.label}>Lead Type</Text>
  <TextInput style={styles.input} value={selectedLead.leadType} />
</ScrollView>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                  <Text style={styles.updateText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default ViewLeadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTag: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    color: '#374151',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContentWrapper: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  updateBtn: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  cancelText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#374151',
  },
  updateText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
  fontWeight: '600',
  marginBottom: 4,
  marginTop: 10,
  color: '#374151',
  fontSize: 14,
},  
});