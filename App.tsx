import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Password must be at least 4 characters')
    .max(12, 'Password cannot exceed 12 characters')
    .required('Password length is required'),
});

export default function App() {
  const [password, setPassword] = useState('');
  const [isPassGenerated, setIsPassGenerated] = useState(false);

  const [lowerCase, setlowerCase] = useState(true);
  const [upperCase, setupperCase] = useState(false);
  const [numbers, setnumbers] = useState(false);
  const [symbols, setsymbols] = useState(false);

  const generatePasswordString = (passLength: number) => {
    //
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
    //
  };

  return (
    <View>
      <Text>App</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
