// This is the contract for Aerx Aerx(An Nft)
use aerx_struct::AexPost;
use near_contract_standards::non_fungible_token::core::ext_receiver;
use near_contract_standards::non_fungible_token::events::NftMint;
use near_contract_standards::non_fungible_token::events::NftTransfer;
use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};
use near_contract_standards::non_fungible_token::{refund_approved_account_ids, NonFungibleToken};
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, TreeMap, UnorderedSet};
use near_sdk::json_types::U128;
use near_sdk::{
    assert_one_yocto, env, ext_contract, log, near_bindgen, require, serde_json, AccountId,
    Balance, BorshStorageKey, Gas, PanicOnDefault, Promise, PromiseOrValue, PromiseResult,
};
use std::collections::HashMap;
const GAS_FOR_RESOLVE_TRANSFER: Gas = Gas(5_000_000_000_000);
const GAS_FOR_NFT_TRANSFER_CALL: Gas = Gas(25_000_000_000_000 + GAS_FOR_RESOLVE_TRANSFER.0);
const ONE_U128_AS_F64: f64 = 1000000000000000000000000_f64;

near_contract_standards::impl_non_fungible_token_enumeration!(Aerx, nfts);

pub mod aerx_struct;
use aerx_struct::MintProfileReturn;
use aerx_struct::{Earnings, Repost};

const MINT_FEE: U128 = U128(1000000000000000000000000);
const AERX_ICON_URL: &str = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -30 230 210'%3E%3Cg id='l' data-name='l'%3E%3Cpath fill='%23C4A2FC' d='M57,3.2c-15.4,2-25.4,4.7-35.8,9.4L16,15l5.7,11.5C25.2,33.5,28,38,29,38c.8,0,5.3-1.3,10-2.9C51.4,30.9,56.1,30,65,30c11.1,0,17,2.4,20.6,8.6,1.9,3.3,2.4,5.5,2.4,11.2,0,4.4-.5,7.4-1.2,7.8-.6.4-8.8,1.1-18.2,1.6-37,1.8-54.4,9.1-62.2,26.1-2.7,5.8-2.9,7-2.9,19.2,0,13,0,13,3.7,20.6,5.8,11.9,15.3,19.3,28,22,7,1.5,27.7.6,35.3-1.5,10.5-3,20.9-9.5,28.7-18l4.7-5.1,7,7.1c7.3,7.3,15.9,12.4,27.1,16.1,8,2.6,39.3,2.6,50-.1,13.1-3.2,19.1-5.7,20.1-8.3,1-2.7,1.3-24.6.3-25.6-.3-.3-2.9.3-5.8,1.5-13.4,5.3-28.3,8.1-41.6,7.6-9.6-.3-11.2-.6-17.2-3.6-10.2-5-16.5-14.4-17.5-26.3l-.6-5.9,4.4-.1c2.4-.1,22.9-.2,45.4-.3l41-.1-.1-15.6c0-23.3-4.2-36.3-15.6-48.4C191,9.9,180.1,4.9,163.3,3.1c-17.4-1.9-34,2.4-46.4,12.1-2,1.5-4.2,2.8-4.9,2.8-.7,0-2.8-1.4-4.7-3-4-3.6-11.9-7.7-18.2-9.6C84.2,4,67.8,1.9,64.5,2.2c-1.1.1-4.5.6-7.5,1zm109.5,27.7c8.9,4,15.3,14.8,15.5,25.8V60h-55v-3.9c0-11.8,8-22.8,19-26.2,4.9-1.5,16.3-.9,20.5,1zM87.8,88.8c.4,10.9-1.5,17.5-6.8,23.4-5.8,6.6-11.1,8.8-21.2,8.8-9.2,0-13.2-1.6-16.5-6.7-2.7-4.1-2.5-17.6.4-22.1,5.4-8.6,15.7-12.1,34.8-11.8l9,.1.3,8.3z'/%3E%3C/g%3E%3C/svg%3E";
const NO_DEPOSIT: Balance = 0;
const AEX_CALL_CALLBACK_GAS: Gas = Gas(150000000000000);
const AEX_CALL_GAS: Gas = Gas(15000000000000);
const GENERAL_RESOLVE_GAS: Gas = Gas(50000000000000);
const GET_PRICE_GAS: Gas = Gas(5000000000000);
const RESOLVE_GET_PRICE_GAS: Gas = Gas(100000000000000);
const REQUIRED_AEX_STORAGE: Balance = 1250000000000000000000 + 2370000000000000000000;
const REGISTRATION_GIFT: Balance = 111000000000000000000000000;
const AVERAGE_MINT_PROFILE_GAS_COST: f64 = 0.00550;
const AVERAGE_MINT_POST_GAS_COST: f64 = 0.00709;
const AVERAGE_CHARGE_GAS_COST: f64 = 0.00600;
const AVERAGE_CHARGE_REPOST_GAS_COST: f64 = 0.00469;

#[ext_contract(ext_aex_token)]
trait AexCrossContract {
    fn register_and_reward_user(&mut self, account_id: AccountId) -> u128;
    fn send_aex(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: U128,
        memo: Option<String>,
    ) -> Balance;
    fn add_unrewarded_user(&mut self, account_id: AccountId) -> Vec<u128>;
}

#[ext_contract(ext_aeswap)]
trait AeswapCrossContract {
    fn get_price_from_pool(&self, pool_id: u32, token_id: AccountId) -> Balance;
}

#[ext_contract(ext_marketplace)]
trait MarketPlaceCrossContract {
    fn list_for_sale(&mut self, post: AexPost, price: Balance) -> bool;
    fn buy_post(&mut self, id: String, post_id: u128) -> bool;
}

#[ext_contract(ext_self)]
trait AfterAexContractCall {
    fn verify_aex_call_for_mint_profile(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        token_metadata: Option<TokenMetadata>,
    ) -> PromiseOrValue<MintProfileReturn>;

    fn verify_add_unrewarded_user_for_mint_profile(
        &mut self,
        username: TokenId,
        token_metadata: TokenMetadata,
    ) -> MintProfileReturn;

    fn verify_aex_for_mint_post(
        &mut self,
        user_id: AccountId,
        origin_post_id: u128,
        token_metadata: Option<TokenMetadata>,
    ) -> PromiseOrValue<MintProfileReturn>;
    fn verify_aex_call_for_charge(
        &mut self,
        creator_id: AccountId,
        charger_id: AccountId,
        post_id: u128,
        amount_charged: Balance,
        earners_share: Option<u128>,
    ) -> bool;
    fn verify_aex_call_for_charge_repost(
        &mut self,
        charger_id: AccountId,
        repost_id: u64,
        amount_charged: u128,
    ) -> bool;
    fn verify_marketplace_call() -> bool;
    fn resolve_get_price_from_pool(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        balance: Option<u128>,
        method: String,
        token_metadata: Option<TokenMetadata>,
        storage_cost_or_amount_charged: Option<u128>,
        repost_id: Option<u64>,
    ) -> PromiseOrValue<MintProfileReturn>;

    fn resolve_send_aex_mint_post_and_charge(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        method: String,
        token_metadata: Option<TokenMetadata>,
        storage_cost_or_amount_charged: Option<u128>,
        repost_id: Option<u64>,
    ) -> MintProfileReturn;

    fn nft_resolve_transfer(
        &mut self,
        previous_owner_id: AccountId,
        receiver_id: AccountId,
        token_id: TokenId,
        approved_account_ids: Option<HashMap<AccountId, u64>>,
    ) -> bool;
}

trait AfterAexContractCall {
    fn verify_aex_call_for_mint_profile(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        token_metadata: Option<TokenMetadata>,
    ) -> PromiseOrValue<MintProfileReturn>;

    fn verify_add_unrewarded_user_for_mint_profile(
        &mut self,
        username: TokenId,
        token_metadata: TokenMetadata,
    ) -> MintProfileReturn;

