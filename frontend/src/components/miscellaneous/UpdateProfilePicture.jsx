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
import { useEffect, useState } from "react";

const UpdateProfilePicture = ({
  user,
  fetchAgain,
  setFetchAgain,
  whoseProfile,
  children,
}) => {
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics == undefined) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type == "image/jpeg" || pics.type == "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "flyrr-mern-app");
      data.append("cloud_name", "dcapvg9qj");
      fetch("https://api.cloudinary.com/v1_1/dcapvg9qj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleUpdateProfilePicture = async () => {
    setLoading(true);
    if (changed == false) {
      toast({
        title: "No file selected!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.put(
          "/api/user/updateprofilepic",
          { pic },
          config
        );

        toast({
          title: "Success",
          description: "Profile picture updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });

        user.pic = pic;
        localStorage.setItem("userInfo", JSON.stringify(user));
        setFetchAgain(!fetchAgain);

        setLoading(false);
        setChanged(false);
        onClose();
      } catch (error) {
        toast({
          title: "Error",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });

        setLoading(false);
      }
    }
  };

  return (
    <>
      {whoseProfile == true ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <span>{children}</span>
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
            Update your profile picture
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <FormControl id="pic">
              <FormLabel>Upload your Profile Picture</FormLabel>
              <Input
                type="file"
                p="1.5"
                accept="image/*"
                onChange={(e) => {
                  postDetails(e.target.files[0]);
                  setChanged(true);
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUpdateProfilePicture}
              isLoading={loading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateProfilePicture;
