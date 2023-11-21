
export async function useGetProfileById(state: any, user_id: string) {
    try{

        if (state.pnftContract) {
            const isUserRegistered = await state.pnftContract?.has_registered({
            user_id: state.accountId,
        });
        if (!isUserRegistered) return
        const res = await state.pnftContract?.profile_by_id({
            user_id,
            user_to_find_id: user_id
        });
        console.log("Profile by id :", res);
        return res;
    }
}
catch(e){
    console.log("ERROR in useGetProfileById", e)
    return {}
}
}

