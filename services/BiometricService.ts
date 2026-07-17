/**
 * Jarvis Biometric Service
 * Handles Face ID / Touch ID authentication for mobile.
 */

import * as LocalAuthentication from 'expo-local-authentication';

class BiometricService {
  constructor() {
    this.isAvailable = false;
    this.biometricType = null;
    this.isEnrolled = false;
  }

  async init() {
    try {
      const [hasHardware, enrolled, types] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);

      this.isAvailable = hasHardware;
      this.isEnrolled = enrolled;

      if (types.includes(2)) {
        this.biometricType = 'FaceID';
      } else if (types.includes(1)) {
        this.biometricType = 'TouchID';
      } else {
        this.biometricType = 'Passcode';
      }

      return {
        available: hasHardware,
        enrolled,
        type: this.biometricType,
      };
    } catch (error) {
      console.warn('Biometric init error:', error);
      return { available: false, enrolled: false, type: null };
    }
  }

  /**
   * Authenticate user with biometrics
   */
  async authenticate(options = {}) {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options.promptMessage || 'Jarvis needs to verify your identity',
        fallbackLabel: options.fallbackLabel || 'Use Passcode',
        disableDeviceFallback: options.disableDeviceFallback || false,
        cancelLabel: options.cancelLabel || 'Cancel',
      });

      return {
        success: result.success,
        error: result.error || null,
        warning: result.warning || null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        warning: null,
      };
    }
  }

  /**
   * Check if biometrics are available
   */
  getStatus() {
    return {
      available: this.isAvailable,
      enrolled: this.isEnrolled,
      type: this.biometricType,
    };
  }
}

export const biometricService = new BiometricService();
export default BiometricService;