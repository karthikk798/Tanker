import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Platform,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const dropdownData = {
    enquiryTypes: ['DIRECT', 'WALK_IN', 'WEBSITE', 'TELEIN', 'CAMPAIGN', 'OTHERS'],
    leadStates: ['ENQUIRY', 'FOLLOW UP', 'BOOKING', 'SALE'],
    executives: ['Robert De Niro', 'Jack Nicholson', 'Marlon Brando', 'Denzel Washington', 'Katharine Hepburn', 'Ramana', 'RajKumar', 'James Arthur'],
    models: ['APACHE RTR 160 4V - RM DISC', 'APACHE RTR 160 2V RM DRUM', 'RTR 310 BASIC YL', 'XL 100 HD ITS BSVI', 'JUPITER 125 BSVI', 'JUPITER BSVI - SMW', 'JUPITER BSVI-AOL', 'SCOOTY ZEST MATTE SERIES'],
    states: ['Arunachal Pradesh', 'Assam', 'Bihar', 'Uttar Pradesh', 'Andhra Pradesh'],
    districts: ['Visakhapatnam', 'East Godavari', 'Guntur', 'Changlang', 'Kamle'],
    winTypes: ['HOT', 'COLD', 'MEDIUM'],
  };

  const [form, setForm] = useState({
    branch: 'HEADOFFICE',
    enquiryType: '',
    leadState: '',
    executive: '',
    model: '',
    customer: '',
    email: '',
    mobile: '',
    address: '',
    state: '',
    district: '',
    winType: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
    if (value.trim() !== '') setErrors(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value || value.trim() === '') newErrors[key] = true;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log('Submitted:', form);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Enquiry Date */}
      <View style={styles.field}>
        <Text style={styles.label}>Enquiry Date *</Text>
        <View style={styles.input}>
          <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)} />
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </View>

      {/* All other fields */}
      {[
        { label: 'Branch Name *', key: 'branch', editable: false },
        { label: 'Customer Name *', key: 'customer' },
        { label: 'Email ID *', key: 'email', keyboardType: 'email-address' },
        { label: 'Mobile Number *', key: 'mobile', keyboardType: 'phone-pad' },
        { label: 'Address *', key: 'address', multiline: true },
      ].map(({ label, key, editable = true, keyboardType, multiline = false }) => (
        <View style={styles.field} key={key}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            placeholder={label}
            value={(form as any)[key]}
            onChangeText={(text) => handleChange(key, text)}
            editable={editable}
            multiline={multiline}
            keyboardType={keyboardType}
            style={styles.input}
          />
        </View>
      ))}

      {/* Dropdown Pickers */}
      {[
        { label: 'Enquiry Type *', key: 'enquiryType', items: dropdownData.enquiryTypes },
        { label: 'Lead State *', key: 'leadState', items: dropdownData.leadStates },
        { label: 'Executive Name *', key: 'executive', items: dropdownData.executives },
        { label: 'Model Name *', key: 'model', items: dropdownData.models },
        { label: 'State Name *', key: 'state', items: dropdownData.states },
        { label: 'District Name *', key: 'district', items: dropdownData.districts },
        { label: 'Win Type *', key: 'winType', items: dropdownData.winTypes },
      ].map(({ label, key, items }) => (
        <View style={styles.field} key={key}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={(form as any)[key]}
              onValueChange={(value) => handleChange(key, value)}
              style={styles.picker}
            >
              <Picker.Item label={`Select ${label}`} value="" />
              {items.map((item: string) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>
        </View>
      ))}

      <View style={styles.buttonWrapper}>
        <Button title="Save" onPress={handleSubmit} />
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
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  picker: {
    height: 52,
    width: '100%',
  },
  buttonWrapper: {
    marginTop: 24,
    alignSelf: 'stretch',
  },
});

export default HomeScreen;
