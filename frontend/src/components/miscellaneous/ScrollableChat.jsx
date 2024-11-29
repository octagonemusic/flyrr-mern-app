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

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const renderMessage = (m) => {
    if (m.isCode) {
      return <CodeBlock code={m.content} language={m.language} />;
    }
    return <span>{m.content}</span>;
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
    </div>
  );
};

export default ScrollableChat;
