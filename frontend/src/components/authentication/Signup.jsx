import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

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
          console.log(err);
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

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password != confirmPassword) {
      toast({
        title: "Passwords do not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/signup",
        { name, email, password, pic },
        config
      );

      toast({
        title: "Account created successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);

      navigate("/chats");
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="name" isRequired>
        <FormLabel textColor={"#E5E5E5"} mb={0.5}>Name</FormLabel>
        <Input
          backgroundColor={"#ffffff"}
          borderRadius={50}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          mb={"0.6rem"}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel textColor={"#E5E5E5"} mb={0.5}>Email</FormLabel>
        <Input
          backgroundColor={"#ffffff"}
          borderRadius={50}
          type="email"
          placeholder="Enter your e-mail"
          onChange={(e) => setEmail(e.target.value)}
          mb={"0.6rem"}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel textColor={"#E5E5E5"} mb={0.5}>Password</FormLabel>
        <InputGroup>
          <Input
            backgroundColor={"#ffffff"}
            borderRadius={50}
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
            mb={"0.6rem"}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size={"sm"} onClick={handleClick} borderRadius={50} bg={"#FFFFFF"}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel textColor={"#E5E5E5"} mb={0.5}>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            backgroundColor={"#ffffff"}
            borderRadius={50}
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            mb={"0.6rem"}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size={"sm"} onClick={handleClick} borderRadius={50} bg={"#FFFFFF"}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel textColor={"#E5E5E5"} mb={0.5}>Upload your Profile Picture</FormLabel>
        <Input
          backgroundColor={"#ffffff"}
          border="none"
          borderRadius={50}
          type="file"
          size="lg"
          padding="0.34rem 0.8rem"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
          mb={"0.6"}
        />
      </FormControl>

      <Button
        bg={"#CBA6F7"}
        borderRadius={50}
        width="60%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up!
      </Button>
    </VStack>
  );
};

export default Signup;
