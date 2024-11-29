import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "//flyrrchat.onrender.com/";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    setChats,
  } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load the messages.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat._id === newMessageRecieved.chat._id) {
              return {
                ...chat,
                latestMessage: newMessageRecieved,
                _id: chat._id, // Preserve the original _id
              };
            }
            return chat;
          });
        });
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (newMessage) {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };

          // Check if message starts and ends with triple backticks
          const codeBlockRegex = /^```(\w+)?\n([\s\S]*?)```$/;
          const match = newMessage.match(codeBlockRegex);

          let messageData = {
            content: newMessage,
            chatId: selectedChat,
            isCode: false,
            language: null,
          };

          if (match) {
            messageData = {
              content: match[2], // The code content
              chatId: selectedChat,
              isCode: true,
              language: match[1] || "plaintext", // The language or default to plaintext
            };
          }

          setNewMessage("");
          const textarea = document.querySelector(".sendmessages");
          if (textarea) {
            textarea.style.height = "40px";
          }

          const { data } = await axios.post(
            "/api/message",
            messageData,
            config
          );
          socket.emit("new message", data);
          setMessages([...messages, data]);

          // Update latest message in chats
          setChats((prevChats) => {
            return prevChats.map((chat) => {
              if (chat._id === selectedChat._id) {
                return {
                  ...chat,
                  latestMessage: data,
                  _id: chat._id, // Preserve the original _id
                };
              }
              return chat;
            });
          });
        } catch (error) {
          toast({
            title: "Error Occurred!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    } else if (e.key === "Tab") {
      e.preventDefault(); // Prevent losing focus
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      // Add two spaces for tab
      const newValue =
        newMessage.substring(0, start) + "  " + newMessage.substring(end);
      setNewMessage(newValue);

      // Put cursor after the inserted tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={"0.5rem"}
            px={"0.8rem"}
            mt="0"
            pt="0"
            width="100%"
            fontFamily="Montserrat"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              borderRadius={50}
              bg={"#CBA6F7"}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                }
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#1E1E2E"
            w="97%"
            h="100%"
            mb={3}
            borderRadius="lg"
            overflowY="hidden"
          >
            <div className="messages" style={{ overflowY: "auto", flex: 1 }}>
              <ScrollableChat messages={messages} />
            </div>

            <FormControl isRequired mt={3}>
              <Box display="flex" gap={2}>
                <Textarea
                  borderColor={"#313244"}
                  className="sendmessages"
                  borderRadius={15}
                  color={"#FFFFFF"}
                  variant="filled"
                  bg="#313244"
                  placeholder="Send A Message (Shift + Enter for new line)"
                  _hover={{
                    background: "#313244",
                  }}
                  onChange={(e) => {
                    typingHandler(e);
                    e.target.style.height = "40px";
                    e.target.style.height = `${Math.min(
                      e.target.scrollHeight,
                      150
                    )}px`;
                    e.target.style.overflowY =
                      e.target.scrollHeight > 150 ? "auto" : "hidden";
                  }}
                  onKeyDown={handleKeyDown}
                  value={newMessage}
                  minH="40px"
                  maxH="150px"
                  resize="none"
                  overflow="hidden"
                  rows={1}
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#1e1e2e",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#313244",
                      borderRadius: "4px",
                    },
                    resize: "none",
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "#45475a",
                    },
                  }}
                />
                <IconButton
                  icon={<ArrowForwardIcon />}
                  bg="#CBA6F7"
                  color="black"
                  borderRadius={15}
                  _hover={{ bg: "#B4BEFE" }}
                  onClick={(e) => sendMessage({ key: "Enter" })}
                  aria-label="Send message"
                  alignSelf="flex-end"
                  h="40px"
                />
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Montserrat">
            Click on a user to start chatting.
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
