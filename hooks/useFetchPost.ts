import toast from "react-hot-toast";

export type postDetailsType = {
    title: string,
    body: string,
    media: string,
    mediaType: string,
    mediaHash: any,
};

export type returnedPostType = {
    post_id: string,
    owner_id: string,
    metadata: {
        title: string,
        media?: string,
        description: string,
        copies?: number,
        issued_at?: string,
        expires_at?: string,
        starts_at?: string,
        updated_at?: string,
        extra?: string,
        reference?: string,
        reference_hash?: string
    },
    total_charges: number,
    origin_post_id: number,
    co_earners: string[],
};

export async function fetchPosts(state: any) {
    if (state.pnftContract) {
        try {
            const post = await state.pnftContract?.get_all_posts({
                user_id: state.accountId,
            });

            if (post) {
                post.sort(function (a: { metadata: { issued_at: any; }; }, b: { metadata: { issued_at: any; }; }) {
                    return (
                        new Date(b.metadata.issued_at) < new Date(a.metadata.issued_at) ? 1 : -1
                    );
                })
                state.setFeed(post.reverse());
            }
        } catch (err) {
            // toast.error("Error while getting all posts");
            console.log("Error while getting all posts due to: ", err)
        }
    }
}
