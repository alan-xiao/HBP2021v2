import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import ProfileCreation from "./screens/ProfileCreationScreen";
import { getUser } from "./graphql/CustomQueries";
import { createUser, createProfile, updateUser, updateProfile } from "./graphql/CustomMutations";
import { withAuthenticator } from "aws-amplify-react-native";
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

const randomImages = [
  "https://hieumobile.com/wp-content/uploads/avatar-among-us-2.jpg",
  "https://hieumobile.com/wp-content/uploads/avatar-among-us-3.jpg",
  "https://hieumobile.com/wp-content/uploads/avatar-among-us-6.jpg",
  "https://hieumobile.com/wp-content/uploads/avatar-among-us-9.jpg",
];

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const getRandomImage = () => {
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  };
  let userAlreadyExists = false
  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });

      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: userInfo.attributes.sub })
        );
        //userData.data.getUser
        if (userData.data.getUser) {
          console.log("User is already registered in database");
          userAlreadyExists = true;
          return;
        }
        // insert profile creation screeen.
        /*console.log(userData);
        const newProfile = {
          id: userInfo.attributes.sub,
          firstName: "John",
          lastName: "Cena",
          expectedGradYear: 2022,
          aboutMe: "Student of the class of 2022.",
          college: "Khoury college",
          major: "super science",
          imageUri: getRandomImage()
        }
        console.log("About to create profile");
        await API.graphql(graphqlOperation(createProfile, { input: newProfile }));
        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          profile: userInfo.attributes.sub
        };
        console.log("profile created.");
        await API.graphql(graphqlOperation(createUser, { input: newUser }));
        //query for profile info
        //ad the info to newProfile.
        console.log("user created");*/
        
      }
    };

    fetchUser();
  }, []);
  if (!isLoadingComplete) {
    return null;
  } else {
    if (userAlreadyExists) {
      return (
        <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
        </SafeAreaProvider>
      );
    }
    else {
      return (
        <SafeAreaProvider>
        <ProfileCreation />
        <StatusBar />
        </SafeAreaProvider>
      );
    }
  }
}
//<Navigation colorScheme={colorScheme} />
export default withAuthenticator(App);