    fn verify_aex_for_mint_post(
        &mut self,
        user_id: AccountId,
        origin_post_id: u128,
        token_metadata: Option<TokenMetadata>,
    ) -> PromiseOrValue<MintProfileReturn>;
    fn verify_aex_call_for_charge(
        &mut self,
        creator_id: AccountId,
        charger_id: AccountId,
        post_id: u128,
        amount_charged: Balance,
        earners_share: Option<u128>,
    ) -> bool;
    fn verify_aex_call_for_charge_repost(
        &mut self,
        charger_id: AccountId,
        repost_id: u64,
        amount_charged: u128,
    ) -> bool;
    fn verify_marketplace_call() -> bool;
    fn resolve_get_price_from_pool(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        balance: Option<u128>,
        method: String,
        token_metadata: Option<TokenMetadata>,
        storage_cost_or_amount_charged: Option<u128>,
        repost_id: Option<u64>,
    ) -> PromiseOrValue<MintProfileReturn>;

    fn resolve_send_aex_mint_post_and_charge(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        method: String,
        token_metadata: Option<TokenMetadata>,
        storage_cost_or_amount_charged: Option<u128>,
        repost_id: Option<u64>,
    ) -> MintProfileReturn;

    fn nft_resolve_transfer(
        &mut self,
        previous_owner_id: AccountId,
        receiver_id: AccountId,
        token_id: TokenId,
        approved_account_ids: Option<HashMap<AccountId, u64>>,
    ) -> bool;
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Aerx {
    nfts: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,
    token_contract_id: AccountId,
    aeswap_contract_id: AccountId,
    marketplace_contract_id: AccountId,
    last_post_id: u128,
    total_charges_per_post: TreeMap<TokenId, Balance>,
    earnings_per_user: LookupMap<AccountId, Earnings>,
    co_earners_per_post: LookupMap<TokenId, Vec<AccountId>>,
    origin_post_id_per_post: LookupMap<TokenId, u128>,
    reposts: UnorderedSet<Repost>,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    NonFungibleToken,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
    TokensPerOwner { account_hash: Vec<u8> },
}

//Todo: for frontend dev the contract with user as signer should be used to call all the view methods during integration
#[near_bindgen]
impl Aerx {
    // initialize Aerx contract with default metadata
    #[init]
    pub fn new_default_metadata(
        owner_id: AccountId,
        token_contract_id: AccountId,
        aeswap_contract_id: AccountId,
        marketplace_contract_id: AccountId,
    ) -> Self {
        Self::new(
            owner_id,
            NFTContractMetadata {
                spec: NFT_METADATA_SPEC.to_string(),
                name: "AERX NFT".to_string(),
                symbol: "AERX-NFT".to_string(),
                icon: Some(AERX_ICON_URL.to_string()),
                base_uri: None,
                reference: None,
                reference_hash: None,
            },
            token_contract_id,
            aeswap_contract_id,
            marketplace_contract_id,
        )
    }

    #[init]
    pub fn new(
        owner_id: AccountId,
        metadata: NFTContractMetadata,
        token_contract_id: AccountId,
        aeswap_contract_id: AccountId,
        marketplace_contract_id: AccountId,
    ) -> Self {
        require!(!env::state_exists(), "Already initialized");
        metadata.assert_valid();
        Self {
            nfts: NonFungibleToken::new(
                StorageKey::NonFungibleToken,
                owner_id,
                Some(StorageKey::TokenMetadata),
                Some(StorageKey::Enumeration),
                Some(StorageKey::Approval),
            ),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
            token_contract_id,
            aeswap_contract_id,
            reposts: UnorderedSet::new(b"r"),
            marketplace_contract_id,
            last_post_id: 0,
            total_charges_per_post: TreeMap::new(b"t"),
            earnings_per_user: LookupMap::new(b"e"),
            co_earners_per_post: LookupMap::new(b"c"),
            origin_post_id_per_post: LookupMap::new(b"o"),
        }
    }
    // gift user 111 aex and registers users and create profile(mint Nft)
    // take username incase user decides not to add username to their metadata(username is compulsory at least)
    #[payable]
    pub fn mint_profile(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        token_metadata: TokenMetadata,
    ) -> PromiseOrValue<MintProfileReturn> {
        require!(
            username.parse::<u128>().is_err(),
            "Username cannot be number must contain a letter or character at least"
        );
        require!(
            self.is_username_available(username.clone()),
            "Username exists. Choose new one"
        );
        if env::predecessor_account_id() == self.nfts.owner_id {
            // verify user is not an existing user
            require!(
                !self
                    .nfts
                    .tokens_per_owner
                    .as_ref()
                    .unwrap()
                    .contains_key(&user_id),
                "You are an existing user you can only edit your details can't remint"
            );
            //call token contract to claim gift
            let deposit = env::attached_deposit();
            let result = ext_aex_token::register_and_reward_user(
                user_id.clone(),
                self.token_contract_id.clone(),
                deposit,
                AEX_CALL_GAS,
            )
            .then(ext_self::verify_aex_call_for_mint_profile(
                user_id,
                username,
                Some(token_metadata),
                env::current_account_id(),
                0,
                AEX_CALL_CALLBACK_GAS,
            ));
            PromiseOrValue::Promise(result)
        } else {
            // verify caller is not an existing user
            require!(
                !self
                    .nfts
                    .tokens_per_owner
                    .as_ref()
                    .unwrap()
                    .contains_key(&env::predecessor_account_id()),
                "You are an existing user you can only edit your details can't remint"
            );
            let result = ext_aex_token::add_unrewarded_user(
                env::predecessor_account_id(),
                self.token_contract_id.clone(),
                env::attached_deposit(),
                AEX_CALL_GAS,
            )
            .then(ext_self::verify_add_unrewarded_user_for_mint_profile(
                username,
                token_metadata,
                env::current_account_id(),
                env::attached_deposit(),
                AEX_CALL_CALLBACK_GAS,
            ));
            PromiseOrValue::Promise(result)
        }
    }

    // checks if username is available(adviceable for users to first check this to save gas)
    // the main reason is for frontend dev so they can use this to warn users that input an existing username
    pub fn is_username_available(&self, username: TokenId) -> bool {
        if username.parse::<u128>().is_ok() {
            false
        } else {
            self.nft_token(username).is_none()
        }
    }
    //return standard nft Token struct on a selected token(profile/post)
    pub fn nft_token(&self, token_id: TokenId) -> Option<Token> {
        let owner_id = self.nfts.owner_by_id.get(&token_id)?;
        let metadata = self
            .nfts
            .token_metadata_by_id
            .as_ref()
            .and_then(|by_id| by_id.get(&token_id));
        let approved_account_ids = self
            .nfts
            .approvals_by_id
            .as_ref()
            .and_then(|by_id| by_id.get(&token_id).or_else(|| Some(HashMap::new())));
        Some(Token {
            token_id,
            owner_id,
            metadata,
            approved_account_ids,
        })
    }

    #[payable]
    pub fn edit_profile(
        &mut self,
        new_username: TokenId,
        new_details: TokenMetadata,
    ) -> Option<Token> {
        let initial_storage = env::storage_usage();
        let user_id = env::predecessor_account_id();
        // verify caller is a user
        require!(
            self.has_registered(user_id.clone()),
            "Only Aerx users can edit profile"
        );
        require!(
            new_username.to_string().parse::<u128>().is_err(),
            "Username cannot be number must contain a letter at least"
        );
        //Verify new username doesn't exist
        require!(
            self.is_username_available(new_username.clone()),
            "Username exists. Choose new one"
        );
        //Get previous username
        let old_username = self
            .nfts
            .tokens_per_owner
            .as_ref()
            .unwrap_or_else(|| env::panic_str("Error while getting all Aerx nfts"))
            .get(&user_id)
            .unwrap_or_else(|| env::panic_str("You are not an existing user"))
            .iter()
            .find(|nft| nft.to_string().parse::<u128>().is_err())
            .unwrap_or_else(|| {
                env::panic_str("Error while getting your previous username, Try again later")
            });
        self.nfts.owner_by_id.remove(&old_username);
        self.nfts.owner_by_id.insert(&new_username, &user_id);
        let last_details = self.nfts.token_metadata_by_id.as_mut().unwrap();
        last_details.remove(&old_username);
        last_details.insert(&new_username, &new_details);
        if let Some(nfts_per_owner) = &mut self.nfts.tokens_per_owner {
            let mut usernames = nfts_per_owner
                .get(&user_id)
                .unwrap_or_else(|| env::panic_str("User id does not exist"));
            usernames.remove(&old_username);
            usernames.insert(&new_username);
            nfts_per_owner.insert(&user_id, &usernames);
        };
        let final_storage = env::storage_usage();
        let cost = Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
        if final_storage > initial_storage {
            require!(
                env::attached_deposit() >= cost,
                format!(
                    "Attached deposit is lesser than storage cost, attach : {} and try again",
                    cost
                )
            );
        }
        let refund = env::attached_deposit() - cost;
        if refund > 0 {
            Promise::new(user_id).transfer(refund);
        }
        self.nft_token(new_username)
    }

