import Image from 'next/image';
import React, { useState } from 'react'

interface Coin {
    logo: string,
    name: string,
}
const SelectCoin: React.FC = () => {
    const coins: Coin[] = [
        {
            logo: '/assets/icons/ae-coin-icon.svg',
            name: 'AEX'
        },
    ]

    const [activeCoin, setActiveCoin] = useState(coins[0]);
    const [showSelect, setShowSelect] = useState<boolean>(false);

    return (
        <div className='relative'>
            <div onClick={() => setShowSelect(!showSelect)} className="flex gap-2 items-center">
                <div className='flex gap-2 items-center'>
                    <Image src={activeCoin.logo} width={20} height={20} alt="coin" />
                    <label className='text-white text-sm'>{activeCoin.name}</label>
                </div>
                <div>
                    <Image src="/assets/icons/select-coin-icon.svg" width={10} height={10} alt="arrow down" />
                </div>
            </div>
            {showSelect && (
            <div className='absolute bg-black-dark w-[max-content] mt-4 p-2 rounded-md'>
                <div>
                    {coins.map((coin, index) => (
                        <div className='mt-1 flex rounded-md  p-2 gap-2 cursor-pointer hover:bg-black-light' key={index} onClick={() => {
                            setActiveCoin(coin);
                            setShowSelect(false);
                        } }>
                            <Image src={coin.logo} width={20} height={20} alt="coin" />
                            <label className='cursor-pointer text-white text-sm'>{coin.name}</label>
                        </div>
                    ))
        }
                </div>
            </div>
            )}
        </div>
    )
}

export default SelectCoin;