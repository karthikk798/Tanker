import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, CameraOptions } from 'react-native-image-picker';

const HomeScreen = () => {
  const [form, setForm] = useState({
    tankerNumber: '',
    ownerName: '',
    tankerCapacity: '',
    dateTime: new Date(),
    receiptNumber: '',
    voucherAmount: '',
    receiptDate: new Date(),
    meterStart: '',
    meterEnd: '',
    voucherPhoto: '',
    tankerPhoto: '',
  });

  const [showDatePicker, setShowDatePicker] = useState({
    receiptDate: false,
  });

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (key: string, selectedDate?: Date) => {
    setShowDatePicker(prev => ({ ...prev, [key]: false }));
    if (selectedDate) setForm(prev => ({ ...prev, [key]: selectedDate }));
  };

  const handleCapturePhoto = async (key: 'voucherPhoto' | 'tankerPhoto') => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.5,
      saveToPhotos: true,
    };

    try {
      const result = await launchCamera(options);
      if (result.didCancel) {
        console.log('User cancelled camera');
      } else if (result.errorCode) {
        console.log('Camera Error: ', result.errorMessage);
        Alert.alert('Camera Error', result.errorMessage || 'Unknown error');
      } else if (result.assets && result.assets.length > 0) {
        handleChange(key, result.assets[0].uri || '');
      }
    } catch (error) {
      console.log('Camera Exception: ', error);
      Alert.alert('Camera Error', 'Unable to open camera');
    }
  };

  const handleSubmit = () => {
    const requiredFields = [
      'tankerNumber',
      'ownerName',
      'tankerCapacity',
      'receiptNumber',
      'voucherAmount',
      'meterStart',
      'meterEnd',
      'voucherPhoto',
      'tankerPhoto',
    ];

    const missing = requiredFields.filter(key => !form[key as keyof typeof form]);
    if (missing.length > 0) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }

    console.log('Form submitted:', form);
    Alert.alert('Success', 'Form submitted successfully!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/** Tanker Vehicle Number */}
      <View style={styles.field}>
        <Text style={styles.label}>Tanker Vehicle Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Vehicle Number"
          value={form.tankerNumber}
          onChangeText={text => handleChange('tankerNumber', text)}
        />
      </View>

      {/** Owner Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Name of the Owner *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Owner Name"
          value={form.ownerName}
          onChangeText={text => handleChange('ownerName', text)}
        />
      </View>

      {/** Tanker Capacity */}
      <View style={styles.field}>
        <Text style={styles.label}>Tanker Capacity *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Tanker Capacity"
          value={form.tankerCapacity}
          onChangeText={text => handleChange('tankerCapacity', text)}
          keyboardType="numeric"
        />
      </View>

      {/** Date & Time (display only, no edit) */}
      <View style={styles.field}>
        <Text style={styles.label}>Date & Time *</Text>
        <Text style={styles.readOnly}>{form.dateTime.toLocaleString()}</Text>
      </View>

      {/** Receipt Voucher Number */}
      <View style={styles.field}>
        <Text style={styles.label}>Receipt Voucher Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Receipt Voucher Number"
          value={form.receiptNumber}
          onChangeText={text => handleChange('receiptNumber', text)}
        />
      </View>

      {/** Voucher Amount */}
      <View style={styles.field}>
        <Text style={styles.label}>Voucher Amount *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          value={form.voucherAmount}
          onChangeText={text => handleChange('voucherAmount', text)}
          keyboardType="numeric"
        />
      </View>

      {/** Receipt Voucher Date */}
      <View style={styles.field}>
        <Text style={styles.label}>Receipt Voucher Date *</Text>
        <Button title={form.receiptDate.toDateString()} onPress={() => setShowDatePicker(prev => ({ ...prev, receiptDate: true }))} />
        {showDatePicker.receiptDate && (
          <DateTimePicker
            value={form.receiptDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => handleDateChange('receiptDate', selectedDate)}
          />
        )}
      </View>

      {/** Meter Readings */}
      <View style={styles.field}>
        <Text style={styles.label}>Meter Starting Reading *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Starting Reading"
          value={form.meterStart}
          onChangeText={text => handleChange('meterStart', text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Meter Ending Reading *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Ending Reading"
          value={form.meterEnd}
          onChangeText={text => handleChange('meterEnd', text)}
          keyboardType="numeric"
        />
      </View>

      {/** Voucher Photo */}
      <View style={styles.field}>
        <Text style={styles.label}>Voucher Photo *</Text>
        <Button title="Capture Photo" onPress={() => handleCapturePhoto('voucherPhoto')} />
        {form.voucherPhoto ? (
          <Image source={{ uri: form.voucherPhoto }} style={styles.photo} />
        ) : null}
      </View>

      {/** Tanker Photo */}
      <View style={styles.field}>
        <Text style={styles.label}>Tanker Photo *</Text>
        <Button title="Capture Photo" onPress={() => handleCapturePhoto('tankerPhoto')} />
        {form.tankerPhoto ? (
          <Image source={{ uri: form.tankerPhoto }} style={styles.photo} />
        ) : null}
      </View>

      {/** Submit Button */}
      <View style={styles.buttonWrapper}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  readOnly: {
    height: 48,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#e6e6e6',
    color: '#555',
  },
  buttonWrapper: {
    marginTop: 24,
  },
  photo: {
    marginTop: 8,
    width: '100%',
    height: 200,
    borderRadius: 6,
  },
});

export default HomeScreen;
