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
import { set } from "mongoose";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  function isValidEmail(email) {
    // Define a regular expression pattern for email validation.
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email",
        status: "error",
        duration: 3000,
        isClosable: true,
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
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Success",
        description: "Logged in successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
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
  };

  return (
    <VStack spacing="5px" color="white">
      <FormControl id="email" isRequired>
        <FormLabel
          fontWeight={"extrabold"}
          requiredIndicator={false}
          fontSize="15px"
          fontFamily="Montserrat"
          textColor={"#E5E5E5"}
          mb={"0.5"}
        >
          Email
        </FormLabel>
        <Input
          bg={"#FFFFFF"}
          fontWeight={"light"}
          fontFamily={"Montserrat"}
          borderRadius={50}
          textColor={"#000000"}
          type="email"
          placeholder="Enter your e-mail"
          onChange={(e) => setEmail(e.target.value)}
          mb={"1rem"}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel
          fontWeight={"extrabold"}
          requiredIndicator={false}
          fontSize="15px"
          fontFamily="Montserrat"
          textColor={"#E5E5E5"}
          mb={0.5}
        >
          Password
        </FormLabel>
        <InputGroup>
          <Input
            bg={"#FFFFFF"}
            fontWeight={"light"}
            fontFamily={"Montserrat"}
            borderRadius={50}
            textColor={"#000000"}
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
            mb={"1rem"}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size={"sm"}
              fontFamily={"Montserrat"}
              borderRadius={50}
              onClick={handleClick}
              bgColor={"#FFFFFF"}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        fontFamily={"Montserrat"}
        borderRadius={50}
        bg={"#CBA6F7"}
        width="60%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login!
      </Button>
    </VStack>
  );
};

export default Signup;
