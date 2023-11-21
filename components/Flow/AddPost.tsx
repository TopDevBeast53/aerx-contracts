import { Textarea } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { pinToPinata } from '../../lib/pinata';
import { nearStore } from '../../store/near';
import { Post } from '../../types/Post';
const shajs = require('sha.js');
import { uploadTempo } from "../../lib/aerxTempo";

interface IProps {
    onClose: () => void;
}


const CreatePostForm: React.FC<{ setFileToPreview: (fileURL: string) => void, earnPost: any }> = ({ setFileToPreview, earnPost }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filePreview, setFilePreview] = useState<string>();
    const [media, setMedia] = useState();
    const [postOwnerProfile, setPostOwnerProfile] = useState<any>();
    const nearState = nearStore((state) => state);
    const [postType, setPostType] = useState<'post' | 'tempo' | 'music'>('post')

    const handlePost = async (e: { preventDefault: () => void; }) => {
        if (isLoading) return;
        e.preventDefault();
        if (earnPost) return postEarn2Gether();
        const file = media;
        if (file) {
            const filename = (file as File).name;
            var parts = filename.split(".");
            const fileType = parts[parts.length - 1];

            await pinToPinata(file, "POST", nearState.profile?.username).then(async (res: { IpfsHash: any; }) => {
                const fileUrl = `${process.env.NEXT_PUBLIC_IPFS_BASE_URL}/${res.IpfsHash}`
                console.log("File url: ", fileUrl)
                const fileUrlHash = new shajs.sha256().update(fileUrl).digest("base64");
                console.log("Encrypted url: ", fileUrlHash)
                nearState.postDetails.media = fileUrl;
                nearState.postDetails.mediaType = fileType;
                nearState.postDetails.mediaHash = fileUrlHash;
                console.log("title: ", nearState?.postDetails?.title)
                if (!nearState.postDetails.body || nearState.postDetails.body.length === 0) return toast.error("Please enter a description");
                const postToMint = {
                    title: (!nearState?.postDetails?.title || (nearState.postDetails.title = "")) ? `AERX-postNFT for ${nearState.profile?.username}`
                        : nearState?.postDetails?.title,
                    description: nearState.postDetails.body,
                    media: fileUrl,
                    media_hash: fileUrlHash,
                    issued_at: new Date().toISOString(),
                    //extra will be used to handle the toghether with on the create post
                }
                if (postType == "tempo") {
                    try {
                        let result = await uploadTempo(nearState.accountId, postToMint.description, postToMint.title, postToMint.media);
                        if (result) {
                            toast.success("Tempo uploaded successfully will be deleted exactly 12 hours from now");
                            console.log("Tempo uploaded successfully")
                            nearState.postDetails.body = "";
                            nearState.postDetails.title = "";
                            location.reload();
                        }


                    } catch (err) {
                        setIsLoading(false);
                        toast.error("Unable to upload tempo. Try again later")
                        console.error("Unable to upload tempo due to: ", err)
                    }
                } else {
                    try {
                        console.log("post to mint", postToMint);
                        setIsLoading(true);
                        console.log("Post to mint: ", postToMint)
                        await nearState.pnftContract?.mint_post({
                            user_id: nearState.accountId,
                            origin_post_id: 0,
                            token_metadata: postToMint
                        },
                            "300000000000000"
                        ).then((res) => {
                            toast.success(`Your AERX-postNFT has been minted Successfully`)
                            nearState.postDetails.body = "";
                            nearState.postDetails.title = "";
                            location.reload();
                            //save post

                        })
                        setIsLoading(false);
                    } catch (err) {
                        setIsLoading(false);
                        toast.error("Unable to mint AERX-postNFT. Try again later")
                        console.error("Unable to mint AERX postNFT: ", err)

                    }
                }
            })
        } else {
            toast.error("No image found")
        }

    }

    const updateTitle = (e: any) => {
        const val = e.currentTarget.value;
        if (val != "") {
            nearState.postDetails.title = val;
        }

    }

    //Todo: handle file preview
    const updateMedia = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setMedia(file);
        setFilePreview(URL.createObjectURL(file));
        setFileToPreview(URL.createObjectURL(file));

    }

    const uploadPhoto = () => {
        console.log("Update photo clicked");
        (document.getElementsByClassName('upload-photo')[0] as any).click();
    }


    /*  post earn to gether post */
    const postEarn2Gether = async () => {
        const file = media;
        if (file) {
            const filename = (file as File).name;
            var parts = filename.split(".");
            const fileType = parts[parts.length - 1];
            await pinToPinata(file, "POST", nearState.profile?.username).then(async (res: { IpfsHash: any; }) => {
                const fileUrl = `${process.env.NEXT_PUBLIC_IPFS_BASE_URL}/${res.IpfsHash}`
                console.log("File url: ", fileUrl)
                const fileUrlHash = new shajs.sha256().update(fileUrl).digest("base64");
                console.log("Encrypted url: ", fileUrlHash)
                nearState.postDetails.media = fileUrl;
                nearState.postDetails.mediaType = fileType;
                nearState.postDetails.mediaHash = fileUrlHash;
                console.log("title: ", nearState?.postDetails?.title)
                if (!nearState.postDetails.body || nearState.postDetails.body.length === 0) return toast.error("Please enter a description");
                const postToMint = {
                    title: (!nearState?.postDetails?.title || (nearState.postDetails.title = "")) ? `AERX-postNFT for ${nearState.profile?.username}`
                        : nearState?.postDetails?.title,
                    description: nearState.postDetails.body,
                    media: fileUrl,
                    media_hash: fileUrlHash,
                    issued_at: new Date().toISOString(),
                    //extra will be used to handle the toghether with on the create post
                }
                try {
                    console.log("post to mint", postToMint);
                    setIsLoading(true);
                    console.log("Post to mint: ", postToMint)
                    await nearState.profileContract?.mint_post({
                        user_id: nearState.accountId,
                        origin_post_id: Number(earnPost.post_id),
                        token_metadata: postToMint
                    },
                        "300000000000000",
                        "10000000000000000000000"
                    ).then((res) => {
                        toast.success(`Your AERX-postNFT has been minted Successfully`)
                        nearState.postDetails.body = "";
                        nearState.postDetails.title = "";
                        location.reload();

                    })
                    setIsLoading(false);
                } catch (err) {
                    setIsLoading(false);

                }
            })
        } else {
            toast.error("No image found")
        }

    }

    useEffect(() => {
        getPostOwnerProfile();
    }, [earnPost])

    useEffect(() => {
        console.log("profile ....")
        console.log(postOwnerProfile)
    }, [postOwnerProfile])
    const getPostOwnerProfile = async () => {
        // alert(JSON.stringify(earnPost))
        if (earnPost) {
            await nearState.profileContract?.profile_by_id({
                user_id: earnPost?.owner_id,
                user_to_find_id: earnPost?.owner_id
            }).then((res) => {
                setPostOwnerProfile(res);
            })
        }
    }
    return (
        <div>
            <Toaster />
            <h1 className='text-white text-center text-sm' style={{
                fontWeight: 'bolder'
            }}>Create Post</h1>

            <form className='w-full p-2 px-6'>
                <div>
                    <label className='text-white opacity-[20%] text-sm'>Name: </label>
                    <input placeholder='Post title'
                        className='focus:outline-none border-none text-white w-full bg-transparent text-sm mt-4'
                        onChange={updateTitle}
                        defaultValue={""}
                    />
                    <div className='bg-white opacity-[15%] p-[0.5px] mt-4' />
                </div>

                <div className='mt-4'>
                    <label className='text-white opacity-[20%] text-sm'>Type: </label>

                    <div className='flex flex-wrap gap-3 mt-4'>
                        <div className='bg-[#6154f027] p-2 rounded-full w-[max-content] flex gap-2 px-4 cursor-pinter'
                            onClick={() => setPostType('post')}
                            style={{
                                backgroundColor: (postType === 'post') ? '#6154f0ce' : '#6154f027'
                            }}
                        >
                            <Image src="/assets/icons/text-post-icon.svg" alt="comment" width={15} height={15}
                                className='cursor-pointer'
                            />
                            <label className='text-purple text-sm cursor-pointer'>Post</label>
                        </div>
                        <div className='cursor-pointer bg-[#ff76272f] p-2 rounded-full w-[max-content] flex gap-2 px-4'
                            onClick={() => setPostType('tempo')}
                            style={{
                                backgroundColor: (postType === 'tempo') ? '#ff7627ae' : '#ff76272f'
                            }}
                        >
                            <Image src="/assets/icons/tempo-post-icon.svg" alt="comment" width={15} height={15}
                                className='cursor-pointer'
                            />
                            <label className='text-[#FF7527] text-sm cursor-pointer'>Tempo</label>
                        </div>
                        <div className='bg-[#ec52a427] p-2 rounded-full w-[max-content] flex gap-2 px-4 cursor-pointer'
                            onClick={() => setPostType('music')}
                            style={{
                                backgroundColor: (postType === 'music') ? '#ec52a4b5' : '#ec52a427'
                            }}
                        >
                            <Image src="/assets/icons/music-post-icon.svg" alt="comment" width={15} height={15}
                                className='cursor-pointer'
                            />
                            <label className='text-[#ec52a4] text-sm cursor-pointer'>Music</label>
                        </div>
                    </div>
                    <div className='bg-white opacity-[15%] p-[0.5px] mt-6' />
                </div>

                <div className='mt-4'>
                    <label className='text-white opacity-[20%] text-sm'>Together with: </label>

                    <div className='bg-[#ffffff1a] p-2 mt-4 cursor-pointer rounded-full w-[35px] h-[35px] flex justify-around'>
                        <Image src="/assets/icons/add-post-white-icon.svg"
                            alt="Add post" width={10} height={10}
                            className="cursor-pointer"
                        />
                    </div>
                    {/* <label className='text-white'>{earnPost?.metadata?.extra}</label> */}
                    {postOwnerProfile &&
                        <Image src={postOwnerProfile?.metadata?.media} width={30} height={30}
                            className="rounded-full mt-1" title={postOwnerProfile?.metadata?.extra}
                        />
                    }

                    <div className='bg-white opacity-[15%] p-[0.5px] mt-6' />
                </div>

                <div className='mt-4'>
                    <label className='text-white opacity-[20%] text-sm'>Add content: </label>

                    <div>
                        <div className='flex gap-8'>
                            <div>
                                <div className='bg-[#ffffff1a] p-[6px] cursor-pointer mt-4 rounded-full w-[35px] h-[35px] flex justify-around'
                                    onClick={uploadPhoto}
                                >
                                    <Image src="/assets/icons/default-image-icon.svg"
                                        alt="Upload image" width={25} height={25}
                                        className="cursor-pointer"

                                    />
                                    <input type="file"
                                        hidden
                                        accept='image/*'
                                        onChange={updateMedia}
                                        className="upload-photo"
                                    />
                                </div>

                                <div className='mt-2 flex justify-around'>
                                    <label className='text-[#ffffff47] text-sm'>Photo</label>
                                </div>
                            </div>

                            <div>
                                <div className='bg-[#ffffff1a] p-[6px] mt-4 cursor-pointer rounded-full w-[35px] h-[35px] flex justify-around'>
                                    <Image src="/assets/icons/camera-icon.svg"
                                        alt="Upload image" width={25} height={25}
                                        className="cursor-pointer"
                                    />
                                </div>
                                <div className='mt-2 flex justify-around'>
                                    <label className='text-[#ffffff47] text-sm'>Video</label>
                                </div>
                            </div>

                            <div>
                                <div className='bg-[#ffffff1a] p-[6px] mt-4 cursor-pointer rounded-full w-[35px] h-[35px] flex justify-around'>
                                    <Image src="/assets/icons/text-icon.svg"
                                        alt="Upload image" width={25} height={25}
                                        className="cursor-pointer"
                                    />
                                </div>
                                <div className='mt-2 flex justify-around'>
                                    <label className='text-[#ffffff47] text-sm'>Text</label>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white opacity-[15%] p-[0.5px] mt-6' />
                    </div>

                    <div className='mt-4'>
                        <div className='flex gap-2 items-center cursor-pointer'>
                            <Image src="/assets/icons/link-icon.svg" alt="Add post" width={20} height={20}
                                className="cursor-pointer"
                            />
                            <label className='text-white text-[11px] cursor-pointer'>Copy Link</label>
                        </div>

                        <div className='flex gap-2 items-center cursor-pointer mt-2'>
                            <Image src="/assets/icons/share-icon.svg" alt="Add post" width={20} height={20}
                                className="cursor-pointer"
                            />
                            <label className='text-white text-[11px] cursor-pointer'>Copy Link</label>
                        </div>
                    </div>

                    <div className='w-full flex justify-around  mt-6'>
                        <button
                            onClick={handlePost}
                            className='p-3 rounded-[10px] text-[#ffffff53]  bg-black-light w-full'
                        >
                            {isLoading ? 'Loading...' : 'Post'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

const AddPost: React.FC<IProps> = ({ onClose }) => {
    const [filePreview, setFilePreview] = useState<string>();
    const nearState = nearStore((state) => state);
    const router = useRouter();
    const [earnPost, setEarnPost] = useState<any>();
    const { earn2gether } = router.query;
    const updateBody = (e: any) => {
        const val = e.currentTarget.value;
        if (val != "") {
            nearState.postDetails.body = val;
        }
    }

    useEffect(() => {
        if (earn2gether) {
            getPost();
        }
    }, [earn2gether])

    const getPost = async () => {
        const post = await nearState?.profileContract?.post_details({ user_id: nearState?.accountId, post_id: earn2gether as string });
        if (!post) return;
        // if (post?.metadata?.media) {
        //     setFilePreview(post?.metadata?.media);
        // }
        setEarnPost(post)
    }

    return (
        <div className='w-full  h-[94vh] flex'>
            <div className='flex justify-between w-full h-full'>
                <div className='h-full w-[50%] '>
                    {!filePreview &&
                        <div className='h-[50%] flex justify-around bg-black-light' style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <Image src={
                                (!filePreview) ? "/assets/icons/default-image-icon.svg" : filePreview}
                                alt="avatar" width={100} height={100}
                            />
                        </div>
                    }
                    {filePreview &&
                        <div className='h-[50%] flex justify-around bg-black-light' style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <Image src={(!filePreview) ? "/assets/icons/default-image-icon.svg" : filePreview}
                                alt="avatar" width={270} height={100}
                                style={{
                                    borderRadius: '10px 10px 0px 0px',
                                }}
                            />
                        </div>
                    }
                    <div className='h-[50%] p-4'>
                        <textarea
                            className='w-full h-[100%] focus:outline-none bg-transparent text-sm'
                            placeholder='Type something ...'
                            style={{
                                resize: 'none',
                                color: 'white'
                            }}
                            onChange={updateBody}
                            defaultValue={""}

                        />
                    </div>
                </div>
                <div className='p-2 w-[50%]'>
                    <div className='w-full'>
                        <div className='w-full flex justify-between'>
                            <div />
                            <Image src="/assets/icons/modal-close.svg"
                                alt='close modal' width={20} height={20}
                                className='cursor-pointer'
                                onClick={onClose}
                            />
                        </div>

                        <CreatePostForm earnPost={earnPost} setFileToPreview={setFilePreview} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPost;

