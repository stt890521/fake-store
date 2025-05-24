import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  // Toggle between Sign In and Sign Up modes
  const toggleMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setErrors({}); // reset errors when toggling mode
  };

  // Clear all input fields and errors
  const clearFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrors({});
  };

  // Handle form submission for both Sign In and Sign Up
  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Please fill all required fields.');
      return;
    }
    setErrors({}); // clear previous errors if any

    const url =
      mode === 'signin'
        ? 'http://10.0.2.2:3000/users/signin'
        : 'http://10.0.2.2:3000/users/signup';
    const payload: any = { email: email.trim(), password: password }; 
    if (mode === 'signup') {
      payload.name = name.trim();
    }

    try {
      // Send POST request to server
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Attempt to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (err) {
        // If parsing fails, the response is not valid JSON
        Alert.alert('Server did not return valid JSON');
        return;
      }

      if (!response.ok) {
        // Response returned an error status
        if (response.status === 401 || response.status === 400) {
          Alert.alert('Invalid credentials');
        } else {
          // If server provided an error message, use it; otherwise generic message
          const message = data?.error || 'Something went wrong. Please try again.';
          Alert.alert(message);
        }
        return;
      }

      // Successful response
      await AsyncStorage.setItem('user', JSON.stringify(data));
      // Navigate to the product screen (inside the "(tabs)" group)
      router.replace('/(tabs)/product');
    } catch (error) {
      // Network or fetch error (server unreachable, etc.)
      Alert.alert('Unable to connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Text>

      {/* Name field (Sign Up mode only) */}
      {mode === 'signup' && (
        <>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </>
      )}

      {/* Email field */}
      <TextInput
        style={[styles.input, errors.email ? styles.inputError : null]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Password field */}
      <TextInput
        style={[styles.input, errors.password ? styles.inputError : null]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Submit and Clear buttons */}
      <Button
        title={mode === 'signin' ? 'Sign In' : 'Sign Up'}
        onPress={handleSubmit}
      />
      <Button title="Clear" color="#555" onPress={clearFields} />

      {/* Toggle between Sign In and Sign Up */}
      <TouchableOpacity onPress={toggleMode}>
        <Text style={styles.toggleText}>
          {mode === 'signin'
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Sign In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#AAA',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  toggleText: {
    color: 'blue',
    marginTop: 16,
    textAlign: 'center',
  },
});
