import React, { useState, useEffect } from "react";
import { Box, Image, Text, Spinner } from "@chakra-ui/react";
import { getLinkPreview } from "link-preview-js";

const LinkPreview = ({ url }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const data = await getLinkPreview(url);
        setPreview(data);
      } catch (error) {
        console.error("Error fetching link preview:", error);
      }
      setLoading(false);
    };
    fetchPreview();
  }, [url]);

  if (loading) {
    return <Spinner size="sm" color="#CBA6F7" />;
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
    >
      {preview.images && preview.images[0] && (
        <Image
          src={preview.images[0]}
          alt={preview.title || "Link preview"}
          maxH="150px"
          objectFit="cover"
          borderRadius="md"
          mb={2}
        />
      )}
      <Text fontSize="sm" fontWeight="bold" color="#CBA6F7">
        {preview.title || url}
      </Text>
      {preview.description && (
        <Text fontSize="xs" color="gray.300" noOfLines={2}>
          {preview.description}
        </Text>
      )}
    </Box>
  );
};

export default LinkPreview;
