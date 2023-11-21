// AeSwap contract that will swap the transferred tokens
use near_contract_standards::fungible_token::receiver::FungibleTokenReceiver;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, UnorderedSet};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    assert_one_yocto, env, ext_contract, log, near_bindgen, require, serde_json, AccountId,
    Balance, Gas, PanicOnDefault, Promise, PromiseOrValue, PromiseResult,
};
use std::collections::HashMap;

const ONE_U128_AS_F64 : f64 = 1000000000000000000000000_f64;
const CROSS_CONTRACT_GAS: Gas = Gas(45000000000000);
const FUNCTION_WITH_CALLBACKS_TOTAL_GAS: Gas = Gas(150000000000000);
const CALLBACK_GAS: Gas = Gas(45000000000000);

#[ext_contract(ext_aex_token)]
pub trait AexCrossContract {
    fn send_aex(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: U128,
        memo: Option<String>,
    ) -> bool;
    fn mint_aex_for_swap(
        &mut self,
        receiver_id: AccountId,
        amount: U128,
        memo: Option<String>,
    ) -> Balance;
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>);
}

#[ext_contract(ext_whitelisted_token)]
pub trait WhitelistedContractCall {
    fn ft_balance_of(&self, account_id: AccountId) -> U128;
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>);
}

#[ext_contract(ext_self)]
trait AfterAexContractCall {
    fn verify_send_aex_call_from_swap_aex(
        &mut self,
        pool_id: u32,
        token_from: AccountId,
        token_to: AccountId,
        amount: U128,
        return_amount_u128: u128,
        updated_pool: Pool,
    ) -> Balance;

    fn verify_mint_aex_call_from_swap_aex(
        &mut self,
        pool_id: u32,
        token_from: AccountId,
        token_to: AccountId,
        amount: U128,
        return_amount_u128: u128,
        updated_pool: Pool,
    ) -> Balance;

    fn verify_ft_transfer(
        &mut self,
        pool_id: u32,
        token_from: Option<AccountId>,
        token_to: Option<AccountId>,
        amount: U128,
        return_amount_u128: u128,
        updated_pool: Option<Pool>,
        method: String,
    ) -> Balance;
}
trait AfterAexContractCall {
    fn verify_send_aex_call_from_swap_aex(
        &mut self,
        pool_id: u32,
        token_from: AccountId,
        token_to: AccountId,
        amount: U128,
        return_amount_u128: u128,
        updated_pool: Pool,
    ) -> Balance;

    fn verify_mint_aex_call_from_swap_aex(
        &mut self,
        pool_id: u32,
        token_from: AccountId,
        token_to: AccountId,
        amount: U128,
        return_amount_u128: u128,
        updated_pool: Pool,
    ) -> Balance;

