# AquaCare Frontend

A mobile application for monitoring and controlling your smart aquarium system.

## Description
AquaCare Frontend is the mobile client component of the AquaCare system, built with React Native and Expo. It provides a user-friendly interface for monitoring aquarium metrics, managing feeding schedules, and controlling aquarium devices.

## Features
- Real-time monitoring of aquarium metrics (pH, temperature, water level)
- Live 3D visualization of aquarium status
- Automated feeding schedule management
- Push notifications for critical alerts
- Device management system
- Historical data visualization with graphs
- Dark mode UI design

## Tech Stack
- React Native
- Expo Router for navigation
- Socket.IO for real-time communication
- Three.js for 3D visualization
- D3.js for data visualization
- TypeScript for type safety
- Expo Secure Store for local storage
- Native Base UI components

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation
1. Clone the repository:
   ```bash
   git clone [repository URL]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure API endpoint in `config/api.config.ts`.
4. Start the development server:
   ```bash
   npm start
   ```

## Development Commands
- `npm start`: Start the Expo development server
- `npm run ios`: Start the iOS simulator
- `npm run android`: Start the Android simulator
- `npm run web`: Start the web version

## Project Structure
- `/app` - Main application screens and navigation
- `/components` - Reusable UI components
- `/context` - React Context providers
- `/services` - API and device services
- `/assets` - Images and static assets
- `/config` - Configuration files

## Contributing
1. Fork the repository.
2. Create your feature branch.
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

## Author
- Ananda Ayu Putri
- Bintang Timurlangit
- Raqqat Amarasangga Iswahyudi

## Acknowledgments
- Expo team
- React Native community
- Three.js contributors
- D3.js team
