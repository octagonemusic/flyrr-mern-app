import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import UpdateProfilePicture from "./UpdateProfilePicture";
import UpdatePassword from "./UpdatePassword";

const ProfileModal = ({
  user,
  fetchAgain,
  setFetchAgain,
  whoseProfile,
  children,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <UpdateProfilePicture
              user={user}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              whoseProfile={whoseProfile}
            >
              <Tooltip
                label="Click to update profile picture"
                display={whoseProfile ? "block" : "none"}
              >
                <Image
                  borderRadius="50%"
                  boxSize="150px"
                  src={user.pic}
                  alt={user.name}
                  marginBottom="1.5rem"
                  cursor={whoseProfile ? "pointer" : "default"}
                />
              </Tooltip>
            </UpdateProfilePicture>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            {whoseProfile ? (
              <UpdatePassword user={user} whoseProfile={whoseProfile}>
                <Button colorScheme="blue" mr={2}>
                  {" "}
                  Update Password{" "}
                </Button>
              </UpdatePassword>
            ) : (
              <> </>
            )}
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