    // checks if account id is an aerx user
    pub fn has_registered(&self, user_id: AccountId) -> bool {
        self.nfts
            .tokens_per_owner
            .as_ref()
            .unwrap_or(&LookupMap::new(b"z"))
            .get(&user_id)
            .is_some()
    }

    //get user details using their id(for frontend and users that want to search using near account)
    pub fn profile_by_id(&self, user_id: AccountId, user_to_find_id: AccountId) -> Token {
        // verify caller is a user
        require!(
            self.has_registered(user_id),
            "Only Aerx users can search other users by their id"
        );
        // get user to find username and get details
        let username_to_find = self
            .nfts
            .tokens_per_owner
            .as_ref()
            .unwrap_or_else(|| env::panic_str("Error while getting all Aerx nfts"))
            .get(&user_to_find_id)
            .unwrap_or_else(|| UnorderedSet::new(b"x"))
            .iter()
            .find(|nft| nft.to_string().parse::<u128>().is_err())
            .unwrap_or_default();
        self.nft_token(username_to_find).unwrap()
    }

    //Frontend devs should verify user have at least 1 + amount to charge before calling this function
    //mint post
    #[payable]
    pub fn mint_post(
        &mut self,
        user_id: AccountId,
        origin_post_id: u128,
        token_metadata: Option<TokenMetadata>,
    ) -> PromiseOrValue<AexPost> {
        require!(
            env::predecessor_account_id() == env::signer_account_id(),
            "Cross contract call is not allowed for your security. Thanks"
        );
        // verify Aerx is the caller
        if env::signer_account_id() == self.nfts.owner_id {
            // verify user is registered
            require!(
                self.has_registered(user_id.clone()),
                "Only Aerx users can mint post"
            );
            require!(origin_post_id == 0, "Aerx can only help you make a post, you need to be the signer to make an earn together post");
            //call aex_token and send aex
            let memo = format!(
                "Post minting payment from '{}' to '{}'",
                user_id, self.token_contract_id
            );
            let result = ext_aex_token::send_aex(
                user_id.clone(),
                env::current_account_id(),
                MINT_FEE,
                Some(memo),
                self.token_contract_id.clone(),
                NO_DEPOSIT,
                AEX_CALL_GAS,
            )
            .then(ext_self::verify_aex_for_mint_post(
                user_id,
                origin_post_id,
                token_metadata,
                env::current_account_id(),
                self.get_minimum_required_storage_cost(),
                AEX_CALL_CALLBACK_GAS,
            ));
            near_sdk::PromiseOrValue::Promise(result)
        } else {
            // verify caller is registered
            require!(
                self.has_registered(env::predecessor_account_id()),
                "Only Aerx users can mint post"
            );
            require!(
                origin_post_id <= self.last_post_id,
                format!(
                    "Invalid origin post id, note: it must be between 0 to {}",
                    self.last_post_id
                )
            );
            //call aex_token and send aex
            let memo = format!(
                "Post minting payment from '{}' to '{}'",
                env::predecessor_account_id(),
                self.token_contract_id
            );
            let result = ext_aex_token::send_aex(
                env::predecessor_account_id(),
                env::current_account_id(),
                MINT_FEE,
                Some(memo),
                self.token_contract_id.clone(),
                NO_DEPOSIT,
                AEX_CALL_GAS,
            )
            .then(ext_self::verify_aex_for_mint_post(
                env::predecessor_account_id(),
                origin_post_id,
                token_metadata,
                env::current_account_id(),
                env::attached_deposit(),
                AEX_CALL_CALLBACK_GAS,
            ));
            near_sdk::PromiseOrValue::Promise(result)
        }
    }

    fn get_additional_required_storage_fee(
        &mut self,
        user_id: AccountId,
        origin_post_id: u128,
    ) -> u128 {
        let initial_storage = env::storage_usage();
        let test_post_id = (u128::MAX).to_string();
        let u128_max = u128::MAX;
        self.total_charges_per_post.insert(&test_post_id, &u128_max);
        self.origin_post_id_per_post
            .insert(&test_post_id, &u128_max);
        if origin_post_id > 0 {
            let post = self.post_details(user_id, origin_post_id.to_string());
            if !post.co_earners.is_empty() {
                self.co_earners_per_post.insert(&test_post_id, &Vec::new());
            } else {
                let mut co_earners = post.co_earners;
                co_earners.push(post.owner_id);
                self.co_earners_per_post.insert(&test_post_id, &co_earners);
            }
        }
        let final_storage = env::storage_usage();
        let cost = Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
        self.total_charges_per_post.remove(&test_post_id);
        self.origin_post_id_per_post.remove(&test_post_id);
        if origin_post_id > 0 {
            self.co_earners_per_post.remove(&test_post_id);
        }
        cost
    }

    fn get_mint_storage_fee(
        &mut self,
        user_id: AccountId,
        token_metadata: Option<TokenMetadata>,
    ) -> Balance {
        let initial_storage = env::storage_usage();
        let token_id = (u128::MAX).to_string();
        self.nfts.owner_by_id.insert(&token_id, &user_id);
        self.nfts
            .token_metadata_by_id
            .as_mut()
            .and_then(|by_id| by_id.insert(&token_id, token_metadata.as_ref().unwrap()));
        if let Some(tokens_per_owner) = &mut self.nfts.tokens_per_owner {
            let mut token_ids = tokens_per_owner.get(&user_id).unwrap_or_else(|| {
                UnorderedSet::new(StorageKey::TokensPerOwner {
                    account_hash: env::sha256(user_id.as_bytes()),
                })
            });
            token_ids.insert(&token_id);
            tokens_per_owner.insert(&user_id, &token_ids);
        }
        let final_storage = env::storage_usage();
        let cost = Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
        self.nfts.owner_by_id.remove(&token_id);
        self.nfts
            .token_metadata_by_id
            .as_mut()
            .unwrap()
            .remove(&token_id);
        if let Some(nfts_per_owner) = &mut self.nfts.tokens_per_owner {
            let post_ids = &mut nfts_per_owner.get(&user_id).unwrap();
            post_ids.remove(&token_id);
            nfts_per_owner.insert(&user_id, post_ids);
        };
        if let Some(approvals_by_id) = &mut self.nfts.approvals_by_id {
            approvals_by_id.remove(&token_id);
        }
        cost
    }