    fn verify_ft_transfer(
        &mut self,
        pool_id: u32,
        token_from: Option<AccountId>,
        token_to: Option<AccountId>,
        amount: U128,
        return_amount_u128: u128,
        updated_pool: Option<Pool>,
        method: String,
    ) -> Balance;
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct AeSwap {
    owner_id: AccountId,
    pools: UnorderedSet<Pool>,
    token_contract_id: AccountId,
    whitelisted_tokens: UnorderedSet<AccountId>,
    storage_fee_owed_by_account: UnorderedMap<AccountId, Balance>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Pool {
    id: u32,
    owner_id: AccountId,
    liquidity_per_token: HashMap<AccountId, Balance>,
    volumes: HashMap<AccountId, Balance>,
    fees: PoolFee,
    shares: PoolShare,
    lenders: Vec<AccountId>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct PoolFee {
    total_fee_percentage: f64,
    owner_fee_percentage: f64,
    lender_fee_percentage: f64,
    aeswap_fee_percentage: f64,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct PoolShare {
    total_shares: Balance,
    share_per_contributor: HashMap<AccountId, Vec<Balance>>,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct OnTransferMessage {
    action: String,
    pool_id: String,
    token_to: String,
    min_expected: Option<U128>,
}
#[near_bindgen]
impl AeSwap {
    #[init]
    pub fn new(owner_id: AccountId, token_contract_id: AccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            token_contract_id,
            owner_id,
            pools: UnorderedSet::new(b"p"),
            whitelisted_tokens: UnorderedSet::new(b"w"),
            storage_fee_owed_by_account: UnorderedMap::new(b"s"),
        }
    }

    //Todo: create share for creator
    #[payable]
    pub fn create_pool(
        &mut self,
        first_token_contract_id: AccountId,
        sencond_token_contract_id: AccountId,
        total_fee_percentage: f64,
    ) -> Pool {
        let initial_storage_usage = env::storage_usage();
        require!(
            first_token_contract_id != sencond_token_contract_id,
            "The 2 tokens cannot be the same"
        );
        if self.pools.is_empty() {
            require!(
                env::predecessor_account_id() == self.owner_id,
                "You are not authorized to create the first pool"
            );
        }
        require!(total_fee_percentage > 0.0 && total_fee_percentage <= 0.5, "Fee cannot lesser than zero(0) or higher than 0.5");
        if env::predecessor_account_id() == self.owner_id {
            let prev_id = self.pools.len() as u32;
            let mut liquidity_per_token: HashMap<AccountId, Balance> = HashMap::new();
            liquidity_per_token.insert(first_token_contract_id.clone(), 0);
            liquidity_per_token.insert(sencond_token_contract_id.clone(), 0);
            let mut volumes: HashMap<AccountId, Balance> = HashMap::new();
            volumes.insert(first_token_contract_id, 0);
            volumes.insert(sencond_token_contract_id, 0);
            let mut share_per_contributor: HashMap<AccountId, Vec<Balance>> = HashMap::new();
            share_per_contributor.insert(env::predecessor_account_id(), vec![0, 0]);
            let calculated_fee = AeSwap::calculate_pool_fees(total_fee_percentage);
            let new_pool = Pool {
                id: prev_id + 1,
                owner_id: env::predecessor_account_id(),
                liquidity_per_token,
                volumes,
                fees: PoolFee {
                    total_fee_percentage: calculated_fee.total_fee_percentage,
                    owner_fee_percentage: calculated_fee.owner_fee_percentage,
                    lender_fee_percentage: calculated_fee.lender_fee_percentage,
                    aeswap_fee_percentage: calculated_fee.aeswap_fee_percentage,
                },
                shares: PoolShare {
                    total_shares: 0,
                    share_per_contributor,
                },
                lenders: Vec::new(),
            };
            self.pools.insert(&new_pool);
            let storage_used = env::storage_usage() - initial_storage_usage;
            let storage_cost = Balance::from(storage_used) * env::storage_byte_cost();
            require!(
                env::attached_deposit() >= storage_cost,
                format!(
                    "attached deposit is lesser than the required storage balance of: {}",
                    storage_cost
                )
            );
            let refund = env::attached_deposit() - storage_cost;
            if refund > 0 {
                log!("will refund overpayment of {}", refund);
                Promise::new(env::predecessor_account_id()).transfer(refund);
            }
            new_pool
        } else {
            require!(
                first_token_contract_id != self.token_contract_id &&
                sencond_token_contract_id != self.token_contract_id,
                "Only Contract owner can create pool for AEX,you can only add lend us token paired in any pool involving AEX. Thanks"
            );
            require!(
                first_token_contract_id != sencond_token_contract_id,
                "The 2 tokens cannot be the same"
            );
            let prev_id = self.pools.len() as u32;
            let mut liquidity_per_token: HashMap<AccountId, Balance> = HashMap::new();
            liquidity_per_token.insert(first_token_contract_id.clone(), 0);
            liquidity_per_token.insert(sencond_token_contract_id.clone(), 0);
            let mut volumes: HashMap<AccountId, Balance> = HashMap::new();
            volumes.insert(first_token_contract_id, 0);
            volumes.insert(sencond_token_contract_id, 0);
            let mut share_per_contributor: HashMap<AccountId, Vec<Balance>> = HashMap::new();
            share_per_contributor.insert(env::predecessor_account_id(), vec![0, 0]);
            let calculated_fee = AeSwap::calculate_pool_fees(total_fee_percentage);
            let new_pool = Pool {
                id: prev_id + 1,
                owner_id: env::predecessor_account_id(),
                liquidity_per_token,
                volumes,
                fees: PoolFee {
                    total_fee_percentage: calculated_fee.total_fee_percentage,
                    owner_fee_percentage: calculated_fee.owner_fee_percentage,
                    lender_fee_percentage: calculated_fee.lender_fee_percentage,
                    aeswap_fee_percentage: calculated_fee.aeswap_fee_percentage,
                },
                shares: PoolShare {
                    total_shares: 0,
                    share_per_contributor,
                },
                lenders: Vec::new(),
            };
            self.pools.insert(&new_pool);
            let storage_used = env::storage_usage() - initial_storage_usage;
            let storage_cost = Balance::from(storage_used) * env::storage_byte_cost();
            require!(
                env::attached_deposit() >= storage_cost,
                format!(
                    "attached deposit is lesser than the required storage balance of: {}",
                    storage_cost
                )
            );
            let refund = env::attached_deposit() - storage_cost;
            if refund > 0 {
                log!("will refund overpayment of {}", refund);
                Promise::new(env::predecessor_account_id()).transfer(refund);
            }
            new_pool
        }
    }

    pub fn calculate_pool_fees(total_fee_percentage: f64) -> PoolFee {
        let owner_fee_percentage = (3.0/100.0) * total_fee_percentage;
        let lender_fee_percentage = (85.0/100.0) * total_fee_percentage;
        let aeswap_fee_percentage = (12.0/100.0) * total_fee_percentage;
        PoolFee {
            total_fee_percentage,
            owner_fee_percentage,
            lender_fee_percentage,
            aeswap_fee_percentage,
        }
    }


    //get all pools
    pub fn all_pools(&self) -> Vec<Pool> {
        self.pools.to_vec()
    }
    //lend us token so users can swap and you earn reward
    #[payable]
    pub fn lend(
        &mut self,
        pool_id: u32,
        amount: Option<U128>,
        equivalent_aex: Option<U128>,
    ) -> Pool {
        let storage_cost = self.get_storage_fee_for_lend(pool_id, env::signer_account_id());
        let token_id  = self.get_pool(pool_id)
        .liquidity_per_token
        .keys()
        .find(|token| **token != self.token_contract_id.clone())
        .unwrap_or_else(|| env::panic_str("Error while finding paired token with AEX in this pool, Verify pool contains a paired token with AEX that is different from AEX and try again"))
        .clone();
        if token_id.to_string() == "nearnativetoken.near" {
            require!(env::attached_deposit() > storage_cost, format!("attached deposit is lesser than or equal to required storage fee, Note: attached deposit must be greater than {} to lend us near for the first time", storage_cost));
            require!(amount.is_none(), "You don't need to input amount when you want to lend us near, we calculate the amount for you thanks");
        } else {
            require!(
                env::attached_deposit() == 0,
                "You don't need to attach deposit when lending this token"
            );
        }
        //get amount, slippage and run verifications
        let _amount: Balance = amount
            .unwrap_or_else(|| U128(env::attached_deposit() - storage_cost))
            .into();
        require!(_amount > 0, "Error, amount must be greater than Zero(0)");
        if amount.is_some() {
            require!(
                self.whitelisted_tokens
                    .contains(&env::predecessor_account_id()),
                format!(
                    "You can only lend us this token through ft_transfer_call on {} contract",
                    env::predecessor_account_id()
                )
            );
            let additional_storage_fee =
                self.get_additional_storage_fee_for_lend(env::signer_account_id());
            let storage_owe = storage_cost + additional_storage_fee;
            let token_price = self.get_price_from_pool(pool_id, token_id.clone());
            let aex_price = self
                .get_price_from_pool(pool_id, AccountId::new_unchecked("nearnativetoken.near".to_string()));
            let near_price =
                self.get_price_from_pool(1, AccountId::new_unchecked("nearnativetoken.near".to_string()));
            let storage_owe_to_aex = storage_owe * near_price;
            let amount_to_aex = _amount * token_price;
            let minimum_required_token = storage_owe_to_aex * aex_price;
            require!(
                amount_to_aex > storage_owe_to_aex,
                format!("amount to lend must be greater than required storage to aex, amount must be greater than {}", minimum_required_token)
            );
            self.storage_fee_owed_by_account
                .insert(&env::signer_account_id(), &storage_owe);
        }
        //update liquidity and volume
        let equivalent_aex_u128;
        let aex_contract = self.token_contract_id.clone();
        let prev_token_to_liquidity = self.get_liquidity(pool_id, token_id.clone());
        let prev_token_from_liquidity = self.get_liquidity(pool_id, aex_contract.clone());
        let prev_token_to_volume = self.get_volume(pool_id, token_id.clone());
        let prev_token_from_volume = self.get_volume(pool_id, aex_contract.clone());
        if prev_token_from_liquidity > 0 && prev_token_to_liquidity > 0 {
            let token_price = self.get_price_from_pool(pool_id, token_id.clone());
            let equivalent_aex_f64 = (token_price as f64 / ONE_U128_AS_F64)
                * (_amount as f64 / ONE_U128_AS_F64);
            equivalent_aex_u128 = (equivalent_aex_f64 * ONE_U128_AS_F64) as u128;
        } else {
            require!(env::predecessor_account_id() == self.owner_id || env::predecessor_account_id() == env::current_account_id(), "Selected pool has no liquidity yet, wait till contract owner adds liquidity before you lend to this pool");
            equivalent_aex_u128 = equivalent_aex.unwrap().0;
        };
        let pool = &mut self.pools.iter().find(|pool| pool.id == pool_id).unwrap();
        self.pools.remove(pool);
        pool.liquidity_per_token.insert(
            aex_contract.clone(),
            prev_token_from_liquidity + equivalent_aex_u128,
        );
        pool.volumes
            .insert(aex_contract, prev_token_from_volume + equivalent_aex_u128);
        //check for storage here so caller pay at the end
        pool.liquidity_per_token
            .insert(token_id.clone(), prev_token_to_liquidity + _amount);
        pool.volumes
            .insert(token_id, prev_token_to_volume + _amount);
        if pool.shares.total_shares > 0 {
            //get custom share according to amount lent and update lender's share
            let share_ratio_to_liquidity = (pool.shares.total_shares as f64 / ONE_U128_AS_F64)
                / (prev_token_to_liquidity as f64 / ONE_U128_AS_F64);
            let share = (_amount as f64 / ONE_U128_AS_F64) * share_ratio_to_liquidity;
            let share_u128 = (share * ONE_U128_AS_F64) as u128;
            // register lender(if not registered) and update lender's share
            if pool
                .shares
                .share_per_contributor
                .get(&env::predecessor_account_id())
                .is_some()
            {
                let prev_share = pool
                    .shares
                    .share_per_contributor
                    .get(&env::signer_account_id())
                    .unwrap()[0];
                let new_share = prev_share + share_u128;
                pool.shares
                    .share_per_contributor
                    .insert(env::signer_account_id(), vec![new_share, 0]);
                pool.shares.total_shares += share_u128;
            } else {
                pool.shares
                    .share_per_contributor
                    .insert(env::signer_account_id(), vec![share_u128, 0]);
                pool.shares.total_shares += share_u128;
            }
        } else {
            //get default share irrespective of amount lent and update lender's share
            pool.shares.share_per_contributor.insert(
                env::signer_account_id(),
                vec![1000000000000000000000000, 0],
            );
            pool.shares.total_shares += 1000000000000000000000000;
        }
        if !pool.lenders.contains(&env::signer_account_id()) {
            pool.lenders.push(env::signer_account_id());
        }
        self.pools.insert(pool);
        self.pools.iter().find(|pool| pool.id == pool_id).unwrap()
    }

    pub fn get_storage_fee_for_lend(&mut self, pool_id: u32, account_id: AccountId) -> Balance {
        let initial_storage_usage = env::storage_usage();
        log!("initial storage {}", initial_storage_usage);
        let pool_untouched = self.get_pool(pool_id);
        let pool = &mut self
            .pools
            .iter()
            .find(|pool| pool.id == pool_id)
            .unwrap_or_else(|| env::panic_str("Pool with this id does not exist"));
        self.pools.remove(&pool_untouched);
        if pool.shares.share_per_contributor.get(&account_id).is_none() {
            pool.shares
                .share_per_contributor
                .insert(account_id.clone(), vec![u128::MAX, u128::MAX]);
            pool.shares.total_shares += u128::MAX - pool.shares.total_shares;
        }
        if !pool.lenders.contains(&account_id) {
            pool.lenders.push(account_id);
        }
        self.pools.insert(pool);
        let final_storage_usage = env::storage_usage();
        let cost =
            Balance::from(final_storage_usage - initial_storage_usage) * env::storage_byte_cost();
        self.pools.remove(pool);
        self.pools.insert(&pool_untouched);
        cost
    }

    pub fn get_additional_storage_fee_for_lend(&mut self, account_id: AccountId) -> Balance {
        let initial_storage_usage = env::storage_usage();
        if self.storage_fee_owed_by_account.get(&account_id).is_none() {
            self.storage_fee_owed_by_account
                .insert(&account_id, &u128::MAX);
            let final_storage_usage = env::storage_usage();
            let cost = Balance::from(final_storage_usage - initial_storage_usage)
                * env::storage_byte_cost();
            self.storage_fee_owed_by_account.remove(&account_id);
            cost
        } else {
            0
        }
    }

    pub fn get_share_for_lend(&self, pool_id: u32, amount: U128) -> u128 {
        let pool = self.get_pool(pool_id);
        let token_id  = pool
        .liquidity_per_token
        .keys()
        .find(|token| **token != self.token_contract_id.clone())
        .unwrap_or_else(|| env::panic_str("Error while finding paired token with AEX in this pool, Verify pool contains a paired token with AEX that is different from AEX and try again"))
        .clone();
        let token_liquidity = self.get_liquidity(pool_id, token_id);
        let share_ratio_to_liquidity = (pool.shares.total_shares as f64 / ONE_U128_AS_F64)
        / (token_liquidity as f64 / ONE_U128_AS_F64);
        let share = (amount.0 as f64 / ONE_U128_AS_F64) * share_ratio_to_liquidity;
        (share * ONE_U128_AS_F64) as u128
    }

    fn get_liquidity(&self, pool_id: u32, token_id: AccountId) -> Balance {
        let pool = self
            .pools
            .iter()
            .find(|pool| pool.id == pool_id)
            .unwrap_or_else(|| env::panic_str("Pool with this id does not exist"));
        *pool
            .liquidity_per_token
            .get(&token_id)
            .unwrap_or_else(|| env::panic_str("Selected Token not found in this pool"))
    }
    //gets volumes
    fn get_volume(&self, pool_id: u32, token_id: AccountId) -> Balance {
        let pool = self
            .pools
            .iter()
            .find(|pool| pool.id == pool_id)
            .unwrap_or_else(|| env::panic_str("Pool with this id does not exist"));
        *pool
            .volumes
            .get(&token_id)
            .unwrap_or_else(|| env::panic_str("Selected Token not found in this pool"))
    }

    //return the share of the selected contributor(creator, lender or aexswap) of a selected pool.
    //returns 0 if contributor doesn't exist
    pub fn get_user_share(&self, account_id: AccountId, pool_id: u32) -> u128 {
        let pool = self
            .pools
            .iter()
            .find(|pool| pool.id == pool_id)
            .unwrap_or_else(|| env::panic_str("Pool with this id does not exist"));
        pool.shares
            .share_per_contributor
            .get(&account_id)
            .unwrap_or(&vec![0, 0])[0]
    }
    //returns all lenders
    fn get_pool_owner(&self, pool_id: u32) -> AccountId {
        self.pools
            .iter()
            .find(|pool| pool.id == pool_id)
            .unwrap_or_else(|| env::panic_str("Pool with this id does not exist"))
            .owner_id
    }

    pub fn get_pool(&self, pool_id: u32) -> Pool {
        self.pools
            .iter()
            .find(|pool| pool.id == pool_id)
            .unwrap_or_else(|| env::panic_str("Pool with this id does not exist"))
    }
    pub fn get_price_from_pool(&self, pool_id: u32, token_id: AccountId) -> Balance {
        let pool = self.get_pool(pool_id);
        let paired_token = pool
            .liquidity_per_token
            .keys()
            .find(|token| **token != token_id)
            .unwrap_or_else(|| env::panic_str("Error this pool contains the same token"));
        let paired_token_liquidity = pool.liquidity_per_token.get(paired_token).unwrap();
        let token_liquidity = pool.liquidity_per_token.get(&token_id).unwrap_or(&0);
        let price_in_f64 = (*paired_token_liquidity as f64 / ONE_U128_AS_F64) / (*token_liquidity as f64 / ONE_U128_AS_F64);
        (price_in_f64 * ONE_U128_AS_F64) as u128
    }
    /// Swaps aex to token_to(if token_to is not aex) or swap paired paired token with aex to aex(if token_to is aex)
    /// If token_from is Near(native token) attached deposit is used as amount
    /// Note: using near CLI for this function is risky(incase you picked the wrong pool_id) use aeswap website Thanks.
    #[payable]
    pub fn swap_aex(
        &mut self,
        pool_id: u32,
        token_to: AccountId,
        amount: U128,
        min_expected: Option<U128>,
    ) -> PromiseOrValue<u128> {
        //get pool_untouched
        let pool_untouched = self.get_pool(pool_id);
        //get pool to swap from
        let pool_to_swap_from = &mut self
            .pools
            .iter()
            .find(|pool| pool.id == pool_id)
            .unwrap_or_else(|| env::panic_str("Pool with this id does not exist"));
        let mut token_from = self.token_contract_id.clone();
        let mut amount_to_swap: u128 = amount.0;
        //Get token_from and at the same time verify tokens not the same
        if token_to == self.token_contract_id {
            token_from = pool_to_swap_from
                .liquidity_per_token
                .keys()
                .find(|token| **token != self.token_contract_id.clone())
                .unwrap_or_else(|| env::panic_str("Error while finding paired token with AEX in this pool, Verify pool contains a paired token with AEX that is different from AEX and try again"))
                .clone();
            if token_from.to_string() == "nearnativetoken.near" {
                amount_to_swap = env::attached_deposit();
            }
        }
        if token_to == self.token_contract_id.clone() {
            if token_from.to_string() == "nearnativetoken.near" {
                require!(
                    env::attached_deposit() >= 1,
                    "Requires attached deposit of at least 1 yoctoNEAR"
                );
            } else {
                require!(self.whitelisted_tokens.contains(&env::predecessor_account_id()), format!("You can only swap this token to AEX by calling the ft_transfer_call on {} contract", token_from));
            }
        }
        require!(
            pool_to_swap_from
                .liquidity_per_token
                .contains_key(&token_from)
                && pool_to_swap_from
                    .liquidity_per_token
                    .contains_key(&token_to),
            "Selected Pool does not contain one or both of the token(s) selected"
        );
        let prev_token_to_volume = self.get_volume(pool_id, token_to.clone());
        let prev_token_from_volume = self.get_volume(pool_id, token_from.clone());
        let prev_token_to_liquidity = self.get_liquidity(pool_id, token_to.clone());
        let prev_token_from_liquidity = self.get_liquidity(pool_id, token_from.clone());
        let pool_owner = self.get_pool_owner(pool_id);
        //remove charges and get the return amount_to_swap
        let total_fee_percentage = pool_to_swap_from.fees.total_fee_percentage;
        let fee_charged = ((total_fee_percentage / 100.0) * ONE_U128_AS_F64) as u128
            * (amount_to_swap / 1000000000000000000000000);
        let amount_after_fee = amount_to_swap - fee_charged;
        let constant =
            (prev_token_from_liquidity as f64 / ONE_U128_AS_F64) * (prev_token_to_liquidity as f64 / ONE_U128_AS_F64);
        let new_token_liquidity =
            constant  / ((amount_after_fee as f64 / ONE_U128_AS_F64) + (prev_token_from_liquidity as f64 / ONE_U128_AS_F64));
        let new_token_liquidity_u128 =
            (new_token_liquidity * ONE_U128_AS_F64) as u128;
        require!(
            prev_token_to_liquidity > new_token_liquidity_u128,
            "Insufficient liquidity"
        );
        let return_amount_u128 = prev_token_to_liquidity - new_token_liquidity_u128;
        if min_expected.is_some() {
            require!(
                return_amount_u128 >= min_expected.unwrap().0,
                "Error: Returned amount_to_swap lesser than slippage"
            );
        }
        //update liquidity
        pool_to_swap_from
            .liquidity_per_token
            .insert(token_to.clone(), new_token_liquidity_u128);
        pool_to_swap_from.liquidity_per_token.insert(
            token_from.clone(),
            prev_token_from_liquidity + amount_after_fee as u128,
        );
        //update volume
        pool_to_swap_from
            .volumes
            .insert(token_to.clone(), prev_token_to_volume + return_amount_u128);
        pool_to_swap_from.volumes.insert(
            token_from.clone(),
            prev_token_from_volume + amount_to_swap,
        );
        if token_from != self.token_contract_id {
            //share income
            let prev_aeswap_share_and_income = pool_to_swap_from
                .shares
                .share_per_contributor
                .iter()
                .find(|contributors| *contributors.0 == env::current_account_id())
                .unwrap_or((&env::current_account_id(), &vec![0, 0]))
                .1
                .clone();
            let aeswap_income =
                (pool_to_swap_from.fees.total_fee_percentage / 100.0) * amount_to_swap as f64 / ONE_U128_AS_F64;
            let aeswap_income_u128 = (aeswap_income * ONE_U128_AS_F64) as u128;
            log!("aeswap income: {}", aeswap_income_u128);
            //update aeswap share
            pool_to_swap_from.shares.share_per_contributor.insert(
                env::current_account_id(),
                vec![
                    prev_aeswap_share_and_income[0],
                    prev_aeswap_share_and_income[1] + aeswap_income_u128,
                ],
            );
            //deposit returned amount
            if token_to == self.token_contract_id.clone() {
                //mint aex and deposit to user account
                let result = ext_aex_token::mint_aex_for_swap(
                    env::predecessor_account_id(),
                    U128(return_amount_u128),
                    Some("Swap on aeswap".to_string()),
                    self.token_contract_id.clone(),
                    0,
                    CROSS_CONTRACT_GAS,
             
                )
                .then(ext_self::verify_mint_aex_call_from_swap_aex(
                    pool_id,
                    token_from,
                    token_to,
                    U128(amount_to_swap),
                    return_amount_u128,
                    pool_to_swap_from.clone(),
                    env::current_account_id(),
                    0,
                    CALLBACK_GAS,
                ));
                PromiseOrValue::Promise(result)
            } else {
                env::panic_str("Error token to or token from must be AEX i.e AEX must be involved");
            }
        } else {
            //share income
            let total_ld_income =
                (pool_to_swap_from.fees.lender_fee_percentage / 100.0) * (amount_to_swap as f64 / ONE_U128_AS_F64);
            for lender in pool_to_swap_from.lenders.iter() {
                let prev_ld_share_and_income = pool_to_swap_from
                    .shares
                    .share_per_contributor
                    .iter_mut()
                    .find(|contributors| contributors.0 == lender)
                    .unwrap();

                let ld_income = ((prev_ld_share_and_income.1[0] as f64 / ONE_U128_AS_F64)
                    / (pool_to_swap_from.shares.total_shares as f64 / ONE_U128_AS_F64))
                    * total_ld_income;
                let ld_income_u128 = (ld_income * ONE_U128_AS_F64) as u128;
                prev_ld_share_and_income.1[1] += ld_income_u128;
            }
            let prev_owner_share_and_income = pool_to_swap_from
                .shares
                .share_per_contributor
                .iter()
                .find(|contributors| *contributors.0 == pool_owner.clone())
                .unwrap()
                .1
                .clone();
            let owner_income =
                (pool_to_swap_from.fees.owner_fee_percentage / 100.0) * amount_to_swap as f64 / ONE_U128_AS_F64;
            let owner_income_u128 =  (owner_income * ONE_U128_AS_F64) as u128;
            pool_to_swap_from.shares.share_per_contributor.insert(
                pool_owner,
                vec![
                    prev_owner_share_and_income[0],
                    prev_owner_share_and_income[1] + owner_income_u128,
                ],
            );
            let prev_aeswap_share_and_income = pool_to_swap_from
                .shares
                .share_per_contributor
                .iter()
                .find(|contributors| *contributors.0 == env::current_account_id())
                .unwrap_or((&env::current_account_id(), &vec![0, 0]))
                .1
                .clone();
            let aeswap_income =
                (pool_to_swap_from.fees.aeswap_fee_percentage / 100.0) * amount_to_swap as f64 / ONE_U128_AS_F64;
            let aeswap_income_u128 = (aeswap_income * ONE_U128_AS_F64) as u128;
            //update aeswap share
            pool_to_swap_from.shares.share_per_contributor.insert(
                env::current_account_id(),
                vec![
                    prev_aeswap_share_and_income[0],
                    prev_aeswap_share_and_income[1] + aeswap_income_u128,
                ],
            );
            //remove aex from users balance if call is not from aex
            if env::predecessor_account_id() != self.token_contract_id.clone() {
                let result = ext_aex_token::send_aex(
                    env::predecessor_account_id(),
                    env::current_account_id(),
                    amount_to_swap.into(),
                    Some("Swap payment on Aeswap".to_string()),
                    self.token_contract_id.clone(),
                    0,
                    env::prepaid_gas() - FUNCTION_WITH_CALLBACKS_TOTAL_GAS,
                )
                .then(ext_self::verify_send_aex_call_from_swap_aex(
                    pool_id,
                    token_from,
                    token_to,
                    amount_to_swap.into(),
                    return_amount_u128,
                    pool_to_swap_from.clone(),
                    env::current_account_id(),
                    0,
                    CALLBACK_GAS,
                ));
                PromiseOrValue::Promise(result)
            } else if token_to.to_string() == "nearnativetoken.near" {
                //send return amount to user
                Promise::new(env::signer_account_id()).transfer(return_amount_u128);
                self.pools.remove(&pool_untouched);
                self.pools.insert(pool_to_swap_from);
                log!(
                    "@{} succesfully swapped {:?} {} for {} {} token",
                    env::signer_account_id(),
                    amount_to_swap,
                    token_from,
                    return_amount_u128,
                    token_to
                );
                //return the amount user received
                PromiseOrValue::Value(return_amount_u128)
            } else {
                //send returned amount to user's balance
                let final_result = ext_whitelisted_token::ft_transfer(
                    env::signer_account_id(),
                    U128(return_amount_u128),
                    Some("Swap payment on Aeswap".to_string()),
                    env::predecessor_account_id(),
                    1,
                    CROSS_CONTRACT_GAS,

                )
                .then(ext_self::verify_ft_transfer(
                    pool_id,
                    Some(token_from),
                    Some(token_to),
                    amount,
                    return_amount_u128,
                    Some(pool_to_swap_from.clone()),
                    "swap_aex".to_string(),
                    env::current_account_id(),
                    0,
                    CALLBACK_GAS,
                ));
                PromiseOrValue::Promise(final_result)
            }
        }
    }

    #[payable]
    pub fn whitelist_token(&mut self, token_id: AccountId) {
        let initial_storage = env::storage_usage();
        require!(
            env::predecessor_account_id() == self.owner_id
                || env::predecessor_account_id() == env::current_account_id(),
            "You are not authorized to make this call"
        );
        self.whitelisted_tokens.insert(&token_id);
        let final_storage = env::storage_usage();
        let cost = Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
        require!(
            env::attached_deposit() >= cost,
            format!(
                "attached storage lesser than required storage, attach {} and try again",
                cost
            )
        );
        let refund = env::attached_deposit() - cost;
        if refund > 0 {
            log!("will refund overpayment of {}", refund);
            Promise::new(env::predecessor_account_id()).transfer(refund);
        }
    }

    pub fn get_return_amount_in_u128(
        &self,
        pool_id: u32,
        amount_to_swap: U128,
        token_from: AccountId,
        token_to: AccountId,
    ) -> Balance {
        let pool_to_swap_from = self
            .pools
            .iter()
            .find(|pool| pool.id == pool_id)
            .unwrap_or_else(|| env::panic_str("Pool with this id does not exist"));
        let prev_token_from_liquidity = self.get_liquidity(pool_id, token_from);
        let prev_token_to_liquidity = self.get_liquidity(pool_id, token_to);
        let total_fee_percentage = pool_to_swap_from.fees.total_fee_percentage;
        let fee_charged = ((total_fee_percentage / 100.0) * ONE_U128_AS_F64) as u128
            * (amount_to_swap.0 / 1000000000000000000000000);
        let amount_after_fee = amount_to_swap.0 - fee_charged;
        let constant =
            (prev_token_from_liquidity as f64 / ONE_U128_AS_F64) * (prev_token_to_liquidity as f64 / ONE_U128_AS_F64);
        let new_token_to_liquidity =
            constant as f64 / ((amount_after_fee as f64 / ONE_U128_AS_F64) + (prev_token_from_liquidity as f64 / ONE_U128_AS_F64));
        let new_token_to_liquidity_u128 =
            (new_token_to_liquidity * ONE_U128_AS_F64) as u128;
        prev_token_to_liquidity - new_token_to_liquidity_u128
    }

    #[payable]
    pub fn withdraw_profit(&mut self, pool_id: u32, amount: U128) -> PromiseOrValue<u128> {
        require!(
            env::predecessor_account_id() == env::signer_account_id(),
            "You have to be the caller and signer of this function can't use cross contract call, 
        for your security Thanks"
        );
        assert_one_yocto();
        let account_id = env::predecessor_account_id();
        let amount: Balance = amount.into();
        require!(amount > 0, "Zero(0) amount passed");
        let pool = self.get_pool(pool_id);
        require!(
            pool.shares.share_per_contributor.contains_key(&account_id),
            "You are not a contributor on this pool can't withdraw profit"
        );
        let balance = pool
            .shares
            .share_per_contributor
            .get(&account_id)
            .unwrap_or_else(|| env::panic_str("error while getting your balance try again later"))
            [1];
        let new_balance = balance
            .checked_sub(amount)
            .unwrap_or_else(|| env::panic_str("insufficient balance"));
        let result = ext_aex_token::ft_transfer(
            account_id,
            U128(amount),
            Some("Profit withdrawal on AESWAP".to_string()),
            self.token_contract_id.clone(),
            1,
            CROSS_CONTRACT_GAS,
        )
        .then(ext_self::verify_ft_transfer(
            pool_id,
            None,
            None,
            U128(amount),
            new_balance,
            None,
            "withdraw_profit".to_string(),
            env::current_account_id(),
            0,
            CALLBACK_GAS,
        ));
        PromiseOrValue::Promise(result)
    }

    #[payable]
    pub fn remove_liquidity(&mut self, pool_id: u32, amount: U128, min_expected: Option<U128>) -> u128 {
        assert_one_yocto();
        require!(env::predecessor_account_id() == env::signer_account_id(), 
        "You must be the caller and signer of this function can't use cross contract for your security, Thanks");
        let account_id = env::predecessor_account_id();
        let amount : Balance = amount.into();
        let pool = self.get_pool(pool_id);
        require!(
            pool.lenders.contains(&account_id),
            "You are not a lender on this pool, only lenders can remove liquidity"
        );
        let token = pool.liquidity_per_token.iter().find(|token_liq| *token_liq.0 != self.token_contract_id.clone()).unwrap_or_else(|| env::panic_str("Error while getting paired token with aex on this pool, try again later"));
        let token_id = token.0;
        let prev_token_liquidity = token.1;
        let prev_aex_liquidity = self.get_liquidity(pool_id, self.token_contract_id.clone());
        let share_balance = pool.shares.share_per_contributor.get(&account_id).unwrap_or_else(|| env::panic_str("You are not a contributor on this pool"))[0];
        let prev_lender_profit = pool.shares.share_per_contributor.get(&account_id).unwrap()[1];
        let share_balance_u128 = share_balance as u128;
        let pool_mut = &mut self.pools.iter().find(|pool| pool.id == pool_id).unwrap();
        let new_share = share_balance_u128.checked_sub(amount).unwrap_or_else(|| env::panic_str("Insufficient share balance"));
        let amount_out = self.get_amount_out_for_share(pool_id, U128(amount));
        let token_price = self.get_price_from_pool(pool_id, token_id.clone());
        let equivalent_aex_f64 = (token_price as f64 / ONE_U128_AS_F64)
            * (amount_out as f64 / ONE_U128_AS_F64);
        let equivalent_aex_u128 = (equivalent_aex_f64 * ONE_U128_AS_F64) as u128;
        let _min_expected = min_expected.unwrap_or(U128(0));
        if amount_out >= _min_expected.0 {
            self.pools.remove(&pool);
            let new_token_liquidity = prev_token_liquidity.checked_sub(amount_out).unwrap_or_else(|| env::panic_str("Unexpected error amount out is greater than token liquidity"));
            let new_aex_liquidity = prev_aex_liquidity.checked_sub(equivalent_aex_u128).unwrap_or_else(|| env::panic_str("Unexpected error equivalent aex out due to amount out from token is greater than aex liquidity"));
            pool_mut.liquidity_per_token.insert(token_id.clone(), new_token_liquidity);
            pool_mut.liquidity_per_token.insert(self.token_contract_id.clone(), new_aex_liquidity);
            pool_mut.shares.share_per_contributor.insert(env::predecessor_account_id(), vec![new_share, prev_lender_profit]);
            pool_mut.shares.total_shares -= amount;
            self.pools.insert(pool_mut);
            Promise::new(env::predecessor_account_id()).transfer(amount_out);
            log!("@{} succesfully removed {} {} tokens from pool id {} and got {} back", env::predecessor_account_id(), amount, token_id, pool_id, amount_out);
            amount_out
        }else{
            env::panic_str("Slippage error amount out must to be greater than min expected from slippage");
        }


    }

    pub fn get_amount_out_for_share(&self, pool_id: u32, amount: U128) -> u128 {
        let amount: Balance = amount.into();
        require!(amount > 0, "Zero(0) amount passed");
        let pool = self.get_pool(pool_id);
        let token = pool.liquidity_per_token.iter().find(|token_liq| token_liq.0 != &self.token_contract_id.clone()).unwrap_or_else(|| env::panic_str("Error while getting paired token with aex on this pool, try again later"));
        let prev_token_liquidity = token.1;
        if *prev_token_liquidity > 0 {
            let total_shares = pool.shares.total_shares;
            let amount_to_total_share_ratio = (amount as f64 / ONE_U128_AS_F64) / (total_shares as f64 / ONE_U128_AS_F64);
            let amount_out_f64 = (*prev_token_liquidity as f64 / ONE_U128_AS_F64) * amount_to_total_share_ratio;
            (amount_out_f64 * ONE_U128_AS_F64) as u128
        }else{
            amount
        }
        
        


    }
}

#[near_bindgen]
impl FungibleTokenReceiver for AeSwap {
    fn ft_on_transfer(
        &mut self,
        sender_id: AccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        require!(
            self.whitelisted_tokens
                .contains(&env::predecessor_account_id()),
            "only whitelisted token contract can call this function"
        );
        //decode message
        let message: OnTransferMessage = serde_json::from_str(&msg).unwrap();
        //log a message with aex and near as default tokens(will be made dynamic later)
        log!(
            "Received {} {} tokens from @{} with the intension to {} it for {}",
            amount.0,
            env::predecessor_account_id(),
            sender_id,
            message.action,
            message.token_to,
        );
        let default_pool_id = self
            .pools
            .iter()
            .find(|_pool| {
                _pool
                    .liquidity_per_token
                    .contains_key(&AccountId::new_unchecked(message.token_to.clone()))
                    && _pool
                        .liquidity_per_token
                        .contains_key(&env::predecessor_account_id())
            })
            .unwrap_or_else(|| {
                env::panic_str("no existing pool for these tokens combination, try again later")
            })
            .id;
        let pool_id: u32 = message.pool_id.parse().unwrap_or(default_pool_id);
        if message.action == *"swap" {
            //swap received token
            self.swap_aex(
                pool_id,
                AccountId::new_unchecked(message.token_to),
                amount,
                message.min_expected,
            );
            PromiseOrValue::Value(U128(0))
        } else if message.action == *"lend" {
            self.lend(pool_id, Some(amount), message.min_expected);
            PromiseOrValue::Value(U128(0))
        } else {
            log!("Invalid message action will return amount back to token contract");
            PromiseOrValue::Value(amount)
        }
    }
}

#[near_bindgen]
impl AfterAexContractCall for AeSwap {
    #[private]
    fn verify_send_aex_call_from_swap_aex(
        &mut self,
        pool_id: u32,
        token_from: AccountId,
        token_to: AccountId,
        amount: U128,
        return_amount_u128: u128,
        updated_pool: Pool,
    ) -> Balance {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                env::panic_str("Cross contract call to Send_aex token from swap failed")
            }
            PromiseResult::Successful(_result) => {
                let _res: u128 = serde_json::from_slice(&_result)
                    .expect("Cross contract call didn't return true or false");
                let initial_pool = self.get_pool(pool_id);
                if token_to.to_string() == "nearnativetoken.near" {
                    //send return amount to user
                    Promise::new(env::signer_account_id()).transfer(return_amount_u128);
                } else {
                    //deposit returned amount to user's balance
                }
                self.pools.remove(&initial_pool);
                self.pools.insert(&updated_pool);
                log!(
                    "@{} succesfully swapped {:?} {} for {} {} token",
                    env::signer_account_id(),
                    amount,
                    token_from,
                    return_amount_u128,
                    token_to
                );
                //return the amount user received
                return_amount_u128
            }
        }
    }

    #[private]
    fn verify_mint_aex_call_from_swap_aex(
        &mut self,
        pool_id: u32,
        token_from: AccountId,
        token_to: AccountId,
        amount: U128,
        return_amount_u128: u128,
        updated_pool: Pool,
    ) -> Balance {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                //refund
                Promise::new(env::signer_account_id()).transfer(return_amount_u128);
                log!(
                    "Swap failed refund anount of: {} has been sent back to: to {}",
                    amount.0,
                    env::signer_account_id()
                );
                0_u128
            }
            PromiseResult::Successful(_result) => {
                let result: u128 = serde_json::from_slice(&_result)
                    .expect("Cross contract call didn't return a number");
                let initial_pool = self.get_pool(pool_id);
                self.pools.remove(&initial_pool);
                self.pools.insert(&updated_pool);
                log!(
                    "@{} succesfully swapped {:?} {} for {} {} token",
                    env::signer_account_id(),
                    amount,
                    token_from,
                    return_amount_u128,
                    token_to
                );
                result
            }
        }
    }

