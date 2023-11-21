import { on } from 'events';
// import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react'
import { collapseFlow } from '../../store/slices/modulesSlices';
import { useDispatch } from '../../store/store';
import {
  Box,
  Button,
  Text,
  Heading,
  Container,
  Flex,
  Image
} from "@chakra-ui/react";

export interface Props {
    backgroundColor?:string,
    placeholder?: string,
    onChange: (value:string) => void,
}

export interface HeaderProps {
    onAddPost: () => void,
    onSearch: (searchValue: string) => void
}



const SearchInput: React.FC<Props> = ({backgroundColor='#FFFFFF08', placeholder="Search user", onChange }) => {
    return (
        <div className={`${backgroundColor}  pl-2  rounded-md flex items-center  gap-2 w-full `}>
            <div className='bg=["#FFFFFF08]' >
            <Image src={'/assets/icons/search-input-icon.svg'}  width="16.44px" height="16.44px" alt="Search "  />
            </div>
            <div>
              <input type="text" placeholder={placeholder} className='text-white bg-transparent text-sm focus:outline-none' style={{
                height:"27.4px",
                // backgroundColor:"#FFFFFF08"
              }}
               onChange={(e) => onChange(e.target.value)}
              />
            </div>
        </div>
    )
}

const FlowHeader: React.FC<HeaderProps> = ({onAddPost, onSearch}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { earn2gether} = router.query;

    if(earn2gether){
      onAddPost();
    }
    
    const onCollapse = () => {
      dispatch(collapseFlow());
    }

    return (
       
          <Flex
          className="bg-black-dark"
          width="488.82px"
          height="43.84px"
          
          // justifyContent="space-between"
          // backgroundColor="#FFFFFF12;
          // "
           position="fixed"
           zIndex="2"
          //  mt="-25px"
          //  textAlign="center"
           alignItems="center"
           ml={-4}
          >
          <Image src="/assets/icons/flow-header-logo.svg" alt='flow' width="21.92px" height="21.92px" />
            <Box
            w="63.155px"
            h="10.96px"
            ml="10.275px"
            >
             <Text 
          
            fontFamily= 'Poppins'
            fontStyle= 'normal'
            fontWeight= '600'
            fontSize='10.96px'
            lineHeight= '100%'
            letterSpacing= '-0.02em'
            color="#FFFFFF"
         
            >             
              My Flow            
            </Text>
            </Box>
               <Box className='w-[242.925px] bg-[#FFFFFF08] rounded-[6.85px]'>
             <SearchInput 
             backgroundColor='#FFFFFF08' 
             placeholder="Search" 
             onChange={onSearch}
              />
           </Box>
             <Box
            w="71.925px" h="27.4px" mr="5.48px" backgroundColor= "rgba(255, 255, 255, 0.03)" justifyContent="center" alignItems="center" ml="8px" borderRadius="6.85px" 
            >
              <Flex justifyContent="center" gap="7.87px" backgroundColor= "rgba(255, 255, 255, 0.03)" w="71.925px" h="27.4px"  >
             <Image src='/assets/icons/flash-icon.svg' alt="total posts" width="16.44px" height="16.44px"  mt="1" />
             <Text 
                fontFamily= 'Poppins'
                fontStyle= 'normal'
                fontWeight= '600'
                fontSize='14px'
                lineHeight= '100%'
                mt="1.5"
                /* identical to box height, or 16px */
    
                letterSpacing= '-0.02em'
                color="#FFFFFF"
             >
              31134
              </Text>
              </Flex>
              </Box>
                 <Box className='bg-black-light p-1 rounded-[10px] mr-[5.48px] items-center justify-around flex w-[27.4px] h-[27.4px] '>
          <Image src="/assets/icons/switch-icon.svg" alt="Switch accounts" width="24px" height="24px" />
           </Box>
           <Box className='bg-purple p-1 rounded-[10px] items-center justify-around flex w-[27.4px] h-[27.4px]  cursor-pointer hover:opacity-[50%]' 
            onClick={onAddPost}
           >
            <Image src="/assets/icons/white-add-icon.svg" alt="Add Post" width="12px" height="12px" />
           </Box>
             <Box className='cursor-pointer ' ml="16.44px" onClick={() => onCollapse()}>
            <Image src="/assets/icons/chat-room-menu-icon.svg" alt="Meu" width={30} height={45} />
            </Box>
          </Flex>
           
          //  <Flex  
          //  gap="8.49"
          //  justifyContent="space-evenly"   
          //  alignItems="center"
          //  position="fixed"
          //  zIndex="2"
          //  mt="-25px"
          //  ml="0"
          // backgroundColor="black"
          //  >
          //    <Image src="/assets/icons/flow-header-logo.svg" alt='flow' width="32px" height="32px" />
          //    <Text 
          
          //   fontFamily= 'Poppins'
          //   fontStyle= 'normal'
          //   fontWeight= '600'
          //   fontSize='16px'
          //   lineHeight= '100%'
          //   w="63px"
          //   /* identical to box height, or 16px */

          //   letterSpacing= '-0.02em'
          //   color="#FFFFFF"
           

            
          //   >             
          //     My Flow            
          //   </Text>

          //   <div className='w-[205px] '>
          //    <SearchInput 
          //    backgroundColor='bg-black-light' 
          //    placeholder="Search" 
          //    onChange={onSearch}
          //     />
          //  </div>
          //   <Box
          //   w="71.925px" h="27.4px" backgroundColor= "rgba(255, 255, 255, 0.03)" justifyContent="center" alignItems="center" ml="8px" borderRadius="6.85px" 
          //   >
          //     <Flex justifyContent="center" gap="11.49" backgroundColor= "rgba(255, 255, 255, 0.03)"  >
          //    <Image src='/assets/icons/flash-icon.svg' alt="total posts" width="16.44px" height="16.44px"  mt="1" />
          //    <Text 
          //       fontFamily= 'Poppins'
          //       fontStyle= 'normal'
          //       fontWeight= '600'
          //       fontSize='10.96px'
          //       lineHeight= '100%'
          //       mt="2"
          //       /* identical to box height, or 16px */
    
          //       letterSpacing= '-0.02em'
          //       color="#FFFFFF"
          //    >
          //     31134
          //     </Text>
          //     </Flex>
          //     </Box>
          //     <div className='bg-black-light p-1 rounded-[10px] items-center justify-around flex w-[27.4px] h-[27.4px] '>
          //   <Image src="/assets/icons/switch-icon.svg" alt="Switch accounts" width="24px" height="24px" />
          //  </div>
          //  <div className='bg-purple p-1 rounded-[10px] items-center justify-around flex w-[27.4px] h-[27.4px]  cursor-pointer hover:opacity-[50%]' 
          //   onClick={onAddPost}
          //  >
          //   <Image src="/assets/icons/white-add-icon.svg" alt="Add Post" width="12px" height="12px" />
          //  </div>
          //  <div className='cursor-pointer ' onClick={() => onCollapse()}>
          //    <Image src="/assets/icons/chat-room-menu-icon.svg" alt="Meu" width={30} height={45} />
          //  </div>
          //  </Flex>
        
    
    )
}

export default FlowHeader;
