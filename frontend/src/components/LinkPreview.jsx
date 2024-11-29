import React, { useState, useEffect } from "react";
import { Box, Image, Text, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";

const LinkPreview = ({ url, previewData }) => {
  const [preview, setPreview] = useState(previewData);
  const [loading, setLoading] = useState(!previewData);
  const { user } = ChatState();

  useEffect(() => {
    if (!previewData) {
      const fetchPreview = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(
            `/api/message/preview?url=${encodeURIComponent(url)}`,
            config
          );
          if (
            data &&
            (data.title ||
              data.description ||
              (data.images && data.images.length))
          ) {
            setPreview(data);
          }
        } catch (error) {
          console.error("Error fetching link preview:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPreview();
    }
  }, [url, user.token, previewData]);

  if (loading) {
    return (
      <Box mt={2}>
        <Spinner size="sm" color="#CBA6F7" />
      </Box>
    );
  }

  if (!preview) return null;

  return (
    <Box
      mt={2}
      p={2}
      bg="#313244"
      borderRadius="md"
      cursor="pointer"
      onClick={() => window.open(url, "_blank")}
      _hover={{ bg: "#45475a" }}
      transition="background 0.2s"
    >
      <Box display="flex" gap={3}>
        {preview.images && preview.images[0] && (
          <Image
            src={preview.images[0]}
            alt={preview.title || "Link preview"}
            maxH="80px"
            maxW="80px"
            objectFit="cover"
            borderRadius="md"
          />
        )}
        <Box flex="1">
          <Text fontSize="sm" fontWeight="bold" color="#CBA6F7">
            {preview.title || url}
          </Text>
          {preview.description && (
            <Text fontSize="xs" color="gray.300" noOfLines={2}>
              {preview.description}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LinkPreview;