    #[private]
    fn verify_ft_transfer(
        &mut self,
        pool_id: u32,
        token_from: Option<AccountId>,
        token_to: Option<AccountId>,
        amount: U128,
        return_amount_u128: u128,
        updated_pool: Option<Pool>,
        method: String,
    ) -> Balance {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                env::panic_str("Swap failed, ft_transfer call on received token failed");
            }
            PromiseResult::Successful(_result) => {
                if method == "swap_aex" {
                    let initial_pool = self.get_pool(pool_id);
                    self.pools.remove(&initial_pool);
                    self.pools.insert(&updated_pool.unwrap());
                    log!(
                        "@{} succesfully swapped {:?} {} for {} {} token",
                        env::signer_account_id(),
                        amount,
                        token_from.unwrap(),
                        return_amount_u128,
                        token_to.unwrap()
                    );
                    return_amount_u128
                } else if method == "withdraw_profit" {
                    let pool = self.get_pool(pool_id);
                    let pool_mut = &mut self.pools.iter().find(|pool| pool.id == pool_id).unwrap();
                    let user_share = pool
                        .shares
                        .share_per_contributor
                        .get(&env::signer_account_id())
                        .unwrap_or_else(|| env::panic_str("user is not a contributor"))[0];
                    let new_balance = return_amount_u128;
                    pool_mut.shares.share_per_contributor.insert(env::signer_account_id(), vec![user_share, new_balance]);
                    self.pools.remove(&pool);
                    self.pools.insert(pool_mut);
                    return_amount_u128
                } else {
                    0
                }
            }
        }
    }
}
