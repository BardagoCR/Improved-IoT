# IoT Application Documentation

This document explains what was already in the project, what was added, why it was added, and how the pieces work together.

## 1. Project Before These Changes

The project was already an Expo React Native application using TypeScript and React Navigation.

The original structure included:

- `App.tsx`, which wrapped the app in `IoTProvider` and `NavigationContainer`.
- A drawer navigator with Dashboard, Sensors, Devices, and Settings screens.
- A basic `IoTContext.tsx` file.
- A Devices screen that displayed sample devices and allowed synchronous local switch changes.
- A Sensors screen with hard-coded values: `28 C`, `65%`, and `720 lux`.
- A Dashboard screen with sensor cards and device switches.

The original context contained the sample devices, stored device status locally, and generated sensor data directly inside the context. There was no service layer, simulated network delay, loading state, gateway state, or request error handling.

## 2. Data Models Added

File: `src/models/IoTModels.ts`

Two reusable TypeScript types were added:

### `Device`

A device contains:

- `id: number`
- `name: string`
- `type: string`
- `icon`, restricted to an icon name from Expo Ionicons
- `status: boolean`

### `SensorData`

Sensor readings contain:

- `temperature: number`
- `humidity: number`
- `lightLevel: number`

The file also contains `sampleDevices`, with these initial devices:

- Living Room Light
- Bedroom Fan
- Front Door Lock

The purpose of this file is to keep the shape of IoT data in one place and allow the context, service, and screens to share the same types.

## 3. Simulated IoT Service Added

File: `src/services/IoTService.ts`

The service represents communication between the mobile application and a future IoT backend:

```text
Mobile App -> IoTContext -> IoTService -> Simulated IoT API
```

It provides three asynchronous functions:

- `getSensorData()` retrieves changing temperature, humidity, and light values.
- `getDevices()` retrieves the sample device list.
- `updateDeviceStatus(id, status)` simulates sending a device command and returns the updated device.

Each function uses `async/await` and a simulated delay. The service also has a simulated failure rate so the application can demonstrate error handling and retry behavior.

The current service values are intentionally simulated. They are not connected to physical IoT hardware or a real API.

## 4. IoT Context Changes

File: `src/context/IoTContext.tsx`

The existing context was expanded instead of creating a second context file. The todo list called the file `IotContext.tsx`, but the project already used `IoTContext.tsx`, so the existing filename was preserved to avoid breaking imports.

The context now owns shared state for:

- Devices
- Sensor readings
- Device loading
- Sensor loading
- Device update progress
- Gateway connection status
- Device errors
- Sensor errors

It exposes:

- `loadDevices()`
- `refreshSensors()`
- `toggleDevice(id, value)`
- `useIoT()`
- `IoTProvider`

### Initial loading

When the provider mounts, it requests devices and sensor data from the service. Screens receive loading state while those requests are running.

### Device updates

When a device switch changes, the context updates the device immediately. This is called an optimistic update. It prevents the controlled React Native switch from visually turning on, reverting, and then turning on again while the simulated request is running.

The switch is disabled for that device while its request is in progress. If the service fails, the previous status is restored and an error is shown.

### Gateway behavior

A failed request marks the gateway as disconnected. The screens then disable device controls and display the gateway error. This is simulated behavior intended to demonstrate the required disconnected state.

## 5. Devices Screen Changes

File: `src/navigation/screens/DevicesScreen.tsx`

The Devices screen now:

- Loads devices through the context instead of relying on screen-local data.
- Displays device icon, name, type, status, and switch.
- Shows `Loading devices...` during the initial request.
- Shows `Syncing device...` while a device command is processing.
- Disables the switch when the gateway is disconnected.
- Disables only the device currently being updated.
- Shows device errors and a `Retry` button.
- Shows `IoT Gateway is disconnected.` when appropriate.

## 6. Sensors Screen Changes

File: `src/navigation/screens/SensorsScreen.tsx`

The Sensors screen now:

- Reads sensor data from the shared context.
- Displays temperature, humidity, and light level from the service response.
- Provides a `Refresh Sensors` button.
- Shows `Refreshing Sensors...` while refreshing.
- Disables the refresh button during a request.
- Shows sensor errors and a `Retry` button.

The screen does not generate sensor values itself. It requests them through the context and service.

## 7. Dashboard Changes

File: `src/navigation/screens/DashboardScreen.tsx`

The Dashboard now uses the shared sensor and device state.

The sensor area contains:

- Temperature with the `thermometer-outline` icon.
- Humidity with the `water-outline` icon.
- Light Level with the `sunny-outline` icon.

Temperature and Humidity share the top row. Light Level is displayed in a separate full-width card below them.

Dashboard device switches use the same context update behavior as the Devices screen, including optimistic updates and protection against repeated taps during a request.

## 8. Why the Service and Context Are Separate

The screens should focus on displaying information and handling user interaction. They should not know how data is retrieved or how network failures happen.

The responsibilities are separated like this:

- `IoTModels.ts`: defines data shapes.
- `IoTService.ts`: simulates backend communication.
- `IoTContext.tsx`: stores shared application state and coordinates service calls.
- Screens: display state and send user actions to the context.

This structure makes it possible to replace the simulated service with a real API later without rewriting every screen.

## 9. Expo Setup Note

The project uses Expo SDK 57. The local Expo executable was initially missing from `node_modules/.bin` because the dependency installation was incomplete. Running the project dependency install repaired the local command link.

The project can be started with:

```powershell
npm run start
```

For local-only development:

```powershell
npm run start -- --localhost
```

The development server was verified at:

```text
http://localhost:8081
```

## 10. Validation

Editor diagnostics showed no TypeScript errors in the files changed for the IoT features. The project TypeScript compiler also completed successfully after the dependencies were repaired.

The simulated failure behavior is intentional, so a request may occasionally fail and display the retry or disconnected state during normal testing.
