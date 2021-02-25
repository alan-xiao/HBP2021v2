import * as React from "react";
import { FlatList, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import ContactListItem from "../components/ContactListItem";

import { API, graphqlOperation, Auth } from "aws-amplify";

import { listUsers } from "../graphql/queries";
import users from "../data/Users";
import NewMessageButton from "../components/NewMessageButton";
import { useEffect } from "react";
import { useState } from "react";

export default function ContactsScreen() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();

        const usersData = await API.graphql(
          graphqlOperation(listUsers, {
            filter: {
              id: {
                ne: userInfo.attributes.sub,
              },
            },
          })
        );
        setUsers(usersData.data.listUsers.items);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUsers();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        data={users}
        renderItem={({ item }) => <ContactListItem user={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
