import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
import "./styles.css";

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={"0.8rem"}
      bg="#313244"
      w={{ base: "100%", md: "33%" }}
      borderRadius="lg"
      borderWidth="none"
    >
      <Box
        pb="3"
        px="3"
        fontSize={{ base: "20px", md: "22px" }}
        fontFamily="Montserrat"
        textColor={"#FFFFFF"}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            borderRadius={50}
            display="flex"
            bg="#CBA6F7"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            overflow="hidden"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#1E1E2E"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        className="mychats-scroll"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#CBA6F7" : "#24273A"}
                  color={selectedChat === chat ? "black" : "white"}
                  px={3}
                  py={2}
                  borderRadius="50"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(
                          JSON.parse(localStorage.getItem("userInfo")),
                          chat.users
                        )
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
