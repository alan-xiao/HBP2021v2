import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { ChatRoom } from "../../types";
import styles from "./style";
import { useNavigation } from "@react-navigation/native";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getProfile } from "../../graphql/CustomQueries";

export type ChatListItemProps = {
  chatRoom: ChatRoom;
};
const ChatListItem = (props: ChatListItemProps) => {
  const { chatRoom } = props;
  const [otherUser, setOtherUser] = useState(null);
  const [otherUserProfile, setOtherUserProfile] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getOtherUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      if (chatRoom.chatRoomUsers.items[0].user.id === userInfo.attributes.sub) {
        setOtherUser(chatRoom.chatRoomUsers.items[1].user);
      } else {
        setOtherUser(chatRoom.chatRoomUsers.items[0].user);
      }
    };
    const getOtherUserProfile = async () => {
      const otherProfile = await API.graphql(
        graphqlOperation(getProfile, { id: otherUser.profile}));
      setOtherUserProfile(otherProfile as any);

    }
    getOtherUser();
    getOtherUserProfile();
  }, []);

  const onClick = () => {
    navigation.navigate("ChatRoom", { id: chatRoom.id, name: otherUser.name });
  };

  if (!otherUser) {
    return null;
  }
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: otherUserProfile.imageUri }} style={styles.avatar} />

          <View style={styles.midContainer}>
            <Text style={styles.username}>{otherUser.name}</Text>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {chatRoom.lastMessage
                ? `${chatRoom.lastMessage.user.name}: ${chatRoom.lastMessage.content}`
                : ""}
            </Text>
          </View>
        </View>

        <Text style={styles.time}>
          {chatRoom.lastMessage &&
            moment(chatRoom.lastMessage.createdAt).format("MM/DD/YYYY")}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatListItem;
