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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const UpdatePassword = ({ user, whoseProfile, children }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        <ModalContent>
          <ModalHeader>Update Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                placeholder="Current Password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                mb="1rem"
              />
            </FormControl>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                mb="1rem"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm New Password"
                onChange={(e) => setRepeatNewPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                updatePassword();
              }}
              isLoading={loading}
            >
              Update Password
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatePassword;
