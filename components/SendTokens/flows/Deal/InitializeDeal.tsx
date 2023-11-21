import Image from 'next/image';
import React from 'react'

const InitializeDeal: React.FC<{setFlow: (flow: number) => void}> = ({setFlow}) => {
    return (
        <div>
             <div className='w-[17vw] '>
            <div className='w-full flex justify-around'>
                <label className='text-md text-white font-semibold '>Deal</label>
            </div>

            <div className='mt-4 flex  px-[10%] w-full justify-between mb-6'>
                <div className='flex flex-col justify-center' onClick={() => setFlow(1)}>
                    <Image src="/assets/icons/request-transaction-icon.svg" alt="request transaction" width={40} height={40} 
                    className="cursor-pointer  flex justify-around rounded-[10px] "
                    />
                    <label className=' text-white text-sm mt-3 text-center'>NFT's</label>
                </div>


                <div className='pl-2 flex flex-col justify-center' onClick={() => setFlow(2)}>
                    <Image src="/assets/icons/send-transaction-icon.svg" alt="send transaction" width={40} height={40} 
                     className="cursor-pointer   flex justify-around p-[6px] h-[40px] rounded-[10px] "
                    />
                    <label className='text-center text-white text-sm mt-3'>Coins</label>
                </div>

                <div className=' flex flex-col justify-center' onClick={() => setFlow(3)}>
                    <Image src="/assets/icons/services-deal.svg" alt="send transaction" width={40} height={40} 
                     className="cursor-pointer   flex justify-around p-[6px] h-[40px] rounded-[10px] "
                    />
                    <label className=' text-white text-sm mt-3'>Services</label>
                </div>
                
               
            </div>
        </div>
        </div>
    )
}

export default InitializeDeal;