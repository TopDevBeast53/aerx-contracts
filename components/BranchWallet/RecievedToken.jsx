import React from 'react'

function RecievedToken() {
  return (
 <Box 
 height="100%"
 w="257.56px"
 bgColor="#1f1f1f"
 position="absolute"
 top="0"
 >
        <Center borderRadius="50px 50px 0px 0px" zIndex={6} >
            <Button
              onClick={props.toggleWallet}
              cursor="pointer"
              background="none"
              w="21.92px"
              bgColor="rgba(255, 255, 255, 0.3);"
              height="12px"
              mt="2"
              px="0"
              flexDirection="column"
              gap="2px"
              // backgroundColor="#1F1F1F"
            >
              <MinusIcon
                w="21.92px"
                bgColor="rgba(255, 255, 255, 0.3);"
                height="2px"
              />
              <MinusIcon
                w="21.92px"
                bgColor="rgba(255, 255, 255, 0.3);"
                height="2px"
              />
            </Button>
          </Center>
      <Box
        mb="158.235px"
        mx="16.44px"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="400"
      >
        <Flex
          gap="5.48px"
          alignItems="center"
          mb="202.075px"
          ml="16.44px"
          onClick={props.recieved}
          cursor="pointer"
        >
          <Image
            src={"../resources/Arrow - Right1.png"}
            color="#FFFFFF4D;"
            w="8.25425px"
            h="10.275px"
          />
          <Text color="#FFFFFF4D;">Back</Text>
        </Flex>
      </Box>
      
 </Box>
  )
}

export default RecievedToken