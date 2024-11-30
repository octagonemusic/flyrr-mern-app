import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Text,
  useClipboard,
  IconButton,
  Switch,
  Flex,
} from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.css";

const CodeBlock = ({ code, language }) => {
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const { hasCopied, onCopy } = useClipboard(code);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language, showLineNumbers]);

  const renderCodeWithLineNumbers = () => {
    const lines = code.split("\n");
    return (
      <table
        style={{ borderSpacing: 0, borderCollapse: "collapse", width: "100%" }}
      >
        <tbody>
          {lines.map((line, index) => (
            <tr key={index} style={{ height: "1.5em" }}>
              {showLineNumbers && (
                <td
                  style={{
                    userSelect: "none",
                    color: "#6C7086",
                    paddingRight: "1em",
                    textAlign: "right",
                    fontFamily: "Fira Code, monospace",
                    borderRight: "1px solid #313244",
                    position: "sticky",
                    left: 0,
                    background: "#1E1E2E",
                    verticalAlign: "top",
                    width: "1%", // Make line number column as narrow as possible
                    whiteSpace: "nowrap",
                  }}
                >
                  {index + 1}
                </td>
              )}
              <td
                style={{
                  paddingLeft: "1em",
                  fontFamily: "Fira Code, monospace",
                  whiteSpace: "pre",
                  verticalAlign: "top",
                }}
              >
                {line || " "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Box bg="#1E1E2E" p={4} borderRadius="md" position="relative" mt={2} mb={2}>
      <Flex mb={3} justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={4}>
          <Text
            color="#CBA6F7"
            fontSize="sm"
            fontFamily="Fira Code, monospace"
            textTransform="lowercase"
          >
            {language || "plaintext"}
          </Text>
          <Switch
            size="sm"
            isChecked={showLineNumbers}
            onChange={() => setShowLineNumbers(!showLineNumbers)}
            colorScheme="purple"
          >
            <Text color="#CBA6F7" fontSize="sm" ml={2}>
              Line Numbers
            </Text>
          </Switch>
        </Flex>
        <IconButton
          size="sm"
          icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
          onClick={onCopy}
          bg="#CBA6F7"
          color="black"
          _hover={{ bg: "#B4BEFE" }}
          aria-label="Copy code"
        />
      </Flex>
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
            display: "block",
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
            {renderCodeWithLineNumbers()}
          </code>
        </pre>
      </Box>
    </Box>
  );
};

export default CodeBlock;
