import Image from 'next/image';
import React, { useState } from 'react'

interface Coin {
    logo: string,
    name: string,
}
const SelectDealType: React.FC = () => {
    const coins: Coin[] = [
        {
            logo: '/assets/icons/nft-icon.svg',
            name: "NFT's"
        },
        {
            logo: '/assets/icons/coins-icon.svg',
            name: "Coins"
        },
        {
            logo: '/assets/icons/others-icon.svg',
            name: "Others"
        },
    ]

    const [activeCoin, setActiveCoin] = useState<{logo: string, name: string}>();
    const [showSelect, setShowSelect] = useState<boolean>(false);


    return (
        <div style={ (showSelect) ? {
            border: '1px solid white',
            height: '175px',
            borderRadius: '5px',
        }
            :
        {

        }
    }>
        <div className='relative w-full bg-[#131313] rounded-md p-2'
         style={{
         }}
        >
            <div onClick={() => setShowSelect(!showSelect)} className="flex justify-between items-center"
            >
                <div className='flex gap-2 items-center px-4'>
                    {activeCoin && 
                    <Image src={activeCoin?.logo} width={20} height={20} alt="coin" />
                    }
                    <label className='text-white text-sm'>{!activeCoin ? 'Select type' : `${activeCoin.name}`}</label>
                </div>
                <div>
                    <Image src="/assets/icons/select-coin-icon.svg" width={10} height={10} alt="arrow down" />
                </div>
            </div>
            {showSelect && (
            <div className='absolute bg-[#131313] p-2  w-full -ml-2' 
             style={{
                
            }}
            >
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
        </div>
    )
}

export default SelectDealType;