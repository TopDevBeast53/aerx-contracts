import { GridItem, Image, Text, Box } from "@chakra-ui/react";
import React from "react";

function Contact({
  src = "../resources/Rectangle 3604.png",
  name = "Annas",
  selected,
  circle = false,
  onClick,
  w = "48px",
  h = "48px",
  justifyContent = "flex-start",
  more = false,
  count,
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
      >
        <Image
          src={src}
          w={w}
          h={h}
          bgColor="rgba(255, 255, 255, 0.05)"
          backdropFilter="10px"
          borderRadius="15px"
        />
        {!circle && (
          <Text
            fontFamily="poppins"
            textAlign="center"
            pt={2}
            fontWeight="500"
            color="#ffffff"
            lineHeight="18px"
            fontSize="12px"
          >
            {name}
          </Text>
        )}
      </Box>
      {selected && (
        <Box
          bg="linear-gradient(0deg, rgba(96, 84, 240, 0.8), rgba(96, 84, 240, 0.8)), url(.jpg), rgba(255, 255, 255, 0.05)"
          backdropFilter="10px"
          pos="absolute"
          top="0"
          left="0"
          display="flex"
          justifyContent="center"
          alignItems="center"
          h={h}
          w={w}
          overflow="hidden"
          borderRadius="15px"
        >
          <Image src="resources/selected.png" h="20px" w="20px" />
        </Box>
      )}
      {more && (
        <Box
          bg="linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(.jpg), url(.jpg), url(.jpg), url(.jpg), rgba(255, 255, 255, 0.05)"
          backdropBlur="2px"
          pos="absolute"
          top="0"
          left="0"
          display="flex"
          justifyContent="center"
          alignItems="center"
          h={h}
          w={w}
          overflow="hidden"
          borderRadius="15px"
        >
          <Text color="#fff" fontSize="12px" fontWeight={500} lineHeight="18px">
            {" "}
            +{`${count.length - 3}`}
          </Text>
        </Box>
      )}
    </GridItem>
  );
}

export default Contact;
