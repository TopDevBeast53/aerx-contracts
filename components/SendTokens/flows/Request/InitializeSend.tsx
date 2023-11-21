import Image from 'next/image';
import React from 'react'
import StepIndicator from '../../../StepIndicator';

const InitializeSend: React.FC<{setFlow: (flow: number) => void}> = ({setFlow}) => {
    return (
        <div>
             <div className='w-[150px] '>
            <div className='w-full flex justify-around'>
                <label className='text-md text-white font-semibold '>Invoice</label>
            </div>

            <div className='flex p-4 px-[10%] w-full justify-between mt-2 mb-2'>
                <div className='flex flex-col justify-center' onClick={() => setFlow(1)}>
                    <Image src="/assets/icons/send-transaction-icon.svg" alt="send transaction" width={40} height={40} 
                     className="cursor-pointer   flex justify-around p-[6px] h-[40px] rounded-[10px] "
                    />
                    <label className=' text-white text-sm mt-3'>Coins</label>
                </div>
                <div className='flex flex-col justify-center' onClick={() => setFlow(2)}>
                    <Image src="/assets/icons/request-transaction-icon.svg" alt="request transaction" width={40} height={40} 
                    className="cursor-pointer  flex justify-around rounded-[10px] "
                    />
                    <label className=' text-white text-sm mt-3'>NFT's</label>
                </div>
               
            </div>

            <div className='w-full flex my-2 justify-around'>
                    <div className='flex gap-4'>
                        <StepIndicator  bg="purple" />
                        <StepIndicator />
                    </div>
                    </div>
        </div>
        </div>
    )
}

export default InitializeSend;