    // charge users for their posts
    // TODO: frontend dev should make a click on this send 1 aex token and hold on this should let user input amount they want
    pub fn charge(&mut self, charger_id: AccountId, post_id: u128, amount: U128) {
        // verify Aerx is the caller
        require!(
            self.nfts.owner_id == env::signer_account_id(),
            "Only Aerx contract can call this"
        );
        // check if caller(on aerx) is a user
        require!(
            self.has_registered(charger_id.clone()),
            "Only Aerx users can charge post(s)"
        );
        //verify post exists
        require!(
            post_id != 0 && post_id <= self.last_post_id,
            format!(
                "Invalid post id, note: post id must be between 1 to {}",
                self.last_post_id
            )
        );
        //get post creator_id, and co_earners
        let amount_charged: Balance = amount.into();
        let post_details = self.post_details(charger_id.clone(), post_id.to_string());
        let creator_id = post_details.owner_id;
        let memo_aerx = format!("Charge post payment from '{}' to Aerx", charger_id,);
        let memo_creator = format!(
            "Charge post payment from '{}' to '{}'",
            charger_id, creator_id
        );
        let co_earners = post_details.co_earners;
        let aerx_share = (10.0 / 100.0) * amount_charged as f64;
        let aerx_share_u128 = aerx_share as u128;
        let earner_share;
        if !co_earners.is_empty() {
            ext_aex_token::send_aex(
                charger_id.clone(),
                env::current_account_id(),
                U128(aerx_share_u128),
                Some(memo_aerx),
                self.token_contract_id.clone(),
                NO_DEPOSIT,
                AEX_CALL_GAS,
            );
            if !co_earners.contains(&charger_id) {
                if charger_id != creator_id {
                    earner_share =
                        (amount_charged as f64 - aerx_share) / (co_earners.len() as f64 + 1.0);
                } else {
                    earner_share = (amount_charged as f64 - aerx_share) / co_earners.len() as f64;
                }
            } else if charger_id != creator_id {
                earner_share = (amount_charged as f64 - aerx_share) / co_earners.len() as f64;
            } else {
                earner_share =
                    (amount_charged as f64 - aerx_share) / (co_earners.len() as f64 - 1.0);
            }
            let earners_share_u128 = earner_share as u128;
            for earner in co_earners.iter() {
                if *earner != charger_id {
                    let memo_earner =
                        format!("Charge post payment from '{}' to '{}'", charger_id, earner);
                    ext_aex_token::send_aex(
                        charger_id.clone(),
                        earner.clone(),
                        U128(earners_share_u128),
                        Some(memo_earner.clone()),
                        self.token_contract_id.clone(),
                        NO_DEPOSIT,
                        AEX_CALL_GAS,
                    );
                } else {
                    continue;
                }
            }
            if !co_earners.contains(&charger_id) && charger_id != creator_id {
                ext_aex_token::send_aex(
                    charger_id.clone(),
                    creator_id.clone(),
                    U128(earners_share_u128),
                    Some(memo_creator),
                    self.token_contract_id.clone(),
                    NO_DEPOSIT,
                    AEX_CALL_GAS,
                )
                .then(ext_self::verify_aex_call_for_charge(
                    creator_id,
                    charger_id,
                    post_id,
                    amount_charged,
                    Some(earners_share_u128),
                    env::current_account_id(),
                    NO_DEPOSIT,
                    AEX_CALL_CALLBACK_GAS,
                ));
            }
        } else if charger_id != creator_id {
            ext_aex_token::send_aex(
                charger_id.clone(),
                env::current_account_id(),
                U128(aerx_share_u128),
                Some(memo_aerx),
                self.token_contract_id.clone(),
                NO_DEPOSIT,
                AEX_CALL_GAS,
            );
            let creator_share = amount_charged as f64 - aerx_share;
            let creator_share_u128 = creator_share as u128;
            ext_aex_token::send_aex(
                charger_id.clone(),
                creator_id.clone(),
                U128(creator_share_u128),
                Some(memo_creator),
                self.token_contract_id.clone(),
                NO_DEPOSIT,
                AEX_CALL_GAS,
            )
            .then(ext_self::verify_aex_call_for_charge(
                creator_id,
                charger_id,
                post_id,
                amount_charged,
                None,
                env::current_account_id(),
                NO_DEPOSIT,
                AEX_CALL_CALLBACK_GAS,
            ));
        } else {
            ext_aex_token::send_aex(
                charger_id,
                env::current_account_id(),
                U128(amount_charged),
                Some(memo_aerx),
                self.token_contract_id.clone(),
                NO_DEPOSIT,
                AEX_CALL_GAS,
            );
        }
    }

    pub fn charge_repost(&mut self, charger_id: AccountId, repost_id: u64, amount: U128) {
        // verify Aerx is the caller
        require!(
            self.nfts.owner_id == env::signer_account_id(),
            "Only Aerx contract can call this"
        );
        // check if caller(on aerx) is a user
        require!(
            self.has_registered(charger_id.clone()),
            "Only Aerx users can charge post(s)"
        );
        //verify post exists
        require!(
            repost_id != 0 && repost_id <= self.reposts.len() as u64,
            format!(
                "Invalid repost id, note: post id must be between 1 to {}",
                self.reposts.len()
            )
        );
        //get post creator_id, and co_earners
        let amount_charged: Balance = amount.into();
        let repost_details = self.repost_details(charger_id.clone(), repost_id);
        let initial_owner = repost_details.initial_owner;
        let creator_id = repost_details.owner;
        let memo_aerx = format!("Charge Repost payment from '{}' to Aerx", charger_id,);
        let memo_initial_owner = format!(
            "Charge Repost payment from '{}' to {}",
            charger_id, initial_owner
        );
        let memo_creator = format!(
            "Charge Repost payment from '{}' to '{}'",
            charger_id, creator_id
        );
        let aerx_share = 10.0 / 100.0 * amount_charged as f64;
        let aerx_share_u128 = aerx_share as u128;
        ext_aex_token::send_aex(
            charger_id.clone(),
            env::current_account_id(),
            U128(aerx_share_u128),
            Some(memo_aerx),
            self.token_contract_id.clone(),
            NO_DEPOSIT,
            AEX_CALL_GAS,
        );
        if charger_id != creator_id {
            let initial_owner_share = (90.0 / 100.0) * (amount_charged as f64 - aerx_share);
            let initial_owner_share_u128 = initial_owner_share as u128;
            ext_aex_token::send_aex(
                charger_id.clone(),
                initial_owner,
                U128(initial_owner_share_u128),
                Some(memo_initial_owner),
                self.token_contract_id.clone(),
                NO_DEPOSIT,
                AEX_CALL_GAS,
            );
            let creator_share = (amount_charged as f64 - aerx_share) - initial_owner_share;
            let creator_share_u128 = creator_share as u128;
            ext_aex_token::send_aex(
                charger_id.clone(),
                creator_id,
                U128(creator_share_u128),
                Some(memo_creator),
                self.token_contract_id.clone(),
                NO_DEPOSIT,
                AEX_CALL_GAS,
            )
            .then(ext_self::verify_aex_call_for_charge_repost(
                charger_id,
                repost_id,
                amount_charged,
                env::current_account_id(),
                NO_DEPOSIT,
                AEX_CALL_CALLBACK_GAS,
            ));
        } else {
            let initial_owner_share = amount_charged as f64 - aerx_share;
            let initial_owner_share_u128 = initial_owner_share as u128;
            ext_aex_token::send_aex(
                charger_id.clone(),
                initial_owner,
                U128(initial_owner_share_u128),
                Some(memo_initial_owner),
                self.token_contract_id.clone(),
                NO_DEPOSIT,
                AEX_CALL_GAS,
            )
            .then(ext_self::verify_aex_call_for_charge_repost(
                charger_id,
                repost_id,
                amount_charged,
                env::current_account_id(),
                0,
                AEX_CALL_CALLBACK_GAS,
            ));
        }
    }

    //gives all the details about a post/profile
    pub fn post_details(&self, user_id: AccountId, post_id: TokenId) -> AexPost {
        // check if caller(on aerx) is a user
        require!(
            self.has_registered(user_id),
            "Only Aerx users can check post(s) details"
        );
        let owner_id = self
            .nfts
            .owner_by_id
            .get(&post_id)
            .unwrap_or_else(|| AccountId::new_unchecked("".to_string()));
        let metadata = self
            .nfts
            .token_metadata_by_id
            .as_ref()
            .and_then(|details_by_id| details_by_id.get(&post_id));
        let total_charges = self.total_charges_per_post.get(&post_id).unwrap_or(0);
        let origin_post_id = self.origin_post_id_per_post.get(&post_id);
        let co_earners = self.co_earners_per_post.get(&post_id).unwrap_or_default();
        AexPost {
            post_id,
            owner_id,
            metadata,
            total_charges,
            origin_post_id,
            co_earners,
        }
    }

    // get all posts
    pub fn get_all_posts(&self, user_id: AccountId) -> Vec<AexPost> {
        // check if caller(on aerx) is a user
        require!(
            self.has_registered(user_id.clone()),
            "Only Aerx users can get all posts details"
        );
        let aerx_testnet: AccountId = AccountId::new_unchecked("Aerx.Aerx".to_string());
        let mut posts_details: Vec<AexPost> = vec![AexPost {
            post_id: 0.to_string(),
            owner_id: aerx_testnet,
            metadata: Some(TokenMetadata {
                title: Some("Welcome to AERX".to_string()),
                description: Some("Welcome to AERX".to_string()),
                media: None,
                media_hash: None,
                copies: None,
                issued_at: None,
                expires_at: None,
                starts_at: None,
                updated_at: None,
                extra: None,
                reference: None,
                reference_hash: None,
            }),
            total_charges: 0,
            origin_post_id: None,
            co_earners: Vec::new(),
        }];
        for (_usernames, user_ids) in self.nfts.owner_by_id.into_iter() {
            if self.nfts.tokens_per_owner.is_some() {
                let posts_per_owner = self.nfts.tokens_per_owner.as_ref().unwrap();
                if posts_per_owner.get(&user_ids).is_some() {
                    let posts_ids = posts_per_owner.get(&user_ids).unwrap();
                    for post_id in posts_ids.iter() {
                        let post_details = self.post_details(user_id.clone(), post_id);
                        if !posts_details.contains(&post_details) {
                            posts_details.push(post_details)
                        }
                    }
                } else {
                    continue;
                }
            } else {
                continue;
            }
        }
        posts_details
    }

