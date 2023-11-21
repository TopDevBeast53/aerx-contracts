import * as nearApiJs from "near-api-js";
import { OtherTokenContract, PNFTContract } from "../types/contracts";
import { getConfig } from "./config";
import {
    connect,
    Contract,
    WalletConnection,
    keyStores,
    ConnectConfig,
    ConnectedWalletAccount,
} from "near-api-js";
import { NearStoreType, ProfileType } from "../types/stores";
import {
    DexContract,
    ProfileContract,
    TokenContract,
} from "../types/contracts";
import { TOKEN_CONTRACT_NAME, NFT_CONTRACT_NAME, DEX_CONTRACT_NAME } from "../utils/constants/contract";
import { authenticatePinata } from "./pinata";
import Big from "big.js";


const {
    KeyPair,
    InMemorySigner,
    transactions: { addKey },
    utils: {
        PublicKey,
        format: { parseNearAmount, formatNearAmount },
    },
    Account,
} = nearApiJs;

export default async function contractFullAccessKey(
    _c_type: string,
): Promise<PNFTContract | null> {
    // Step 1:  get the keypair from the contract's full access private key
    let PRIV_KEY;
    let CONTRACT_NAME;

    if (_c_type === "AerxProfileContract") {
        PRIV_KEY = process.env.NEXT_PUBLIC_PNFT_PRIV_KEY;
        CONTRACT_NAME = process.env.NEXT_PUBLIC_PNFT_ID;
    } else {
        //Todo: throw an error
        console.log("Invalid _c_type passed")
    }

    if (!PRIV_KEY) {
        console.error("PRIV KEY IS NULL");
        return null;
    }
    const { networkId, nodeUrl, walletUrl } = getConfig("testnet");
    const keyPair = KeyPair.fromString(PRIV_KEY);

    // Step 2:  load up an inMemorySigner using the keyPair for the account
    if (!CONTRACT_NAME) {
        console.error("CONTRACT NAME IS NULL");
        return null;
    }
    const keyStore = new nearApiJs.keyStores.InMemoryKeyStore();
    keyStore.setKey(networkId, CONTRACT_NAME, keyPair);

    let signer = new InMemorySigner(keyStore);

    // Step 3:  create a connection to the network using the signer's keystore and default config for testnet
    const config: ConnectConfig = {
        networkId,
        nodeUrl,
        walletUrl,
        keyStore: signer.keyStore,
        headers: {},
    };
    const near = await nearApiJs.connect(config);

    // Step 4:  get the account object of the currentAccount.  At this point, we should have full control over the account.
    let account;
    try {
        account = new nearApiJs.Account(near.connection, CONTRACT_NAME);
    } catch (e: any) {
        alert("ERROR GETTING ACCOUNT");
    }
    if (!account) {
        console.error("ACCOUNT IS NULL");
        return null;
    }
    if (!CONTRACT_NAME) {
        console.error("CONTRACT NAME IS NULL");
        return null;
    }

    // initiate the contract so its associated with this current account and exposing all the methods
    const contract = new nearApiJs.Contract(account, CONTRACT_NAME, {
        viewMethods: [
            "is_username_available",
            "has_registered",
            "nft_tokens_for_owner",
            "profile_by_id",
            "post_details",
            "get_all_posts",
            "get_users_ids",
            "repost_details",
            "get_all_repost",
        ],
        changeMethods: [
            "mint_profile",
            "edit_profile",
            "mint_post",
            "comment",
            "charge",
            "charge_repost",
            "nft_transfer",
        ],
    }) as PNFTContract;

    return contract;
}

