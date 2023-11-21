import { AppDispatch } from '../store/store'
import { setFeeds } from '../store/slices/postsSlice'
import { Feed } from '../types/Post'

export type postDetailsType = {
  title: string
  body: string
  media: string
  mediaType: string
  mediaHash: any
}

const useGetPosts = async (state: any, dispatch: AppDispatch) => {
  if (!state?.pnftContract) return false
  const isUserRegistered = await state.pnftContract?.has_registered({
    user_id: state.accountId,
  })
  if (!isUserRegistered) return false
  let posts = await state.pnftContract?.get_all_posts({
    user_id: state.accountId,
  })
  if (posts?.length > 0) {
    posts.sort((a: any, b: any) => { // 
    return new Date(b.metadata.issued_at) < new Date(a.metadata.issued_at) ? 1 : -1
    })

    dispatch(setFeeds(posts))
    let feeds: Array<Feed> = []
    posts.map(async (feed: Feed, index: number) => {
      try {
        const profile = await state.pnftContract?.profile_by_id({
          user_id: feed.owner_id,
          user_to_find_id: feed.owner_id,
        })
        let newFeed = { ...feed }
        newFeed.profile = profile
        feeds.push(newFeed)
      } catch (e) {
        console.log('ERROR in usefetchpost')
      }
      if (index + 1 == posts.length) {
        dispatch(setFeeds(feeds))
      }
    })
    // state.setFeed(feeds.reverse());
    return feeds.reverse()
  }
}

export { useGetPosts }
