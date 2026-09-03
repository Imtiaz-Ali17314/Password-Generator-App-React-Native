import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Password must be at least 4 characters')
    .max(12, 'Password cannot exceed 12 characters')
    .required('Password length is required'),
});

export default function App() {
  const [password, setPassword] = useState('');
  const [isPassGenerated, setIsPassGenerated] = useState(false);

  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const generatePasswordString = (passLength: number) => {
    let charactersList = '';

    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*+?>/';

    if (lowerCase) charactersList += lowerCaseChars;
    if (upperCase) charactersList += upperCaseChars;
    if (numbers) charactersList += numberChars;
    if (symbols) charactersList += symbolChars;

    const passResult = createPassword(charactersList, passLength);

    setPassword(passResult);
    setIsPassGenerated(true);
  };

  const createPassword = (characters: string, passLength: number) => {
    let password = '';

    for (let i = 0; i < passLength; i++) {
      const characterIndex = Math.floor(Math.random() * characters.length);

      password += characters.charAt(characterIndex);
    }

    return password;
  };

  const resetPassword = () => {
    setPassword('');
    setIsPassGenerated(false);

    setLowerCase(true);
    setUpperCase(false);
    setNumbers(false);
    setSymbols(false);
  };

  // Visual Password Strength Evaluator
  const getStrengthInfo = (lengthStr: string) => {
    if (!isPassGenerated || !password) return null;
    const len = +lengthStr || password.length;
    const activeCount = [lowerCase, upperCase, numbers, symbols].filter(
      Boolean,
    ).length;

    if (len >= 10 && activeCount >= 3) {
      return {
        label: 'Ultra Strong',
        color: '#10B981',
        bg: '#064E3B',
        border: '#059669',
      };
    }
    if (len >= 8 && activeCount >= 2) {
      return {
        label: 'Strong',
        color: '#34D399',
        bg: '#065F46',
        border: '#10B981',
      };
    }
    if (len >= 6 && activeCount >= 1) {
      return {
        label: 'Medium',
        color: '#FBBF24',
        bg: '#78350F',
        border: '#D97706',
      };
    }
    return {
      label: 'Weak',
      color: '#F87171',
      bg: '#7F1D1D',
      border: '#DC2626',
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.topRow}>
                <View style={styles.brandRow}>
                  <View style={styles.logo}>
                    <Text style={styles.logoText}>⚡</Text>
                  </View>
                  <Text style={styles.brandName}>SECUREGEN</Text>
                </View>

                <View style={styles.offlineBadge}>
                  <View style={styles.offlineDot} />
                  <Text style={styles.offlineText}>100% Offline</Text>
                </View>
              </View>

              <Text style={styles.title}>
                Password
                <Text style={styles.titleAccent}> Generator</Text>
              </Text>

              <Text style={styles.subtitle}>
                Create strong, customized & random passwords instantly.
              </Text>
            </View>

            <Formik
              initialValues={{ passwordLength: '' }}
              validationSchema={PasswordSchema}
              onSubmit={values => {
                generatePasswordString(+values.passwordLength);
              }}
            >
              {({
                values,
                errors,
                touched,
                isValid,
                handleChange,
                handleSubmit,
                handleReset,
                setFieldValue,
              }) => {
                const strength = getStrengthInfo(values.passwordLength);

                return (
                  <View>
                    {/* Main Card */}
                    <View style={styles.mainCard}>
                      {/* Generated Password Section */}
                      <View style={styles.passwordSection}>
                        <View style={styles.sectionTopRow}>
                          <View>
                            <Text style={styles.eyebrow}>GENERATED PASSWORD</Text>
                            <Text style={styles.passwordHint}>
                              {isPassGenerated
                                ? 'Press & hold password to copy'
                                : 'Your password will appear below'}
                            </Text>
                          </View>

                          {strength && (
                            <View
                              style={[
                                styles.strengthBadge,
                                {
                                  backgroundColor: strength.bg,
                                  borderColor: strength.border,
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.strengthDot,
                                  { backgroundColor: strength.color },
                                ]}
                              />
                              <Text
                                style={[
                                  styles.strengthText,
                                  { color: strength.color },
                                ]}
                              >
                                {strength.label}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View
                          style={[
                            styles.passwordDisplay,
                            isPassGenerated && styles.passwordDisplayActive,
                          ]}
                        >
                          <Text
                            selectable={true}
                            style={[
                              styles.passwordText,
                              !isPassGenerated && styles.passwordPlaceholder,
                            ]}
                          >
                            {isPassGenerated ? password : '••••••••••••'}
                          </Text>
                        </View>
                      </View>

                      {/* Divider */}
                      <View style={styles.divider} />

                      {/* Password Length Section */}
                      <View style={styles.lengthSection}>
                        <View style={styles.labelRow}>
                          <View>
                            <Text style={styles.label}>Password Length</Text>
                            <Text style={styles.helperText}>
                              Select between 4 and 12 characters
                            </Text>
                          </View>

                          <View style={styles.numberBadge}>
                            <Text style={styles.numberBadgeText}>
                              {values.passwordLength || '—'}
                            </Text>
                          </View>
                        </View>

                        {/* Input & Quick Presets */}
                        <View style={styles.inputContainerRow}>
                          <TextInput
                            style={[
                              styles.input,
                              touched.passwordLength &&
                                errors.passwordLength &&
                                styles.inputError,
                            ]}
                            value={values.passwordLength}
                            onChangeText={handleChange('passwordLength')}
                            placeholder="Enter 4-12"
                            placeholderTextColor="#4B4958"
                            keyboardType="numeric"
                            maxLength={2}
                          />

                          {/* Quick Presets */}
                          <View style={styles.presetsRow}>
                            {[4, 8, 12].map(preset => {
                              const isSelected =
                                values.passwordLength === String(preset);
                              return (
                                <Pressable
                                  key={preset}
                                  style={[
                                    styles.presetChip,
                                    isSelected && styles.presetChipActive,
                                  ]}
                                  onPress={() =>
                                    setFieldValue('passwordLength', String(preset))
                                  }
                                >
                                  <Text
                                    style={[
                                      styles.presetText,
                                      isSelected && styles.presetTextActive,
                                    ]}
                                  >
                                    {preset}
                                  </Text>
                                </Pressable>
                              );
                            })}
                          </View>
                        </View>

                        {touched.passwordLength && errors.passwordLength && (
                          <Text style={styles.errorText}>
                            ⚠️ {errors.passwordLength}
                          </Text>
                        )}
                      </View>

                      {/* Character Options Section */}
                      <View style={styles.optionsSection}>
                        <View style={styles.optionsHeader}>
                          <Text style={styles.label}>Character Types</Text>
                          <Text style={styles.helperText}>
                            Customize character inclusion criteria
                          </Text>
                        </View>

                        <View style={styles.optionsGrid}>
                          {/* Lowercase Option */}
                          <TouchableOpacity
                            activeOpacity={0.9}
                            style={[
                              styles.optionCard,
                              lowerCase && styles.optionCardActiveLower,
                            ]}
                            onPress={() => setLowerCase(!lowerCase)}
                          >
                            <View style={styles.optionLeft}>
                              <View
                                style={[
                                  styles.optionSymbol,
                                  styles.lowerSymbolBg,
                                ]}
                              >
                                <Text style={styles.lowerSymbolText}>ab</Text>
                              </View>
                              <View style={styles.optionMeta}>
                                <Text style={styles.optionTitle}>Lowercase</Text>
                                <Text style={styles.optionSub}>a — z</Text>
                              </View>
                            </View>

                            <BouncyCheckbox
                              disableText={true}
                              size={22}
                              useBuiltInState={false}
                              isChecked={lowerCase}
                              onPress={() => setLowerCase(!lowerCase)}
                              fillColor="#8B5CF6"
                              unFillColor="#1C1A27"
                              iconStyle={styles.checkbox}
                              innerIconStyle={styles.innerCheckbox}
                            />
                          </TouchableOpacity>

                          {/* Uppercase Option */}
                          <TouchableOpacity
                            activeOpacity={0.9}
                            style={[
                              styles.optionCard,
                              upperCase && styles.optionCardActiveUpper,
                            ]}
                            onPress={() => setUpperCase(!upperCase)}
                          >
                            <View style={styles.optionLeft}>
                              <View
                                style={[
                                  styles.optionSymbol,
                                  styles.upperSymbolBg,
                                ]}
                              >
                                <Text style={styles.upperSymbolText}>AB</Text>
                              </View>
                              <View style={styles.optionMeta}>
                                <Text style={styles.optionTitle}>Uppercase</Text>
                                <Text style={styles.optionSub}>A — Z</Text>
                              </View>
                            </View>

                            <BouncyCheckbox
                              disableText={true}
                              size={22}
                              useBuiltInState={false}
                              isChecked={upperCase}
                              onPress={() => setUpperCase(!upperCase)}
                              fillColor="#38BDF8"
                              unFillColor="#1C1A27"
                              iconStyle={styles.checkbox}
                              innerIconStyle={styles.innerCheckbox}
                            />
                          </TouchableOpacity>

                          {/* Numbers Option */}
                          <TouchableOpacity
                            activeOpacity={0.9}
                            style={[
                              styles.optionCard,
                              numbers && styles.optionCardActiveNumber,
                            ]}
                            onPress={() => setNumbers(!numbers)}
                          >
                            <View style={styles.optionLeft}>
                              <View
                                style={[
                                  styles.optionSymbol,
                                  styles.numberSymbolBg,
                                ]}
                              >
                                <Text style={styles.numberSymbolText}>123</Text>
                              </View>
                              <View style={styles.optionMeta}>
                                <Text style={styles.optionTitle}>Numbers</Text>
                                <Text style={styles.optionSub}>0 — 9</Text>
                              </View>
                            </View>

                            <BouncyCheckbox
                              disableText={true}
                              size={22}
                              useBuiltInState={false}
                              isChecked={numbers}
                              onPress={() => setNumbers(!numbers)}
                              fillColor="#34D399"
                              unFillColor="#1C1A27"
                              iconStyle={styles.checkbox}
                              innerIconStyle={styles.innerCheckbox}
                            />
                          </TouchableOpacity>

                          {/* Symbols Option */}
                          <TouchableOpacity
                            activeOpacity={0.9}
                            style={[
                              styles.optionCard,
                              symbols && styles.optionCardActiveSymbols,
                            ]}
                            onPress={() => setSymbols(!symbols)}
                          >
                            <View style={styles.optionLeft}>
                              <View
                                style={[
                                  styles.optionSymbol,
                                  styles.symbolsSymbolBg,
                                ]}
                              >
                                <Text style={styles.symbolsSymbolText}>#$%</Text>
                              </View>
                              <View style={styles.optionMeta}>
                                <Text style={styles.optionTitle}>Symbols</Text>
                                <Text style={styles.optionSub}>! @ # $</Text>
                              </View>
                            </View>

                            <BouncyCheckbox
                              disableText={true}
                              size={22}
                              useBuiltInState={false}
                              isChecked={symbols}
                              onPress={() => setSymbols(!symbols)}
                              fillColor="#F472B6"
                              unFillColor="#1C1A27"
                              iconStyle={styles.checkbox}
                              innerIconStyle={styles.innerCheckbox}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Actions */}
                      <View style={styles.actions}>
                        <TouchableOpacity
                          activeOpacity={0.85}
                          disabled={!isValid}
                          style={[
                            styles.generateButton,
                            !isValid && styles.generateButtonDisabled,
                          ]}
                          onPress={() => handleSubmit()}
                        >
                          <Text style={styles.generateButtonText}>
                            Generate Password
                          </Text>
                          <Text style={styles.arrow}>→</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={styles.resetButton}
                          onPress={() => {
                            handleReset();
                            resetPassword();
                          }}
                        >
                          <Text style={styles.resetText}>↻ Reset settings</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
            </Formik>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerIcon}>🛡️</Text>
              <Text style={styles.footerText}>
                Passwords are generated locally. No data leaves your device.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0911',
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },

  /* Header */

  header: {
    marginBottom: 24,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    marginRight: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  brandName: {
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.5,
  },

  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161F1A',
    borderWidth: 1,
    borderColor: '#1E382B',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 6,
  },

  offlineText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: -1.2,
  },

  titleAccent: {
    color: '#A78BFA',
  },

  subtitle: {
    color: '#8E8C9A',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },

  /* Main Card */

  mainCard: {
    backgroundColor: '#13111C',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#232033',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },

  /* Password Section */

  passwordSection: {
    marginBottom: 20,
  },

  sectionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  eyebrow: {
    color: '#8E8C9A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  passwordHint: {
    color: '#656372',
    fontSize: 11,
    marginTop: 3,
  },

  strengthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  strengthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  strengthText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  passwordDisplay: {
    minHeight: 90,
    borderRadius: 18,
    backgroundColor: '#0A0911',
    borderWidth: 1.5,
    borderColor: '#262238',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  passwordDisplayActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#100C1B',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },

  passwordText: {
    color: '#F4F4F5',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: 'monospace',
  },

  passwordPlaceholder: {
    color: '#343242',
    letterSpacing: 4,
    fontFamily: undefined,
  },

  divider: {
    height: 1,
    backgroundColor: '#211E2E',
    marginBottom: 22,
  },

  /* Length Section */

  lengthSection: {
    marginBottom: 24,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  helperText: {
    color: '#716F82',
    fontSize: 11,
    marginTop: 3,
  },

  numberBadge: {
    minWidth: 44,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#231B3A',
    borderWidth: 1,
    borderColor: '#4C3575',
  },

  numberBadgeText: {
    color: '#C4B5FD',
    fontSize: 15,
    fontWeight: '900',
  },

  inputContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    height: 52,
    backgroundColor: '#0A0911',
    borderWidth: 1.5,
    borderColor: '#29253B',
    borderRadius: 14,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#1C1215',
  },

  presetsRow: {
    flexDirection: 'row',
    marginLeft: 10,
  },

  presetChip: {
    width: 44,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1B1828',
    borderWidth: 1,
    borderColor: '#2C283F',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  presetChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#9333EA',
  },

  presetText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '800',
  },

  presetTextActive: {
    color: '#FFFFFF',
  },

  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },

  /* Options Section */

  optionsSection: {
    marginBottom: 24,
  },

  optionsHeader: {
    marginBottom: 14,
  },

  optionsGrid: {
    gap: 10,
  },

  optionCard: {
    width: '100%',
    minHeight: 64,
    backgroundColor: '#0A0911',
    borderWidth: 1.5,
    borderColor: '#232033',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionCardActiveLower: {
    borderColor: '#7C3AED',
    backgroundColor: '#171226',
  },

  optionCardActiveUpper: {
    borderColor: '#0284C7',
    backgroundColor: '#0F1E2E',
  },

  optionCardActiveNumber: {
    borderColor: '#059669',
    backgroundColor: '#0C221A',
  },

  optionCardActiveSymbols: {
    borderColor: '#DB2777',
    backgroundColor: '#241220',
  },

  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  optionSymbol: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  lowerSymbolBg: {
    backgroundColor: '#2A1F45',
  },

  lowerSymbolText: {
    color: '#C4B5FD',
    fontSize: 13,
    fontWeight: '900',
  },

  upperSymbolBg: {
    backgroundColor: '#172E48',
  },

  upperSymbolText: {
    color: '#7DD3FC',
    fontSize: 13,
    fontWeight: '900',
  },

  numberSymbolBg: {
    backgroundColor: '#13352A',
  },

  numberSymbolText: {
    color: '#6EE7B7',
    fontSize: 13,
    fontWeight: '900',
  },

  symbolsSymbolBg: {
    backgroundColor: '#3D1B33',
  },

  symbolsSymbolText: {
    color: '#F472B6',
    fontSize: 12,
    fontWeight: '900',
  },

  optionMeta: {
    flex: 1,
    justifyContent: 'center',
  },

  optionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  optionSub: {
    color: '#716F82',
    fontSize: 11,
    marginTop: 2,
  },

  checkbox: {
    borderRadius: 6,
  },

  innerCheckbox: {
    borderRadius: 6,
  },

  /* Buttons */

  actions: {
    marginTop: 4,
  },

  generateButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },

  generateButtonDisabled: {
    backgroundColor: '#2A233C',
    shadowOpacity: 0,
    elevation: 0,
  },

  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 10,
    marginTop: -2,
    fontWeight: '900',
  },

  resetButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  resetText: {
    color: '#8E8C9A',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Footer */

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
  },

  footerIcon: {
    fontSize: 14,
    marginRight: 8,
  },

  footerText: {
    color: '#656372',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});