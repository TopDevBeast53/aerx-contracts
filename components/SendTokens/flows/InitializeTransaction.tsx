import Image from 'next/image';
import React from 'react'

interface IProps{
    setFlow: (flow: number) => void;
}
const InitializeTransaction: React.FC<IProps> = ({setFlow}) => {
    return (
        <div className='w-[250px] '>
            <div className='w-full flex justify-around'>
                <label className='text-md text-white font-semibold '>Select</label>
            </div>

            <div className='flex p-4 px-[10%] w-full justify-between mt-2 mb-2'>
                <div className='flex flex-col justify-center' onClick={() => setFlow(1)}>
                    <Image src="/assets/icons/send-transaction-icon.svg" alt="send transaction" width={35} height={35} 
                     className="cursor-pointer   flex justify-around p-[6px] h-[40px] rounded-[10px] "
                    />
                    <label className=' text-white text-sm mt-3'>Send</label>
                </div>
                <div className='flex flex-col justify-center' onClick={() => setFlow(2)}>
                    <Image src="/assets/icons/request-transaction-icon.svg" alt="request transaction" width={35} height={35} 
                    className="cursor-pointer  flex justify-around rounded-[10px] "
                    />
                    <label className=' text-white text-sm mt-3'>Request</label>
                </div>
                <div className='flex flex-col justify-center cursor-pointer' onClick={() => setFlow(3)}>
                    <Image src="/assets/icons/deal-transaction-icon.svg" alt="deal transaction" width={35} height={35} />
                    <label className=' text-white text-sm mt-3 cursor-pointer'>Deal</label>
                </div>
            </div>
        </div>
    )
}
export default InitializeTransaction;