    //returns collection of all user ids(for frontend to improve users search)
    pub fn get_users_ids(&self, user_id: AccountId) -> Vec<AccountId> {
        // check if caller(on aerx) is a user
        require!(
            self.has_registered(user_id),
            "Only Aerx users can search for user(s)"
        );
        let mut user_ids: Vec<AccountId> = Vec::new();
        for (_usernames, _user_ids) in self.nfts.owner_by_id.iter() {
            if !user_ids.contains(&_user_ids) {
                user_ids.push(_user_ids);
            }
        }
        user_ids
    }

    //borrow a post so users can earn together
    #[payable]
    pub fn repost(&mut self, post_id: u128) -> Repost {
        let initial_storage = env::storage_usage();
        let user_id = env::predecessor_account_id();
        // check if caller(on aerx) is a user
        require!(
            self.has_registered(user_id.clone()),
            "Only Aerx users can repost a post"
        );
        //verify post exists
        require!(
            post_id != 0 && post_id <= self.last_post_id,
            format!(
                "Invalid post id, note: post id must be between 1 to {}",
                self.last_post_id
            )
        );
        //get post details
        let post_to_borrow = self.post_details(env::predecessor_account_id(), post_id.to_string());
        //create repost with caller as owner
        let new_repost = Repost {
            id: self.reposts.len() as u64 + 1,
            owner: env::predecessor_account_id(),
            initial_owner: post_to_borrow.owner_id,
            details: Some(post_to_borrow.metadata.unwrap()),
            total_charges: 0,
        };
        self.reposts.insert(&new_repost);
        let final_storage = env::storage_usage();
        let cost = Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
        require!(
            env::attached_deposit() >= cost,
            format!(
                "Attached deposit lesser than storage cost, attach: {} and try again",
                cost
            )
        );
        let refund = env::attached_deposit() - cost;
        if refund > 0 {
            Promise::new(user_id).transfer(refund);
        }
        self.reposts
            .iter()
            .find(|repost| repost.id == new_repost.id)
            .unwrap_or_else(|| env::panic_str("Error getting newly saved repost try again"))
    }
    //return a particular repost using repost id
    pub fn repost_details(&self, user_id: AccountId, repost_id: u64) -> Repost {
        // check if caller(on aerx) is a user
        require!(
            self.has_registered(user_id),
            "Only Aerx users can see repost(s) details"
        );
        self.reposts
            .iter()
            .find(|repost| repost.id == repost_id)
            .unwrap_or(Repost {
                id: 0,
                owner: AccountId::new_unchecked("".to_string()),
                initial_owner: AccountId::new_unchecked("".to_string()),
                details: None,
                total_charges: 0,
            })
    }
    //return all reposts
    pub fn get_all_repost(&self, user_id: AccountId) -> Vec<Repost> {
        // check if caller(on aerx) is a user
        require!(
            self.has_registered(user_id),
            "Only Aerx users can see all reposts details"
        );
        self.reposts.to_vec()
    }

    //get caller's earnings
    pub fn get_earnings(&self, user_id: AccountId) -> Earnings {
        self.earnings_per_user.get(&user_id).unwrap_or(Earnings {
            total: 0,
            available: 0,
        })
    }
    pub fn decrease_earning(&mut self, user_id: AccountId, amount: U128) -> bool {
        require!(
            env::predecessor_account_id() == env::current_account_id()
                || env::predecessor_account_id() == self.token_contract_id
                || env::predecessor_account_id() == self.aeswap_contract_id,
            "Only AERX, AESWAP and AEX contracts are allowed to call this function"
        );
        let earnings = self.get_earnings(user_id.clone());
        let amount: Balance = amount.into();
        if earnings.available >= amount {
            let new_available_amount = earnings
                .available
                .checked_sub(amount)
                .unwrap_or_else(|| env::panic_str("Available earning overflow"));
            let _earnings = Earnings {
                total: earnings.total,
                available: new_available_amount,
            };
            self.earnings_per_user.insert(&user_id, &_earnings);
            true
        } else {
            env::panic_str("Insufficient available earnings")
        }
    }

    pub fn increase_earnings(&mut self, user_id: AccountId, amount: U128) -> bool {
        require!(
            env::predecessor_account_id() == env::current_account_id()
                || env::predecessor_account_id() == self.token_contract_id
                || env::predecessor_account_id() == self.aeswap_contract_id,
            "Only AERX, AESWAP and AEX contracts are allowed to call this function"
        );
        let earnings = self.get_earnings(user_id.clone());
        let amount: Balance = amount.into();
        if earnings.available == 0 {
            if self.has_registered(user_id.clone()) {
                let new_available_amount = earnings.available.checked_add(amount).unwrap_or_else(|| env::panic_str("Available earning overflow, receiver should withdraw from earnings before more earnings can be added"));
                let new_total_amount = earnings.total.checked_add(amount).unwrap_or(u128::MAX);
                let _earnings = Earnings {
                    total: new_total_amount,
                    available: new_available_amount,
                };
                self.earnings_per_user.insert(&user_id, &_earnings);
                true
            } else {
                true
            }
        } else {
            let new_available_amount = earnings
                .available
                .checked_add(amount)
                .unwrap_or_else(|| env::panic_str("Available earning overflow"));
            let new_total_amount = earnings.total.checked_add(amount).unwrap_or(u128::MAX);
            let _earnings = Earnings {
                total: new_total_amount,
                available: new_available_amount,
            };
            self.earnings_per_user.insert(&user_id, &_earnings);
            true
        }
    }
    pub fn get_minimum_required_storage_cost(&self) -> Balance {
        Balance::from(self.nfts.extra_storage_in_bytes_per_token) * env::storage_byte_cost()
    }

    #[payable]
    pub fn nft_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
    ) {
        assert_one_yocto();
        require!(
            token_id.parse::<u128>().is_ok(),
            "You can't transfer your AERXProfileNFT only posts"
        );
        let sender_id = env::predecessor_account_id();
        self.nfts
            .internal_transfer(&sender_id, &receiver_id, &token_id, approval_id, memo);
    }

    #[payable]
    pub fn nft_transfer_call(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
        msg: String,
    ) -> PromiseOrValue<bool> {
        assert_one_yocto();
        require!(
            token_id.parse::<u128>().is_ok(),
            "You can't transfer your AERXProfileNFT only posts"
        );
        require!(
            env::prepaid_gas() > GAS_FOR_NFT_TRANSFER_CALL,
            "More gas is required"
        );
        require!(
            receiver_id == self.marketplace_contract_id.clone(),
            "AERX NFT MAERKETPLACE contract is the only authorized contract to receive AERX NFTS"
        );
        let sender_id = env::predecessor_account_id();
        let (old_owner, old_approvals) =
            self.nfts
                .internal_transfer(&sender_id, &receiver_id, &token_id, approval_id, memo);
        // Initiating receiver's call and the callback
        ext_receiver::nft_on_transfer(
            sender_id,
            old_owner.clone(),
            token_id.clone(),
            msg,
            receiver_id.clone(),
            NO_DEPOSIT,
            env::prepaid_gas() - GAS_FOR_NFT_TRANSFER_CALL,
        )
        .then(ext_self::nft_resolve_transfer(
            old_owner,
            receiver_id,
            token_id,
            old_approvals,
            env::current_account_id(),
            NO_DEPOSIT,
            GAS_FOR_RESOLVE_TRANSFER,
        ))
        .into()
    }
}

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Aerx {
    fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.get().unwrap()
    }
}

