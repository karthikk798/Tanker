import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const USERNAME = 'admin';
const PASSWORD = '1234';

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    if (username === USERNAME && password === PASSWORD) {
      setErrorMsg('');
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
