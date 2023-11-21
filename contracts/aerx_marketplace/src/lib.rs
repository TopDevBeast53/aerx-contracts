// //Aerx marketplace contract where you can buy and sell your Aerx nfts
// use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
// use near_contract_standards::non_fungible_token::TokenId;
// use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
// use near_sdk::collections::UnorderedMap;
// use near_sdk::serde::{Deserialize, Serialize};
// use near_sdk::{
//     env, ext_contract, near_bindgen, serde_json, AccountId, Balance, CryptoHash, Gas,
//     PanicOnDefault, PromiseResult, Timestamp,
// };
// use near_sdk::{log, require};
// use std::collections::HashMap;
// mod aerx_struct;
// use aerx_struct::AexPost;

// #[ext_contract(ext_profile)]
// trait ProfileCrossContract {
//     fn transfer_ownership(
//         &mut self,
//         current_owner: AccountId,
//         new_owner: AccountId,
//         post_id: u128,
//     ) -> bool;
// }

// #[ext_contract(ext_self)]
// trait AfterProfileContraCall {
//     fn verify_transfer_ownership_for_buy_post(&mut self, id: String) -> bool;
// }

// trait AfterProfileContraCall {
//     fn verify_transfer_ownership_for_buy_post(&mut self, id: String) -> bool;
// }

// #[near_bindgen]
// #[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
// pub struct AerxMarket {
//     owner_id: AccountId,
//     available_in_market: Vec<NftForSale>,
//     aerx_contract_id: AccountId,
//     token_ids_per_contract: UnorderedMap<AccountId, Vec<TokenId>>,
//     transactions: Vec<Transaction>,
// }

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug, Clone)]
// #[serde(crate = "near_sdk::serde")]
// pub struct NftForSale {
//     id: String,
//     owner_id: AccountId,
//     contract_id: AccountId,
//     price: Balance,
//     charges_received_on_aerx_before: Balance,
//     co_earner_on_aerx: u64,
//     offers: Option<Vec<Offer>>,
//     date_added: Timestamp,
//     highest_offer_price_by_id: HashMap<u32, Balance>,
//     details: TokenMetadata,
// }

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug, Clone)]
// #[serde(crate = "near_sdk::serde")]
// pub struct Offer {
//     id: u32,
//     owner_id: AccountId,
//     nftforsale_id: String,
//     bid_date: Timestamp,
//     status: OfferStatus,
// }

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug, Clone, Copy)]
// #[serde(crate = "near_sdk::serde")]
// pub enum OfferStatus {
//     Pending,
//     Approved,
//     Successful,
//     Declined,
// }

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug, Clone)]
// #[serde(crate = "near_sdk::serde")]
// pub struct Transaction {
//     receipt: CryptoHash,
//     seller: AccountId,
//     buyer: AccountId,
//     nft_id: TokenId,
// }

// #[near_bindgen]
// impl AerxMarket {
//     #[init]
//     pub fn new(owner_id: AccountId, aerx_contract_id: AccountId) -> Self {
//         assert!(
//             !env::state_exists(),
//             "Contract has already been initialized"
//         );
//         Self {
//             owner_id,
//             available_in_market: Vec::new(),
//             aerx_contract_id,
//             token_ids_per_contract: UnorderedMap::new(b"t"),
//             transactions: Vec::new(),
//         }
//     }

//     //Todo: charge storage
//     //list received nft for sale
//     pub fn list_for_sale(&mut self, post: AexPost, price: Balance) -> bool {
//         //Verify Aerx is the caller
//         require!(
//             env::predecessor_account_id() == self.aerx_contract_id,
//             "Only profile contract can help you list your post for sale"
//         );
//         let id = format!("AERX POST NFT-{}", post.post_id);
//         let new_nft_for_sale = NftForSale {
//             id,
//             owner_id: post.owner_id,
//             contract_id: self.aerx_contract_id.clone(),
//             price,
//             offers: None,
//             date_added: env::block_timestamp(),
//             highest_offer_price_by_id: HashMap::new(),
//             charges_received_on_aerx_before: post.total_charges,
//             co_earner_on_aerx: post.co_earners.len() as u64,
//             details: post.metadata.unwrap(),
//         };
//         self.available_in_market.push(new_nft_for_sale);
//         log!("post listed succesfully");
//         true
//     }
//     //get all available markets
//     pub fn available_in_market(&self) -> Vec<NftForSale> {
//         self.available_in_market.clone()
//     }
//     //buy a selected token for receiver
//     #[payable]
//     pub fn buy_post(&mut self, id: String, post_id: u128) -> bool {
//         //Verify Aerx is the caller
//         require!(
//             env::predecessor_account_id() == self.aerx_contract_id,
//             "Only profile contract can help you buy post(s)"
//         );
//         let post_to_buy = self
//             .available_in_market
//             .iter()
//             .find(|post| post.id == id)
//             .unwrap_or_else(|| {
//                 env::panic_str("Post with this id does not exist or available in the market")
//             });
//         require!(
//             env::attached_deposit() >= post_to_buy.price,
//             "Your attached deposit must be higher than or equal to the post price"
//         );
//         let current_owner = post_to_buy.owner_id.clone();
//         let new_owner = env::signer_account_id();
//         ext_profile::transfer_ownership(
//             current_owner,
//             new_owner,
//             post_id,
//             self.aerx_contract_id.clone(),
//             0,
//             Gas(30000000000000),
//         )
//         .then(ext_self::verify_transfer_ownership_for_buy_post(
//             id,
//             env::current_account_id(),
//             0,
//             Gas(30000000000000),
//         ));
//         true
//     }
// }

// #[near_bindgen]
// impl AfterProfileContraCall for AerxMarket {
//     #[private]
//     fn verify_transfer_ownership_for_buy_post(&mut self, id: String) -> bool {
//         require!(
//             env::promise_results_count() == 1,
//             "Expected one result from promise"
//         );
//         match env::promise_result(0) {
//             PromiseResult::NotReady => unreachable!(),
//             PromiseResult::Failed => {
//                 env::panic_str("Cross contract call to Profile contract from buy_post failed")
//             }
//             PromiseResult::Successful(_result) => {
//                 let result: bool = serde_json::from_slice(&_result)
//                     .expect("Cross contract call didn't return true or false");
//                 if result {
//                     let (idx, _post) = self
//                         .available_in_market
//                         .iter()
//                         .enumerate()
//                         .find(|(_, post)| post.id == id)
//                         .unwrap_or_else(|| env::panic_str("Post not available for sale anymore"));
//                     //Todo: transfer money back to caller if post not available for sale anymore
//                     let removed_post = self.available_in_market.remove(idx);
//                     log!(
//                         "@{} just bought post with id: {} from @{}",
//                         env::signer_account_id(),
//                         id,
//                         removed_post.owner_id
//                     );
//                     true
//                 } else {
//                     env::panic_str(
//                         "Something went wrong, transfer_ownership on profile contract didn't return true",
//                     );
//                 }
//             }
//         }
//     }
// }
