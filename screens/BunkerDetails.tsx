import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

type BunkerRecord = {
  id: string;
  name: string;
  image?: string;
  startTime: string;
  endTime: string;
  shift: string;
};

const defaultImage = 'https://via.placeholder.com/150.png?text=No+Image';

const sampleData: BunkerRecord[] = [
  { id: '1', name: 'Bunker A', startTime: '06:00', endTime: '14:00', shift: 'Morning' },
  { id: '2', name: 'Bunker B', startTime: '14:00', endTime: '22:00', shift: 'Evening' },
  { id: '3', name: 'Bunker C', startTime: '22:00', endTime: '06:00', shift: 'Night' },
  { id: '4', name: 'Bunker D', startTime: '06:00', endTime: '14:00', shift: 'Morning' },
  { id: '5', name: 'Bunker E', startTime: '14:00', endTime: '22:00', shift: 'Evening' },
  { id: '6', name: 'Bunker F', startTime: '22:00', endTime: '06:00', shift: 'Night' },
];

const PAGE_SIZE = 5;

const BunkerDetails = () => {
  const [role, setRole] = useState<string | null>(null);
  const [data, setData] = useState<BunkerRecord[]>(sampleData);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BunkerRecord | null>(null);

  useEffect(() => {
    const getRole = async () => {
      const storedRole = await AsyncStorage.getItem('userRole');
      setRole(storedRole || 'branch');
    };
    getRole();
  }, []);

  const openModal = (item: BunkerRecord) => {
    setSelectedRecord(item);
    setModalVisible(true);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const renderCard = ({ item }: { item: BunkerRecord }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <TouchableOpacity onPress={() => openModal(item)}>
          <Ionicons name="eye-outline" size={20} color="#1E90FF" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardLabel}><Text style={styles.bold}>ID:</Text> {item.id}</Text>
        <Text style={styles.cardLabel}><Text style={styles.bold}>Start:</Text> {item.startTime}</Text>
        <Text style={styles.cardLabel}><Text style={styles.bold}>End:</Text> {item.endTime}</Text>
        <Text style={styles.cardLabel}><Text style={styles.bold}>Shift:</Text> {item.shift}</Text>
        <Image source={{ uri: item.image || defaultImage }} style={styles.cardImage} resizeMode="cover" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={paginatedData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No bunker records found</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((p) => p - 1)}
          style={[styles.pageBtn, currentPage === 1 && styles.disabledBtn]}
        >
          <Text style={styles.pageText}>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>{currentPage} / {totalPages || 1}</Text>
        <TouchableOpacity
          disabled={currentPage === totalPages}
          onPress={() => setCurrentPage((p) => p + 1)}
          style={[styles.pageBtn, currentPage === totalPages && styles.disabledBtn]}
        >
          <Text style={styles.pageText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      {selectedRecord && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Bunker Details</Text>
                <View style={styles.detailRow}><Text style={styles.bold}>ID:</Text><Text>{selectedRecord.id}</Text></View>
                <View style={styles.detailRow}><Text style={styles.bold}>Name:</Text><Text>{selectedRecord.name}</Text></View>
                <View style={styles.detailRow}><Text style={styles.bold}>Start Time:</Text><Text>{selectedRecord.startTime}</Text></View>
                <View style={styles.detailRow}><Text style={styles.bold}>End Time:</Text><Text>{selectedRecord.endTime}</Text></View>
                <View style={styles.detailRow}><Text style={styles.bold}>Shift:</Text><Text>{selectedRecord.shift}</Text></View>
                <Text style={[styles.modalText, { marginTop: 12 }]}>Image:</Text>
                <Image source={{ uri: selectedRecord.image || defaultImage }} style={styles.photoLarge} resizeMode="cover" />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default BunkerDetails;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: '#f7f9fc' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1E1E1E' },
  cardDetails: { marginTop: 2 },
  cardLabel: { fontSize: 13, color: '#555', marginBottom: 2 },
  bold: { fontWeight: '700', color: '#1E1E1E' },
  cardImage: { width: '100%', height: 10, borderRadius: 6, marginTop: 4 },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  pageBtn: { padding: 5, backgroundColor: '#1E90FF', borderRadius: 5 },
  disabledBtn: { backgroundColor: '#a0a0a0' },
  pageText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { width: '90%', maxHeight: '85%', backgroundColor: '#fff', padding: 18, borderRadius: 12, elevation: 10 },
  closeBtn: { position: 'absolute', top: 10, right: 10, padding: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 14, textAlign: 'center' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  modalText: { fontSize: 15, marginBottom: 6 },
  photoLarge: { width: '100%', height: 180, borderRadius: 8, marginTop: 4 },
});
