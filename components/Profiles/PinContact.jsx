import React, { useState } from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Image,
  Button,
  Grid,
  GridItem,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import {
  MinusIcon,
  PhoneIcon,
  RepeatClockIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import Contact from "./Contact";

const data = [
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
];

function PinContact(props) {
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleClick = (item) => {
    setSelectedContacts((ps) => {
      if (ps.includes(item)) {
        return [...ps.filter((arr) => arr !== item)];
      } else {
        return [...ps, item];
      }
    });
  };

  return (
    <Box
      height="100vh"
      w="250px"
      bgColor="#1f1f1f"
      // zIndex="6"
      fontFamily="poppins"
      display="flex"
      flexDirection="column"
    >
      <Center borderRadius="50px 50px 0px 0px" zIndex={6}>
        <Button
          onClick={props.remove}
          cursor="pointer"
          background="none"
          h="16px"
          w="16px"
          my={3}
          px="0"
        >
          <Image src="/resources/arrow-down.png" />
        </Button>
      </Center>

      <Flex alignItems="center" flexDirection="column" mx={0}>
        <Text
          my={1}
          fontFamily="poppins"
          fontSize="14px"
          color="#ffffff"
          fontWeight="600"
          letterSpacing="-0.02em"
          lineHeight="21px"
        >
          {selectedContacts.length >= 1
            ? `Selected: ${selectedContacts.length} `
            : "Pinned Contacts"}
        </Text>
        {selectedContacts.length >= 1 ? (
          <Flex
            flexDirection="row"
            justifyContent="flex-start"
            overflowX="scroll"
            px={4}
            w="full"
            css={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
            gap={2}
          >
            {selectedContacts.map((item, index) => (
              <Flex
                key={index}
                whiteSpace="nowrap"
                bgColor="#6054f0"
                h="24px"
                px={1}
                py={1}
                borderRadius="5px"
                padding=" 6px 8px"
                gap="4px"
                alignItems="center"
                flexWrap="nowrap"
              >
                <Text
                  color="#fff"
                  fontSize="12px"
                  textTransform="lowercase"
                  fontWeight="500"
                  lineHeight="100%"
                >
                  @{item.name}
                </Text>{" "}
                <Box
                  color="#fff"
                  alignSelf="center"
                  justifySelf="center"
                  cursor="pointer"
                  h="12px" w="12px"
                  onClick={() => handleClick(item)}
                >
                  <Image src="resources/close.png" h="12px" w="12px" />
                </Box>
              </Flex>
            ))}
          </Flex>
        ) : (
          <Text
            // mb="21.92px"
            fontFamily="poppins"
            fontSize="12px"
            color="#ffffff"
            fontWeight="400"
            letterSpacing="-0.02em"
            lineHeight="18px"
            opacity="0.3"
          >
            Select up to 4 users
          </Text>
        )}
      </Flex>

      <Flex alignItems="center" flexDirection="column" mx={4} my={6}>
        <InputGroup
          outline="none"
          border="none"
          bgColor="#191A1B"
          borderRadius="10px"
        >
          <InputLeftElement
            pointerEvents="none"
            children={<Search2Icon color="#0F0F0F" />}
          />
          <Input
            type="text"
            placeholder="Search"
            _placeholder={{
              color: "#5F5F5F",
              fontSize: "12px",
            }}
            outline="none"
            border="none"
          />
        </InputGroup>
      </Flex>

      <Box overflowY="scroll" flex={2} mb={0}>
        <Box mx={1}>
          <Grid
            templateColumns="repeat(4, auto)"
            alignContent="center"
            h="auto"
            gap={2}
            ml={4}
          >
            {data.map((item, index) => (
              <Contact
                key={index}
                src={item.src}
                name={item.name}
                selected={selectedContacts.includes(item) ? true : false}
                onClick={() => handleClick(item)}
              />
            ))}
          </Grid>
        </Box>
      </Box>

      <Box display="flex" flexDirection="center" justifyContent="center" mb={4}>
        {selectedContacts.length === 4 ? (
          <Button
            bgColor="#6054F0"
            borderRadius="10px"
            px="12px"
            py="24px"
            w="226px"
            h="40px"
          >
            <Text
              color="#fff"
              fontFamily="poppins"
              letterSpacing="-0.02em"
              fontSize="14px"
              fontWeight={600}
              lineHeight="100%"
            >
              Done
            </Text>
          </Button>
        ) : (
          <Button
            bgColor="rgba(255, 255, 255, 0.05)"
            borderRadius="10px"
            px="12px"
            py="24px"
            w="226px"
            h="40px"
            disabled
          >
            <Text
              color="#fff"
              opacity="0.3"
              fontFamily="poppins"
              letterSpacing="-0.02em"
              fontSize="14px"
              fontWeight={600}
              lineHeight="100%"
            >
              Select
            </Text>
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default PinContact;
