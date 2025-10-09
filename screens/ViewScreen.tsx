import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TankerForm = {
  id: string;
  tankerNumber: string;
  ownerName: string;
  tankerCapacity: string;
  dateTime: Date;
  receiptNumber: string;
  voucherAmount: string;
  receiptDate: Date;
  meterStart: string;
  meterEnd: string;
  voucherPhoto?: string;
  tankerPhoto?: string;
};

const defaultVoucher = 'https://via.placeholder.com/400x300.png?text=No+Voucher';
const defaultTanker = 'https://via.placeholder.com/400x300.png?text=No+Tanker';

const sampleData: TankerForm[] = [
  { id: '1', tankerNumber: 'AP31XY1001', ownerName: 'Suresh', tankerCapacity: '5000', dateTime: new Date(), receiptNumber: 'RV1001', voucherAmount: '12000', receiptDate: new Date(), meterStart: '100', meterEnd: '500', branch: 'Branch A' },
  { id: '2', tankerNumber: 'AP31XY1002', ownerName: 'Ramesh', tankerCapacity: '5200', dateTime: new Date(), receiptNumber: 'RV1002', voucherAmount: '15000', receiptDate: new Date(), meterStart: '200', meterEnd: '600', branch: 'Branch B' },
  { id: '3', tankerNumber: 'AP31XY1003', ownerName: 'Mahesh', tankerCapacity: '4800', dateTime: new Date(), receiptNumber: 'RV1003', voucherAmount: '10000', receiptDate: new Date(), meterStart: '150', meterEnd: '550', branch: 'Branch A' },
  { id: '4', tankerNumber: 'AP31XY1004', ownerName: 'Sathish', tankerCapacity: '5100', dateTime: new Date(), receiptNumber: 'RV1004', voucherAmount: '13000', receiptDate: new Date(), meterStart: '120', meterEnd: '520', branch: 'Branch B' },
  { id: '5', tankerNumber: 'AP31XY1005', ownerName: 'Prakash', tankerCapacity: '5300', dateTime: new Date(), receiptNumber: 'RV1005', voucherAmount: '14000', receiptDate: new Date(), meterStart: '180', meterEnd: '580', branch: 'Branch C' },
  { id: '6', tankerNumber: 'AP31XY1006', ownerName: 'Karthik', tankerCapacity: '5000', dateTime: new Date(), receiptNumber: 'RV1006', voucherAmount: '12500', receiptDate: new Date(), meterStart: '130', meterEnd: '530', branch: 'Branch C' },
  { id: '7', tankerNumber: 'AP31XY1007', ownerName: 'Vignesh', tankerCapacity: '4950', dateTime: new Date(), receiptNumber: 'RV1007', voucherAmount: '11000', receiptDate: new Date(), meterStart: '140', meterEnd: '540', branch: 'Branch A' },
  { id: '8', tankerNumber: 'AP31XY1008', ownerName: 'Ajith', tankerCapacity: '5050', dateTime: new Date(), receiptNumber: 'RV1008', voucherAmount: '13500', receiptDate: new Date(), meterStart: '160', meterEnd: '560', branch: 'Branch B' },
  { id: '9', tankerNumber: 'AP31XY1009', ownerName: 'Manoj', tankerCapacity: '5200', dateTime: new Date(), receiptNumber: 'RV1009', voucherAmount: '14500', receiptDate: new Date(), meterStart: '170', meterEnd: '570', branch: 'Branch C' },
  { id: '10', tankerNumber: 'AP31XY1010', ownerName: 'Ravi', tankerCapacity: '5000', dateTime: new Date(), receiptNumber: 'RV1010', voucherAmount: '12500', receiptDate: new Date(), meterStart: '150', meterEnd: '550', branch: 'Branch A' },
];

const PAGE_SIZE = 5;

