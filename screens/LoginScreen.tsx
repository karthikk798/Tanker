import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS = [
  { username: 'admin', password: '1234', role: 'admin' },
  { username: 'branch1', password: '1234', role: 'branch' },
  { username: 'branch2', password: '1234', role: 'branch' },
];

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    const user = USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      await AsyncStorage.setItem('userRole', user.role);
      await AsyncStorage.setItem('username', user.username);
      navigation.replace('MainTabs');
    } else {
      setErrorMsg('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Login</Title>

      <TextInput
        label="Username"
        mode="outlined"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {errorMsg ? <Text style={{ color: 'red' }}>{errorMsg}</Text> : null}

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 26,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
});
