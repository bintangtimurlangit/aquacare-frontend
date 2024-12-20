import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { deviceAPI } from '../../services/api/device';
import { Device } from '../../context/DeviceContext';

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    id: user?.id || '',
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    loadUserDevices();
  }, []);

  const loadUserDevices = async () => {
    try {
      const userDevices = await deviceAPI.getUserDevices();
      console.log('📱 Loaded devices:', userDevices);
      setDevices(userDevices);
    } catch (error) {
      console.error('❌ Failed to load devices:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderDeviceIcon = (deviceName: string) => {
    if (deviceName.toLowerCase().includes('living')) return 'sofa';
    if (deviceName.toLowerCase().includes('bedroom')) return 'bed';
    if (deviceName.toLowerCase().includes('office')) return 'desk';
    if (deviceName.toLowerCase().includes('kitchen')) return 'stove';
    return 'fish';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="rgba(237, 237, 237, 0.7)" />
        </TouchableOpacity>
        {!isEditing && (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <MaterialCommunityIcons name="pencil" size={24} color="rgba(237, 237, 237, 0.7)" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
       style={styles.contentWrapper}
       showsVerticalScrollIndicator={false}
     >
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
        </View>

        {isEditing ? (
          <View style={styles.form}>
            <Text style={styles.inputLabel}>
              <MaterialCommunityIcons name="account" size={18} color="rgba(237, 237, 237, 0.6)" /> Name
            </Text>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({...userData, name: text})}
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />

            <Text style={styles.inputLabel}>
              <MaterialCommunityIcons name="email" size={18} color="rgba(237, 237, 237, 0.6)" /> Email
            </Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({...userData, email: text})}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="email-address"
              editable={false}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleUpdateProfile}
              >
                <MaterialCommunityIcons name="content-save" size={20} color="#0B2447" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <MaterialCommunityIcons name="close" size={20} color="#A5D7E8" style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <View style={styles.infoSection}>
              <Text style={styles.label}>
                <MaterialCommunityIcons name="account" size={18} color="rgba(237, 237, 237, 0.6)" /> Name
              </Text>
              <Text style={styles.value}>{user?.name || '-'}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>
                <MaterialCommunityIcons name="email" size={18} color="rgba(237, 237, 237, 0.6)" /> Email
              </Text>
              <Text style={styles.value}>{user?.email}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>
                <MaterialCommunityIcons name="calendar" size={18} color="rgba(237, 237, 237, 0.6)" /> Member Since
              </Text>
              <Text style={styles.value}>{formatDate(userData.createdAt)}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>
                <MaterialCommunityIcons name="fish" size={18} color="rgba(237, 237, 237, 0.6)" /> Connected Devices
              </Text>
              <View style={styles.deviceList}>
                {devices && devices.length > 0 ? (
                  devices.map((device) => (
                    <TouchableOpacity 
                      key={device.id} 
                      style={styles.deviceItem}
                      onPress={() => router.push(`/home/${device.id}`)}
                    >
                      <MaterialCommunityIcons 
                        name={renderDeviceIcon(device.name || '')} 
                        size={24} 
                        color="#A5D7E8" 
                        style={styles.deviceIcon}
                      />
                      <Text style={styles.deviceName}>{device.name || `Device ${device.id}`}</Text>
                      <MaterialCommunityIcons 
                        name="chevron-right" 
                        size={24} 
                        color="rgba(237, 237, 237, 0.3)" 
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noDeviceText}>No devices connected</Text>
                )}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialCommunityIcons name="logout" size={20} color="#A5D7E8" style={styles.buttonIcon} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b2447',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 66,
    marginHorizontal: 32,
  },
  backButton: {
    fontSize: 30,
    color: 'rgba(237, 237, 237, 0.7)',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(237, 237, 237, 0.6)'
  },
  editText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(237, 237, 237, 0.7)'
  },
  contentWrapper: {
    marginHorizontal: 32,
    marginTop: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#A5D7E8',
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    color: 'rgba(237, 237, 237, 0.6)',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(165, 215, 232, 0.3)',
    borderRadius: 12,
    padding: 15,
    paddingLeft: 20,
    marginBottom: 20,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(165, 215, 232, 0.1)',
  },
  profileInfo: {
    width: '100%',
  },
  infoSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: 'rgba(237, 237, 237, 0.6)',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(165, 215, 232, 0.1)',
    padding: 15,
    borderRadius: 12,
  },
  deviceList: {
    backgroundColor: 'rgba(165, 215, 232, 0.1)',
    borderRadius: 12,
    padding: 15,
    paddingTop: 0,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(165, 215, 232, 0.2)',
  },
  deviceIcon: {
    marginRight: 12,
  },
  deviceName: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  noDeviceText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  button: {
    backgroundColor: '#A5D7E8',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#0B2447',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#A5D7E8',
  },
  cancelButtonText: {
    color: '#A5D7E8',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#A5D7E8',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 60,
    width: '100%',
  },
  logoutButtonText: {
    color: '#A5D7E8',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;