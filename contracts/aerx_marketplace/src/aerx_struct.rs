use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, Balance};

#[derive(Serialize, Deserialize, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub struct AexPost {
    pub post_id: TokenId,
    pub owner_id: AccountId,
    pub metadata: Option<TokenMetadata>,
    pub total_charges: Balance,
    pub origin_post_id: Option<u64>,
    pub co_earners: Vec<AccountId>,
}
