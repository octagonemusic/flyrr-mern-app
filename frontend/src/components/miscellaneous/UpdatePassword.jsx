import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  InputRightElement,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const UpdatePassword = ({ user, whoseProfile, children }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const updatePassword = async () => {
    if (!newPassword || !repeatNewPassword || !currentPassword) {
      return toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    if (newPassword != repeatNewPassword) {
      return toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      setLoading(true);
      const { response } = await axios.put(
        "/api/user/updatepassword",
        { currentPassword, newPassword },
        config
      );
      toast({
        title: "Password updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      {whoseProfile == true ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <span>{children}</span>
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#1E1E2E"}>
          <ModalHeader textColor={"#FFFFFF"}>Update Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel  textColor={"#FFFFFF"}>Current Password</FormLabel>
              <InputGroup>
                <Input
                  borderColor={"#313244"}
                  bg={"#313244"}
                  borderRadius={50}
                  textColor={"#FFFFFF"}
                  type={show ? "text" : "password"}
                  placeholder="Current Password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  mb="1rem"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size={"sm"} onClick={handleClick} borderRadius={50} bg={"#CBA6F7"} paddingRight={"0.5rem"}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel  textColor={"#FFFFFF"}>New Password</FormLabel>
              <InputGroup>
                <Input
                  borderColor={"#313244"}
                  bg={"#313244"}
                  borderRadius={50}
                  textColor={"#FFFFFF"}
                  type={show ? "text" : "password"}
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  mb="1rem"
                />

                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size={"sm"} onClick={handleClick} borderRadius={50} bg={"#CBA6F7"} paddingRight={"0.5rem"}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel  textColor={"#FFFFFF"}>Confirm New Password</FormLabel>
              <InputGroup>
                <Input
                  borderColor={"#313244"}
                  bg={"#313244"}
                  borderRadius={50}
                  type={show ? "text" : "password"}
                  placeholder="Confirm New Password"
                  onChange={(e) => setRepeatNewPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size={"sm"} onClick={handleClick}  borderRadius={50} bg={"#CBA6F7"} paddingRight={"0.5rem"} >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              bg={"#CBA6F7"}
              borderRadius={50}
              mr={3}
              onClick={() => {
                updatePassword();
              }}
              isLoading={loading}
            >
              Update Password
            </Button>
            <Button variant="ghost" onClick={onClose} bg={"#e78284"} borderRadius={50}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatePassword;
