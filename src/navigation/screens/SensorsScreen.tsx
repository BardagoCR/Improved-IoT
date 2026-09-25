import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function SensorsScreen() {
  const {
    sensors,
    isLoadingSensors,
    sensorError,
    refreshSensors,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <Text style={styles.title}>
        Sensors
      </Text>

      <Text style={styles.subtitle}>
        Monitor your environment
      </Text>

      {sensorError && (
        <View style={styles.feedback}>
          <Text style={styles.error}>{sensorError}</Text>
          <Button title="Retry" onPress={() => void refreshSensors()} />
        </View>
      )}

      <Button
        title={isLoadingSensors ? 'Refreshing Sensors...' : 'Refresh Sensors'}
        onPress={() => void refreshSensors()}
        disabled={isLoadingSensors}
      />

      {isLoadingSensors && (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text>Refreshing Sensors...</Text>
        </View>
      )}

      {/* Temperature */}
      {sensors && <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="thermometer-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Temperature
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors.temperature}°C
        </Text>

        <Text style={styles.sensorDescription}>
          Current room temperature
        </Text>

      </View>}

      {/* Humidity */}
      {sensors && <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="water-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Humidity
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors.humidity}%
        </Text>

        <Text style={styles.sensorDescription}>
          Current relative humidity
        </Text>

      </View>}

      {/* Light Level */}
      {sensors && <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="sunny-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Light Level
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors.lightLevel} lux
        </Text>

        <Text style={styles.sensorDescription}>
          Current ambient light
        </Text>

      </View>}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },

  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
  },

  loading: {
    alignItems: 'center',
    gap: 8,
    marginVertical: 24,
  },

  feedback: {
    marginVertical: 12,
    gap: 8,
  },

  error: {
    color: '#b42318',
  },

});