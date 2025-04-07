import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Button } from 'react-native';
import axios from 'axios';


const Signin = () => {
  const [from,setForm] = useState("")
  return (
    <SafeAreaView> 
      <Text>Sign In</Text>
    </SafeAreaView>
  );
};

export default Signin;
