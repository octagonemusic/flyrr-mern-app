import React, { useEffect, useRef } from "react";
import { Box, Text, useClipboard, IconButton } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.css"; // This theme matches your dark theme

const CodeBlock = ({ code, language }) => {
  const { hasCopied, onCopy } = useClipboard(code);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

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
          "& pre": {
            margin: 0,
            padding: 0,
          },
          "& code": {
            fontFamily: "Fira Code, monospace !important",
            fontSize: "14px !important",
            lineHeight: "1.5 !important",
            background: "transparent !important",
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
          <code ref={codeRef} className={language || "plaintext"}>
            {code}
          </code>
        </pre>
      </Box>
    </Box>
  );
};

export default CodeBlock;
