import React from "react";
import { Box, Button, useClipboard } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
// Import more language support as needed

const CodeBlock = ({ code, language }) => {
  const { hasCopied, onCopy } = useClipboard(code);

  React.useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <Box position="relative" my={2}>
      <Button size="xs" position="absolute" top={2} right={2} onClick={onCopy}>
        {hasCopied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <pre style={{ background: "#1E1E2E", borderRadius: "8px" }}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </Box>
  );
};

export default CodeBlock;
