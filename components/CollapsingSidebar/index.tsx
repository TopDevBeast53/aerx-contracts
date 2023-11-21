import Image from 'next/image';
import React from 'react'

interface IProps{
        onFlowClicked: () => void,
        onSpaceClicked: () => void,
        onCollectionsClicked?: () => void,
        onChatClicked: () => void,
        onNotificationsClicked?: () => void,
        onSettingsClicked?: () => void
}
const CollapsingSidebar: React.FC<IProps> = ({
        onFlowClicked,
        onSpaceClicked,
        onCollectionsClicked,
        onChatClicked
}) => {
        return (
                <div className='h-[100vh] w-[60px] pr-2 absolute top-0 left-0'>
                        <div className='h-full bg-[#232323] flex flex-col justify-between'>
                        <div className='flex flex-col items-center gap-6 w-ful mt-[40%] h-[30%]'>   
                                <div>
                                     <Image src="/assets/icons/sidebar-logo.svg" alt="logo" width={25} height={25} />   
                                </div>

                                <div className='flex flex-col gap-2'>
                                <div
                                className='cursor-pointer bg-[#ffffff27] hover:bg-[#ffffff39] w-[40px] flex justify-around p-[6px] h-[40px] rounded-[15px]'
                                onClick={() => onFlowClicked()}
                                >
                                     <Image src="/assets/icons/sidebar-flow-icon.svg" alt="trigger" width={25} height={25} />   
                                </div>
                                <div
                                className='cursor-pointer bg-[#ffffff27] hover:bg-[#ffffff39] w-[40px] flex justify-around p-[6px] h-[40px] rounded-[15px]'
                                onClick={() => onChatClicked()}
                                >
                                     <Image src="/assets/icons/sidebar-valuengr-icon.svg" alt="trigger" width={25} height={25} />   
                                </div>
                                <div
                                className='cursor-pointer bg-[#ffffff27] hover:bg-[#ffffff39] w-[40px] flex justify-around p-[6px] h-[40px] rounded-[15px]'
                                onClick={() => onChatClicked()}
                                >
                                     <Image src="/assets/icons/sidebar-collections-icon.svg" alt="trigger" width={25} height={25} />   
                                </div>
                                <div
                                className='cursor-pointer  w-[40px] hover:bg-[#ffffff39] flex justify-around p-[6px] h-[40px] rounded-[15px]'
                                onClick={() => onSpaceClicked()}
                                >
                                     <Image src="/assets/icons/space-icon.svg" alt="trigger" width={30} height={30} />   
                                </div>
                                </div>
                        </div>

                        <div className='flex justify-around h-[50%] '>
                        <div className='h-[98px] mt-[5em] rounded-md cursor-pointer  p-2 flex items-center bg-[#ffffff16] hover:bg-[#ffffff39] w-[max-content]'>
                                <Image src="/assets/icons/sidebar-collapse-icon.svg" className='cursor-pointer' alt="trigger" width={10} height={10} />
                        </div>
                        </div>

                        <div className='flex flex-col items-center gap-2 w-ful'>
                                <div className='relative'>
                                    <div className='w-[35px] h-[35px] border-[1px] cursor-pointer border-[#ffffff3c] hover:bg-[#ffffff39] p-[6px] rounded-full flex justify-around'>
                                     <Image src="/assets/icons/notifications-icon.svg" alt="trigger" width={25} height={25} />
                                    </div>
                                     <div 
                                     className='
                                     bg-red-500 w-[15px] h-[15px] rounded-full text-[10px] text-white 
                                     flex justify-around items-center absolute -top-2 -right-[5px]'>3</div>   
                                </div>
                                <div className='w-[35px] h-[35px] cursor-pointer border-[1px] border-[#ffffff3c] hover:bg-[#ffffff39] rounded-full p-[6px] flex justify-around'>
                                     <Image src="/assets/icons/settings-icon.svg" alt="trigger" width={25} height={25} />   
                                </div>  
                        </div>
                        <div>

                        </div>
                        </div>
                </div>
        )
}

export default CollapsingSidebar;