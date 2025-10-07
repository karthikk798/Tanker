import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const branchData = [
  { branchId: 'B001', name: 'Branch 1', sales: 5000 },
  { branchId: 'B002', name: 'Branch 2', sales: 7000 },
];

const BranchHome = ({ navigation }: any) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchBranchData = async () => {
      const branchId = await AsyncStorage.getItem('userBranch');
      const filtered = branchData.filter(item => item.branchId === branchId);
      setData(filtered);
    };
    fetchBranchData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Branch User</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.branchId}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Text>Sales: {item.sales}</Text>
          </View>
        )}
      />
      <Button mode="contained" onPress={handleLogout} style={{ marginTop: 20 }}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  item: { padding: 10, borderBottomWidth: 1 },
});

export default BranchHome;
