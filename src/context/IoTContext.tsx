import React, { createContext, useContext, useEffect, useState } from 'react';
import { Device, SensorData } from '../models/IoTModels';
import { getDevices, getSensorData, updateDeviceStatus } from '../services/IoTService';

type IoTContextType = {
    devices: Device[];
    sensors: SensorData | null;
    isLoadingDevices: boolean;
    isLoadingSensors: boolean;
    updatingDeviceId: number | null;
    gatewayConnected: boolean;
    deviceError: string | null;
    sensorError: string | null;
    loadDevices: () => Promise<void>;
    refreshSensors: () => Promise<void>;
    toggleDevice: (id: number, value: boolean) => Promise<void>;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
    const [devices, setDevices] = useState<Device[]>([]);
    const [sensors, setSensors] = useState<SensorData | null>(null);
    const [isLoadingDevices, setIsLoadingDevices] = useState(true);
    const [isLoadingSensors, setIsLoadingSensors] = useState(true);
    const [updatingDeviceId, setUpdatingDeviceId] = useState<number | null>(null);
    const [gatewayConnected, setGatewayConnected] = useState(true);
    const [deviceError, setDeviceError] = useState<string | null>(null);
    const [sensorError, setSensorError] = useState<string | null>(null);

    const loadDevices = async () => {
        setIsLoadingDevices(true);
        setDeviceError(null);
        try {
            setDevices(await getDevices());
            setGatewayConnected(true);
        } catch {
            setDeviceError('Unable to retrieve devices.');
            setGatewayConnected(false);
        } finally {
            setIsLoadingDevices(false);
        }
    };

    const refreshSensors = async () => {
        setIsLoadingSensors(true);
        setSensorError(null);
        try {
            setSensors(await getSensorData());
            setGatewayConnected(true);
        } catch {
            setSensorError('Unable to retrieve sensor data.');
            setGatewayConnected(false);
        } finally {
            setIsLoadingSensors(false);
        }
    };

    const toggleDevice = async (id: number, value: boolean) => {
        const device = devices.find((item) => item.id === id);
        if (!device || !gatewayConnected || updatingDeviceId !== null) return;

        setUpdatingDeviceId(id);
        setDeviceError(null);
        setDevices((currentDevices) =>
            currentDevices.map((item) => item.id === id ? { ...item, status: value } : item),
        );

        try {
            const updatedDevice = await updateDeviceStatus(id, value);
            setDevices((currentDevices) =>
                currentDevices.map((item) => item.id === id ? updatedDevice : item),
            );
            setGatewayConnected(true);
        } catch {
            setDevices((currentDevices) =>
                currentDevices.map((item) => item.id === id ? device : item),
            );
            setDeviceError(`Unable to update ${device.name}.`);
            setGatewayConnected(false);
        } finally {
            setUpdatingDeviceId(null);
        }
    };

    useEffect(() => {
        void Promise.all([loadDevices(), refreshSensors()]);
    }, []);

    return (
        <IoTContext.Provider value={{
            devices,
            sensors,
            isLoadingDevices,
            isLoadingSensors,
            updatingDeviceId,
            gatewayConnected,
            deviceError,
            sensorError,
            loadDevices,
            refreshSensors,
            toggleDevice,
        }}>
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {
    const context = useContext(IoTContext);
    if (!context) throw new Error('useIoT must be used inside IoTProvider');
    return context;
}