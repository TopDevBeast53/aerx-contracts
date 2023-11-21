import React from "react";
import { Text } from "@chakra-ui/react";

const VideoControl: React.FC = () => {
  return (
    <div>
      <div className="bg-[#ffffff3e] w-full h-[4px] rounded-md flex items-center ">
        <div className="flex items-center ">
          <div className="h-[4px] w-[60px] rounded-l-md bg-white"></div>
          <div className="h-[10px] w-[10px] rounded-full bg-white -ml-2"></div>
        </div>
      </div>
      <div className="flex justify-between mt-2 ">
        <Text 
           fontFamily= 'Poppins'
           fontStyle= 'normal'
           fontWeight= '400'
           fontSize='9.59px'
           lineHeight= '150%'
           letterSpacing= '-0.02em'
           color="#FFFFFF"
        >0:46</Text>
        <Text 
        fontFamily= 'Poppins'
        fontStyle= 'normal'
        fontWeight= '400'
        fontSize='9.59px'
        lineHeight= '150%'
        letterSpacing= '-0.02em'
        color="#FFFFFF"
        >-3:14</Text>
      </div>
    </div>
  );
};

export default VideoControl;
