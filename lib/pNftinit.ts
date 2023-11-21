//this is not really needed auth can handle all contracts init
import * as nearApiJs from "near-api-js";
import { ConnectConfig } from "near-api-js";
import { PNFTContract } from "../types/contracts";
import { getConfig } from "./config";

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

export async function contractFullAccessKey(
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
