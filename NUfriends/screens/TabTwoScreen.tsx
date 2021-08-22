import * as React from 'react';
import { StyleSheet, Button } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getUser, getProfile } from "../graphql/CustomQueries";



export default function TabTwoScreen() {
  const [backendOutput, setBackendOutput] = React.useState("hmmm");
  React.useEffect(() => {
    const backendCheck = async () => {
    
      const userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: userInfo.attributes.sub })
        );
        //userData.data.getUser
        if (!userData.data.getUser) {
          console.log("User data not found!");
          setBackendOutput("User data not found!")
          return;
        }
        const username = userData.data.getUser.name;
        const userProfile = await API.graphql(
          graphqlOperation(getProfile, { id: userInfo.attributes.sub }));
        let showUserInfo = "Username: " + username + "\nFirst name: " + userProfile.data.getProfile.firstName + "\nLast name: " + userProfile.data.getProfile.lastName;
        setBackendOutput(showUserInfo);
        return;
      }
      setBackendOutput("Couldn't find logged in user.")
      return;
    };
    backendCheck();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Button
        onPress={signOut}
        title="logout button"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Text>{backendOutput}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
    </View>
  );
}
/*
const backendCheck = async () => {
  setBackendOutput("Hey!");
  return;
  return (<Text>Helloooo</Text>);
  const userInfo = await Auth.currentAuthenticatedUser({
    bypassCache: true,
  });
  if (userInfo) {
    const userData = await API.graphql(
      graphqlOperation(getUser, { id: userInfo.attributes.sub })
    );
    //userData.data.getUser
    if (!userData.data.getUser) {
      console.log("User data not found!");
      return <Text style={styles.title}>User data not found!</Text>;
    }
    const username = userData.getUser.name;
    const userProfile = await API.graphql(
      graphqlOperation(getProfile, { id: userData.getUser.profile}));
    return <Text style={styles.title}>"Username: " + username + "\nFirst name: " + userProfile.firstName + "\nLast name: " + userProfile.lastName</Text>;
  }
  return <Text style={styles.title}>"Um hmmm"</Text>;
}
*/
async function signOut() {
  try {
      await Auth.signOut();
  } catch (error) {
      console.log('error signing out: ', error);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
