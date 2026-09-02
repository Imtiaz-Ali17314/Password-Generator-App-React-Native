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

  const generatePasswordString = (length: number) => {
    //
  };

  const createPassword = (characters: string, length: number) => {
    //
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
