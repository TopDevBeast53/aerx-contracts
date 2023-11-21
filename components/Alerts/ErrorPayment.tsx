import Image from 'next/image';
import React from 'react'
import Button from '../Elements/Button';

interface IProps{
    onClose: () => void;
    message?: string;
}

const ErrorPayment: React.FC<IProps> = ({onClose, message}) => {
    return (
         <div className='w-[300px] px-4 flex justify-center flex-col gap-5'>
            <div className='w-full flex justify-center'>
                <label className='text-sm text-white'>Status:</label>
            </div>
                <Image src="/assets/icons/failed-transaction-icon.svg" alt="success payment" width={30} height={30} />
            <div className='w-full'>
                <div className='flex justify-center'>
                    <label className='text-[12px] font-bold text-danger' style={{fontWeight:'bold'}}>Something went wrong...</label>
                </div>
                <div className='flex justify-center'>
                    <label className='text-[12px] mt-[3px] text-white opacity-[30%]'>{!message ? 'Error reason. Please try again' : `${message}`}</label>
                </div>
            </div>
            <div className='pb-4'>
                <Button label='RETRY' onClick={() => onClose()}  />
            </div>
         </div>
    )
    }
export default ErrorPayment;