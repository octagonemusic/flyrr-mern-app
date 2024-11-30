import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Spinner,
  Text,
} from "@chakra-ui/react";

const CodeExecutionModal = ({ isOpen, onClose, output, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="#1E1E2E">
        <ModalHeader color="#CBA6F7">Code Output</ModalHeader>
        <ModalCloseButton color="#CBA6F7" />
        <ModalBody pb={6}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <Spinner color="#CBA6F7" size="lg" />
            </Box>
          ) : (
            <Box
              bg="#313244"
              p={4}
              borderRadius="md"
              maxHeight="400px"
              overflowY="auto"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#1E1E2E",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#45475A",
                  borderRadius: "4px",
                },
              }}
            >
              <Text
                fontFamily="Fira Code, monospace"
                whiteSpace="pre-wrap"
                color="white"
                fontSize="sm"
              >
                {output || "No output"}
              </Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CodeExecutionModal;