#[near_bindgen]
impl AfterAexContractCall for Aerx {
    #[private]
    fn verify_aex_call_for_mint_profile(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        token_metadata: Option<TokenMetadata>,
    ) -> PromiseOrValue<MintProfileReturn> {
        require!(
            env::promise_results_count() == 1,
            "Expected 1 result from promise",
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => env::panic_str("Claim token call failed"),
            PromiseResult::Successful(_result) => {
                let result: u128 = serde_json::from_slice(&_result)
                    .expect("Unexpected Error! Cross contract call didn't return user's balance");
                if result > 0 {
                    let final_result = ext_aeswap::get_price_from_pool(
                        1,
                        AccountId::new_unchecked("nearnativetoken.near".to_string()),
                        self.aeswap_contract_id.clone(),
                        NO_DEPOSIT,
                        GET_PRICE_GAS,
                    )
                    .then(ext_self::resolve_get_price_from_pool(
                        user_id,
                        username,
                        Some(result),
                        "mint_profile".to_string(),
                        token_metadata,
                        None,
                        None,
                        env::current_account_id(),
                        self.get_minimum_required_storage_cost(),
                        RESOLVE_GET_PRICE_GAS,
                    ));
                    PromiseOrValue::Promise(final_result)
                } else {
                    env::panic_str("Unexpected error occured try again later")
                }
            }
        }
    }

