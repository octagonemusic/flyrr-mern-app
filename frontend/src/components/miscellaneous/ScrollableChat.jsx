import React, { useRef, useEffect } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import "./styles.css";
import CodeBlock from "../CodeBlock";
import LinkPreview from "../LinkPreview";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const messagesEndRef = useRef(null);

  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (m) => {
    if (m.isCode) {
      return <CodeBlock code={m.content} language={m.language} />;
    }

    // URL detection using regex
    const matches = m.content.match(urlPattern);

    if (matches) {
      let content = m.content;
      matches.forEach((url) => {
        content = content.replace(
          url,
          `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: ${
            m.sender._id === user._id ? "#313244" : "#CBA6F7"
          }; text-decoration: underline; font-weight: bold;">${url}</a>`
        );
      });

      return (
        <>
          <span
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {matches.map((url, index) => (
            <LinkPreview key={index} url={url} />
          ))}
        </>
      );
    }

    return <span style={{ whiteSpace: "pre-wrap" }}>{m.content}</span>;
  };

  return (
    <div className="messages">
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="0.5rem"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#CBA6F7" : "#313244"
                }`,
                color: `${m.sender._id === user._id ? "#1E1E2E" : "#FFFFFF"}`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "70%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {renderMessage(m)}
            </span>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ScrollableChat;
