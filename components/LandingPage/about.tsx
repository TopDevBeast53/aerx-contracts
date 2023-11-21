import React from 'react'
import {
  Image,
  Heading,
  Center,
  Container,
  Button,
  Box
} from "@chakra-ui/react";
import WithStar from "./WithStars";
import WithDots from "./WithDots";

import { useDispatch, useSelector } from '../../store/store';
import {  getUserState, setImages } from '../../store/slices/imageSlices';
import Link from 'next/link'


const About: React.FC = () => {
    const dispatch = useDispatch();
    const { frame,polygon } = useSelector(getUserState);
    return (
            
            
            <Container maxWidth="container.xlg">
                
            <Center>
                <Heading    
                    mt="190.75px"
                     fontSize="64px"
                     lineHeight="96px"
                     fontWeight="600"
                     color="#322E65;"
                     mb="64px">
               {/* About project */}
               <Image src='resources\About project.png' w="277.425px" />
                </Heading>  
            </Center>
            <Center>
                <Box margin="auto" position="absolute" cursor="pointer" bgColor="#8D00FF;
">
       <Link rel="stylesheet" href="https://drive.google.com/file/d/1nB_yGQycXbI2bXeNRNEYBDzrRwCv6yjA/view?usp=drivesdk" 
              
              >
                    <Image src={polygon}/>
                    </Link>
                </Box>
                    <Image src={frame} width="1120px" height="633px"/>
            </Center>
            </Container >
            
            
        
        

    )
}

export default About;