import Image from 'next/image';
import React from 'react'
import Button from '../Elements/Button';

interface IProps{
    onClose: () => void;
    message?: string
}

const SuccessPayment: React.FC<IProps> = ({onClose, message}) => {
    return (
         <div className='w-[300px] px-4 flex justify-center flex-col gap-5'>
            <div className='w-full flex justify-center'>
                <label className='text-sm text-white'>Status:</label>
            </div>
                <Image src="/assets/icons/success-transaction-icon.svg" alt="success payment" width={30} height={30} />
            <div className='w-full flex justify-center'>
                <label className='text-[12px] font-bold text-success' style={{fontWeight:'bold'}}>{!message  ? 'Payment successful' : `${message}`}</label>
            </div>
            <div className='pb-4'>
                <Button label='OK' onClick={() => onClose()}  />
            </div>
         </div>
    )
    }
export default SuccessPayment;