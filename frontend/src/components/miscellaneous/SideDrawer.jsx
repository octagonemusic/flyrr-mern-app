import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import ChatLoading from "./ChatLoading";
import UserListItem from "../user-avatar/UserListItem";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import { color } from "framer-motion";

const SideDrawer = ({ fetchAgain, setFetchAgain }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setSelectedChat(null);
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "No Search Query",
        description: "Please enter a name or email to search for a user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
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

  return (
    <>
      <Box
        fontFamily={"Montserrat"}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#313244"
        width="100%"
        padding={"0.5rem"}
        borderWidth="none"
      >
        <Tooltip
          label="Search For Users!"
          hasArrow
          placement="bottom-end"
          fontFamily={"Montserrat"}
        >
          <Button
            variant="ghost"
            onClick={onOpen}
            bg={"#CBA6F7"}
            borderRadius={50}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} paddingX="1.5rem">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontFamily={"Montserrat"} fontSize={"2rem"} color={"#FFFFFF"}>
          FLYRR
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} color={"#FFFFFF"} />
              {notification.length != 0 && (
                <Box
                  as={"span"}
                  color={"white"}
                  position={"absolute"}
                  fontSize={"0.7rem"}
                  bgColor={"red"}
                  borderRadius={"50%"}
                  zIndex={9999}
                  ml="-1rem"
                  width="1rem"
                  height="1rem"
                >
                  <b>{notification.length}</b>
                </Box>
              )}
            </MenuButton>
            <MenuList
              pl="2"
              pr="2"
              bg={"#1E1E2E"}
              borderRadius={50}
              textColor={"#FFFFFF"}
              borderColor={"#1E1E2E"}
              textAlign={"Center"}
            >
              {!notification.length && "No new messages."}
              {notification.map((notif, i) => (
                <MenuItem
                  key={i}
                  bg={"#1E1E2E"}
                  textColor={"#FFFFFF"}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu bg={"#1E1E2E"}>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg={"#CBA6F7"}
              borderRadius={50}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList bg={"#1E1E2E"} border={"none"}>
              <ProfileModal
                user={user}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                whoseProfile={true}
              >
                <MenuItem bg={"#1E1E2E"} textColor={"#FFFFFF"}>
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuItem
                bg={"#1E1E2E"}
                textColor={"#FFFFFF"}
                onClick={logoutHandler}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" isOpen={isOpen} onClose={onClose} bg={"#1E1E2E"}>
        <DrawerOverlay />
        <DrawerContent bg={"#1E1E2E"}>
          <DrawerHeader textColor={"#FFFFFF"} bg={"#313244"}>
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box
              display="flex"
              paddingBottom="3"
              paddingTop="3"
              borderColor={"#313244"}
            >
              <Input
                borderRadius={50}
                bg={"#313244"}
                textColor={"#FFFFFF"}
                placeholder="Search by Name or Email"
                marginRight="2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} borderRadius={50} bg={"#CBA6F7"}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
