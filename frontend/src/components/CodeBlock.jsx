import React, { useEffect } from "react";
import { Box, Text, useClipboard, IconButton } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

const CodeBlock = ({ code, language }) => {
  const { hasCopied, onCopy } = useClipboard(code);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <Box bg="#1E1E2E" p={4} borderRadius="md" position="relative" mt={2} mb={2}>
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          color="#CBA6F7"
          fontSize="sm"
          fontFamily="Fira Code, monospace"
          textTransform="lowercase"
        >
          {language || "plaintext"}
        </Text>
        <IconButton
          size="sm"
          icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
          onClick={onCopy}
          bg="#CBA6F7"
          color="black"
          _hover={{ bg: "#B4BEFE" }}
          aria-label="Copy code"
        />
      </Box>
      <Box
        className="code-block-container"
        overflowX="auto"
        sx={{
          "& pre, & code": {
            margin: 0,
            padding: 0,
            background: "transparent",
            fontSize: "14px !important",
            fontFamily: "Fira Code, monospace !important",
            lineHeight: "1.5 !important",
          },
          "& .token": {
            fontSize: "inherit !important",
            fontFamily: "inherit !important",
            lineHeight: "inherit !important",
          },
          "::selection, & *::selection": {
            background: "#CBA6F7",
            color: "#1E1E2E",
          },
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#181825",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#313244",
            borderRadius: "4px",
          },
        }}
      >
        <pre>
          <code className={`language-${language || "plaintext"}`}>{code}</code>
        </pre>
      </Box>
    </Box>
  );
};

export default CodeBlock;
