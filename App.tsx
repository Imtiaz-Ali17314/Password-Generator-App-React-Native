import { useState } from 'react';
import {
  ScrollView,
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>✦</Text>
              </View>

              <Text style={styles.brandName}>SECUREGEN</Text>
            </View>

            <Text style={styles.title}>
              Password
              <Text style={styles.titleAccent}> Generator</Text>
            </Text>

            <Text style={styles.subtitle}>
              Create strong, random passwords in seconds.
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
            }) => (
              <View>
                {/* Main Card */}
                <View style={styles.mainCard}>
                  {/* Generated Password */}
                  <View style={styles.passwordSection}>
                    <View style={styles.sectionTopRow}>
                      <View>
                        <Text style={styles.eyebrow}>GENERATED PASSWORD</Text>

                        <Text style={styles.passwordHint}>
                          {isPassGenerated
                            ? 'Long press to copy'
                            : 'Your password will appear here'}
                        </Text>
                      </View>

                      {isPassGenerated && (
                        <View style={styles.strongBadge}>
                          <View style={styles.greenDot} />
                          <Text style={styles.strongText}>Strong</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.passwordDisplay}>
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

                  {/* Password Length */}
                  <View style={styles.lengthSection}>
                    <View style={styles.labelRow}>
                      <View>
                        <Text style={styles.label}>Password Length</Text>

                        <Text style={styles.helperText}>
                          Choose between 4 and 12 characters
                        </Text>
                      </View>

                      <View style={styles.numberBadge}>
                        <Text style={styles.numberBadgeText}>
                          {values.passwordLength || '—'}
                        </Text>
                      </View>
                    </View>

                    <TextInput
                      style={[
                        styles.input,
                        touched.passwordLength &&
                          errors.passwordLength &&
                          styles.inputError,
                      ]}
                      value={values.passwordLength}
                      onChangeText={handleChange('passwordLength')}
                      placeholder="Enter length"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                      maxLength={2}
                    />

                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>
                        {errors.passwordLength}
                      </Text>
                    )}
                  </View>

                  {/* Character Options */}
                  <View style={styles.optionsSection}>
                    <View style={styles.optionsHeader}>
                      <View>
                        <Text style={styles.label}>Character Types</Text>

                        <Text style={styles.helperText}>
                          Customize your password
                        </Text>
                      </View>
                    </View>

                    <View style={styles.optionsGrid}>
                      {/* Lowercase */}
                      <View
                        style={[
                          styles.optionCard,
                          lowerCase && styles.optionCardActive,
                        ]}
                      >
                        <View style={styles.optionContent}>
                          <View
                            style={[styles.optionSymbol, styles.lowerSymbol]}
                          >
                            <Text style={styles.symbolText}>ab</Text>
                          </View>

                          <View>
                            <Text style={styles.optionTitle}>Lowercase</Text>

                            <Text style={styles.optionSub}>a — z</Text>
                          </View>
                        </View>

                        <BouncyCheckbox
                          useBuiltInState={false}
                          isChecked={lowerCase}
                          onPress={() => setLowerCase(!lowerCase)}
                          fillColor="#7C3AED"
                          unFillColor="#242331"
                          iconStyle={styles.checkbox}
                          innerIconStyle={styles.innerCheckbox}
                        />
                      </View>

                      {/* Uppercase */}
                      <View
                        style={[
                          styles.optionCard,
                          upperCase && styles.optionCardActive,
                        ]}
                      >
                        <View style={styles.optionContent}>
                          <View
                            style={[styles.optionSymbol, styles.upperSymbol]}
                          >
                            <Text style={styles.symbolText}>AB</Text>
                          </View>

                          <View>
                            <Text style={styles.optionTitle}>Uppercase</Text>

                            <Text style={styles.optionSub}>A — Z</Text>
                          </View>
                        </View>

                        <BouncyCheckbox
                          useBuiltInState={false}
                          isChecked={upperCase}
                          onPress={() => setUpperCase(!upperCase)}
                          fillColor="#7C3AED"
                          unFillColor="#242331"
                          iconStyle={styles.checkbox}
                          innerIconStyle={styles.innerCheckbox}
                        />
                      </View>

                      {/* Numbers */}
                      <View
                        style={[
                          styles.optionCard,
                          numbers && styles.optionCardActive,
                        ]}
                      >
                        <View style={styles.optionContent}>
                          <View
                            style={[styles.optionSymbol, styles.numberSymbol]}
                          >
                            <Text style={styles.symbolText}>123</Text>
                          </View>

                          <View>
                            <Text style={styles.optionTitle}>Numbers</Text>

                            <Text style={styles.optionSub}>0 — 9</Text>
                          </View>
                        </View>

                        <BouncyCheckbox
                          useBuiltInState={false}
                          isChecked={numbers}
                          onPress={() => setNumbers(!numbers)}
                          fillColor="#7C3AED"
                          unFillColor="#242331"
                          iconStyle={styles.checkbox}
                          innerIconStyle={styles.innerCheckbox}
                        />
                      </View>

                      {/* Symbols */}
                      <View
                        style={[
                          styles.optionCard,
                          symbols && styles.optionCardActive,
                        ]}
                      >
                        <View style={styles.optionContent}>
                          <View
                            style={[styles.optionSymbol, styles.symbolsSymbol]}
                          >
                            <Text style={styles.symbolText}>#$%</Text>
                          </View>

                          <View>
                            <Text style={styles.optionTitle}>Symbols</Text>

                            <Text style={styles.optionSub}>! @ # $</Text>
                          </View>
                        </View>

                        <BouncyCheckbox
                          useBuiltInState={false}
                          isChecked={symbols}
                          onPress={() => setSymbols(!symbols)}
                          fillColor="#7C3AED"
                          unFillColor="#242331"
                          iconStyle={styles.checkbox}
                          innerIconStyle={styles.innerCheckbox}
                        />
                      </View>
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
                      <Text style={styles.resetText}>Reset settings</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerIcon}>◈</Text>

            <Text style={styles.footerText}>
              Your password is generated locally on your device.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0C14',
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 35,
  },

  /* Header */

  header: {
    marginBottom: 26,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    marginRight: 10,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  brandName: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 43,
    fontWeight: '900',
    letterSpacing: -1.3,
  },

  titleAccent: {
    color: '#A78BFA',
  },

  subtitle: {
    color: '#71717A',
    fontSize: 14,
    marginTop: 9,
    lineHeight: 20,
  },

  /* Main Card */

  mainCard: {
    backgroundColor: '#17161F',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#292733',
    padding: 18,
  },

  /* Password */

  passwordSection: {
    marginBottom: 20,
  },

  sectionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 13,
  },

  eyebrow: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  passwordHint: {
    color: '#52525B',
    fontSize: 11,
    marginTop: 4,
  },

  strongBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13251B',
    borderWidth: 1,
    borderColor: '#21472D',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 5,
  },

  strongText: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '800',
  },

  passwordDisplay: {
    minHeight: 86,
    borderRadius: 16,
    backgroundColor: '#0F0E15',
    borderWidth: 1,
    borderColor: '#302D3B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  passwordText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: 1.2,
    textAlign: 'center',
  },

  passwordPlaceholder: {
    color: '#3F3E48',
    letterSpacing: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#292733',
    marginBottom: 22,
  },

  /* Length */

  lengthSection: {
    marginBottom: 25,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  label: {
    color: '#F4F4F5',
    fontSize: 15,
    fontWeight: '800',
  },

  helperText: {
    color: '#60606A',
    fontSize: 11,
    marginTop: 4,
  },

  numberBadge: {
    minWidth: 42,
    height: 34,
    paddingHorizontal: 9,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#241A3D',
    borderWidth: 1,
    borderColor: '#432D6C',
  },

  numberBadgeText: {
    color: '#C4B5FD',
    fontSize: 14,
    fontWeight: '900',
  },

  input: {
    height: 52,
    backgroundColor: '#111017',
    borderWidth: 1,
    borderColor: '#302E38',
    borderRadius: 13,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  inputError: {
    borderColor: '#EF4444',
  },

  errorText: {
    color: '#F87171',
    fontSize: 11,
    marginTop: 7,
    marginLeft: 2,
  },

  /* Options */

  optionsSection: {
    marginBottom: 25,
  },

  optionsHeader: {
    marginBottom: 12,
  },

  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  optionCard: {
    width: '48.5%',
    minHeight: 83,
    backgroundColor: '#111017',
    borderWidth: 1,
    borderColor: '#292733',
    borderRadius: 14,
    padding: 10,
    marginBottom: 9,
    justifyContent: 'space-between',
  },

  optionCardActive: {
    borderColor: '#4C3575',
    backgroundColor: '#191524',
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionSymbol: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  lowerSymbol: {
    backgroundColor: '#272036',
  },

  upperSymbol: {
    backgroundColor: '#2B2139',
  },

  numberSymbol: {
    backgroundColor: '#22283B',
  },

  symbolsSymbol: {
    backgroundColor: '#362330',
  },

  symbolText: {
    color: '#D4D4D8',
    fontSize: 10,
    fontWeight: '900',
  },

  optionTitle: {
    color: '#E4E4E7',
    fontSize: 12,
    fontWeight: '800',
  },

  optionSub: {
    color: '#52525B',
    fontSize: 9,
    marginTop: 3,
  },

  checkbox: {
    borderRadius: 5,
  },

  innerCheckbox: {
    borderRadius: 5,
  },

  /* Buttons */

  actions: {
    marginTop: 2,
  },

  generateButton: {
    height: 55,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  generateButtonDisabled: {
    backgroundColor: '#3A3150',
    shadowOpacity: 0,
    elevation: 0,
  },

  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 10,
    marginTop: -2,
  },

  resetButton: {
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  resetText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Footer */

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 19,
    paddingHorizontal: 10,
  },

  footerIcon: {
    color: '#52525B',
    fontSize: 12,
    marginRight: 7,
  },

  footerText: {
    color: '#52525B',
    fontSize: 10,
    textAlign: 'center',
  },
});