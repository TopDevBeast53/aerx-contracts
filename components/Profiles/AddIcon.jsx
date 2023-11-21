import { GridItem, Image, Text, Box } from "@chakra-ui/react";
import React from "react";

function AddIcon({
  src = "../resources/Rectangle 3604.png",
  selected,
  onClick,
  w = "48px",
  h = "48px",
  justifyContent = "flex-start",
}) {
  return (
    <GridItem
      cursor="pointer"
      pos="relative"
      onClick={onClick}
      display="flex"
      justifyContent={justifyContent}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        bgImage={selected ? "resources/selected-icon.png" : 'resources/unselected-icon.png'}
        w={w}
        h={h}
      >
        <Image
          src={src}
          w="24px"
          h="24px"
          backdropFilter="10px"
          borderRadius="15px"
        />
      </Box>
    </GridItem>
  );
}

export default AddIcon;
