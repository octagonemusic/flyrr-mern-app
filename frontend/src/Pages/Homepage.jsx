import { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent backgroundColor={"#1E1E2E"}>
        <Text textAlign={"center"} fontWeight={"extrabold"} fontSize="50px" fontFamily="Montserrat" textColor={"#E5E5E5"} m="20px 0 0 0">
          FLYRR
        </Text>

      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"#313244"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="2rem"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList>
            <Tab width="50%" textAlign={"center"} fontWeight={"extrabold"} fontSize="15px" fontFamily="Montserrat" textColor={"#E5E5E5"} m="10px 0 0 0">Login</Tab>
            <Tab width="50%" textAlign={"center"} fontWeight={"extrabold"} fontSize="15px" fontFamily="Montserrat" textColor={"#E5E5E5"} m="10px 0 0 0">Sign-Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
