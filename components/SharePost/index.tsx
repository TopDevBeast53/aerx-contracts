import React from 'react'
import Image from 'next/image'
import { Feed } from '../../types/Post';
import Modal from '../Modal';
import { useRouter } from 'next/router';
import { nearStore } from '../../store/near';
import toast from 'react-hot-toast';


interface Props {
    onClose: () => void,
    post: Feed
}

const SharePost: React.FC<Props> = ({ onClose, post }) => {
    const nearState = nearStore((state) => state);
    const router = useRouter();
    const onEarn2Gether = () => {
        router.push(`/flow?earn2gether=${post.post_id}`)
        onClose();
    }
    const handleRepost = async () => {
        console.log("repost has been clicked")
        try {
            await nearState.profileContract?.repost({
                post_id: parseInt(post.post_id),
            },
                "300000000000000",
                "10000000000000000000000",
            ).then(() => {
                toast.success("Repost created succesfully")
                console.log("Repost created succesfully")
                location.reload();
            })
        } catch (err) {
            toast.error("Unable to create your repost")
            console.error("Unable to create repost due to: ", err)

        }
    }

    return (
        <Modal onClose={onClose}>
            <div>
                <div className='w-[20vw] '>
                    <div className='w-full flex justify-around'>
                        <label className='text-md text-white font-semibold '>Share</label>
                    </div>

                    <div className='mt-6 flex  px-[10%] w-full justify-between mb-6'>
                        <div className='flex flex-col justify-center' onClick={() => { handleRepost() }}>
                            <div className='flex justify-around'>
                                <div className='w-[50px] h-[50px] cursor-pointer hover:bg-[#ffffff2a] rounded-[15px] bg-[#ffffff13] flex justify-around items-center'>
                                    <Image src="/assets/icons/my-flow-icon.svg" alt="request transaction" width={30} height={30}
                                        className="cursor-pointer  flex justify-around rounded-[10px] "
                                    />
                                </div>
                            </div>
                            <label className=' text-white text-sm mt-4 text-center'>My flow</label>
                        </div>


                        <div className='pl-2 flex flex-col justify-center' onClick={() => { }}>
                            <div className='flex justify-around'>
                                <div className='w-[50px] h-[50px] cursor-pointer hover:bg-[#ffffff2a] rounded-[15px] bg-[#ffffff13] flex justify-around items-center'
                                    onClick={() => onEarn2Gether()}
                                >
                                    <Image src="/assets/icons/earn-to-gether-icon.svg" alt="send transaction" width={30} height={30}
                                        className="cursor-pointer   flex justify-around p-[6px] h-[40px] rounded-[10px] "
                                    />
                                </div>
                            </div>
                            <label className='text-center text-white text-sm mt-4'>Earn2gether</label>
                        </div>

                        <div className=' flex flex-col justify-center' onClick={() => { }}>
                            <div className='flex justify-around'>
                                <div className='w-[50px] h-[50px] cursor-pointer hover:bg-[#ffffff2a] rounded-[15px] bg-[#ffffff13] flex justify-around items-center'>
                                    <Image src="/assets/icons/share-send-icon.svg" alt="send transaction" width={30} height={30}
                                        className="cursor-pointer   flex justify-around p-[6px] h-[40px] rounded-[10px] "
                                    />
                                </div>
                            </div>
                            <label className=' text-white text-sm mt-4 text-center'>Send</label>
                        </div>


                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default SharePost;