export async function initNearConnection(nearState: NearStoreType) {
    // Initialize connection to the NEAR testnet
    const nearTokenConfig = getConfig(process.env.NODE_ENV);
    //set keystore and connect
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const config: ConnectConfig = {
        ...nearTokenConfig,
        headers: {},
        keyStore,
    };
    const nearConnection = await connect(config);
    console.log("nearConnection : ", nearConnection);
    nearState.setConnection(nearConnection);

    // TODO: CHECK IF THE KEY IS NOT CAUSING LOCALSTORAGE ACCESS ISSUE
    const walletConnection = new WalletConnection(nearConnection, "Aerx");
    console.log("walletConnection : ", walletConnection);
    nearState.setWalletConnection(walletConnection);

    //Get accountId 
    const accountId = walletConnection.getAccountId();
    console.log("accountId : ", accountId);
    //verify accountId exists
    if (!accountId) {
        console.log("Account id is empty");
        //Todo: prompt user to register or login
        return;
    }
    nearState.setAccountId(accountId);
    //Get balance
    const _account = await nearConnection.account(accountId);
    const balance = await _account.getAccountBalance();
    console.log("available near balance: ", balance.available);
    const availableNear = balance.available;
    const nearBalanceBigN = new Big(availableNear || 0);
    const formattedNearBalance = nearBalanceBigN.div("10e23").toFixed(3);
    nearState.setNearBalance(formattedNearBalance);
    console.log("formated near balance: ", formattedNearBalance)
    //.2 load tokenContract whenever it is ready
    await loadTokenContract(nearState, walletConnection.account());
    await loadNFTContract(nearState, walletConnection.account());
    //3. load dex contract whenever it is ready
    await loadDexContrat(nearState, walletConnection.account());
    //.4 load profile with user as signer(incase aerx decide to let user pay)
    await loadProfileWithUserAsSigner(nearState, walletConnection.account());
    //.5 halt until pnftContract is set to state
    await loadProfileContract(nearState);
    //.6 load nft contract
    // await loadNFTContract(nearState, walletConnection.account());
    // complete the initnearConnection
}

export async function checkProfile(nearState: any) {
    // checks profile contract is initialised and user is connected(has accountId)
    if (nearState.pnftContract && nearState.accountId) {
        console.log("profile checking ...", nearState.profile);
        const has_registered = await nearState.pnftContract?.has_registered({
            user_id: nearState.accountId,
        });
        console.log("Has user registered? : ", has_registered);
        // composed the (image) and (extra) query fields
        if (has_registered) {
            const user_info = await nearState.pnftContract?.profile_by_id({
                user_id: nearState.accountId,
                user_to_find_id: nearState.accountId,
            });
            const returnedProfile: ProfileType = {
                userId: user_info.owner_id,
                username: user_info.token_id,
                fullName: user_info.metadata.extra,
                aboutMe: user_info.metadata.description,
                profileImg: user_info.metadata.media,
            }
            nearState.setProfile(returnedProfile)
            console.log("Profile: ", returnedProfile)
        }
    }
}

const loadNFTContract = (
    nearState: NearStoreType,
    account: ConnectedWalletAccount,
) => {
    const nftContract: PNFTContract = new Contract(
        account,
        NFT_CONTRACT_NAME,
        {
            viewMethods: [
                "is_username_available",
                "has_registered",
                "nft_tokens_for_owner",
                "profile_by_id",
                "post_details",
                "get_all_posts",
                "get_users_ids",
                "repost_details",
                "get_all_repost",
            ],
            changeMethods: [
                "mint_profile",
                "edit_profile",
                "mint_post",
                "comment",
                "charge",
                "charge_repost",
                "nft_transfer",
            ],
        },
    ) as PNFTContract;

    nearState.setNFTContract(nftContract);
    console.log("token contract:", nftContract);
};
// Initializing our token contract APIs by contract name and configuration
const loadTokenContract = (
    nearState: NearStoreType,
    account: ConnectedWalletAccount,
) => {
    const tokenContract: TokenContract = new Contract(
        account,
        TOKEN_CONTRACT_NAME,
        {
            viewMethods: [
                "ft_balance_of",
                "get_owner",
                "ft_total_supply",
                "ft_metadata",
            ],
            changeMethods: [
                "claim_gift",
                "reward_users_for_anniversaries",
                "change_owner_to",
                "ft_transfer",
                "ft_transfer_call",
                "send_aex",
            ],
        },
    ) as TokenContract;

    nearState.setTokenContract(tokenContract);
    console.log("token contract:", tokenContract);
};