const TankerCardScreen = () => {
  const [role, setRole] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [data, setData] = useState<TankerForm[]>(sampleData);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TankerForm | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState<'dateTime' | 'receiptDate' | null>(null);

  useEffect(() => {
    const getRoleAndBranch = async () => {
      const storedRole = await AsyncStorage.getItem('userRole');
      const storedBranch = await AsyncStorage.getItem('branchName');
      setRole(storedRole || 'branch');
      setBranch(storedBranch || 'Branch A');
    };
    getRoleAndBranch();
  }, []);

  const openViewModal = (item: TankerForm) => {
    setSelectedRecord(item);
    setViewModalVisible(true);
  };

  const openEditModal = (item: TankerForm) => {
    setSelectedRecord(item);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (selectedRecord) {
      setData((prev) =>
        prev.map((t) => (t.id === selectedRecord.id ? selectedRecord : t))
      );
    }
    setEditModalVisible(false);
  };

  const filteredData = data
    .filter((item) => filterDate ? item.dateTime.toDateString() === filterDate.toDateString() : true)
    .filter((item) => role === 'admin' ? true : item.branch === branch);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const renderCard = ({ item }: { item: TankerForm }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.tankerLabel}>
          <Text style={styles.bold}>Tanker No:</Text> {item.tankerNumber}
        </Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => openViewModal(item)}>
            <Ionicons name="eye-outline" size={20} color="#1E90FF" style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openEditModal(item)}>
            <Ionicons name="create-outline" size={20} color="orange" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <Text style={styles.cardLabel}><Text style={styles.bold}>Owner:</Text> {item.ownerName}</Text>
        <Text style={styles.cardLabel}><Text style={styles.bold}>Capacity:</Text> {item.tankerCapacity} KL</Text>
        <Text style={styles.cardLabel}><Text style={styles.bold}>Voucher:</Text> ₹{item.voucherAmount}</Text>
        <Text style={styles.cardLabel}><Text style={styles.bold}>Date & Time:</Text> {item.dateTime.toLocaleString()}</Text>
        {role === 'admin' && (
          <Text style={styles.cardLabel}><Text style={styles.bold}>Branch:</Text> {item.branch}</Text>
        )}
      </View>
    </View>
  );

  if (!role) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Date Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.filterText}>{filterDate ? filterDate.toDateString() : 'Filter by Date'}</Text>
        </TouchableOpacity>
        {filterDate && <TouchableOpacity onPress={() => setFilterDate(null)}><Ionicons name="close-circle" size={24} color="red" /></TouchableOpacity>}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={filterDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setFilterDate(selectedDate);
          }}
        />
      )}

      <FlatList
        data={paginatedData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No tanker records found</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity disabled={currentPage === 1} onPress={() => setCurrentPage((p) => p - 1)} style={[styles.pageBtn, currentPage === 1 && styles.disabledBtn]}>
          <Text style={styles.pageText}>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>{currentPage} / {totalPages || 1}</Text>
        <TouchableOpacity disabled={currentPage === totalPages} onPress={() => setCurrentPage((p) => p + 1)} style={[styles.pageBtn, currentPage === totalPages && styles.disabledBtn]}>
          <Text style={styles.pageText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* View Modal */}
      {selectedRecord && (
        <Modal visible={viewModalVisible} transparent animationType="fade" onRequestClose={() => setViewModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.viewModalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setViewModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Tanker Details</Text>
                {[
                  ['Tanker No', selectedRecord.tankerNumber],
                  ['Owner Name', selectedRecord.ownerName],
                  ['Capacity', selectedRecord.tankerCapacity + ' KL'],
                  ['Date & Time', selectedRecord.dateTime.toLocaleString()],
                  ['Receipt No', selectedRecord.receiptNumber],
                  ['Voucher Amount', selectedRecord.voucherAmount],
                  ['Receipt Date', selectedRecord.receiptDate.toDateString()],
                  ['Meter Start', selectedRecord.meterStart],
                  ['Meter End', selectedRecord.meterEnd],
                  ['Branch', selectedRecord.branch],
                ].map(([label, value], i) => (
                  <View key={i} style={styles.detailRow}>
                    <Text style={styles.bold}>{label}:</Text>
                    <Text>{value}</Text>
                  </View>
                ))}
                <Text style={[styles.modalText, { marginTop: 12 }]}>Voucher Photo:</Text>
                <Image source={{ uri: selectedRecord.voucherPhoto || defaultVoucher }} style={styles.photoLarge} resizeMode="cover" />
                <Text style={[styles.modalText, { marginTop: 12 }]}>Tanker Photo:</Text>
                <Image source={{ uri: selectedRecord.tankerPhoto || defaultTanker }} style={styles.photoLarge} resizeMode="cover" />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Edit Modal */}
      {selectedRecord && (
        <Modal visible={editModalVisible} transparent animationType="fade" onRequestClose={() => setEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.viewModalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Edit Tanker</Text>

                {[
                  { label: 'Tanker No', key: 'tankerNumber' },
                  { label: 'Owner Name', key: 'ownerName' },
                  { label: 'Capacity', key: 'tankerCapacity' },
                  { label: 'Receipt No', key: 'receiptNumber' },
                  { label: 'Voucher Amount', key: 'voucherAmount' },
                  { label: 'Meter Start', key: 'meterStart' },
                  { label: 'Meter End', key: 'meterEnd' },
                  { label: 'Branch', key: 'branch' },
                ].map(({ label, key }) => (
                  <View key={key} style={{ marginBottom: 12 }}>
                    <Text style={styles.bold}>{label}:</Text>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 6, marginTop: 4 }}
                      value={(selectedRecord as any)[key]}
                      onChangeText={(text) => setSelectedRecord((prev) => prev ? { ...prev, [key]: text } : prev)}
                    />
                  </View>
                ))}

                {/* Date Pickers */}
                <TouchableOpacity onPress={() => setShowEditDatePicker('dateTime')} style={{ marginBottom: 12 }}>
                  <Text style={styles.bold}>Date & Time:</Text>
                  <Text>{selectedRecord.dateTime.toLocaleString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEditDatePicker('receiptDate')} style={{ marginBottom: 12 }}>
                  <Text style={styles.bold}>Receipt Date:</Text>
                  <Text>{selectedRecord.receiptDate.toDateString()}</Text>
                </TouchableOpacity>

                {showEditDatePicker && selectedRecord && (
                  <DateTimePicker
                    value={showEditDatePicker === 'dateTime' ? selectedRecord.dateTime : selectedRecord.receiptDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowEditDatePicker(null);
                      if (!selectedDate) return;
                      setSelectedRecord((prev) => prev ? {
                        ...prev,
                        dateTime: showEditDatePicker === 'dateTime' ? selectedDate : prev.dateTime,
                        receiptDate: showEditDatePicker === 'receiptDate' ? selectedDate : prev.receiptDate
                      } : prev);
                    }}
                  />
                )}

                <TouchableOpacity onPress={saveEdit} style={{ backgroundColor: '#1E90FF', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 }}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default TankerCardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f7f9fc' },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  filterBtn: { flexDirection: 'row', backgroundColor: '#1E90FF', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', gap: 6 },
  filterText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tankerLabel: { fontSize: 15, color: '#333', fontWeight: '600' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  cardDetails: { marginTop: 6 },
  cardLabel: { fontSize: 14, color: '#555', marginBottom: 2 },
  bold: { fontWeight: '700', color: '#1E1E1E' },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  pageBtn: { padding: 6, backgroundColor: '#1E90FF', borderRadius: 6 },
  disabledBtn: { backgroundColor: '#a0a0a0' },
  pageText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  viewModalContent: { width: '90%', maxHeight: '85%', backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 10 },
  closeButton: { position: 'absolute', top: 10, right: 10, padding: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 18, textAlign: 'center' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 8 },
  photoLarge: { width: '100%', height: 200, borderRadius: 10, marginTop: 6 },
});