    #[payable]
    #[private]
    fn verify_add_unrewarded_user_for_mint_profile(
        &mut self,
        username: TokenId,
        token_metadata: TokenMetadata,
    ) -> MintProfileReturn {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                env::panic_str("Cross contract call to Aex token from swap failed")
            }
            PromiseResult::Successful(_result) => {
                let result: Vec<u128> = serde_json::from_slice(&_result)
                    .expect("Cross contract call to add_unrewarded_user didn't return a valid number vector");
                let initial_storage = env::storage_usage();
                let remaining_deposit = env::attached_deposit()
                    .checked_sub(result[0])
                    .unwrap_or_else(|| {
                        env::panic_str("deposit is too small attach enough deposit and try again")
                    });
                if self.nfts.owner_by_id.get(&username).is_some() {
                    env::panic_str("Username must be unique chose new one");
                }
                let owner_id: AccountId = env::signer_account_id();
                self.nfts.owner_by_id.insert(&username, &owner_id);
                self.nfts
                    .token_metadata_by_id
                    .as_mut()
                    .and_then(|by_id| by_id.insert(&username, &token_metadata));

                if let Some(tokens_per_owner) = &mut self.nfts.tokens_per_owner {
                    let mut token_ids = tokens_per_owner.get(&owner_id).unwrap_or_else(|| {
                        UnorderedSet::new(StorageKey::TokensPerOwner {
                            account_hash: env::sha256(owner_id.as_bytes()),
                        })
                    });
                    token_ids.insert(&username);
                    tokens_per_owner.insert(&owner_id, &token_ids);
                }

                // Approval Management extension: return empty HashMap as part of Token
                let approved_account_ids = if self.nfts.approvals_by_id.is_some() {
                    Some(HashMap::new())
                } else {
                    None
                };
                let current_earning = result[1];
                let new_earnings = Earnings {
                    total: current_earning,
                    available: current_earning,
                };
                self.earnings_per_user
                    .insert(&env::signer_account_id(), &new_earnings);
                let final_storage = env::storage_usage();
                let cost =
                    Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
                let refund = remaining_deposit - cost;
                if refund > 0 {
                    log!("will refund overpayment of {}", refund);
                    Promise::new(env::signer_account_id()).transfer(refund);
                }
                NftMint {
                    owner_id: &owner_id,
                    token_ids: &[&username],
                    memo: None,
                }
                .emit();
                MintProfileReturn {
                    token_id: username,
                    owner_id,
                    metadata: Some(token_metadata),
                    approved_account_ids,
                    mint_state: true,
                }
            }
        }
    }

    #[private]
    #[payable]
    fn verify_aex_for_mint_post(
        &mut self,
        user_id: AccountId,
        origin_post_id: u128,
        token_metadata: Option<TokenMetadata>,
    ) -> PromiseOrValue<MintProfileReturn> {
        require!(env::promise_results_count() == 1, "Expected 1 result");
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Successful(_result) => {
                let result: u128 =
                    serde_json::from_slice(&_result).expect("Cross contract call didn't a number");
                let available_post_id = self.last_post_id.checked_add(1).unwrap_or_else(|| {
                    env::panic_str("You can't mint anymore post on aerx for now")
                });
                let post_id = available_post_id.to_string();
                if env::signer_account_id() == self.nfts.owner_id {
                    if result > 0 {
                        let storage_cost = self
                            .get_mint_storage_fee(user_id.clone(), token_metadata.clone())
                            + self.get_additional_required_storage_fee(
                                user_id.clone(),
                                origin_post_id,
                            );
                        let final_result = ext_aeswap::get_price_from_pool(
                            1,
                            AccountId::new_unchecked("nearnativetoken.near".to_string()),
                            self.aeswap_contract_id.clone(),
                            NO_DEPOSIT,
                            GET_PRICE_GAS,
                        )
                        .then(ext_self::resolve_get_price_from_pool(
                            user_id,
                            post_id,
                            Some(result),
                            "mint_post".to_string(),
                            token_metadata,
                            Some(storage_cost),
                            None,
                            env::current_account_id(),
                            env::attached_deposit(),
                            RESOLVE_GET_PRICE_GAS,
                        ));
                        PromiseOrValue::Promise(final_result)
                    } else {
                        env::panic_str("Mint post failed because user balance is zero after mint fee was deducted, note: the mint fee was not returned back to user we held onto it as compensation for gas fee");
                    }
                } else {
                    let initial_storage_usage = env::storage_usage();
                    //verify origin post exists using origin post id
                    let token_id = (self.last_post_id + 1).to_string();
                    //mint post
                    if self.nfts.token_metadata_by_id.is_some() && token_metadata.is_none() {
                        env::panic_str("Must provide metadata");
                    }
                    if self.nfts.owner_by_id.get(&token_id).is_some() {
                        env::panic_str("token_id must be unique");
                    }
                    let owner_id: AccountId = user_id;
                    self.nfts.owner_by_id.insert(&token_id, &owner_id);
                    self.nfts.token_metadata_by_id.as_mut().and_then(|by_id| {
                        by_id.insert(&token_id, token_metadata.as_ref().unwrap())
                    });

                    if let Some(tokens_per_owner) = &mut self.nfts.tokens_per_owner {
                        let mut token_ids = tokens_per_owner.get(&owner_id).unwrap();
                        token_ids.insert(&token_id);
                        tokens_per_owner.insert(&owner_id, &token_ids);
                    }
                    let approved_account_ids = if self.nfts.approvals_by_id.is_some() {
                        Some(HashMap::new())
                    } else {
                        None
                    };
                    //update total charges on post
                    self.total_charges_per_post.insert(&post_id, &0);
                    self.origin_post_id_per_post
                        .insert(&post_id, &origin_post_id);
                    if origin_post_id > 0 {
                        let mut co_earners = self
                            .co_earners_per_post
                            .get(&origin_post_id.to_string())
                            .unwrap_or_default();
                        let origin_post_owner = self
                            .post_details(env::signer_account_id(), origin_post_id.to_string())
                            .owner_id;
                        co_earners.push(origin_post_owner);
                        self.co_earners_per_post.insert(&post_id, &co_earners);
                    }
                    //update last post id
                    self.last_post_id = available_post_id;
                    let final_storage_usage = env::storage_usage();
                    let cost = Balance::from(final_storage_usage - initial_storage_usage)
                        * env::storage_byte_cost();
                    require!(env::attached_deposit() >= cost, format!("Attached deposit is lesser than required storage, attach {} and try again", cost));
                    let refund = env::attached_deposit() - cost;
                    if refund > 0 {
                        log!("will refund overpayment of {}", refund);
                        Promise::new(env::signer_account_id()).transfer(refund);
                    }
                    NftMint {
                        owner_id: &owner_id,
                        token_ids: &[&token_id],
                        memo: None,
                    }
                    .emit();
                    PromiseOrValue::Value(MintProfileReturn {
                        token_id,
                        owner_id,
                        metadata: token_metadata,
                        approved_account_ids,
                        mint_state: true,
                    })
                }
            }
            PromiseResult::Failed => {
                env::panic_str("Mint post failed because send_aex called failed, try again later");
            }
        }
    }

    #[private]
    fn verify_aex_call_for_charge(
        &mut self,
        creator_id: AccountId,
        charger_id: AccountId,
        post_id: u128,
        amount_charged: Balance,
        earners_share: Option<u128>,
    ) -> bool {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                env::panic_str("Cross contract call to Aex token from charge failed")
            }
            PromiseResult::Successful(_result) => {
                let result: u128 = serde_json::from_slice(&_result)
                    .expect("Cross contract call didn't return true or false");
                if result > 0 {
                    ext_aeswap::get_price_from_pool(
                        1,
                        AccountId::new_unchecked("nearnativetoken.near".to_string()),
                        self.aeswap_contract_id.clone(),
                        NO_DEPOSIT,
                        GET_PRICE_GAS,
                    )
                    .then(ext_self::resolve_get_price_from_pool(
                        charger_id,
                        post_id.to_string(),
                        Some(result),
                        "charge".to_string(),
                        None,
                        Some(amount_charged),
                        None,
                        env::current_account_id(),
                        NO_DEPOSIT,
                        RESOLVE_GET_PRICE_GAS,
                    ));
                    true
                } else {
                    let aerx_share = (10.0 / 100.0) * amount_charged as f64;
                    let aerx_share_u128 = aerx_share as u128;
                    let co_earners = self
                        .post_details(charger_id.clone(), post_id.to_string())
                        .co_earners;
                    if !co_earners.is_empty() {
                        for co_earner in co_earners.iter() {
                            if *co_earner != charger_id {
                                ext_aex_token::send_aex(
                                    co_earner.clone(),
                                    env::current_account_id(),
                                    U128(earners_share.unwrap()),
                                    Some("charge refund".to_string()),
                                    self.token_contract_id.clone(),
                                    NO_DEPOSIT,
                                    AEX_CALL_GAS,
                                );
                            }
                        }
                        if !co_earners.contains(&creator_id) && creator_id != charger_id {
                            ext_aex_token::send_aex(
                                creator_id,
                                env::current_account_id(),
                                U128(earners_share.unwrap()),
                                Some("charge refund".to_string()),
                                self.token_contract_id.clone(),
                                NO_DEPOSIT,
                                AEX_CALL_GAS,
                            );
                        }
                    } else if creator_id != charger_id {
                        ext_aex_token::send_aex(
                            creator_id,
                            env::current_account_id(),
                            U128(amount_charged - aerx_share_u128),
                            Some("charge refund".to_string()),
                            self.token_contract_id.clone(),
                            NO_DEPOSIT,
                            AEX_CALL_GAS,
                        );
                    }
                    false
                }
            }
        }
    }

    #[private]
    fn verify_aex_call_for_charge_repost(
        &mut self,
        charger_id: AccountId,
        repost_id: u64,
        amount_charged: u128,
    ) -> bool {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                env::panic_str("Cross contract call to Aex token from charge repost failed")
            }
            PromiseResult::Successful(_result) => {
                let result: u128 = serde_json::from_slice(&_result)
                    .expect("Cross contract call didn't return true or false");
                if result > 0 {
                    ext_aeswap::get_price_from_pool(
                        1,
                        AccountId::new_unchecked("nearnativetoken.near".to_string()),
                        self.aeswap_contract_id.clone(),
                        0,
                        GET_PRICE_GAS,
                    )
                    .then(ext_self::resolve_get_price_from_pool(
                        charger_id,
                        repost_id.to_string(),
                        Some(result),
                        "charge_repost".to_string(),
                        None,
                        Some(amount_charged),
                        Some(repost_id),
                        env::current_account_id(),
                        NO_DEPOSIT,
                        RESOLVE_GET_PRICE_GAS,
                    ));
                    true
                } else {
                    let creator_id = self.repost_details(charger_id.clone(), repost_id).owner;
                    let initial_owner = self
                        .repost_details(charger_id.clone(), repost_id)
                        .initial_owner;
                    let aerx_share = 10.0 / 100.0 * amount_charged as f64;
                    if charger_id != creator_id {
                        let initial_owner_share =
                            (90.0 / 100.0) * (amount_charged as f64 - aerx_share);
                        let initial_owner_share_u128 = initial_owner_share as u128;
                        ext_aex_token::send_aex(
                            initial_owner,
                            env::current_account_id(),
                            U128(initial_owner_share_u128),
                            Some("Charge Refund".to_string()),
                            self.token_contract_id.clone(),
                            NO_DEPOSIT,
                            AEX_CALL_GAS,
                        );
                        let creator_share =
                            (amount_charged as f64 - aerx_share) - initial_owner_share;
                        let creator_share_u128 = creator_share as u128;
                        ext_aex_token::send_aex(
                            creator_id,
                            env::current_account_id(),
                            U128(creator_share_u128),
                            Some("Charge Refund".to_string()),
                            self.token_contract_id.clone(),
                            NO_DEPOSIT,
                            AEX_CALL_GAS,
                        );
                    } else {
                        let initial_owner_share = amount_charged as f64 - aerx_share;
                        let initial_owner_share_u128 = initial_owner_share as u128;
                        ext_aex_token::send_aex(
                            initial_owner,
                            env::current_account_id(),
                            U128(initial_owner_share_u128),
                            Some("Charge Refund".to_string()),
                            self.token_contract_id.clone(),
                            NO_DEPOSIT,
                            AEX_CALL_GAS,
                        );
                    }
                    false
                }
            }
        }
    }

    #[private]
    fn verify_marketplace_call() -> bool {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                env::panic_str("Cross contract call to Aex token from swap failed")
            }
            PromiseResult::Successful(_result) => {
                let result: bool = serde_json::from_slice(&_result)
                    .expect("Cross contract call didn't return true or false");
                if result {
                    true
                } else {
                    env::panic_str(
                        "Something went wrong, list_for_sale on marketplace didn't return true",
                    );
                }
            }
        }
    }

    #[private]
    #[payable]
    fn resolve_get_price_from_pool(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        balance: Option<u128>,
        method: String,
        token_metadata: Option<TokenMetadata>,
        storage_cost_or_amount_charged: Option<u128>,
        repost_id: Option<u64>,
    ) -> PromiseOrValue<MintProfileReturn> {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                env::panic_str("Cross contract call to get price from pool failed");
                //Todo: compensate aerx with 1aex
            }
            PromiseResult::Successful(_result) => {
                let result: u128 = serde_json::from_slice(&_result)
                    .expect("Cross contract call didn't return a number");
                if method == "mint_profile" {
                    let initial_storage = env::storage_usage();
                    let profile =
                        self.nfts
                            .internal_mint(username, user_id.clone(), token_metadata);
                    let current_earning = balance.unwrap().checked_sub(REGISTRATION_GIFT).unwrap_or_else(|| env::panic_str("Unexpected error occured users balance after claim token is lesser than registration gift"));
                    let new_earnings = Earnings {
                        total: current_earning,
                        available: current_earning,
                    };
                    self.earnings_per_user.insert(&user_id, &new_earnings);
                    let final_storage = env::storage_usage();
                    let storage_used = final_storage - initial_storage;
                    let storage_cost = Balance::from(storage_used) * env::storage_byte_cost();
                    let average_gas_cost_u128_profile =
                        (AVERAGE_MINT_PROFILE_GAS_COST * ONE_U128_AS_F64) as u128;
                    let amount_to_swap =
                        storage_cost + REQUIRED_AEX_STORAGE + average_gas_cost_u128_profile;
                    let equivalent_aex_profile =
                        (result as f64 / ONE_U128_AS_F64) as u128 * (amount_to_swap);
                    require!(
                        balance.unwrap() >= equivalent_aex_profile,
                        "Unable to mint profile, Registration gift is lesser than required storage and gas amount in aex"
                    );
                    ext_aex_token::send_aex(
                        user_id,
                        env::current_account_id(),
                        U128(equivalent_aex_profile),
                        Some("Aerx Profile creation storage and gas payment".to_string()),
                        self.token_contract_id.clone(),
                        NO_DEPOSIT,
                        AEX_CALL_GAS,
                    );
                    PromiseOrValue::Value(MintProfileReturn {
                        token_id: profile.token_id,
                        owner_id: profile.owner_id,
                        metadata: profile.metadata,
                        approved_account_ids: profile.approved_account_ids,
                        mint_state: true,
                    })
                } else if method == "mint_post" {
                    let average_gas_cost_u128_post =
                        (AVERAGE_MINT_POST_GAS_COST * ONE_U128_AS_F64) as u128;
                    let amount_to_swap =
                        storage_cost_or_amount_charged.unwrap() + average_gas_cost_u128_post;
                    let equivalent_aex_post =
                        (result as f64 / ONE_U128_AS_F64) as u128 * amount_to_swap;
                    require!(
                        balance.unwrap() >= equivalent_aex_post,
                        "Unable to mint post, User's balance is lesser than required storage and gas amount in aex"
                    );
                    let final_result = ext_aex_token::send_aex(
                        user_id.clone(),
                        env::current_account_id(),
                        U128(equivalent_aex_post),
                        Some("Aerx Post creation storage and gas payment".to_string()),
                        self.token_contract_id.clone(),
                        NO_DEPOSIT,
                        AEX_CALL_GAS,
                    )
                    .then(ext_self::resolve_send_aex_mint_post_and_charge(
                        user_id.clone(),
                        username,
                        method,
                        token_metadata,
                        None,
                        repost_id,
                        env::current_account_id(),
                        env::attached_deposit(),
                        GENERAL_RESOLVE_GAS,
                    ));
                    PromiseOrValue::Promise(final_result)
                } else if method == "charge" {
                    let amount_to_swap = (AVERAGE_CHARGE_GAS_COST * ONE_U128_AS_F64) as u128;
                    let amount_to_swap_u128 = amount_to_swap as u128;
                    let equivalent_aex_charge =
                        (result as f64 / ONE_U128_AS_F64) as u128 * amount_to_swap_u128;
                    require!(
                        balance.unwrap() >= equivalent_aex_charge,
                        "Unable to charge, users balance is lesser than required gas amount in aex"
                    );
                    let final_result = ext_aex_token::send_aex(
                        user_id.clone(),
                        env::current_account_id(),
                        U128(equivalent_aex_charge),
                        Some("Aerx charge gas payment".to_string()),
                        self.token_contract_id.clone(),
                        NO_DEPOSIT,
                        AEX_CALL_GAS,
                    )
                    .then(ext_self::resolve_send_aex_mint_post_and_charge(
                        user_id.clone(),
                        username,
                        method,
                        token_metadata,
                        storage_cost_or_amount_charged,
                        repost_id,
                        env::current_account_id(),
                        0,
                        GENERAL_RESOLVE_GAS,
                    ));
                    PromiseOrValue::Promise(final_result)
                } else if method == "charge_repost" {
                    let amount_to_swap = (AVERAGE_CHARGE_REPOST_GAS_COST * ONE_U128_AS_F64) as u128;
                    let equivalent_aex_charge_repost =
                        (result as f64 / ONE_U128_AS_F64) as u128 * amount_to_swap;
                    require!(
                        balance.unwrap() >= equivalent_aex_charge_repost,
                        "Unable to charge repost, Users balance is lesser than required gas payment in aex"
                    );
                    let final_result = ext_aex_token::send_aex(
                        user_id.clone(),
                        env::current_account_id(),
                        U128(equivalent_aex_charge_repost),
                        Some("Aerx charge repost gas payment".to_string()),
                        self.token_contract_id.clone(),
                        NO_DEPOSIT,
                        AEX_CALL_GAS,
                    )
                    .then(ext_self::resolve_send_aex_mint_post_and_charge(
                        user_id.clone(),
                        username,
                        method,
                        token_metadata,
                        storage_cost_or_amount_charged,
                        repost_id,
                        env::current_account_id(),
                        0,
                        GENERAL_RESOLVE_GAS,
                    ));
                    PromiseOrValue::Promise(final_result)
                } else {
                    PromiseOrValue::Value(MintProfileReturn {
                        token_id: "".to_string(),
                        owner_id: AccountId::new_unchecked("".to_string()),
                        metadata: None,
                        approved_account_ids: None,
                        mint_state: false,
                    })
                }
            }
        }
    }

    #[payable]
    #[private]
    fn resolve_send_aex_mint_post_and_charge(
        &mut self,
        user_id: AccountId,
        username: TokenId,
        method: String,
        token_metadata: Option<TokenMetadata>,
        storage_cost_or_amount_charged: Option<u128>,
        repost_id: Option<u64>,
    ) -> MintProfileReturn {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                env::panic_str("Cross contract call to Aex token from charge failed")
            }
            PromiseResult::Successful(_result) => {
                if method == "mint_post" {
                    let post = self
                        .nfts
                        .internal_mint(username.clone(), user_id, token_metadata);
                    //update total charges on post
                    self.total_charges_per_post.insert(&username, &0);
                    self.origin_post_id_per_post.insert(&username, &0);
                    self.last_post_id += 1;
                    MintProfileReturn {
                        token_id: post.token_id,
                        owner_id: post.owner_id,
                        metadata: post.metadata,
                        approved_account_ids: post.approved_account_ids,
                        mint_state: true,
                    }
                } else if method == "charge" {
                    //get total charges on the post and update it
                    let last_total_charges = self
                        .total_charges_per_post
                        .get(&username.to_string())
                        .unwrap();
                    let new_total_charges = last_total_charges
                        .checked_add(storage_cost_or_amount_charged.unwrap())
                        .unwrap_or_else(|| {
                            env::panic_str(
                                "Post has gotten to it's last charge can't add any more charge",
                            )
                        });
                    //update total charges per post
                    self.total_charges_per_post
                        .insert(&username.to_string(), &new_total_charges);
                    log!("Post charged successfully");
                    MintProfileReturn {
                        token_id: "".to_string(),
                        owner_id: AccountId::new_unchecked("".to_string()),
                        metadata: None,
                        approved_account_ids: None,
                        mint_state: false,
                    }
                } else if method == "charge_repost" {
                    //get total charges and update it
                    let last_total_charges = self
                        .reposts
                        .iter()
                        .find(|repost| repost.id == repost_id.unwrap())
                        .unwrap_or_else(|| env::panic_str("Repost with this id does not exist"))
                        .total_charges;
                    let new_total_charges = last_total_charges
                        .checked_add(storage_cost_or_amount_charged.unwrap())
                        .unwrap_or_else(|| {
                            env::panic_str(
                                "Repost has gotten to it's last charge can't add any more charge",
                            )
                        });
                    //update total charges per repost
                    self.reposts
                        .iter()
                        .find(|repost| repost.id == repost_id.unwrap())
                        .unwrap()
                        .total_charges = new_total_charges;
                    log!("Repost charged successfully");
                    MintProfileReturn {
                        token_id: "".to_string(),
                        owner_id: AccountId::new_unchecked("".to_string()),
                        metadata: None,
                        approved_account_ids: None,
                        mint_state: false,
                    }
                } else {
                    MintProfileReturn {
                        token_id: "".to_string(),
                        owner_id: AccountId::new_unchecked("".to_string()),
                        metadata: None,
                        approved_account_ids: None,
                        mint_state: false,
                    }
                }
            }
        }
    }

    #[private]
    fn nft_resolve_transfer(
        &mut self,
        previous_owner_id: AccountId,
        receiver_id: AccountId,
        token_id: TokenId,
        approved_account_ids: Option<HashMap<AccountId, u64>>,
    ) -> bool {
        let must_revert = match env::promise_result(0) {
            PromiseResult::NotReady => env::abort(),
            PromiseResult::Successful(value) => {
                if let Ok(yes_or_no) = near_sdk::serde_json::from_slice::<bool>(&value) {
                    yes_or_no
                } else {
                    true
                }
            }
            PromiseResult::Failed => true,
        };
        if !must_revert {
            return true;
        }

        if let Some(current_owner) = self.nfts.owner_by_id.get(&token_id) {
            if current_owner != receiver_id {
                return true;
            }
        } else {
            if let Some(approved_account_ids) = approved_account_ids {
                refund_approved_account_ids(previous_owner_id, &approved_account_ids);
            }
            return true;
        };

        self.nfts
            .internal_transfer_unguarded(&token_id, &receiver_id, &previous_owner_id);

        if let Some(by_id) = &mut self.nfts.approvals_by_id {
            if let Some(receiver_approvals) = by_id.get(&token_id) {
                refund_approved_account_ids(receiver_id.clone(), &receiver_approvals);
            }
            if let Some(previous_owner_approvals) = approved_account_ids {
                by_id.insert(&token_id, &previous_owner_approvals);
            }
        }
        NftTransfer {
            old_owner_id: &receiver_id,
            new_owner_id: &previous_owner_id,
            token_ids: &[&token_id],
            authorized_id: None,
            memo: None,
        }
        .emit();
        false
    }
}
