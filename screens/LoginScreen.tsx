import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS = [
  { username: 'superadmin', password: '1234', role: 'SuperAdmin' },
  { username: 'admin1', password: '1234', role: 'adminA' },
  { username: 'admin2', password: '1234', role: 'adminB' },
  { username: 'branch1', password: '1234', role: 'branchA' },
  { username: 'branch2', password: '1234', role: 'branchB' },
];

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('admin1');
  const [password, setPassword] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('branch'); // Default role for new users

  const handleLogin = async () => {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      await AsyncStorage.setItem('userRole', user.role);
      await AsyncStorage.setItem('username', user.username);
      navigation.replace('MainTabs');
    } else {
      setErrorMsg('Invalid username or password');
    }
  };

  const handleRegister = async () => {
    // Basic validation
    if (!newUsername || !newPassword || !email || !role) {
      setErrorMsg('Please fill all fields');
      return;
    }

    // Check valid email (simple regex for gmail)
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      setErrorMsg('Please enter a valid Gmail address');
      return;
    }

    // Check if the username already exists
    const userExists = USERS.some((u) => u.username === newUsername);
    if (userExists) {
      setErrorMsg('Username already taken');
      return;
    }

    // Add new user to USERS array
    USERS.push({ username: newUsername, password: newPassword, role });

    // Optionally, you can store users to AsyncStorage for persistence
    await AsyncStorage.setItem('userRole', role);
    await AsyncStorage.setItem('username', newUsername);

    setIsRegistering(false); // Switch back to login screen
    setErrorMsg('');
    // Reset registration fields
    setNewUsername('');
    setNewPassword('');
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Title>

      {!isRegistering ? (
        // Login Form
        <>
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

          <Button
            mode="text"
            onPress={() => setIsRegistering(true)}
            style={styles.switchButton}
          >
            Don't have an account? Register
          </Button>
        </>
      ) : (
        // Registration Form without Confirm Password
        <>
          <TextInput
            label="Username"
            mode="outlined"
            value={newUsername}
            onChangeText={setNewUsername}
            style={styles.input}
          />

          <TextInput
            label="Gmail"
            mode="outlined"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
          />

          <TextInput
            label="Role (branch/admin)"
            mode="outlined"
            value={role}
            onChangeText={setRole}
            style={styles.input}
          />

          {errorMsg ? <Text style={{ color: 'red' }}>{errorMsg}</Text> : null}

          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Register
          </Button>

          <Button
            mode="text"
            onPress={() => setIsRegistering(false)}
            style={styles.switchButton}
          >
            Already have an account? Login
          </Button>
        </>
      )}
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
  switchButton: {
    marginTop: 12,
    alignSelf: 'center',
  },
});
