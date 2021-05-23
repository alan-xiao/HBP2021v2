import React from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { User } from "../../types";
import styles from "./style";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createChatRoom, createChatRoomUser } from "../../graphql/mutations";
import { listChatRoomUsers } from "../../graphql/queries";
export type ContactListItemProps = {
  user: User;
};

const ContactListItem = (props: ContactListItemProps) => {
  const { user } = props;

  const navigation = useNavigation();

  const onClick = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      let otherUserFilter = {
        userID: {
          eq: user.id,
        },
      };
      const otherChatRoomUsers = await API.graphql({
        query: listChatRoomUsers,
        variables: { filter: otherUserFilter },
      });

      let currentUserFilter = {
        userID: {
          eq: userInfo.attributes.sub,
        },
      };
      const currentChatRoomUsers = await API.graphql({
        query: listChatRoomUsers,
        variables: { filter: currentUserFilter },
      });

      //console.info(otherChatRoomUsers.data.listChatRoomUsers.items);

      let theirChatRoomIDs = [];
      let ourChatRoomIDs = [];
      for (let i = 0; i < otherChatRoomUsers.data.listChatRoomUsers.items.length; i++) {
        theirChatRoomIDs.push(otherChatRoomUsers.data.listChatRoomUsers.items[i].chatRoomID);
        //console.log(i);
        //console.log(otherChatRoomUsers.data.listChatRoomUsers.items[i].chatRoomID);
      }
      for (let i = 0; i < currentChatRoomUsers.data.listChatRoomUsers.items.length; i++) {
        ourChatRoomIDs.push(currentChatRoomUsers.data.listChatRoomUsers.items[i].chatRoomID);
      }
      let alreadyExists = false;
      let theMatchingChatRoom;
      for (let i = 0; i < ourChatRoomIDs.length; i++) {
        if (theirChatRoomIDs.includes(ourChatRoomIDs[i])) {
          alreadyExists = true;
          theMatchingChatRoom = ourChatRoomIDs[i];
        }
      }
      if (alreadyExists) {
        //already have convo with them
        console.log("Already has chat room with them.");
        navigation.navigate("ChatRoom", {
          id: theMatchingChatRoom,
          name: "Hardcoded Name",
        });
      } else {
        // 1. Create a new chat room
      
        const newChatRoomData = await API.graphql(
          graphqlOperation(createChatRoom, {
            input: {
              lastMessageID: "zz753fca-e8c3-473b-8e85-b14196e84e16",
            },
          })
        );

        if (!newChatRoomData.data) {
          console.log("Failed to create a chat room!");
          return;
        }

        const newChatRoom = newChatRoomData.data.createChatRoom;

        // 2. Add 'user' to the Chat Room
        await API.graphql(
          graphqlOperation(createChatRoomUser, {
            input: {
              userID: user.id,
              chatRoomID: newChatRoom.id,
            },
          })
        );

        // 3. Add authenticated user to the Chat Room
        await API.graphql(
          graphqlOperation(createChatRoomUser, {
            input: {
              userID: userInfo.attributes.sub,
              chatRoomID: newChatRoom.id,
            },
          })
        );

        navigation.navigate("ChatRoom", {
          id: newChatRoom.id,
          name: "Hardcoded Name",
        });
      }
      
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: user.imageUri }} style={styles.avatar} />

          <View style={styles.midContainer}>
            <Text style={styles.username}>{user.name}</Text>
            <Text numberOfLines={1} style={styles.status}>
              {user.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactListItem;