export async function initNearConnectionForContract(contractName: string) {
    // Initialize connection to the NEAR testnet
    const nearTokenConfig = getConfig(process.env.NODE_ENV);
    //set keystore and connect
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const config: ConnectConfig = {
        ...nearTokenConfig,
        headers: {},
        keyStore,
    };
    const nearConnection = await connect(config);
    console.log("nearConnection : ", nearConnection);
    // nearState.setConnection(nearConnection);

    // TODO: CHECK IF THE KEY IS NOT CAUSING LOCALSTORAGE ACCESS ISSUE
    const walletConnection = new WalletConnection(nearConnection, "Aerx");
    console.log("walletConnection : ", walletConnection);
    // nearState.setWalletConnection(walletConnection);

    //Get accountId 
    const accountId = walletConnection.getAccountId();
    console.log("accountId : ", accountId);
    //Get Balance
    const _account = await nearConnection.account(`${accountId}`);
    const balance = await _account.getAccountBalance();
    console.log("available near balance: ", balance.available);
    //verify accountId exists
    if (!accountId) {
        console.log("Account id is empty");
        //Todo: prompt user to register or login
        return;
    }
    // nearState.setAccountId(accountId);
    return loadOtherTokenContracts(walletConnection.account(), contractName)

}
const loadOtherTokenContracts = (
    account: ConnectedWalletAccount,
    contractName: string,
) => {
    const otherTokenContract: OtherTokenContract = new Contract(
        account,
        contractName,
        {
            viewMethods: [
                "ft_balance_of",
            ],
            changeMethods: [
                "ft_transfer_call",
            ],
        },
    ) as OtherTokenContract;

    return otherTokenContract;
};

const loadDexContrat = (
    nearState: NearStoreType,
    account: ConnectedWalletAccount,
) => {
    const dexContract = new Contract(account, DEX_CONTRACT_NAME, {
        viewMethods: ["all_pools", "get_user_share", "get_pool", "get_price_from_pool", "get_return_amount_in_u128"],
        changeMethods: [
            "register_or_get_balance",
            "create_pool",
            "lend",
            "swap_aex",
        ],
    }) as DexContract;
    nearState.setDexContract(dexContract);
    console.log("dexContract: ", dexContract);
};
const loadProfileWithUserAsSigner = (
    nearState: NearStoreType,
    account: ConnectedWalletAccount,
) => {
    const profileContractWithUserAsSigner = new Contract(
        account,
        NFT_CONTRACT_NAME,
        {
            // change methods(methods that change state)
            changeMethods: [
                "mint_post",
                "repost",
                "swap",
                "list_post_for_sale",
                "transfer_ownership",
                "buy_post",
            ],
            viewMethods: [
                "is_username_available",
                "has_registered",
                "profile_by_id",
                "post_details",
                "nft_tokens",
                "nft_tokens_for_owner",
                "get_all_posts",
                "get_users_ids",
                "repost_details",
                "get_all_repost",
            ],
        },
    ) as ProfileContract;
    nearState.setProfileWithUserAsSigner(profileContractWithUserAsSigner);
};

const loadProfileContract = async (nearState: NearStoreType) => {
    const pnftContract = await contractFullAccessKey("AerxProfileContract");
    if (!pnftContract) {
        throw new Error("Failed to create PNftContract");
    }
    nearState.setPNFTContract(pnftContract);
    console.log("pnft contract:", pnftContract);
}

//Todo: maybe moved into initNearConnection depending on the speed of pinata to authenticate(when we have a gateway will test and decide)
export async function initPinata(nearState: NearStoreType) {
    const pinatastate = await authenticatePinata();
    nearState.setPinataState(pinatastate);
    console.log("Pinata state: ", pinatastate);
}

export function logout(nearState: NearStoreType) {
    // TODO: NEED TO CONFIRM IF IT'S OK TO THROW
    if (!nearState.walletConnection) {
        throw new Error("wallet is not connected");
    }
    // reset store
    nearState.walletConnection.signOut();
    // //remove connection
    // nearState.removeConnection();
    // nearState.removeWalletConnection();
    // reload page
    window.location.replace(window.location.origin);
}

//Todo: create custom url/page for error 401 or 404(incase user didn't approve connection or insufficient balance)
export async function loginToken(nearState: NearStoreType) {
    if (!nearState.walletConnection) {
        throw new Error("Error finding walletConnection state try again later");
        //Todo: alert users if this ever happens
    }
    //Todo: change contract to profile
    //if user hasn't sign out redirect to their profile else redirect to registration form and handle the profile redirect on registration page onload
    if (nearState.profile?.userId != "" && nearState.profile?.username != "") {
        const isUserRegistered = await nearState.pnftContract?.has_registered({ user_id: nearState.accountId } as any);
        if (isUserRegistered) {
            window.location.replace(window.location.origin + "/flow")
        }
        else {
            window.location.replace(window.location.origin + "/settings/profile")
        }
    } else {
        await nearState.walletConnection?.requestSignIn({
            contractId: process.env.TOKEN_CONTRACT_NAME,
            successUrl: `${window.location.origin}/settings/profile`,
            failureUrl: `${window.location.origin}/error`,
        }
        );
    }
}

export { loadOtherTokenContracts }
