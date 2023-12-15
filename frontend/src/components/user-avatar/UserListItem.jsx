import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#313244"
      _hover={{
        background: "#CBA6F7",
        color: "#000000",
      }}
      color={"#FFFFFF"}
      width="100%"
      display="flex"
      alignItems="center"
      paddingX="3px"
      paddingY="2px"
      marginBottom="2"
      borderRadius="50"
    >
      <Avatar
        mr={"1rem"}
        ml={"0.4rem"}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text >{user.name}</Text>
        <Text fontSize="xs">{user.email}</Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
