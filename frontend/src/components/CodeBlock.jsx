import React from "react";
import { Box, Text } from "@chakra-ui/react";

const CodeBlock = ({ code, language }) => {
  return (
    <Box
      bg="#1E1E2E"
      p={3}
      borderRadius="md"
      fontFamily="monospace"
      whiteSpace="pre-wrap"
      position="relative"
    >
      {language && (
        <Text
          position="absolute"
          top={2}
          right={2}
          fontSize="sm"
          color="#CBA6F7"
        >
          {language}
        </Text>
      )}
      <Text color="#FFFFFF">{code}</Text>
    </Box>
  );
};

export default CodeBlock;
