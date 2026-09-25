import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Button,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';

export default function DevicesScreen() {

  const {
    devices,
    isLoadingDevices,
    updatingDeviceId,
    gatewayConnected,
    deviceError,
    loadDevices,
    toggleDevice,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {!gatewayConnected && <Text style={styles.error}>IoT Gateway is disconnected.</Text>}

      {deviceError && (
        <View style={styles.feedback}>
          <Text style={styles.error}>{deviceError}</Text>
          <Button title="Retry" onPress={() => void loadDevices()} />
        </View>
      )}

      {isLoadingDevices && (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text>Loading devices...</Text>
        </View>
      )}

      {!isLoadingDevices && devices.map((device) => (

        <View
          key={device.id}
          style={styles.deviceCard}
        >

          <View style={styles.deviceInfo}>

            <View style={styles.iconContainer}>

              <Ionicons
                name={device.icon}
                size={28}
              />

            </View>

            <View style={styles.deviceDetails}>

              <Text style={styles.deviceName}>
                {device.name}
              </Text>

              <Text style={styles.deviceType}>
                {device.type}
              </Text>

              <Text style={styles.deviceState}>
                {device.status ? 'ON' : 'OFF'}
              </Text>

            </View>

          </View>

          <Switch
            value={device.status}
            disabled={!gatewayConnected || updatingDeviceId === device.id}
            onValueChange={(value) => void toggleDevice(device.id, value)}
          />

          {updatingDeviceId === device.id && <Text style={styles.updating}>Syncing device...</Text>}

        </View>

      ))}

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

  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  deviceDetails: {
    flex: 1,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  deviceType: {
    fontSize: 13,
    marginTop: 3,
  },

  deviceState: {
    fontSize: 12,
    marginTop: 5,
  },

  loading: {
    alignItems: 'center',
    gap: 8,
    marginVertical: 24,
  },

  feedback: {
    marginBottom: 16,
    gap: 8,
  },

  error: {
    color: '#b42318',
    marginBottom: 8,
  },

  updating: {
    fontSize: 12,
    marginLeft: 8,
  },

});