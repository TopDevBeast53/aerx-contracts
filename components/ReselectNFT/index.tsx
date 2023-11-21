import Image from 'next/image';
import React, { useState } from 'react'
import { NFT } from '../../types/NFT';

interface Coin {
    logo: string,
    name: string,
}

interface Props {
    nfts: Array<NFT>,
    allNfts: Array<NFT>,
    setSelectedNFTs: (nfts: Array<NFT>) => void,
}
const ReselectNFT: React.FC<Props> = ({ nfts, setSelectedNFTs, allNfts }) => {
    const coins: Coin[] = [
        {
            logo: '/assets/icons/ae-coin-icon.svg',
            name: 'AE'
        },
        {
            logo: '/assets/icons/ae-coin-icon.svg',
            name: 'AE 2'
        },
        {
            logo: '/assets/icons/ae-coin-icon.svg',
            name: 'AE 3'
        }
    ]

    const [showSelect, setShowSelect] = useState<boolean>(false);

    const handleSelectNFT = (nftId: number) => {
        setShowSelect(false);
        if (nfts.findIndex(nft => nft.id === nftId) === -1) {
            setSelectedNFTs([...nfts, (allNfts.find(nft => nft.id === nftId) as NFT)]);
        }
    }

    return (
        <div className='relative'>
            <div onClick={() => setShowSelect(!showSelect)} className="flex w-full justify-between gap-2 items-center bg-[#131313] p-2 px-4 rounded-[10px]">
                <div className='flex gap-2 items-center'>
                    <label className='text-white text-sm opacity-[20%]'>Selected</label>
                    <Image src="/assets/icons/select-coin-icon.svg" width={10} height={10} alt="arrow down" />
                </div>

                <div>
                    <Image src="/assets/icons/folder-icon.svg" alt="folder" width={20} height={20} />
                </div>
            </div>
            {showSelect && (
                <div className='absolute bg-black-dark w-full mt-4 p-2 rounded-md z-50'>
                    <div>
                        {allNfts && (
                            allNfts.map((nft: NFT, index: number) => (
                                <div className='mt-1 flex rounded-md  p-2 gap-2 cursor-pointer hover:bg-black-light' key={index}
                                    onClick={() => handleSelectNFT(nft.id)}
                                >
                                    <label className='cursor-pointer text-white text-sm'>{nft.name}</label>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReselectNFT;