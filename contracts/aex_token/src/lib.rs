// This is the contract for aex token(AERX FUNGIBLE TOKEN)
use near_contract_standards::fungible_token::core_impl::ext_fungible_token_receiver;
use near_contract_standards::fungible_token::events::{FtBurn, FtMint};
use near_contract_standards::fungible_token::metadata::{
    FungibleTokenMetadata, FungibleTokenMetadataProvider, FT_METADATA_SPEC,
};
use near_contract_standards::fungible_token::FungibleToken;
use near_contract_standards::storage_management::{
    StorageBalance, StorageBalanceBounds, StorageManagement,
};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, UnorderedSet};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    assert_one_yocto, env, ext_contract, log, near_bindgen, require, serde_json, AccountId,
    Balance, BorshStorageKey, Gas, PanicOnDefault, Promise, PromiseOrValue, PromiseResult,
};

const GAS_FOR_RESOLVE_TRANSFER: Gas = Gas(5_000_000_000_000);
const GAS_FOR_FT_TRANSFER_CALL: Gas = Gas(25_000_000_000_000 + GAS_FOR_RESOLVE_TRANSFER.0);
const NO_DEPOSIT: Balance = 0;
const AERX_ICON_URL: &str = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 32 32'%3e%3ccircle cx='16' cy='16' r='16' fill='white'/%3e%3cg clip-path='url(%23a)'%3e%3cpath fill='%236054F0' d='M20.695 9.356c1.176 0 2.211.23 3.104.69a4.929 4.929 0 0 1 2.104 1.975c.509.865.763 1.921.763 3.17v1.699h-9.051c.041.988.363 1.765.964 2.331.609.56 1.452.839 2.529.839.843 0 1.652-.084 2.428-.253a12.51 12.51 0 0 0 2.33-.758v2.71a9.897 9.897 0 0 1-2.192.69c-.751.145-1.677.218-2.78.218a8.894 8.894 0 0 1-2.152-.253 6.755 6.755 0 0 1-1.853-.78A5.41 5.41 0 0 1 15.46 20.3c-.5.544-1.001.991-1.502 1.344-.5.352-1.08.612-1.74.78-.651.161-1.46.242-2.429.242-.801 0-1.54-.146-2.216-.437a3.707 3.707 0 0 1-1.628-1.332c-.409-.605-.613-1.37-.613-2.297 0-.91.225-1.657.676-2.24.45-.589 1.123-1.033 2.016-1.331.901-.299 2.02-.471 3.355-.517l2.391-.07v-.964c0-.528-.188-.919-.563-1.171-.367-.253-.872-.38-1.515-.38-.668 0-1.315.081-1.94.242-.627.16-1.253.375-1.879.643l-1.239-2.32c.735-.36 1.557-.643 2.466-.85.91-.206 1.85-.31 2.817-.31.943 0 1.77.127 2.48.38.717.244 1.318.62 1.802 1.125a5.416 5.416 0 0 1 1.903-1.114c.726-.245 1.59-.368 2.591-.368Zm-6.924 7.132-1.415.046c-1.16.03-1.97.233-2.428.609-.451.375-.676.869-.676 1.481 0 .536.158.919.475 1.149.326.222.752.333 1.277.333.526 0 .998-.1 1.415-.299.417-.199.747-.49.99-.873.241-.383.362-.846.362-1.39v-1.056Zm6.848-4.64c-.85 0-1.535.219-2.053.655-.509.436-.801 1.122-.876 2.056h5.383a3.34 3.34 0 0 0-.3-1.39 2.234 2.234 0 0 0-.814-.965c-.359-.237-.805-.356-1.34-.356Z'/%3e%3c/g%3e%3cdefs%3e%3cclipPath id='a'%3e%3cpath fill='white' d='M0 0h21.333v21.333H0z' transform='translate(5.333 5.333)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const REGISTRATION_GIFT: Balance = 111000000000000000000000000;
const INCREASE_OR_DECREASE_EARNINGS_GAS: Gas = Gas(7000000000000);
const TOTAL_AERX_FT_TRANSFER_CALL_GAS: Gas = Gas(30000000000000);
const RESOLVE_FT_TRANSFER_CALL_AERX_GAS: Gas = Gas(90000000000000);
const RESOLVE_FT_TRANSFER_AND_SEND_AEX_AERX_GAS: Gas = Gas(17000000000000);

#[ext_contract(ext_aerx)]
trait AerxCrossContract {
    fn increase_earnings(&mut self, user_id: AccountId, amount: U128) -> Earnings;
    fn decrease_earning(&mut self, user_id: AccountId, amount: U128) -> Earnings;
}

#[ext_contract(ext_self)]
trait HandleCallbacks {
    fn ft_resolve_transfer(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: U128,
    ) -> U128;
    fn resolve_decrease_earning(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: Balance,
        memo: Option<String>,
        msg: Option<String>,
        method: String,
    ) -> PromiseOrValue<U128>;
}

trait HandleCallbacks {
    fn ft_resolve_transfer(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: U128,
    ) -> U128;

    fn resolve_decrease_earning(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: Balance,
        memo: Option<String>,
        msg: Option<String>,
        method: String,
    ) -> PromiseOrValue<U128>;
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Aex {
    token: FungibleToken,
    metadata: LazyOption<FungibleTokenMetadata>,
    owner_id: AccountId,
    aerx_rewarded_and_unrewarded_users: UnorderedSet<AccountId>,
    aerx_contract_id: AccountId,
    aeswap_contract_id: AccountId,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    FungibleToken,
    Metadata,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Earnings {
    pub total: Balance,
    pub available: Balance,
}

#[near_bindgen]
impl Aex {
    #[init]
    /// initialize token contract with default metadata
    pub fn new_default_metadata(
        owner_id: AccountId,
        total_supply: U128,
        aerx_contract_id: AccountId,
        aeswap_contract_id: AccountId,
    ) -> Self {
        Self::new(
            owner_id,
            total_supply,
            FungibleTokenMetadata {
                spec: FT_METADATA_SPEC.to_string(),
                name: "AEX TOKEN".to_string(),
                symbol: "AEX".to_string(),
                icon: Some(AERX_ICON_URL.to_string()),
                reference: None,
                reference_hash: None,
                decimals: 24,
            },
            aerx_contract_id,
            aeswap_contract_id,
        )
    }

    /// Initialize the contract with the given total supply, other details and deposit it to owner_id(contract owner) account
    #[init]
    pub fn new(
        owner_id: AccountId,
        total_supply: U128,
        metadata: FungibleTokenMetadata,
        aerx_contract_id: AccountId,
        aeswap_contract_id: AccountId,
    ) -> Self {
        require!(!env::state_exists(), "Already initialized");
        metadata.assert_valid();
        let mut this = Self {
            token: FungibleToken::new(StorageKey::FungibleToken),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
            owner_id: owner_id.clone(),
            aerx_rewarded_and_unrewarded_users: UnorderedSet::new(b"r"),
            aerx_contract_id: aerx_contract_id.clone(),
            aeswap_contract_id: aeswap_contract_id.clone(),
        };
        this.token.internal_register_account(&owner_id);
        this.token.internal_register_account(&aerx_contract_id);
        this.token.internal_register_account(&aeswap_contract_id);
        this.token.internal_deposit(&owner_id, total_supply.into());
        this
    }

    /// Registers users(if not registered before),gift user 111aex(if not gifted before) and returns true at all time
    #[payable]
    pub fn register_and_reward_user(&mut self, account_id: AccountId) -> u128 {
        //Verify call is coming from Aerx
        require!(
            env::predecessor_account_id() == self.aerx_contract_id,
            "Only Aerx contract can help you claim gift, mint profile on aerx to do this"
        );
        let additional_storage_fee =
            self.get_additional_storage_for_aerx_profile_creation(account_id.clone());
        //register user if not registered or refund full attached deposit
        if !self.token.accounts.contains_key(&account_id) {
            let requirred_storage_fee =
                self.storage_balance_bounds().min.0 + additional_storage_fee;
            if env::attached_deposit() < requirred_storage_fee {
                env::panic_str(format!("The attached deposit is lesser than required storage fee attache {} and try again", requirred_storage_fee).as_str());
            }
            self.token.internal_register_account(&account_id);
            let refund = env::attached_deposit() - requirred_storage_fee;
            if refund > 0 {
                log!("will refund overpayment of {}", refund);
                Promise::new(self.aerx_contract_id.clone()).transfer(refund);
            }
        } else if env::attached_deposit() > 0 {
            log!("user exists will refund attached deposit");
            Promise::new(self.aerx_contract_id.clone()).transfer(env::attached_deposit());
        }
        if !self
            .aerx_rewarded_and_unrewarded_users
            .contains(&account_id)
        {
            log!("User has not been gifted before, claiming gift....");
            self.token.internal_deposit(&account_id, REGISTRATION_GIFT);
            self.aerx_rewarded_and_unrewarded_users.insert(&account_id);
            FtMint {
                owner_id: &account_id,
                amount: &U128::from(REGISTRATION_GIFT),
                memo: Some("Aerx Registration gift"),
            }
            .emit();
            self.ft_balance_of(account_id).into()
        } else {
            log!("User has been gifted before, Minting......");
            self.ft_balance_of(account_id).into()
        }
    }

    fn get_additional_storage_for_aerx_profile_creation(
        &mut self,
        account_id: AccountId,
    ) -> Balance {
        if !self
            .aerx_rewarded_and_unrewarded_users
            .contains(&account_id)
        {
            let initial_storage = env::storage_usage();
            self.aerx_rewarded_and_unrewarded_users.insert(&account_id);
            let final_storage = env::storage_usage();
            let cost = Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
            self.aerx_rewarded_and_unrewarded_users.remove(&account_id);
            cost
        } else {
            0
        }
    }

    pub fn mint_aex(&mut self, amount: U128, memo: Option<String>) -> Balance {
        let receiver_id = env::predecessor_account_id();
        require!(
            receiver_id == self.owner_id,
            "You are not authorized to call this function"
        );
        self.token.internal_deposit(&receiver_id, amount.into());
        FtMint {
            owner_id: &receiver_id,
            amount: &amount,
            memo: Some(&*memo.unwrap_or_else(|| "".to_string())),
        }
        .emit();
        amount.0
    }

    pub fn mint_aex_for_swap(
        &mut self,
        receiver_id: AccountId,
        amount: U128,
        memo: Option<String>,
    ) -> Balance {
        require!(
            env::predecessor_account_id() == self.aeswap_contract_id.clone(),
            "Only aeswap contract can call this function"
        );
        self.token.internal_deposit(&receiver_id, amount.into());
        if self
            .aerx_rewarded_and_unrewarded_users
            .contains(&receiver_id.clone())
        {
            ext_aerx::increase_earnings(
                receiver_id.clone(),
                amount,
                self.aerx_contract_id.clone(),
                NO_DEPOSIT,
                INCREASE_OR_DECREASE_EARNINGS_GAS,
            );
        }
        FtMint {
            owner_id: &receiver_id.clone(),
            amount: &amount,
            memo: Some(&*memo.unwrap_or_else(|| "".to_string())),
        }
        .emit();
        amount.0
    }

    pub fn burn_aex(&mut self, amount: U128, memo: Option<String>) -> Balance {
        let caller = env::predecessor_account_id();
        require!(
            caller == self.owner_id,
            "Only contract owner can burn tokens"
        );
        self.token.internal_withdraw(&caller, amount.into());
        FtBurn {
            owner_id: &caller,
            amount: &amount,
            memo: Some(&*memo.unwrap_or_else(|| "".to_string())),
        }
        .emit();
        amount.0
    }

    // change contract owner
    pub fn change_owner_to(&mut self, new_owner_id: AccountId) {
        //verify caller is the owner
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only Contract owner can make this decision not up to you "
        );
        let last_owner_id = self.owner_id.clone();
        self.owner_id = new_owner_id.clone();
        log!(
            "The ownership of aex token move from '{}' to '{}'",
            last_owner_id,
            new_owner_id
        )
    }

    /// returns contract owner
    pub fn get_owner(&self) -> AccountId {
        self.owner_id.clone()
    }
    /// returns total supply
    pub fn ft_total_supply(&self) -> U128 {
        self.token.total_supply.into()
    }
    /// returns balance of selected account id(return 0 if user is not registered)
    pub fn ft_balance_of(&self, account_id: AccountId) -> U128 {
        self.token.accounts.get(&account_id).unwrap_or(0).into()
    }
    /// checks if account_id is a registered account(mainly for frontend)
    pub fn is_registered(&self, account_id: AccountId) -> bool {
        self.token.accounts.contains_key(&account_id)
    }

    #[payable]
    pub fn add_unrewarded_user(&mut self, account_id: AccountId) -> Vec<u128> {
        let initial_storage = env::storage_usage();
        require!(
            env::predecessor_account_id() == self.aerx_contract_id,
            "Only Aerx contract can make this call"
        );
        if self.is_registered(account_id.clone()) {
            log!("existing aex user will add to list of unrewarded user...");
            self.aerx_rewarded_and_unrewarded_users.insert(&account_id);
            let final_storage = env::storage_usage();
            let cost = Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
            require!(
                env::attached_deposit() >= cost,
                format!(
                    "Attached deposit is lesser than required storage, attach {} and try again",
                    cost
                )
            );
            let refund = env::attached_deposit() - cost;
            if refund > 0 {
                log!("will refund overpayment of {}", refund);
                Promise::new(self.aerx_contract_id.clone()).transfer(refund);
            }
            let balance = self.ft_balance_of(account_id).0;
            vec![cost, balance]
        } else {
            log!("not an existing user will register and add to list...");
            self.aerx_rewarded_and_unrewarded_users.insert(&account_id);
            let final_storage = env::storage_usage();
            let storage_cost =
                Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
            let total_cost = self.storage_balance_bounds().min.0 + storage_cost;
            require!(
                env::attached_deposit() >= total_cost,
                format!(
                    "Attached deposit is lesser than required storage, attach {} and try again",
                    total_cost
                )
            );
            self.token.internal_register_account(&account_id);
            let refund = env::attached_deposit() - total_cost;
            if refund > 0 {
                log!("will refund overpayment of {}", refund);
                Promise::new(self.aerx_contract_id.clone()).transfer(refund);
            }
            let balance = self.ft_balance_of(account_id).0;
            vec![total_cost, balance]
        }
    }

    ///Transfers token from sender to receiver(decrease and increase earnings when needed)
    #[payable]
    pub fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>) {
        assert_one_yocto();
        let sender_id = env::predecessor_account_id();
        let amount: Balance = amount.into();
        if !self.aerx_rewarded_and_unrewarded_users.contains(&sender_id) {
            self.token
                .internal_transfer(&sender_id, &receiver_id, amount, memo);
            if self
                .aerx_rewarded_and_unrewarded_users
                .contains(&receiver_id)
            {
                ext_aerx::increase_earnings(
                    receiver_id,
                    amount.into(),
                    self.aerx_contract_id.clone(),
                    NO_DEPOSIT,
                    INCREASE_OR_DECREASE_EARNINGS_GAS,
                );
            }
        } else {
            ext_aerx::decrease_earning(
                sender_id.clone(),
                amount.into(),
                self.aerx_contract_id.clone(),
                NO_DEPOSIT,
                INCREASE_OR_DECREASE_EARNINGS_GAS,
            )
            .then(ext_self::resolve_decrease_earning(
                sender_id,
                receiver_id,
                amount,
                memo,
                None,
                "ft_transfer".to_string(),
                env::current_account_id(),
                NO_DEPOSIT,
                RESOLVE_FT_TRANSFER_AND_SEND_AEX_AERX_GAS,
            ));
        }
    }

    /// Handles aex transfer to Contracts(for swap purpose or other purposes) return unused token that is refunded to caller
    /// Note: Only Aeswap contract is support as receiver
    #[payable]
    pub fn ft_transfer_call(
        &mut self,
        receiver_id: AccountId,
        amount: U128,
        memo: Option<String>,
        msg: String,
    ) -> PromiseOrValue<U128> {
        assert_one_yocto();
        require!(
            receiver_id == self.aeswap_contract_id.clone(),
            "Aeswap(Aerx official decentralized exchange) contract is the only supported receiver id of this function"
        );
        require!(
            env::prepaid_gas() > GAS_FOR_FT_TRANSFER_CALL,
            "More gas is required"
        );
        let sender_id = env::predecessor_account_id();
        let amount: Balance = amount.into();
        //decrease sender's earnings if sender is an aerx user
        if self.aerx_rewarded_and_unrewarded_users.contains(&sender_id) {
            near_sdk::PromiseOrValue::Promise(
                ext_aerx::decrease_earning(
                    sender_id.clone(),
                    amount.into(),
                    self.aerx_contract_id.clone(),
                    NO_DEPOSIT,
                    INCREASE_OR_DECREASE_EARNINGS_GAS,
                )
                .then(ext_self::resolve_decrease_earning(
                    sender_id.clone(),
                    receiver_id.clone(),
                    amount,
                    memo,
                    Some(msg),
                    "ft_transfer_call".to_string(),
                    env::current_account_id(),
                    NO_DEPOSIT,
                    RESOLVE_FT_TRANSFER_CALL_AERX_GAS,
                )),
            )
        } else {
            self.token
                .internal_transfer(&sender_id, &receiver_id, amount, memo);
            ext_fungible_token_receiver::ft_on_transfer(
                sender_id.clone(),
                amount.into(),
                msg,
                receiver_id.clone(),
                NO_DEPOSIT,
                env::prepaid_gas() - GAS_FOR_FT_TRANSFER_CALL,
            )
            .then(ext_self::ft_resolve_transfer(
                sender_id,
                receiver_id,
                amount.into(),
                env::current_account_id(),
                NO_DEPOSIT,
                GAS_FOR_RESOLVE_TRANSFER,
            ))
            .into()
        }
    }

    /// Send aex from sender id to receiver id(to be called by aerx or aeswap contract)
    /// This function will only be called when an aerx user mints or charge a post on aerx OR
    /// when aeswap(aerx official decentralized) want to swap aex incase the user did not use ft_transfer_call(
    /// note: this is rare, will not happen most times but aeswap is all about users convenience and decide to save users the stress)
    /// THIS FUNCTION ONLY WORKS ON REGISTERED AERX USERS
    pub fn send_aex(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: U128,
        memo: Option<String>,
    ) -> u128 {
        require!(
            env::predecessor_account_id() == self.aerx_contract_id
                || env::predecessor_account_id() == self.aeswap_contract_id,
            "Only Aerx or Aeswap Contract can call send aex function"
        );
        require!(
            self.aerx_rewarded_and_unrewarded_users.contains(&sender_id),
            "You are not authorized to send aex on behalf of this account"
        );
        let amount: Balance = amount.into();
        if env::predecessor_account_id() == self.aeswap_contract_id {
            ext_aerx::decrease_earning(
                sender_id.clone(),
                amount.into(),
                self.aerx_contract_id.clone(),
                NO_DEPOSIT,
                INCREASE_OR_DECREASE_EARNINGS_GAS,
            )
            .then(ext_self::resolve_decrease_earning(
                sender_id.clone(),
                receiver_id,
                amount,
                memo,
                None,
                "send_aex".to_string(),
                env::current_account_id(),
                NO_DEPOSIT,
                RESOLVE_FT_TRANSFER_AND_SEND_AEX_AERX_GAS,
            ));
            self.ft_balance_of(sender_id).into()
        } else {
            self.token
                .internal_transfer(&sender_id, &receiver_id, amount, memo);
            if self
                .aerx_rewarded_and_unrewarded_users
                .contains(&receiver_id)
            {
                ext_aerx::increase_earnings(
                    receiver_id,
                    amount.into(),
                    self.aerx_contract_id.clone(),
                    NO_DEPOSIT,
                    INCREASE_OR_DECREASE_EARNINGS_GAS,
                );
            }
            self.ft_balance_of(sender_id).into()
        }
    }

    ///To be used by functions related to storage balance
    fn internal_storage_balance_of(&self, account_id: &AccountId) -> Option<StorageBalance> {
        if self.token.accounts.contains_key(account_id) {
            Some(StorageBalance {
                total: self.storage_balance_bounds().min,
                available: 0.into(),
            })
        } else {
            None
        }
    }

    /// To be used by storage_uregister function
    #[payable]
    fn unregister_account(&mut self, force: Option<bool>) -> Option<(AccountId, Balance)> {
        assert_one_yocto();
        let account_id = env::predecessor_account_id();
        let force = force.unwrap_or(false);
        if let Some(balance) = self.token.accounts.get(&account_id) {
            if balance == 0 || force {
                self.token.accounts.remove(&account_id);
                self.token.total_supply -= balance;
                if balance > 0 {
                    FtBurn {
                        owner_id: &account_id,
                        amount: &U128(balance),
                        memo: Some("Account Closure"),
                    }
                    .emit();
                } else {
                    log!("Your account: {} has been closed successfully", account_id);
                }
                //check if user has claimed gift(if yes transfer storage to aerx if not transfer to user)
                if self
                    .aerx_rewarded_and_unrewarded_users
                    .contains(&account_id)
                {
                    Promise::new(self.aerx_contract_id.clone())
                        .transfer(self.storage_balance_bounds().min.0 + 1);
                    Some((account_id, balance))
                } else {
                    Promise::new(account_id.clone())
                        .transfer(self.storage_balance_bounds().min.0 + 1);
                    Some((account_id, balance))
                }
            } else {
                env::panic_str(
                    "Can't unregister an account with the positive balance without force",
                )
            }
        } else {
            log!("The account {} is not registered", &account_id);
            None
        }
    }
}

#[near_bindgen]
impl FungibleTokenMetadataProvider for Aex {
    fn ft_metadata(&self) -> FungibleTokenMetadata {
        self.metadata.get().unwrap()
    }
}

#[near_bindgen]
impl StorageManagement for Aex {
    /// Registers an account(will use caller account if no account is entered) with 0 balance,charge caller for storage fee and refund(if amount attached is greater than minimum storage fee needed)
    /// refund caller if account is an existing user.
    #[payable]
    fn storage_deposit(
        &mut self,
        account_id: Option<AccountId>,
        _registration_only: Option<bool>,
    ) -> StorageBalance {
        let amount: Balance = env::attached_deposit();
        let account_id = account_id.unwrap_or_else(env::predecessor_account_id);
        if self.token.accounts.contains_key(&account_id) {
            log!("The account is already registered, refunding the deposit");
            if amount > 0 {
                Promise::new(env::predecessor_account_id()).transfer(amount);
            }
        } else {
            let min_balance = self.storage_balance_bounds().min.0;
            if amount < min_balance {
                env::panic_str("The attached deposit is less than the minimum storage balance");
            }
            self.token.internal_register_account(&account_id);
            let refund = amount - min_balance;
            if refund > 0 {
                Promise::new(env::predecessor_account_id()).transfer(refund);
            }
        }
        self.internal_storage_balance_of(&account_id).unwrap()
    }

    /// Returns storage balance of the caller(total and available balance) if amount is not passed or amount passed is 0
    /// note: available balance will always be 0 so will panic if amount entered is greater than 0
    #[payable]
    fn storage_withdraw(&mut self, amount: Option<U128>) -> StorageBalance {
        assert_one_yocto();
        let predecessor_account_id = env::predecessor_account_id();
        if let Some(storage_balance) = self.internal_storage_balance_of(&predecessor_account_id) {
            match amount {
                Some(amount) if amount.0 > 0 => {
                    env::panic_str("The amount is greater than the available storage balance");
                }
                _ => storage_balance,
            }
        } else {
            env::panic_str(
                format!("The account {} is not registered", &predecessor_account_id).as_str(),
            );
        }
    }

    ///Unregisters caller account with 0 balance(if force is true,unregisters account with balance greater than 0 and burn the balance)
    /// panics if balance is greater than 0 and force is false.
    #[payable]
    fn storage_unregister(&mut self, force: Option<bool>) -> bool {
        self.unregister_account(force).is_some()
    }

    /// returns the storage balance bounds(min and max near needed to create an account)
    fn storage_balance_bounds(&self) -> StorageBalanceBounds {
        let required_storage_balance =
            Balance::from(self.token.account_storage_usage) * env::storage_byte_cost();
        StorageBalanceBounds {
            min: required_storage_balance.into(),
            max: Some(required_storage_balance.into()),
        }
    }

    /// returns the storage balance of the selected account
    fn storage_balance_of(&self, account_id: AccountId) -> Option<StorageBalance> {
        self.internal_storage_balance_of(&account_id)
    }
}

#[near_bindgen]
impl HandleCallbacks for Aex {
    /// Resolves ft_on_transfer cross contract call from ft_transfer_call
    #[private]
    fn ft_resolve_transfer(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: U128,
    ) -> U128 {
        self.token
            .internal_ft_resolve_transfer(&sender_id, receiver_id, amount)
            .0
            .into()
    }
    #[private]
    fn resolve_decrease_earning(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: Balance,
        memo: Option<String>,
        msg: Option<String>,
        method: String,
    ) -> PromiseOrValue<U128> {
        require!(
            env::promise_results_count() == 1,
            "Expected one result from promise"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                env::panic_str("Cross contract call to decrease earning failed")
            }
            PromiseResult::Successful(_result) => {
                let result: bool = serde_json::from_slice(&_result)
                    .expect("Cross contract call to decrease earning didn't return true or false");
                if result {
                    self.token
                        .internal_transfer(&sender_id, &receiver_id, amount, memo);
                    if self
                        .aerx_rewarded_and_unrewarded_users
                        .contains(&receiver_id)
                    {
                        ext_aerx::increase_earnings(
                            receiver_id.clone(),
                            amount.into(),
                            self.aerx_contract_id.clone(),
                            NO_DEPOSIT,
                            INCREASE_OR_DECREASE_EARNINGS_GAS,
                        );
                        PromiseOrValue::Value(U128(0))
                    } else if method == "ft_transfer_call" {
                        let final_result = ext_fungible_token_receiver::ft_on_transfer(
                            sender_id.clone(),
                            amount.into(),
                            msg.unwrap(),
                            receiver_id.clone(),
                            NO_DEPOSIT,
                            env::prepaid_gas() - TOTAL_AERX_FT_TRANSFER_CALL_GAS,
                        )
                        .then(ext_self::ft_resolve_transfer(
                            sender_id,
                            receiver_id,
                            amount.into(),
                            env::current_account_id(),
                            NO_DEPOSIT,
                            GAS_FOR_RESOLVE_TRANSFER,
                        ));
                        PromiseOrValue::Promise(final_result)
                    } else {
                        PromiseOrValue::Value(U128(0))
                    }
                } else {
                    env::panic_str("Decrease earnings returned false")
                }
            }
        }
    }
}
