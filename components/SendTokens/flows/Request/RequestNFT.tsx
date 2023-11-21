import Image from 'next/image';
import React from 'react'
import { NFT } from '../../../../types/NFT';
import Button from '../../../Elements/Button';
import ReselectNFT from '../../../ReselectNFT';
import SelectCoin from '../../../SelectCoin';
import StepIndicator from '../../../StepIndicator';

interface IProps {
    setTransactionStatus: (status: 'pending' | 'success' | 'failed') => void,
    nfts: Array<NFT>,
    setSelectedNFTs: (nfts: Array<NFT>) => void,
    allNfts: Array<NFT>,
}
const RequestNFT: React.FC<IProps> = ({ setTransactionStatus, nfts, setSelectedNFTs, allNfts }) => {
    const handleRemoveNFT = (nftId: number) => {
        const newNfts = nfts.filter(nft => nft.id !== nftId);
        setSelectedNFTs(newNfts);
    }
    return (
        <div className='w-[300px]'>
            <div className='w-full flex justify-around'>
                <label className='text-white'>Send NFT's</label>
            </div>

            <div className='w-full mt-6'>
                <div className='px-2 w-full'>
                    <div className='w-full'>
                        <div className='z-10 w-full'>
                            <ReselectNFT
                                nfts={nfts}
                                setSelectedNFTs={setSelectedNFTs}
                                allNfts={allNfts}
                            />
                        </div>
                        <div className='mt-2'>
                            {nfts.map((nft: NFT, index: number) => (
                                <div key={index} className="mt-1 flex text-[13px] justify-between">
                                    <label>{nft.name}</label>
                                    <Image src="/assets/icons/remove-icon.svg"
                                        className='cursor-pointer opacity-[15%]' alt="remove" width={15} height={15}
                                        onClick={() => handleRemoveNFT(nft.id)}
                                    />
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className='mt-4'>
                        <Button
                            icon='/assets/icons/right-arrow-icon.svg'
                            label='Send'
                            onClick={() => setTransactionStatus('success')}
                        />
                    </div>

                    <div className='w-full flex my-6 justify-around'>
                        <div className='flex gap-4'>
                            <StepIndicator />
                            <StepIndicator bg="purple" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestNFT;