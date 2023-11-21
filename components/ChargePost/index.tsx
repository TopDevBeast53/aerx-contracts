import React, { useEffect, useState } from 'react'
import Modal from '../Modal';
import ReactSimpleRange from '../Elements/SimpleSlider/ReactSimpleRange'
import Image from 'next/image';
import Button from '../Elements/Button';
import { nearStore } from '../../store/near';

const ChargePost: React.FC<{
    onClose: () => void,
    onCharge: (value: number) => void,
    loading: boolean
}> = ({ onClose, onCharge, loading = false }) => {
    const [value, setValue] = useState<number>(0);
    const nearState: any = nearStore((state) => state);
    const accountBalance = nearState?.aexBalance;

    const handleCharge = () => {
        if (loading) return;
        onCharge(value);
    }

    return (
        <Modal onClose={() => onClose()}>
            <div className='w-[20vw]  px-6 pb-6'>
                <h1 className="text-white text-sm text-center">Charge</h1>
                <div className='flex justify-around mt-4'>
                    <div className='flex gap-2 my-4'>
                        <Image src="/assets/icons/charge-icon.svg" alt="charge" width={20} height={20} />
                        <label className='text-white text-sm'>{value}</label>
                    </div>
                </div>
                <div className='mt-2'>
                    <ReactSimpleRange
                        min={0}
                        max={10}
                        trackColor={'#FFE660'}
                        thumbColor={'#ffff'}
                        onChange={(value: any) => setValue(parseInt(value?.ratio))}
                    />
                </div>
                <div className='mt-8'>
                    <Button
                        icon="/assets/icons/right-arrow-icon.svg"
                        label={loading ? 'Confirming ... ' : 'Confirm'}
                        onClick={() => handleCharge()}
                    />
                </div>
            </div>
        </Modal>
    )
}
export default ChargePost;