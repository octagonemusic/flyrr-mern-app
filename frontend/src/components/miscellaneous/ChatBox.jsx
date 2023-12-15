import { Box } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      padding="0rem"
      ml="10px"
      bg="#313244"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="none"
      justifyContent={"center"}
      textColor={"#FFFFFF"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
