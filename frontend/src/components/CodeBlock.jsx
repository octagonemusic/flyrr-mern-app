import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useClipboard, IconButton, Flex } from "@chakra-ui/react";
import { CopyIcon, CheckIcon, TriangleUpIcon } from "@chakra-ui/icons";
import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.css";
import axios from "axios";
import CodeExecutionModal from "./CodeExecutionModal";
import { ChatState } from "../../context/ChatProvider";

const CodeBlock = ({ code, language }) => {
  const { hasCopied, onCopy } = useClipboard(code);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeRef = useRef(null);
  const { user } = ChatState();

  // Map your language names to Judge0 language IDs
  const languageMap = {
    python: 71,
    javascript: 63,
    java: 62,
    cpp: 54,
    c: 50,
  };

  const executeCode = async () => {
    setIsLoading(true);
    setIsModalOpen(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(
        "/api/execute",
        {
          source_code: code,
          language_id: languageMap[language?.toLowerCase()] || 71,
        },
        config
      );
      setOutput(response.data.output);
    } catch (error) {
      setOutput(error.response?.data?.error || "Error executing code");
    } finally {
      setIsLoading(false);
    }
  };

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
        <Flex gap={2}>
          <IconButton
            size="sm"
            icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
            onClick={onCopy}
            bg="#CBA6F7"
            color="black"
            _hover={{ bg: "#B4BEFE" }}
            aria-label="Copy code"
          />
          {language && languageMap[language.toLowerCase()] && (
            <IconButton
              size="sm"
              icon={<TriangleUpIcon transform="rotate(90deg)" />}
              onClick={executeCode}
              bg="#A6E3A1"
              color="black"
              _hover={{ bg: "#94E2D5" }}
              aria-label="Execute code"
            />
          )}
        </Flex>
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
      {isModalOpen && (
        <CodeExecutionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          output={output}
          isLoading={isLoading}
        />
      )}
    </Box>
  );
};

export default CodeBlock;
