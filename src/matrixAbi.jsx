const matrixAbi = 
{
	"compilerInput": "{\"language\":\"Solidity\",\"sources\":{\"contracts/BeldexBEP20.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\npragma solidity ^0.8.20;\\n\\nimport \\\"@openzeppelin/contracts/token/ERC20/ERC20.sol\\\";\\nimport \\\"@openzeppelin/contracts/utils/Pausable.sol\\\";\\nimport \\\"@openzeppelin/contracts/access/Ownable.sol\\\";\\n\\ncontract BeldexBEP20 is ERC20, Pausable, Ownable(msg.sender) {\\n    error DisabledRenounceOwnership();\\n        \\n    event Mint(address indexed to, uint256 value);\\n    event Burn(address indexed from, uint256 value);\\n\\n    constructor(string memory _name, string memory _symbol)\\n        ERC20(_name, _symbol)\\n    {\\n       \\n    }\\n\\n    function decimals() public pure override returns (uint8) {\\n        return 9;\\n    }\\n\\n    function renounceOwnership() public pure override {\\n        revert DisabledRenounceOwnership();\\n    }\\n\\n    function pause() external onlyOwner {\\n        _pause();\\n    }\\n\\n    function unpause() external onlyOwner {\\n        _unpause();\\n    }\\n\\n    function mint(address _to, uint256 _value) external whenNotPaused onlyOwner {\\n        _mint(_to, _value);\\n        emit Mint(_to, _value);\\n    }\\n\\n    function burn(uint256 _value) external whenNotPaused {\\n        _burn(msg.sender, _value);\\n        emit Burn(msg.sender, _value);\\n    }\\n}\"},\"@openzeppelin/contracts/access/Ownable.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)\\n\\npragma solidity ^0.8.20;\\n\\nimport {Context} from \\\"../utils/Context.sol\\\";\\n\\n/**\\n * @dev Contract module which provides a basic access control mechanism, where\\n * there is an account (an owner) that can be granted exclusive access to\\n * specific functions.\\n *\\n * The initial owner is set to the address provided by the deployer. This can\\n * later be changed with {transferOwnership}.\\n *\\n * This module is used through inheritance. It will make available the modifier\\n * `onlyOwner`, which can be applied to your functions to restrict their use to\\n * the owner.\\n */\\nabstract contract Ownable is Context {\\n    address private _owner;\\n\\n    /**\\n     * @dev The caller account is not authorized to perform an operation.\\n     */\\n    error OwnableUnauthorizedAccount(address account);\\n\\n    /**\\n     * @dev The owner is not a valid owner account. (eg. `address(0)`)\\n     */\\n    error OwnableInvalidOwner(address owner);\\n\\n    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);\\n\\n    /**\\n     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.\\n     */\\n    constructor(address initialOwner) {\\n        if (initialOwner == address(0)) {\\n            revert OwnableInvalidOwner(address(0));\\n        }\\n        _transferOwnership(initialOwner);\\n    }\\n\\n    /**\\n     * @dev Throws if called by any account other than the owner.\\n     */\\n    modifier onlyOwner() {\\n        _checkOwner();\\n        _;\\n    }\\n\\n    /**\\n     * @dev Returns the address of the current owner.\\n     */\\n    function owner() public view virtual returns (address) {\\n        return _owner;\\n    }\\n\\n    /**\\n     * @dev Throws if the sender is not the owner.\\n     */\\n    function _checkOwner() internal view virtual {\\n        if (owner() != _msgSender()) {\\n            revert OwnableUnauthorizedAccount(_msgSender());\\n        }\\n    }\\n\\n    /**\\n     * @dev Leaves the contract without owner. It will not be possible to call\\n     * `onlyOwner` functions. Can only be called by the current owner.\\n     *\\n     * NOTE: Renouncing ownership will leave the contract without an owner,\\n     * thereby disabling any functionality that is only available to the owner.\\n     */\\n    function renounceOwnership() public virtual onlyOwner {\\n        _transferOwnership(address(0));\\n    }\\n\\n    /**\\n     * @dev Transfers ownership of the contract to a new account (`newOwner`).\\n     * Can only be called by the current owner.\\n     */\\n    function transferOwnership(address newOwner) public virtual onlyOwner {\\n        if (newOwner == address(0)) {\\n            revert OwnableInvalidOwner(address(0));\\n        }\\n        _transferOwnership(newOwner);\\n    }\\n\\n    /**\\n     * @dev Transfers ownership of the contract to a new account (`newOwner`).\\n     * Internal function without access restriction.\\n     */\\n    function _transferOwnership(address newOwner) internal virtual {\\n        address oldOwner = _owner;\\n        _owner = newOwner;\\n        emit OwnershipTransferred(oldOwner, newOwner);\\n    }\\n}\\n\"},\"@openzeppelin/contracts/utils/Pausable.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n// OpenZeppelin Contracts (last updated v5.3.0) (utils/Pausable.sol)\\n\\npragma solidity ^0.8.20;\\n\\nimport {Context} from \\\"../utils/Context.sol\\\";\\n\\n/**\\n * @dev Contract module which allows children to implement an emergency stop\\n * mechanism that can be triggered by an authorized account.\\n *\\n * This module is used through inheritance. It will make available the\\n * modifiers `whenNotPaused` and `whenPaused`, which can be applied to\\n * the functions of your contract. Note that they will not be pausable by\\n * simply including this module, only once the modifiers are put in place.\\n */\\nabstract contract Pausable is Context {\\n    bool private _paused;\\n\\n    /**\\n     * @dev Emitted when the pause is triggered by `account`.\\n     */\\n    event Paused(address account);\\n\\n    /**\\n     * @dev Emitted when the pause is lifted by `account`.\\n     */\\n    event Unpaused(address account);\\n\\n    /**\\n     * @dev The operation failed because the contract is paused.\\n     */\\n    error EnforcedPause();\\n\\n    /**\\n     * @dev The operation failed because the contract is not paused.\\n     */\\n    error ExpectedPause();\\n\\n    /**\\n     * @dev Modifier to make a function callable only when the contract is not paused.\\n     *\\n     * Requirements:\\n     *\\n     * - The contract must not be paused.\\n     */\\n    modifier whenNotPaused() {\\n        _requireNotPaused();\\n        _;\\n    }\\n\\n    /**\\n     * @dev Modifier to make a function callable only when the contract is paused.\\n     *\\n     * Requirements:\\n     *\\n     * - The contract must be paused.\\n     */\\n    modifier whenPaused() {\\n        _requirePaused();\\n        _;\\n    }\\n\\n    /**\\n     * @dev Returns true if the contract is paused, and false otherwise.\\n     */\\n    function paused() public view virtual returns (bool) {\\n        return _paused;\\n    }\\n\\n    /**\\n     * @dev Throws if the contract is paused.\\n     */\\n    function _requireNotPaused() internal view virtual {\\n        if (paused()) {\\n            revert EnforcedPause();\\n        }\\n    }\\n\\n    /**\\n     * @dev Throws if the contract is not paused.\\n     */\\n    function _requirePaused() internal view virtual {\\n        if (!paused()) {\\n            revert ExpectedPause();\\n        }\\n    }\\n\\n    /**\\n     * @dev Triggers stopped state.\\n     *\\n     * Requirements:\\n     *\\n     * - The contract must not be paused.\\n     */\\n    function _pause() internal virtual whenNotPaused {\\n        _paused = true;\\n        emit Paused(_msgSender());\\n    }\\n\\n    /**\\n     * @dev Returns to normal state.\\n     *\\n     * Requirements:\\n     *\\n     * - The contract must be paused.\\n     */\\n    function _unpause() internal virtual whenPaused {\\n        _paused = false;\\n        emit Unpaused(_msgSender());\\n    }\\n}\\n\"},\"@openzeppelin/contracts/token/ERC20/ERC20.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/ERC20.sol)\\n\\npragma solidity ^0.8.20;\\n\\nimport {IERC20} from \\\"./IERC20.sol\\\";\\nimport {IERC20Metadata} from \\\"./extensions/IERC20Metadata.sol\\\";\\nimport {Context} from \\\"../../utils/Context.sol\\\";\\nimport {IERC20Errors} from \\\"../../interfaces/draft-IERC6093.sol\\\";\\n\\n/**\\n * @dev Implementation of the {IERC20} interface.\\n *\\n * This implementation is agnostic to the way tokens are created. This means\\n * that a supply mechanism has to be added in a derived contract using {_mint}.\\n *\\n * TIP: For a detailed writeup see our guide\\n * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How\\n * to implement supply mechanisms].\\n *\\n * The default value of {decimals} is 18. To change this, you should override\\n * this function so it returns a different value.\\n *\\n * We have followed general OpenZeppelin Contracts guidelines: functions revert\\n * instead returning `false` on failure. This behavior is nonetheless\\n * conventional and does not conflict with the expectations of ERC-20\\n * applications.\\n */\\nabstract contract ERC20 is Context, IERC20, IERC20Metadata, IERC20Errors {\\n    mapping(address account => uint256) private _balances;\\n\\n    mapping(address account => mapping(address spender => uint256)) private _allowances;\\n\\n    uint256 private _totalSupply;\\n\\n    string private _name;\\n    string private _symbol;\\n\\n    /**\\n     * @dev Sets the values for {name} and {symbol}.\\n     *\\n     * Both values are immutable: they can only be set once during construction.\\n     */\\n    constructor(string memory name_, string memory symbol_) {\\n        _name = name_;\\n        _symbol = symbol_;\\n    }\\n\\n    /**\\n     * @dev Returns the name of the token.\\n     */\\n    function name() public view virtual returns (string memory) {\\n        return _name;\\n    }\\n\\n    /**\\n     * @dev Returns the symbol of the token, usually a shorter version of the\\n     * name.\\n     */\\n    function symbol() public view virtual returns (string memory) {\\n        return _symbol;\\n    }\\n\\n    /**\\n     * @dev Returns the number of decimals used to get its user representation.\\n     * For example, if `decimals` equals `2`, a balance of `505` tokens should\\n     * be displayed to a user as `5.05` (`505 / 10 ** 2`).\\n     *\\n     * Tokens usually opt for a value of 18, imitating the relationship between\\n     * Ether and Wei. This is the default value returned by this function, unless\\n     * it's overridden.\\n     *\\n     * NOTE: This information is only used for _display_ purposes: it in\\n     * no way affects any of the arithmetic of the contract, including\\n     * {IERC20-balanceOf} and {IERC20-transfer}.\\n     */\\n    function decimals() public view virtual returns (uint8) {\\n        return 18;\\n    }\\n\\n    /// @inheritdoc IERC20\\n    function totalSupply() public view virtual returns (uint256) {\\n        return _totalSupply;\\n    }\\n\\n    /// @inheritdoc IERC20\\n    function balanceOf(address account) public view virtual returns (uint256) {\\n        return _balances[account];\\n    }\\n\\n    /**\\n     * @dev See {IERC20-transfer}.\\n     *\\n     * Requirements:\\n     *\\n     * - `to` cannot be the zero address.\\n     * - the caller must have a balance of at least `value`.\\n     */\\n    function transfer(address to, uint256 value) public virtual returns (bool) {\\n        address owner = _msgSender();\\n        _transfer(owner, to, value);\\n        return true;\\n    }\\n\\n    /// @inheritdoc IERC20\\n    function allowance(address owner, address spender) public view virtual returns (uint256) {\\n        return _allowances[owner][spender];\\n    }\\n\\n    /**\\n     * @dev See {IERC20-approve}.\\n     *\\n     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on\\n     * `transferFrom`. This is semantically equivalent to an infinite approval.\\n     *\\n     * Requirements:\\n     *\\n     * - `spender` cannot be the zero address.\\n     */\\n    function approve(address spender, uint256 value) public virtual returns (bool) {\\n        address owner = _msgSender();\\n        _approve(owner, spender, value);\\n        return true;\\n    }\\n\\n    /**\\n     * @dev See {IERC20-transferFrom}.\\n     *\\n     * Skips emitting an {Approval} event indicating an allowance update. This is not\\n     * required by the ERC. See {xref-ERC20-_approve-address-address-uint256-bool-}[_approve].\\n     *\\n     * NOTE: Does not update the allowance if the current allowance\\n     * is the maximum `uint256`.\\n     *\\n     * Requirements:\\n     *\\n     * - `from` and `to` cannot be the zero address.\\n     * - `from` must have a balance of at least `value`.\\n     * - the caller must have allowance for ``from``'s tokens of at least\\n     * `value`.\\n     */\\n    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {\\n        address spender = _msgSender();\\n        _spendAllowance(from, spender, value);\\n        _transfer(from, to, value);\\n        return true;\\n    }\\n\\n    /**\\n     * @dev Moves a `value` amount of tokens from `from` to `to`.\\n     *\\n     * This internal function is equivalent to {transfer}, and can be used to\\n     * e.g. implement automatic token fees, slashing mechanisms, etc.\\n     *\\n     * Emits a {Transfer} event.\\n     *\\n     * NOTE: This function is not virtual, {_update} should be overridden instead.\\n     */\\n    function _transfer(address from, address to, uint256 value) internal {\\n        if (from == address(0)) {\\n            revert ERC20InvalidSender(address(0));\\n        }\\n        if (to == address(0)) {\\n            revert ERC20InvalidReceiver(address(0));\\n        }\\n        _update(from, to, value);\\n    }\\n\\n    /**\\n     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`\\n     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding\\n     * this function.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function _update(address from, address to, uint256 value) internal virtual {\\n        if (from == address(0)) {\\n            // Overflow check required: The rest of the code assumes that totalSupply never overflows\\n            _totalSupply += value;\\n        } else {\\n            uint256 fromBalance = _balances[from];\\n            if (fromBalance < value) {\\n                revert ERC20InsufficientBalance(from, fromBalance, value);\\n            }\\n            unchecked {\\n                // Overflow not possible: value <= fromBalance <= totalSupply.\\n                _balances[from] = fromBalance - value;\\n            }\\n        }\\n\\n        if (to == address(0)) {\\n            unchecked {\\n                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.\\n                _totalSupply -= value;\\n            }\\n        } else {\\n            unchecked {\\n                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.\\n                _balances[to] += value;\\n            }\\n        }\\n\\n        emit Transfer(from, to, value);\\n    }\\n\\n    /**\\n     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).\\n     * Relies on the `_update` mechanism\\n     *\\n     * Emits a {Transfer} event with `from` set to the zero address.\\n     *\\n     * NOTE: This function is not virtual, {_update} should be overridden instead.\\n     */\\n    function _mint(address account, uint256 value) internal {\\n        if (account == address(0)) {\\n            revert ERC20InvalidReceiver(address(0));\\n        }\\n        _update(address(0), account, value);\\n    }\\n\\n    /**\\n     * @dev Destroys a `value` amount of tokens from `account`, lowering the total supply.\\n     * Relies on the `_update` mechanism.\\n     *\\n     * Emits a {Transfer} event with `to` set to the zero address.\\n     *\\n     * NOTE: This function is not virtual, {_update} should be overridden instead\\n     */\\n    function _burn(address account, uint256 value) internal {\\n        if (account == address(0)) {\\n            revert ERC20InvalidSender(address(0));\\n        }\\n        _update(account, address(0), value);\\n    }\\n\\n    /**\\n     * @dev Sets `value` as the allowance of `spender` over the `owner`'s tokens.\\n     *\\n     * This internal function is equivalent to `approve`, and can be used to\\n     * e.g. set automatic allowances for certain subsystems, etc.\\n     *\\n     * Emits an {Approval} event.\\n     *\\n     * Requirements:\\n     *\\n     * - `owner` cannot be the zero address.\\n     * - `spender` cannot be the zero address.\\n     *\\n     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.\\n     */\\n    function _approve(address owner, address spender, uint256 value) internal {\\n        _approve(owner, spender, value, true);\\n    }\\n\\n    /**\\n     * @dev Variant of {_approve} with an optional flag to enable or disable the {Approval} event.\\n     *\\n     * By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by\\n     * `_spendAllowance` during the `transferFrom` operation set the flag to false. This saves gas by not emitting any\\n     * `Approval` event during `transferFrom` operations.\\n     *\\n     * Anyone who wishes to continue emitting `Approval` events on the`transferFrom` operation can force the flag to\\n     * true using the following override:\\n     *\\n     * ```solidity\\n     * function _approve(address owner, address spender, uint256 value, bool) internal virtual override {\\n     *     super._approve(owner, spender, value, true);\\n     * }\\n     * ```\\n     *\\n     * Requirements are the same as {_approve}.\\n     */\\n    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {\\n        if (owner == address(0)) {\\n            revert ERC20InvalidApprover(address(0));\\n        }\\n        if (spender == address(0)) {\\n            revert ERC20InvalidSpender(address(0));\\n        }\\n        _allowances[owner][spender] = value;\\n        if (emitEvent) {\\n            emit Approval(owner, spender, value);\\n        }\\n    }\\n\\n    /**\\n     * @dev Updates `owner`'s allowance for `spender` based on spent `value`.\\n     *\\n     * Does not update the allowance value in case of infinite allowance.\\n     * Revert if not enough allowance is available.\\n     *\\n     * Does not emit an {Approval} event.\\n     */\\n    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {\\n        uint256 currentAllowance = allowance(owner, spender);\\n        if (currentAllowance < type(uint256).max) {\\n            if (currentAllowance < value) {\\n                revert ERC20InsufficientAllowance(spender, currentAllowance, value);\\n            }\\n            unchecked {\\n                _approve(owner, spender, currentAllowance - value, false);\\n            }\\n        }\\n    }\\n}\\n\"},\"@openzeppelin/contracts/utils/Context.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)\\n\\npragma solidity ^0.8.20;\\n\\n/**\\n * @dev Provides information about the current execution context, including the\\n * sender of the transaction and its data. While these are generally available\\n * via msg.sender and msg.data, they should not be accessed in such a direct\\n * manner, since when dealing with meta-transactions the account sending and\\n * paying for execution may not be the actual sender (as far as an application\\n * is concerned).\\n *\\n * This contract is only required for intermediate, library-like contracts.\\n */\\nabstract contract Context {\\n    function _msgSender() internal view virtual returns (address) {\\n        return msg.sender;\\n    }\\n\\n    function _msgData() internal view virtual returns (bytes calldata) {\\n        return msg.data;\\n    }\\n\\n    function _contextSuffixLength() internal view virtual returns (uint256) {\\n        return 0;\\n    }\\n}\\n\"},\"@openzeppelin/contracts/interfaces/draft-IERC6093.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n// OpenZeppelin Contracts (last updated v5.4.0) (interfaces/draft-IERC6093.sol)\\npragma solidity >=0.8.4;\\n\\n/**\\n * @dev Standard ERC-20 Errors\\n * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-20 tokens.\\n */\\ninterface IERC20Errors {\\n    /**\\n     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.\\n     * @param sender Address whose tokens are being transferred.\\n     * @param balance Current balance for the interacting account.\\n     * @param needed Minimum amount required to perform a transfer.\\n     */\\n    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);\\n\\n    /**\\n     * @dev Indicates a failure with the token `sender`. Used in transfers.\\n     * @param sender Address whose tokens are being transferred.\\n     */\\n    error ERC20InvalidSender(address sender);\\n\\n    /**\\n     * @dev Indicates a failure with the token `receiver`. Used in transfers.\\n     * @param receiver Address to which tokens are being transferred.\\n     */\\n    error ERC20InvalidReceiver(address receiver);\\n\\n    /**\\n     * @dev Indicates a failure with the `spender`’s `allowance`. Used in transfers.\\n     * @param spender Address that may be allowed to operate on tokens without being their owner.\\n     * @param allowance Amount of tokens a `spender` is allowed to operate with.\\n     * @param needed Minimum amount required to perform a transfer.\\n     */\\n    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);\\n\\n    /**\\n     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.\\n     * @param approver Address initiating an approval operation.\\n     */\\n    error ERC20InvalidApprover(address approver);\\n\\n    /**\\n     * @dev Indicates a failure with the `spender` to be approved. Used in approvals.\\n     * @param spender Address that may be allowed to operate on tokens without being their owner.\\n     */\\n    error ERC20InvalidSpender(address spender);\\n}\\n\\n/**\\n * @dev Standard ERC-721 Errors\\n * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-721 tokens.\\n */\\ninterface IERC721Errors {\\n    /**\\n     * @dev Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in ERC-20.\\n     * Used in balance queries.\\n     * @param owner Address of the current owner of a token.\\n     */\\n    error ERC721InvalidOwner(address owner);\\n\\n    /**\\n     * @dev Indicates a `tokenId` whose `owner` is the zero address.\\n     * @param tokenId Identifier number of a token.\\n     */\\n    error ERC721NonexistentToken(uint256 tokenId);\\n\\n    /**\\n     * @dev Indicates an error related to the ownership over a particular token. Used in transfers.\\n     * @param sender Address whose tokens are being transferred.\\n     * @param tokenId Identifier number of a token.\\n     * @param owner Address of the current owner of a token.\\n     */\\n    error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);\\n\\n    /**\\n     * @dev Indicates a failure with the token `sender`. Used in transfers.\\n     * @param sender Address whose tokens are being transferred.\\n     */\\n    error ERC721InvalidSender(address sender);\\n\\n    /**\\n     * @dev Indicates a failure with the token `receiver`. Used in transfers.\\n     * @param receiver Address to which tokens are being transferred.\\n     */\\n    error ERC721InvalidReceiver(address receiver);\\n\\n    /**\\n     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.\\n     * @param operator Address that may be allowed to operate on tokens without being their owner.\\n     * @param tokenId Identifier number of a token.\\n     */\\n    error ERC721InsufficientApproval(address operator, uint256 tokenId);\\n\\n    /**\\n     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.\\n     * @param approver Address initiating an approval operation.\\n     */\\n    error ERC721InvalidApprover(address approver);\\n\\n    /**\\n     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.\\n     * @param operator Address that may be allowed to operate on tokens without being their owner.\\n     */\\n    error ERC721InvalidOperator(address operator);\\n}\\n\\n/**\\n * @dev Standard ERC-1155 Errors\\n * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-1155 tokens.\\n */\\ninterface IERC1155Errors {\\n    /**\\n     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.\\n     * @param sender Address whose tokens are being transferred.\\n     * @param balance Current balance for the interacting account.\\n     * @param needed Minimum amount required to perform a transfer.\\n     * @param tokenId Identifier number of a token.\\n     */\\n    error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId);\\n\\n    /**\\n     * @dev Indicates a failure with the token `sender`. Used in transfers.\\n     * @param sender Address whose tokens are being transferred.\\n     */\\n    error ERC1155InvalidSender(address sender);\\n\\n    /**\\n     * @dev Indicates a failure with the token `receiver`. Used in transfers.\\n     * @param receiver Address to which tokens are being transferred.\\n     */\\n    error ERC1155InvalidReceiver(address receiver);\\n\\n    /**\\n     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.\\n     * @param operator Address that may be allowed to operate on tokens without being their owner.\\n     * @param owner Address of the current owner of a token.\\n     */\\n    error ERC1155MissingApprovalForAll(address operator, address owner);\\n\\n    /**\\n     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.\\n     * @param approver Address initiating an approval operation.\\n     */\\n    error ERC1155InvalidApprover(address approver);\\n\\n    /**\\n     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.\\n     * @param operator Address that may be allowed to operate on tokens without being their owner.\\n     */\\n    error ERC1155InvalidOperator(address operator);\\n\\n    /**\\n     * @dev Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation.\\n     * Used in batch transfers.\\n     * @param idsLength Length of the array of token identifiers\\n     * @param valuesLength Length of the array of token amounts\\n     */\\n    error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength);\\n}\\n\"},\"@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Metadata.sol)\\n\\npragma solidity >=0.6.2;\\n\\nimport {IERC20} from \\\"../IERC20.sol\\\";\\n\\n/**\\n * @dev Interface for the optional metadata functions from the ERC-20 standard.\\n */\\ninterface IERC20Metadata is IERC20 {\\n    /**\\n     * @dev Returns the name of the token.\\n     */\\n    function name() external view returns (string memory);\\n\\n    /**\\n     * @dev Returns the symbol of the token.\\n     */\\n    function symbol() external view returns (string memory);\\n\\n    /**\\n     * @dev Returns the decimals places of the token.\\n     */\\n    function decimals() external view returns (uint8);\\n}\\n\"},\"@openzeppelin/contracts/token/ERC20/IERC20.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)\\n\\npragma solidity >=0.4.16;\\n\\n/**\\n * @dev Interface of the ERC-20 standard as defined in the ERC.\\n */\\ninterface IERC20 {\\n    /**\\n     * @dev Emitted when `value` tokens are moved from one account (`from`) to\\n     * another (`to`).\\n     *\\n     * Note that `value` may be zero.\\n     */\\n    event Transfer(address indexed from, address indexed to, uint256 value);\\n\\n    /**\\n     * @dev Emitted when the allowance of a `spender` for an `owner` is set by\\n     * a call to {approve}. `value` is the new allowance.\\n     */\\n    event Approval(address indexed owner, address indexed spender, uint256 value);\\n\\n    /**\\n     * @dev Returns the value of tokens in existence.\\n     */\\n    function totalSupply() external view returns (uint256);\\n\\n    /**\\n     * @dev Returns the value of tokens owned by `account`.\\n     */\\n    function balanceOf(address account) external view returns (uint256);\\n\\n    /**\\n     * @dev Moves a `value` amount of tokens from the caller's account to `to`.\\n     *\\n     * Returns a boolean value indicating whether the operation succeeded.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function transfer(address to, uint256 value) external returns (bool);\\n\\n    /**\\n     * @dev Returns the remaining number of tokens that `spender` will be\\n     * allowed to spend on behalf of `owner` through {transferFrom}. This is\\n     * zero by default.\\n     *\\n     * This value changes when {approve} or {transferFrom} are called.\\n     */\\n    function allowance(address owner, address spender) external view returns (uint256);\\n\\n    /**\\n     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the\\n     * caller's tokens.\\n     *\\n     * Returns a boolean value indicating whether the operation succeeded.\\n     *\\n     * IMPORTANT: Beware that changing an allowance with this method brings the risk\\n     * that someone may use both the old and the new allowance by unfortunate\\n     * transaction ordering. One possible solution to mitigate this race\\n     * condition is to first reduce the spender's allowance to 0 and set the\\n     * desired value afterwards:\\n     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729\\n     *\\n     * Emits an {Approval} event.\\n     */\\n    function approve(address spender, uint256 value) external returns (bool);\\n\\n    /**\\n     * @dev Moves a `value` amount of tokens from `from` to `to` using the\\n     * allowance mechanism. `value` is then deducted from the caller's\\n     * allowance.\\n     *\\n     * Returns a boolean value indicating whether the operation succeeded.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function transferFrom(address from, address to, uint256 value) external returns (bool);\\n}\\n\"}},\"settings\":{\"optimizer\":{\"enabled\":false,\"runs\":200},\"outputSelection\":{\"*\":{\"\":[\"ast\"],\"*\":[\"abi\",\"metadata\",\"devdoc\",\"userdoc\",\"storageLayout\",\"evm.legacyAssembly\",\"evm.bytecode\",\"evm.deployedBytecode\",\"evm.methodIdentifiers\",\"evm.gasEstimates\",\"evm.assembly\"]}},\"remappings\":[],\"evmVersion\":\"cancun\"}}",
	"name": "BeldexBEP20",
	"metadata": "{\"compiler\":{\"version\":\"0.8.24+commit.e11b9ed9\"},\"language\":\"Solidity\",\"output\":{\"abi\":[{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_symbol\",\"type\":\"string\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"DisabledRenounceOwnership\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"allowance\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"needed\",\"type\":\"uint256\"}],\"name\":\"ERC20InsufficientAllowance\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"balance\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"needed\",\"type\":\"uint256\"}],\"name\":\"ERC20InsufficientBalance\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"approver\",\"type\":\"address\"}],\"name\":\"ERC20InvalidApprover\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"}],\"name\":\"ERC20InvalidReceiver\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"ERC20InvalidSender\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"ERC20InvalidSpender\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"EnforcedPause\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ExpectedPause\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"OwnableInvalidOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"OwnableUnauthorizedAccount\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Burn\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Mint\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Paused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Unpaused\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"mint\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"pause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"paused\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"unpause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}],\"devdoc\":{\"errors\":{\"ERC20InsufficientAllowance(address,uint256,uint256)\":[{\"details\":\"Indicates a failure with the `spender`\\u2019s `allowance`. Used in transfers.\",\"params\":{\"allowance\":\"Amount of tokens a `spender` is allowed to operate with.\",\"needed\":\"Minimum amount required to perform a transfer.\",\"spender\":\"Address that may be allowed to operate on tokens without being their owner.\"}}],\"ERC20InsufficientBalance(address,uint256,uint256)\":[{\"details\":\"Indicates an error related to the current `balance` of a `sender`. Used in transfers.\",\"params\":{\"balance\":\"Current balance for the interacting account.\",\"needed\":\"Minimum amount required to perform a transfer.\",\"sender\":\"Address whose tokens are being transferred.\"}}],\"ERC20InvalidApprover(address)\":[{\"details\":\"Indicates a failure with the `approver` of a token to be approved. Used in approvals.\",\"params\":{\"approver\":\"Address initiating an approval operation.\"}}],\"ERC20InvalidReceiver(address)\":[{\"details\":\"Indicates a failure with the token `receiver`. Used in transfers.\",\"params\":{\"receiver\":\"Address to which tokens are being transferred.\"}}],\"ERC20InvalidSender(address)\":[{\"details\":\"Indicates a failure with the token `sender`. Used in transfers.\",\"params\":{\"sender\":\"Address whose tokens are being transferred.\"}}],\"ERC20InvalidSpender(address)\":[{\"details\":\"Indicates a failure with the `spender` to be approved. Used in approvals.\",\"params\":{\"spender\":\"Address that may be allowed to operate on tokens without being their owner.\"}}],\"EnforcedPause()\":[{\"details\":\"The operation failed because the contract is paused.\"}],\"ExpectedPause()\":[{\"details\":\"The operation failed because the contract is not paused.\"}],\"OwnableInvalidOwner(address)\":[{\"details\":\"The owner is not a valid owner account. (eg. `address(0)`)\"}],\"OwnableUnauthorizedAccount(address)\":[{\"details\":\"The caller account is not authorized to perform an operation.\"}]},\"events\":{\"Approval(address,address,uint256)\":{\"details\":\"Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance.\"},\"Paused(address)\":{\"details\":\"Emitted when the pause is triggered by `account`.\"},\"Transfer(address,address,uint256)\":{\"details\":\"Emitted when `value` tokens are moved from one account (`from`) to another (`to`). Note that `value` may be zero.\"},\"Unpaused(address)\":{\"details\":\"Emitted when the pause is lifted by `account`.\"}},\"kind\":\"dev\",\"methods\":{\"allowance(address,address)\":{\"details\":\"Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through {transferFrom}. This is zero by default. This value changes when {approve} or {transferFrom} are called.\"},\"approve(address,uint256)\":{\"details\":\"See {IERC20-approve}. NOTE: If `value` is the maximum `uint256`, the allowance is not updated on `transferFrom`. This is semantically equivalent to an infinite approval. Requirements: - `spender` cannot be the zero address.\"},\"balanceOf(address)\":{\"details\":\"Returns the value of tokens owned by `account`.\"},\"decimals()\":{\"details\":\"Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5.05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the default value returned by this function, unless it's overridden. NOTE: This information is only used for _display_ purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}.\"},\"name()\":{\"details\":\"Returns the name of the token.\"},\"owner()\":{\"details\":\"Returns the address of the current owner.\"},\"paused()\":{\"details\":\"Returns true if the contract is paused, and false otherwise.\"},\"renounceOwnership()\":{\"details\":\"Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.\"},\"symbol()\":{\"details\":\"Returns the symbol of the token, usually a shorter version of the name.\"},\"totalSupply()\":{\"details\":\"Returns the value of tokens in existence.\"},\"transfer(address,uint256)\":{\"details\":\"See {IERC20-transfer}. Requirements: - `to` cannot be the zero address. - the caller must have a balance of at least `value`.\"},\"transferFrom(address,address,uint256)\":{\"details\":\"See {IERC20-transferFrom}. Skips emitting an {Approval} event indicating an allowance update. This is not required by the ERC. See {xref-ERC20-_approve-address-address-uint256-bool-}[_approve]. NOTE: Does not update the allowance if the current allowance is the maximum `uint256`. Requirements: - `from` and `to` cannot be the zero address. - `from` must have a balance of at least `value`. - the caller must have allowance for ``from``'s tokens of at least `value`.\"},\"transferOwnership(address)\":{\"details\":\"Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.\"}},\"version\":1},\"userdoc\":{\"kind\":\"user\",\"methods\":{},\"version\":1}},\"settings\":{\"compilationTarget\":{\"contracts/BeldexBEP20.sol\":\"BeldexBEP20\"},\"evmVersion\":\"cancun\",\"libraries\":{},\"metadata\":{\"bytecodeHash\":\"ipfs\"},\"optimizer\":{\"enabled\":false,\"runs\":200},\"remappings\":[]},\"sources\":{\"@openzeppelin/contracts/access/Ownable.sol\":{\"keccak256\":\"0xff6d0bb2e285473e5311d9d3caacb525ae3538a80758c10649a4d61029b017bb\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://8ed324d3920bb545059d66ab97d43e43ee85fd3bd52e03e401f020afb0b120f6\",\"dweb:/ipfs/QmfEckWLmZkDDcoWrkEvMWhms66xwTLff9DDhegYpvHo1a\"]},\"@openzeppelin/contracts/interfaces/draft-IERC6093.sol\":{\"keccak256\":\"0x19fdfb0f3b89a230e7dbd1cf416f1a6b531a3ee5db4da483f946320fc74afc0e\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://3490d794728f5bfecb46820431adaff71ba374141545ec20b650bb60353fac23\",\"dweb:/ipfs/QmPsfxjVpMcZbpE7BH93DzTpEaktESigEw4SmDzkXuJ4WR\"]},\"@openzeppelin/contracts/token/ERC20/ERC20.sol\":{\"keccak256\":\"0x86b7b71a6aedefdad89b607378eeab1dcc5389b9ea7d17346d08af01d7190994\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://1dc2db8d94a21eac8efe03adf574c419b08536409b416057a2b5b95cb772c43c\",\"dweb:/ipfs/QmZfqJCKVU1ScuX2A7s8WZdQEaikwJbDH5JBrBdKTUT4Gu\"]},\"@openzeppelin/contracts/token/ERC20/IERC20.sol\":{\"keccak256\":\"0x74ed01eb66b923d0d0cfe3be84604ac04b76482a55f9dd655e1ef4d367f95bc2\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://5282825a626cfe924e504274b864a652b0023591fa66f06a067b25b51ba9b303\",\"dweb:/ipfs/QmeCfPykghhMc81VJTrHTC7sF6CRvaA1FXVq2pJhwYp1dV\"]},\"@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol\":{\"keccak256\":\"0xd6fa4088198f04eef10c5bce8a2f4d60554b7ec4b987f684393c01bf79b94d9f\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://f95ee0bbd4dd3ac730d066ba3e785ded4565e890dbec2fa7d3b9fe3bad9d0d6e\",\"dweb:/ipfs/QmSLr6bHkPFWT7ntj34jmwfyskpwo97T9jZUrk5sz3sdtR\"]},\"@openzeppelin/contracts/utils/Context.sol\":{\"keccak256\":\"0x493033a8d1b176a037b2cc6a04dad01a5c157722049bbecf632ca876224dd4b2\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://6a708e8a5bdb1011c2c381c9a5cfd8a9a956d7d0a9dc1bd8bcdaf52f76ef2f12\",\"dweb:/ipfs/Qmax9WHBnVsZP46ZxEMNRQpLQnrdE4dK8LehML1Py8FowF\"]},\"@openzeppelin/contracts/utils/Pausable.sol\":{\"keccak256\":\"0xdb484371dfbb848cb6f5d70464e9ac9b2900e4164ead76bbce4fef0b44bcc68f\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://f9d6f6f6600a2bec622f699081b58350873b5e63ce05464d17d674a290bb8a7c\",\"dweb:/ipfs/QmQKVzSQY1PM3Bid4QhgVVZyx6B4Jx7XgaQzLKHj38vJz8\"]},\"contracts/BeldexBEP20.sol\":{\"keccak256\":\"0x4b4f9815302ed9df2d57108184eb01f0443ef7b9b2ed83ea80d57e4ab718905c\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://a381b69374078a1c8cde49b4dd8e95f322f10ac4a5d0505c4b908b34f15eedf6\",\"dweb:/ipfs/Qmd2ne3sieRe3atp4xYmZaATnpQGMVDLzA8xsQzVCaW1Tn\"]}},\"version\":1}",
	"bytecode": {
		"functionDebugData": {
			"@_1080": {
				"entryPoint": null,
				"id": 1080,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"@_336": {
				"entryPoint": null,
				"id": 336,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"@_50": {
				"entryPoint": null,
				"id": 50,
				"parameterSlots": 1,
				"returnSlots": 0
			},
			"@_transferOwnership_146": {
				"entryPoint": 236,
				"id": 146,
				"parameterSlots": 1,
				"returnSlots": 0
			},
			"abi_decode_available_length_t_string_memory_ptr_fromMemory": {
				"entryPoint": 698,
				"id": null,
				"parameterSlots": 3,
				"returnSlots": 1
			},
			"abi_decode_t_string_memory_ptr_fromMemory": {
				"entryPoint": 772,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_decode_tuple_t_string_memory_ptrt_string_memory_ptr_fromMemory": {
				"entryPoint": 822,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 2
			},
			"abi_encode_t_address_to_t_address_fromStack": {
				"entryPoint": 1798,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"abi_encode_tuple_t_address__to_t_address__fromStack_reversed": {
				"entryPoint": 1815,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"allocate_memory": {
				"entryPoint": 573,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"allocate_unbounded": {
				"entryPoint": 433,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 1
			},
			"array_allocation_size_t_string_memory_ptr": {
				"entryPoint": 603,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"array_dataslot_t_string_storage": {
				"entryPoint": 1060,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"array_length_t_string_memory_ptr": {
				"entryPoint": 953,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"clean_up_bytearray_end_slots_t_string_storage": {
				"entryPoint": 1369,
				"id": null,
				"parameterSlots": 3,
				"returnSlots": 0
			},
			"cleanup_t_address": {
				"entryPoint": 1779,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"cleanup_t_uint160": {
				"entryPoint": 1748,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"cleanup_t_uint256": {
				"entryPoint": 1190,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"clear_storage_range_t_bytes1": {
				"entryPoint": 1331,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"convert_t_uint256_to_t_uint256": {
				"entryPoint": 1208,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"copy_byte_array_to_storage_from_t_string_memory_ptr_to_t_string_storage": {
				"entryPoint": 1520,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"copy_memory_to_memory_with_cleanup": {
				"entryPoint": 656,
				"id": null,
				"parameterSlots": 3,
				"returnSlots": 0
			},
			"divide_by_32_ceil": {
				"entryPoint": 1078,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"extract_byte_array_length": {
				"entryPoint": 1008,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"extract_used_part_and_set_length_of_short_byte_array": {
				"entryPoint": 1491,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"finalize_allocation": {
				"entryPoint": 519,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"identity": {
				"entryPoint": 1199,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"mask_bytes_dynamic": {
				"entryPoint": 1461,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"panic_error_0x22": {
				"entryPoint": 963,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"panic_error_0x41": {
				"entryPoint": 474,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"prepare_store_t_uint256": {
				"entryPoint": 1247,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d": {
				"entryPoint": 450,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae": {
				"entryPoint": 454,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db": {
				"entryPoint": 446,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b": {
				"entryPoint": 442,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"round_up_to_mul_of_32": {
				"entryPoint": 458,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"shift_left_dynamic": {
				"entryPoint": 1093,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"shift_right_unsigned_dynamic": {
				"entryPoint": 1449,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"storage_set_to_zero_t_uint256": {
				"entryPoint": 1303,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"update_byte_slice_dynamic32": {
				"entryPoint": 1105,
				"id": null,
				"parameterSlots": 3,
				"returnSlots": 1
			},
			"update_storage_value_t_uint256_to_t_uint256": {
				"entryPoint": 1256,
				"id": null,
				"parameterSlots": 3,
				"returnSlots": 0
			},
			"zero_value_for_split_t_uint256": {
				"entryPoint": 1299,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 1
			}
		},
		"generatedSources": [
			{
				"ast": {
					"nativeSrc": "0:9160:8",
					"nodeType": "YulBlock",
					"src": "0:9160:8",
					"statements": [
						{
							"body": {
								"nativeSrc": "47:35:8",
								"nodeType": "YulBlock",
								"src": "47:35:8",
								"statements": [
									{
										"nativeSrc": "57:19:8",
										"nodeType": "YulAssignment",
										"src": "57:19:8",
										"value": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "73:2:8",
													"nodeType": "YulLiteral",
													"src": "73:2:8",
													"type": "",
													"value": "64"
												}
											],
											"functionName": {
												"name": "mload",
												"nativeSrc": "67:5:8",
												"nodeType": "YulIdentifier",
												"src": "67:5:8"
											},
											"nativeSrc": "67:9:8",
											"nodeType": "YulFunctionCall",
											"src": "67:9:8"
										},
										"variableNames": [
											{
												"name": "memPtr",
												"nativeSrc": "57:6:8",
												"nodeType": "YulIdentifier",
												"src": "57:6:8"
											}
										]
									}
								]
							},
							"name": "allocate_unbounded",
							"nativeSrc": "7:75:8",
							"nodeType": "YulFunctionDefinition",
							"returnVariables": [
								{
									"name": "memPtr",
									"nativeSrc": "40:6:8",
									"nodeType": "YulTypedName",
									"src": "40:6:8",
									"type": ""
								}
							],
							"src": "7:75:8"
						},
						{
							"body": {
								"nativeSrc": "177:28:8",
								"nodeType": "YulBlock",
								"src": "177:28:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "194:1:8",
													"nodeType": "YulLiteral",
													"src": "194:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "197:1:8",
													"nodeType": "YulLiteral",
													"src": "197:1:8",
													"type": "",
													"value": "0"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "187:6:8",
												"nodeType": "YulIdentifier",
												"src": "187:6:8"
											},
											"nativeSrc": "187:12:8",
											"nodeType": "YulFunctionCall",
											"src": "187:12:8"
										},
										"nativeSrc": "187:12:8",
										"nodeType": "YulExpressionStatement",
										"src": "187:12:8"
									}
								]
							},
							"name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
							"nativeSrc": "88:117:8",
							"nodeType": "YulFunctionDefinition",
							"src": "88:117:8"
						},
						{
							"body": {
								"nativeSrc": "300:28:8",
								"nodeType": "YulBlock",
								"src": "300:28:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "317:1:8",
													"nodeType": "YulLiteral",
													"src": "317:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "320:1:8",
													"nodeType": "YulLiteral",
													"src": "320:1:8",
													"type": "",
													"value": "0"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "310:6:8",
												"nodeType": "YulIdentifier",
												"src": "310:6:8"
											},
											"nativeSrc": "310:12:8",
											"nodeType": "YulFunctionCall",
											"src": "310:12:8"
										},
										"nativeSrc": "310:12:8",
										"nodeType": "YulExpressionStatement",
										"src": "310:12:8"
									}
								]
							},
							"name": "revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db",
							"nativeSrc": "211:117:8",
							"nodeType": "YulFunctionDefinition",
							"src": "211:117:8"
						},
						{
							"body": {
								"nativeSrc": "423:28:8",
								"nodeType": "YulBlock",
								"src": "423:28:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "440:1:8",
													"nodeType": "YulLiteral",
													"src": "440:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "443:1:8",
													"nodeType": "YulLiteral",
													"src": "443:1:8",
													"type": "",
													"value": "0"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "433:6:8",
												"nodeType": "YulIdentifier",
												"src": "433:6:8"
											},
											"nativeSrc": "433:12:8",
											"nodeType": "YulFunctionCall",
											"src": "433:12:8"
										},
										"nativeSrc": "433:12:8",
										"nodeType": "YulExpressionStatement",
										"src": "433:12:8"
									}
								]
							},
							"name": "revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d",
							"nativeSrc": "334:117:8",
							"nodeType": "YulFunctionDefinition",
							"src": "334:117:8"
						},
						{
							"body": {
								"nativeSrc": "546:28:8",
								"nodeType": "YulBlock",
								"src": "546:28:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "563:1:8",
													"nodeType": "YulLiteral",
													"src": "563:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "566:1:8",
													"nodeType": "YulLiteral",
													"src": "566:1:8",
													"type": "",
													"value": "0"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "556:6:8",
												"nodeType": "YulIdentifier",
												"src": "556:6:8"
											},
											"nativeSrc": "556:12:8",
											"nodeType": "YulFunctionCall",
											"src": "556:12:8"
										},
										"nativeSrc": "556:12:8",
										"nodeType": "YulExpressionStatement",
										"src": "556:12:8"
									}
								]
							},
							"name": "revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae",
							"nativeSrc": "457:117:8",
							"nodeType": "YulFunctionDefinition",
							"src": "457:117:8"
						},
						{
							"body": {
								"nativeSrc": "628:54:8",
								"nodeType": "YulBlock",
								"src": "628:54:8",
								"statements": [
									{
										"nativeSrc": "638:38:8",
										"nodeType": "YulAssignment",
										"src": "638:38:8",
										"value": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "656:5:8",
															"nodeType": "YulIdentifier",
															"src": "656:5:8"
														},
														{
															"kind": "number",
															"nativeSrc": "663:2:8",
															"nodeType": "YulLiteral",
															"src": "663:2:8",
															"type": "",
															"value": "31"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "652:3:8",
														"nodeType": "YulIdentifier",
														"src": "652:3:8"
													},
													"nativeSrc": "652:14:8",
													"nodeType": "YulFunctionCall",
													"src": "652:14:8"
												},
												{
													"arguments": [
														{
															"kind": "number",
															"nativeSrc": "672:2:8",
															"nodeType": "YulLiteral",
															"src": "672:2:8",
															"type": "",
															"value": "31"
														}
													],
													"functionName": {
														"name": "not",
														"nativeSrc": "668:3:8",
														"nodeType": "YulIdentifier",
														"src": "668:3:8"
													},
													"nativeSrc": "668:7:8",
													"nodeType": "YulFunctionCall",
													"src": "668:7:8"
												}
											],
											"functionName": {
												"name": "and",
												"nativeSrc": "648:3:8",
												"nodeType": "YulIdentifier",
												"src": "648:3:8"
											},
											"nativeSrc": "648:28:8",
											"nodeType": "YulFunctionCall",
											"src": "648:28:8"
										},
										"variableNames": [
											{
												"name": "result",
												"nativeSrc": "638:6:8",
												"nodeType": "YulIdentifier",
												"src": "638:6:8"
											}
										]
									}
								]
							},
							"name": "round_up_to_mul_of_32",
							"nativeSrc": "580:102:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "611:5:8",
									"nodeType": "YulTypedName",
									"src": "611:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "result",
									"nativeSrc": "621:6:8",
									"nodeType": "YulTypedName",
									"src": "621:6:8",
									"type": ""
								}
							],
							"src": "580:102:8"
						},
						{
							"body": {
								"nativeSrc": "716:152:8",
								"nodeType": "YulBlock",
								"src": "716:152:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "733:1:8",
													"nodeType": "YulLiteral",
													"src": "733:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "736:77:8",
													"nodeType": "YulLiteral",
													"src": "736:77:8",
													"type": "",
													"value": "35408467139433450592217433187231851964531694900788300625387963629091585785856"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "726:6:8",
												"nodeType": "YulIdentifier",
												"src": "726:6:8"
											},
											"nativeSrc": "726:88:8",
											"nodeType": "YulFunctionCall",
											"src": "726:88:8"
										},
										"nativeSrc": "726:88:8",
										"nodeType": "YulExpressionStatement",
										"src": "726:88:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "830:1:8",
													"nodeType": "YulLiteral",
													"src": "830:1:8",
													"type": "",
													"value": "4"
												},
												{
													"kind": "number",
													"nativeSrc": "833:4:8",
													"nodeType": "YulLiteral",
													"src": "833:4:8",
													"type": "",
													"value": "0x41"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "823:6:8",
												"nodeType": "YulIdentifier",
												"src": "823:6:8"
											},
											"nativeSrc": "823:15:8",
											"nodeType": "YulFunctionCall",
											"src": "823:15:8"
										},
										"nativeSrc": "823:15:8",
										"nodeType": "YulExpressionStatement",
										"src": "823:15:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "854:1:8",
													"nodeType": "YulLiteral",
													"src": "854:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "857:4:8",
													"nodeType": "YulLiteral",
													"src": "857:4:8",
													"type": "",
													"value": "0x24"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "847:6:8",
												"nodeType": "YulIdentifier",
												"src": "847:6:8"
											},
											"nativeSrc": "847:15:8",
											"nodeType": "YulFunctionCall",
											"src": "847:15:8"
										},
										"nativeSrc": "847:15:8",
										"nodeType": "YulExpressionStatement",
										"src": "847:15:8"
									}
								]
							},
							"name": "panic_error_0x41",
							"nativeSrc": "688:180:8",
							"nodeType": "YulFunctionDefinition",
							"src": "688:180:8"
						},
						{
							"body": {
								"nativeSrc": "917:238:8",
								"nodeType": "YulBlock",
								"src": "917:238:8",
								"statements": [
									{
										"nativeSrc": "927:58:8",
										"nodeType": "YulVariableDeclaration",
										"src": "927:58:8",
										"value": {
											"arguments": [
												{
													"name": "memPtr",
													"nativeSrc": "949:6:8",
													"nodeType": "YulIdentifier",
													"src": "949:6:8"
												},
												{
													"arguments": [
														{
															"name": "size",
															"nativeSrc": "979:4:8",
															"nodeType": "YulIdentifier",
															"src": "979:4:8"
														}
													],
													"functionName": {
														"name": "round_up_to_mul_of_32",
														"nativeSrc": "957:21:8",
														"nodeType": "YulIdentifier",
														"src": "957:21:8"
													},
													"nativeSrc": "957:27:8",
													"nodeType": "YulFunctionCall",
													"src": "957:27:8"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "945:3:8",
												"nodeType": "YulIdentifier",
												"src": "945:3:8"
											},
											"nativeSrc": "945:40:8",
											"nodeType": "YulFunctionCall",
											"src": "945:40:8"
										},
										"variables": [
											{
												"name": "newFreePtr",
												"nativeSrc": "931:10:8",
												"nodeType": "YulTypedName",
												"src": "931:10:8",
												"type": ""
											}
										]
									},
									{
										"body": {
											"nativeSrc": "1096:22:8",
											"nodeType": "YulBlock",
											"src": "1096:22:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "panic_error_0x41",
															"nativeSrc": "1098:16:8",
															"nodeType": "YulIdentifier",
															"src": "1098:16:8"
														},
														"nativeSrc": "1098:18:8",
														"nodeType": "YulFunctionCall",
														"src": "1098:18:8"
													},
													"nativeSrc": "1098:18:8",
													"nodeType": "YulExpressionStatement",
													"src": "1098:18:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "newFreePtr",
															"nativeSrc": "1039:10:8",
															"nodeType": "YulIdentifier",
															"src": "1039:10:8"
														},
														{
															"kind": "number",
															"nativeSrc": "1051:18:8",
															"nodeType": "YulLiteral",
															"src": "1051:18:8",
															"type": "",
															"value": "0xffffffffffffffff"
														}
													],
													"functionName": {
														"name": "gt",
														"nativeSrc": "1036:2:8",
														"nodeType": "YulIdentifier",
														"src": "1036:2:8"
													},
													"nativeSrc": "1036:34:8",
													"nodeType": "YulFunctionCall",
													"src": "1036:34:8"
												},
												{
													"arguments": [
														{
															"name": "newFreePtr",
															"nativeSrc": "1075:10:8",
															"nodeType": "YulIdentifier",
															"src": "1075:10:8"
														},
														{
															"name": "memPtr",
															"nativeSrc": "1087:6:8",
															"nodeType": "YulIdentifier",
															"src": "1087:6:8"
														}
													],
													"functionName": {
														"name": "lt",
														"nativeSrc": "1072:2:8",
														"nodeType": "YulIdentifier",
														"src": "1072:2:8"
													},
													"nativeSrc": "1072:22:8",
													"nodeType": "YulFunctionCall",
													"src": "1072:22:8"
												}
											],
											"functionName": {
												"name": "or",
												"nativeSrc": "1033:2:8",
												"nodeType": "YulIdentifier",
												"src": "1033:2:8"
											},
											"nativeSrc": "1033:62:8",
											"nodeType": "YulFunctionCall",
											"src": "1033:62:8"
										},
										"nativeSrc": "1030:88:8",
										"nodeType": "YulIf",
										"src": "1030:88:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "1134:2:8",
													"nodeType": "YulLiteral",
													"src": "1134:2:8",
													"type": "",
													"value": "64"
												},
												{
													"name": "newFreePtr",
													"nativeSrc": "1138:10:8",
													"nodeType": "YulIdentifier",
													"src": "1138:10:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "1127:6:8",
												"nodeType": "YulIdentifier",
												"src": "1127:6:8"
											},
											"nativeSrc": "1127:22:8",
											"nodeType": "YulFunctionCall",
											"src": "1127:22:8"
										},
										"nativeSrc": "1127:22:8",
										"nodeType": "YulExpressionStatement",
										"src": "1127:22:8"
									}
								]
							},
							"name": "finalize_allocation",
							"nativeSrc": "874:281:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "memPtr",
									"nativeSrc": "903:6:8",
									"nodeType": "YulTypedName",
									"src": "903:6:8",
									"type": ""
								},
								{
									"name": "size",
									"nativeSrc": "911:4:8",
									"nodeType": "YulTypedName",
									"src": "911:4:8",
									"type": ""
								}
							],
							"src": "874:281:8"
						},
						{
							"body": {
								"nativeSrc": "1202:88:8",
								"nodeType": "YulBlock",
								"src": "1202:88:8",
								"statements": [
									{
										"nativeSrc": "1212:30:8",
										"nodeType": "YulAssignment",
										"src": "1212:30:8",
										"value": {
											"arguments": [],
											"functionName": {
												"name": "allocate_unbounded",
												"nativeSrc": "1222:18:8",
												"nodeType": "YulIdentifier",
												"src": "1222:18:8"
											},
											"nativeSrc": "1222:20:8",
											"nodeType": "YulFunctionCall",
											"src": "1222:20:8"
										},
										"variableNames": [
											{
												"name": "memPtr",
												"nativeSrc": "1212:6:8",
												"nodeType": "YulIdentifier",
												"src": "1212:6:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "memPtr",
													"nativeSrc": "1271:6:8",
													"nodeType": "YulIdentifier",
													"src": "1271:6:8"
												},
												{
													"name": "size",
													"nativeSrc": "1279:4:8",
													"nodeType": "YulIdentifier",
													"src": "1279:4:8"
												}
											],
											"functionName": {
												"name": "finalize_allocation",
												"nativeSrc": "1251:19:8",
												"nodeType": "YulIdentifier",
												"src": "1251:19:8"
											},
											"nativeSrc": "1251:33:8",
											"nodeType": "YulFunctionCall",
											"src": "1251:33:8"
										},
										"nativeSrc": "1251:33:8",
										"nodeType": "YulExpressionStatement",
										"src": "1251:33:8"
									}
								]
							},
							"name": "allocate_memory",
							"nativeSrc": "1161:129:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "size",
									"nativeSrc": "1186:4:8",
									"nodeType": "YulTypedName",
									"src": "1186:4:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "memPtr",
									"nativeSrc": "1195:6:8",
									"nodeType": "YulTypedName",
									"src": "1195:6:8",
									"type": ""
								}
							],
							"src": "1161:129:8"
						},
						{
							"body": {
								"nativeSrc": "1363:241:8",
								"nodeType": "YulBlock",
								"src": "1363:241:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "1468:22:8",
											"nodeType": "YulBlock",
											"src": "1468:22:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "panic_error_0x41",
															"nativeSrc": "1470:16:8",
															"nodeType": "YulIdentifier",
															"src": "1470:16:8"
														},
														"nativeSrc": "1470:18:8",
														"nodeType": "YulFunctionCall",
														"src": "1470:18:8"
													},
													"nativeSrc": "1470:18:8",
													"nodeType": "YulExpressionStatement",
													"src": "1470:18:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "length",
													"nativeSrc": "1440:6:8",
													"nodeType": "YulIdentifier",
													"src": "1440:6:8"
												},
												{
													"kind": "number",
													"nativeSrc": "1448:18:8",
													"nodeType": "YulLiteral",
													"src": "1448:18:8",
													"type": "",
													"value": "0xffffffffffffffff"
												}
											],
											"functionName": {
												"name": "gt",
												"nativeSrc": "1437:2:8",
												"nodeType": "YulIdentifier",
												"src": "1437:2:8"
											},
											"nativeSrc": "1437:30:8",
											"nodeType": "YulFunctionCall",
											"src": "1437:30:8"
										},
										"nativeSrc": "1434:56:8",
										"nodeType": "YulIf",
										"src": "1434:56:8"
									},
									{
										"nativeSrc": "1500:37:8",
										"nodeType": "YulAssignment",
										"src": "1500:37:8",
										"value": {
											"arguments": [
												{
													"name": "length",
													"nativeSrc": "1530:6:8",
													"nodeType": "YulIdentifier",
													"src": "1530:6:8"
												}
											],
											"functionName": {
												"name": "round_up_to_mul_of_32",
												"nativeSrc": "1508:21:8",
												"nodeType": "YulIdentifier",
												"src": "1508:21:8"
											},
											"nativeSrc": "1508:29:8",
											"nodeType": "YulFunctionCall",
											"src": "1508:29:8"
										},
										"variableNames": [
											{
												"name": "size",
												"nativeSrc": "1500:4:8",
												"nodeType": "YulIdentifier",
												"src": "1500:4:8"
											}
										]
									},
									{
										"nativeSrc": "1574:23:8",
										"nodeType": "YulAssignment",
										"src": "1574:23:8",
										"value": {
											"arguments": [
												{
													"name": "size",
													"nativeSrc": "1586:4:8",
													"nodeType": "YulIdentifier",
													"src": "1586:4:8"
												},
												{
													"kind": "number",
													"nativeSrc": "1592:4:8",
													"nodeType": "YulLiteral",
													"src": "1592:4:8",
													"type": "",
													"value": "0x20"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "1582:3:8",
												"nodeType": "YulIdentifier",
												"src": "1582:3:8"
											},
											"nativeSrc": "1582:15:8",
											"nodeType": "YulFunctionCall",
											"src": "1582:15:8"
										},
										"variableNames": [
											{
												"name": "size",
												"nativeSrc": "1574:4:8",
												"nodeType": "YulIdentifier",
												"src": "1574:4:8"
											}
										]
									}
								]
							},
							"name": "array_allocation_size_t_string_memory_ptr",
							"nativeSrc": "1296:308:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "length",
									"nativeSrc": "1347:6:8",
									"nodeType": "YulTypedName",
									"src": "1347:6:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "size",
									"nativeSrc": "1358:4:8",
									"nodeType": "YulTypedName",
									"src": "1358:4:8",
									"type": ""
								}
							],
							"src": "1296:308:8"
						},
						{
							"body": {
								"nativeSrc": "1672:184:8",
								"nodeType": "YulBlock",
								"src": "1672:184:8",
								"statements": [
									{
										"nativeSrc": "1682:10:8",
										"nodeType": "YulVariableDeclaration",
										"src": "1682:10:8",
										"value": {
											"kind": "number",
											"nativeSrc": "1691:1:8",
											"nodeType": "YulLiteral",
											"src": "1691:1:8",
											"type": "",
											"value": "0"
										},
										"variables": [
											{
												"name": "i",
												"nativeSrc": "1686:1:8",
												"nodeType": "YulTypedName",
												"src": "1686:1:8",
												"type": ""
											}
										]
									},
									{
										"body": {
											"nativeSrc": "1751:63:8",
											"nodeType": "YulBlock",
											"src": "1751:63:8",
											"statements": [
												{
													"expression": {
														"arguments": [
															{
																"arguments": [
																	{
																		"name": "dst",
																		"nativeSrc": "1776:3:8",
																		"nodeType": "YulIdentifier",
																		"src": "1776:3:8"
																	},
																	{
																		"name": "i",
																		"nativeSrc": "1781:1:8",
																		"nodeType": "YulIdentifier",
																		"src": "1781:1:8"
																	}
																],
																"functionName": {
																	"name": "add",
																	"nativeSrc": "1772:3:8",
																	"nodeType": "YulIdentifier",
																	"src": "1772:3:8"
																},
																"nativeSrc": "1772:11:8",
																"nodeType": "YulFunctionCall",
																"src": "1772:11:8"
															},
															{
																"arguments": [
																	{
																		"arguments": [
																			{
																				"name": "src",
																				"nativeSrc": "1795:3:8",
																				"nodeType": "YulIdentifier",
																				"src": "1795:3:8"
																			},
																			{
																				"name": "i",
																				"nativeSrc": "1800:1:8",
																				"nodeType": "YulIdentifier",
																				"src": "1800:1:8"
																			}
																		],
																		"functionName": {
																			"name": "add",
																			"nativeSrc": "1791:3:8",
																			"nodeType": "YulIdentifier",
																			"src": "1791:3:8"
																		},
																		"nativeSrc": "1791:11:8",
																		"nodeType": "YulFunctionCall",
																		"src": "1791:11:8"
																	}
																],
																"functionName": {
																	"name": "mload",
																	"nativeSrc": "1785:5:8",
																	"nodeType": "YulIdentifier",
																	"src": "1785:5:8"
																},
																"nativeSrc": "1785:18:8",
																"nodeType": "YulFunctionCall",
																"src": "1785:18:8"
															}
														],
														"functionName": {
															"name": "mstore",
															"nativeSrc": "1765:6:8",
															"nodeType": "YulIdentifier",
															"src": "1765:6:8"
														},
														"nativeSrc": "1765:39:8",
														"nodeType": "YulFunctionCall",
														"src": "1765:39:8"
													},
													"nativeSrc": "1765:39:8",
													"nodeType": "YulExpressionStatement",
													"src": "1765:39:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "i",
													"nativeSrc": "1712:1:8",
													"nodeType": "YulIdentifier",
													"src": "1712:1:8"
												},
												{
													"name": "length",
													"nativeSrc": "1715:6:8",
													"nodeType": "YulIdentifier",
													"src": "1715:6:8"
												}
											],
											"functionName": {
												"name": "lt",
												"nativeSrc": "1709:2:8",
												"nodeType": "YulIdentifier",
												"src": "1709:2:8"
											},
											"nativeSrc": "1709:13:8",
											"nodeType": "YulFunctionCall",
											"src": "1709:13:8"
										},
										"nativeSrc": "1701:113:8",
										"nodeType": "YulForLoop",
										"post": {
											"nativeSrc": "1723:19:8",
											"nodeType": "YulBlock",
											"src": "1723:19:8",
											"statements": [
												{
													"nativeSrc": "1725:15:8",
													"nodeType": "YulAssignment",
													"src": "1725:15:8",
													"value": {
														"arguments": [
															{
																"name": "i",
																"nativeSrc": "1734:1:8",
																"nodeType": "YulIdentifier",
																"src": "1734:1:8"
															},
															{
																"kind": "number",
																"nativeSrc": "1737:2:8",
																"nodeType": "YulLiteral",
																"src": "1737:2:8",
																"type": "",
																"value": "32"
															}
														],
														"functionName": {
															"name": "add",
															"nativeSrc": "1730:3:8",
															"nodeType": "YulIdentifier",
															"src": "1730:3:8"
														},
														"nativeSrc": "1730:10:8",
														"nodeType": "YulFunctionCall",
														"src": "1730:10:8"
													},
													"variableNames": [
														{
															"name": "i",
															"nativeSrc": "1725:1:8",
															"nodeType": "YulIdentifier",
															"src": "1725:1:8"
														}
													]
												}
											]
										},
										"pre": {
											"nativeSrc": "1705:3:8",
											"nodeType": "YulBlock",
											"src": "1705:3:8",
											"statements": []
										},
										"src": "1701:113:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "dst",
															"nativeSrc": "1834:3:8",
															"nodeType": "YulIdentifier",
															"src": "1834:3:8"
														},
														{
															"name": "length",
															"nativeSrc": "1839:6:8",
															"nodeType": "YulIdentifier",
															"src": "1839:6:8"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "1830:3:8",
														"nodeType": "YulIdentifier",
														"src": "1830:3:8"
													},
													"nativeSrc": "1830:16:8",
													"nodeType": "YulFunctionCall",
													"src": "1830:16:8"
												},
												{
													"kind": "number",
													"nativeSrc": "1848:1:8",
													"nodeType": "YulLiteral",
													"src": "1848:1:8",
													"type": "",
													"value": "0"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "1823:6:8",
												"nodeType": "YulIdentifier",
												"src": "1823:6:8"
											},
											"nativeSrc": "1823:27:8",
											"nodeType": "YulFunctionCall",
											"src": "1823:27:8"
										},
										"nativeSrc": "1823:27:8",
										"nodeType": "YulExpressionStatement",
										"src": "1823:27:8"
									}
								]
							},
							"name": "copy_memory_to_memory_with_cleanup",
							"nativeSrc": "1610:246:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "src",
									"nativeSrc": "1654:3:8",
									"nodeType": "YulTypedName",
									"src": "1654:3:8",
									"type": ""
								},
								{
									"name": "dst",
									"nativeSrc": "1659:3:8",
									"nodeType": "YulTypedName",
									"src": "1659:3:8",
									"type": ""
								},
								{
									"name": "length",
									"nativeSrc": "1664:6:8",
									"nodeType": "YulTypedName",
									"src": "1664:6:8",
									"type": ""
								}
							],
							"src": "1610:246:8"
						},
						{
							"body": {
								"nativeSrc": "1957:339:8",
								"nodeType": "YulBlock",
								"src": "1957:339:8",
								"statements": [
									{
										"nativeSrc": "1967:75:8",
										"nodeType": "YulAssignment",
										"src": "1967:75:8",
										"value": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "length",
															"nativeSrc": "2034:6:8",
															"nodeType": "YulIdentifier",
															"src": "2034:6:8"
														}
													],
													"functionName": {
														"name": "array_allocation_size_t_string_memory_ptr",
														"nativeSrc": "1992:41:8",
														"nodeType": "YulIdentifier",
														"src": "1992:41:8"
													},
													"nativeSrc": "1992:49:8",
													"nodeType": "YulFunctionCall",
													"src": "1992:49:8"
												}
											],
											"functionName": {
												"name": "allocate_memory",
												"nativeSrc": "1976:15:8",
												"nodeType": "YulIdentifier",
												"src": "1976:15:8"
											},
											"nativeSrc": "1976:66:8",
											"nodeType": "YulFunctionCall",
											"src": "1976:66:8"
										},
										"variableNames": [
											{
												"name": "array",
												"nativeSrc": "1967:5:8",
												"nodeType": "YulIdentifier",
												"src": "1967:5:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "array",
													"nativeSrc": "2058:5:8",
													"nodeType": "YulIdentifier",
													"src": "2058:5:8"
												},
												{
													"name": "length",
													"nativeSrc": "2065:6:8",
													"nodeType": "YulIdentifier",
													"src": "2065:6:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "2051:6:8",
												"nodeType": "YulIdentifier",
												"src": "2051:6:8"
											},
											"nativeSrc": "2051:21:8",
											"nodeType": "YulFunctionCall",
											"src": "2051:21:8"
										},
										"nativeSrc": "2051:21:8",
										"nodeType": "YulExpressionStatement",
										"src": "2051:21:8"
									},
									{
										"nativeSrc": "2081:27:8",
										"nodeType": "YulVariableDeclaration",
										"src": "2081:27:8",
										"value": {
											"arguments": [
												{
													"name": "array",
													"nativeSrc": "2096:5:8",
													"nodeType": "YulIdentifier",
													"src": "2096:5:8"
												},
												{
													"kind": "number",
													"nativeSrc": "2103:4:8",
													"nodeType": "YulLiteral",
													"src": "2103:4:8",
													"type": "",
													"value": "0x20"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "2092:3:8",
												"nodeType": "YulIdentifier",
												"src": "2092:3:8"
											},
											"nativeSrc": "2092:16:8",
											"nodeType": "YulFunctionCall",
											"src": "2092:16:8"
										},
										"variables": [
											{
												"name": "dst",
												"nativeSrc": "2085:3:8",
												"nodeType": "YulTypedName",
												"src": "2085:3:8",
												"type": ""
											}
										]
									},
									{
										"body": {
											"nativeSrc": "2146:83:8",
											"nodeType": "YulBlock",
											"src": "2146:83:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae",
															"nativeSrc": "2148:77:8",
															"nodeType": "YulIdentifier",
															"src": "2148:77:8"
														},
														"nativeSrc": "2148:79:8",
														"nodeType": "YulFunctionCall",
														"src": "2148:79:8"
													},
													"nativeSrc": "2148:79:8",
													"nodeType": "YulExpressionStatement",
													"src": "2148:79:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "src",
															"nativeSrc": "2127:3:8",
															"nodeType": "YulIdentifier",
															"src": "2127:3:8"
														},
														{
															"name": "length",
															"nativeSrc": "2132:6:8",
															"nodeType": "YulIdentifier",
															"src": "2132:6:8"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "2123:3:8",
														"nodeType": "YulIdentifier",
														"src": "2123:3:8"
													},
													"nativeSrc": "2123:16:8",
													"nodeType": "YulFunctionCall",
													"src": "2123:16:8"
												},
												{
													"name": "end",
													"nativeSrc": "2141:3:8",
													"nodeType": "YulIdentifier",
													"src": "2141:3:8"
												}
											],
											"functionName": {
												"name": "gt",
												"nativeSrc": "2120:2:8",
												"nodeType": "YulIdentifier",
												"src": "2120:2:8"
											},
											"nativeSrc": "2120:25:8",
											"nodeType": "YulFunctionCall",
											"src": "2120:25:8"
										},
										"nativeSrc": "2117:112:8",
										"nodeType": "YulIf",
										"src": "2117:112:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "src",
													"nativeSrc": "2273:3:8",
													"nodeType": "YulIdentifier",
													"src": "2273:3:8"
												},
												{
													"name": "dst",
													"nativeSrc": "2278:3:8",
													"nodeType": "YulIdentifier",
													"src": "2278:3:8"
												},
												{
													"name": "length",
													"nativeSrc": "2283:6:8",
													"nodeType": "YulIdentifier",
													"src": "2283:6:8"
												}
											],
											"functionName": {
												"name": "copy_memory_to_memory_with_cleanup",
												"nativeSrc": "2238:34:8",
												"nodeType": "YulIdentifier",
												"src": "2238:34:8"
											},
											"nativeSrc": "2238:52:8",
											"nodeType": "YulFunctionCall",
											"src": "2238:52:8"
										},
										"nativeSrc": "2238:52:8",
										"nodeType": "YulExpressionStatement",
										"src": "2238:52:8"
									}
								]
							},
							"name": "abi_decode_available_length_t_string_memory_ptr_fromMemory",
							"nativeSrc": "1862:434:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "src",
									"nativeSrc": "1930:3:8",
									"nodeType": "YulTypedName",
									"src": "1930:3:8",
									"type": ""
								},
								{
									"name": "length",
									"nativeSrc": "1935:6:8",
									"nodeType": "YulTypedName",
									"src": "1935:6:8",
									"type": ""
								},
								{
									"name": "end",
									"nativeSrc": "1943:3:8",
									"nodeType": "YulTypedName",
									"src": "1943:3:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "array",
									"nativeSrc": "1951:5:8",
									"nodeType": "YulTypedName",
									"src": "1951:5:8",
									"type": ""
								}
							],
							"src": "1862:434:8"
						},
						{
							"body": {
								"nativeSrc": "2389:282:8",
								"nodeType": "YulBlock",
								"src": "2389:282:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "2438:83:8",
											"nodeType": "YulBlock",
											"src": "2438:83:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d",
															"nativeSrc": "2440:77:8",
															"nodeType": "YulIdentifier",
															"src": "2440:77:8"
														},
														"nativeSrc": "2440:79:8",
														"nodeType": "YulFunctionCall",
														"src": "2440:79:8"
													},
													"nativeSrc": "2440:79:8",
													"nodeType": "YulExpressionStatement",
													"src": "2440:79:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"arguments": [
																{
																	"name": "offset",
																	"nativeSrc": "2417:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "2417:6:8"
																},
																{
																	"kind": "number",
																	"nativeSrc": "2425:4:8",
																	"nodeType": "YulLiteral",
																	"src": "2425:4:8",
																	"type": "",
																	"value": "0x1f"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "2413:3:8",
																"nodeType": "YulIdentifier",
																"src": "2413:3:8"
															},
															"nativeSrc": "2413:17:8",
															"nodeType": "YulFunctionCall",
															"src": "2413:17:8"
														},
														{
															"name": "end",
															"nativeSrc": "2432:3:8",
															"nodeType": "YulIdentifier",
															"src": "2432:3:8"
														}
													],
													"functionName": {
														"name": "slt",
														"nativeSrc": "2409:3:8",
														"nodeType": "YulIdentifier",
														"src": "2409:3:8"
													},
													"nativeSrc": "2409:27:8",
													"nodeType": "YulFunctionCall",
													"src": "2409:27:8"
												}
											],
											"functionName": {
												"name": "iszero",
												"nativeSrc": "2402:6:8",
												"nodeType": "YulIdentifier",
												"src": "2402:6:8"
											},
											"nativeSrc": "2402:35:8",
											"nodeType": "YulFunctionCall",
											"src": "2402:35:8"
										},
										"nativeSrc": "2399:122:8",
										"nodeType": "YulIf",
										"src": "2399:122:8"
									},
									{
										"nativeSrc": "2530:27:8",
										"nodeType": "YulVariableDeclaration",
										"src": "2530:27:8",
										"value": {
											"arguments": [
												{
													"name": "offset",
													"nativeSrc": "2550:6:8",
													"nodeType": "YulIdentifier",
													"src": "2550:6:8"
												}
											],
											"functionName": {
												"name": "mload",
												"nativeSrc": "2544:5:8",
												"nodeType": "YulIdentifier",
												"src": "2544:5:8"
											},
											"nativeSrc": "2544:13:8",
											"nodeType": "YulFunctionCall",
											"src": "2544:13:8"
										},
										"variables": [
											{
												"name": "length",
												"nativeSrc": "2534:6:8",
												"nodeType": "YulTypedName",
												"src": "2534:6:8",
												"type": ""
											}
										]
									},
									{
										"nativeSrc": "2566:99:8",
										"nodeType": "YulAssignment",
										"src": "2566:99:8",
										"value": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "offset",
															"nativeSrc": "2638:6:8",
															"nodeType": "YulIdentifier",
															"src": "2638:6:8"
														},
														{
															"kind": "number",
															"nativeSrc": "2646:4:8",
															"nodeType": "YulLiteral",
															"src": "2646:4:8",
															"type": "",
															"value": "0x20"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "2634:3:8",
														"nodeType": "YulIdentifier",
														"src": "2634:3:8"
													},
													"nativeSrc": "2634:17:8",
													"nodeType": "YulFunctionCall",
													"src": "2634:17:8"
												},
												{
													"name": "length",
													"nativeSrc": "2653:6:8",
													"nodeType": "YulIdentifier",
													"src": "2653:6:8"
												},
												{
													"name": "end",
													"nativeSrc": "2661:3:8",
													"nodeType": "YulIdentifier",
													"src": "2661:3:8"
												}
											],
											"functionName": {
												"name": "abi_decode_available_length_t_string_memory_ptr_fromMemory",
												"nativeSrc": "2575:58:8",
												"nodeType": "YulIdentifier",
												"src": "2575:58:8"
											},
											"nativeSrc": "2575:90:8",
											"nodeType": "YulFunctionCall",
											"src": "2575:90:8"
										},
										"variableNames": [
											{
												"name": "array",
												"nativeSrc": "2566:5:8",
												"nodeType": "YulIdentifier",
												"src": "2566:5:8"
											}
										]
									}
								]
							},
							"name": "abi_decode_t_string_memory_ptr_fromMemory",
							"nativeSrc": "2316:355:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "offset",
									"nativeSrc": "2367:6:8",
									"nodeType": "YulTypedName",
									"src": "2367:6:8",
									"type": ""
								},
								{
									"name": "end",
									"nativeSrc": "2375:3:8",
									"nodeType": "YulTypedName",
									"src": "2375:3:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "array",
									"nativeSrc": "2383:5:8",
									"nodeType": "YulTypedName",
									"src": "2383:5:8",
									"type": ""
								}
							],
							"src": "2316:355:8"
						},
						{
							"body": {
								"nativeSrc": "2791:739:8",
								"nodeType": "YulBlock",
								"src": "2791:739:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "2837:83:8",
											"nodeType": "YulBlock",
											"src": "2837:83:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
															"nativeSrc": "2839:77:8",
															"nodeType": "YulIdentifier",
															"src": "2839:77:8"
														},
														"nativeSrc": "2839:79:8",
														"nodeType": "YulFunctionCall",
														"src": "2839:79:8"
													},
													"nativeSrc": "2839:79:8",
													"nodeType": "YulExpressionStatement",
													"src": "2839:79:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "dataEnd",
															"nativeSrc": "2812:7:8",
															"nodeType": "YulIdentifier",
															"src": "2812:7:8"
														},
														{
															"name": "headStart",
															"nativeSrc": "2821:9:8",
															"nodeType": "YulIdentifier",
															"src": "2821:9:8"
														}
													],
													"functionName": {
														"name": "sub",
														"nativeSrc": "2808:3:8",
														"nodeType": "YulIdentifier",
														"src": "2808:3:8"
													},
													"nativeSrc": "2808:23:8",
													"nodeType": "YulFunctionCall",
													"src": "2808:23:8"
												},
												{
													"kind": "number",
													"nativeSrc": "2833:2:8",
													"nodeType": "YulLiteral",
													"src": "2833:2:8",
													"type": "",
													"value": "64"
												}
											],
											"functionName": {
												"name": "slt",
												"nativeSrc": "2804:3:8",
												"nodeType": "YulIdentifier",
												"src": "2804:3:8"
											},
											"nativeSrc": "2804:32:8",
											"nodeType": "YulFunctionCall",
											"src": "2804:32:8"
										},
										"nativeSrc": "2801:119:8",
										"nodeType": "YulIf",
										"src": "2801:119:8"
									},
									{
										"nativeSrc": "2930:291:8",
										"nodeType": "YulBlock",
										"src": "2930:291:8",
										"statements": [
											{
												"nativeSrc": "2945:38:8",
												"nodeType": "YulVariableDeclaration",
												"src": "2945:38:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "2969:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "2969:9:8"
																},
																{
																	"kind": "number",
																	"nativeSrc": "2980:1:8",
																	"nodeType": "YulLiteral",
																	"src": "2980:1:8",
																	"type": "",
																	"value": "0"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "2965:3:8",
																"nodeType": "YulIdentifier",
																"src": "2965:3:8"
															},
															"nativeSrc": "2965:17:8",
															"nodeType": "YulFunctionCall",
															"src": "2965:17:8"
														}
													],
													"functionName": {
														"name": "mload",
														"nativeSrc": "2959:5:8",
														"nodeType": "YulIdentifier",
														"src": "2959:5:8"
													},
													"nativeSrc": "2959:24:8",
													"nodeType": "YulFunctionCall",
													"src": "2959:24:8"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "2949:6:8",
														"nodeType": "YulTypedName",
														"src": "2949:6:8",
														"type": ""
													}
												]
											},
											{
												"body": {
													"nativeSrc": "3030:83:8",
													"nodeType": "YulBlock",
													"src": "3030:83:8",
													"statements": [
														{
															"expression": {
																"arguments": [],
																"functionName": {
																	"name": "revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db",
																	"nativeSrc": "3032:77:8",
																	"nodeType": "YulIdentifier",
																	"src": "3032:77:8"
																},
																"nativeSrc": "3032:79:8",
																"nodeType": "YulFunctionCall",
																"src": "3032:79:8"
															},
															"nativeSrc": "3032:79:8",
															"nodeType": "YulExpressionStatement",
															"src": "3032:79:8"
														}
													]
												},
												"condition": {
													"arguments": [
														{
															"name": "offset",
															"nativeSrc": "3002:6:8",
															"nodeType": "YulIdentifier",
															"src": "3002:6:8"
														},
														{
															"kind": "number",
															"nativeSrc": "3010:18:8",
															"nodeType": "YulLiteral",
															"src": "3010:18:8",
															"type": "",
															"value": "0xffffffffffffffff"
														}
													],
													"functionName": {
														"name": "gt",
														"nativeSrc": "2999:2:8",
														"nodeType": "YulIdentifier",
														"src": "2999:2:8"
													},
													"nativeSrc": "2999:30:8",
													"nodeType": "YulFunctionCall",
													"src": "2999:30:8"
												},
												"nativeSrc": "2996:117:8",
												"nodeType": "YulIf",
												"src": "2996:117:8"
											},
											{
												"nativeSrc": "3127:84:8",
												"nodeType": "YulAssignment",
												"src": "3127:84:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "3183:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "3183:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "3194:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "3194:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "3179:3:8",
																"nodeType": "YulIdentifier",
																"src": "3179:3:8"
															},
															"nativeSrc": "3179:22:8",
															"nodeType": "YulFunctionCall",
															"src": "3179:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "3203:7:8",
															"nodeType": "YulIdentifier",
															"src": "3203:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_string_memory_ptr_fromMemory",
														"nativeSrc": "3137:41:8",
														"nodeType": "YulIdentifier",
														"src": "3137:41:8"
													},
													"nativeSrc": "3137:74:8",
													"nodeType": "YulFunctionCall",
													"src": "3137:74:8"
												},
												"variableNames": [
													{
														"name": "value0",
														"nativeSrc": "3127:6:8",
														"nodeType": "YulIdentifier",
														"src": "3127:6:8"
													}
												]
											}
										]
									},
									{
										"nativeSrc": "3231:292:8",
										"nodeType": "YulBlock",
										"src": "3231:292:8",
										"statements": [
											{
												"nativeSrc": "3246:39:8",
												"nodeType": "YulVariableDeclaration",
												"src": "3246:39:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "3270:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "3270:9:8"
																},
																{
																	"kind": "number",
																	"nativeSrc": "3281:2:8",
																	"nodeType": "YulLiteral",
																	"src": "3281:2:8",
																	"type": "",
																	"value": "32"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "3266:3:8",
																"nodeType": "YulIdentifier",
																"src": "3266:3:8"
															},
															"nativeSrc": "3266:18:8",
															"nodeType": "YulFunctionCall",
															"src": "3266:18:8"
														}
													],
													"functionName": {
														"name": "mload",
														"nativeSrc": "3260:5:8",
														"nodeType": "YulIdentifier",
														"src": "3260:5:8"
													},
													"nativeSrc": "3260:25:8",
													"nodeType": "YulFunctionCall",
													"src": "3260:25:8"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "3250:6:8",
														"nodeType": "YulTypedName",
														"src": "3250:6:8",
														"type": ""
													}
												]
											},
											{
												"body": {
													"nativeSrc": "3332:83:8",
													"nodeType": "YulBlock",
													"src": "3332:83:8",
													"statements": [
														{
															"expression": {
																"arguments": [],
																"functionName": {
																	"name": "revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db",
																	"nativeSrc": "3334:77:8",
																	"nodeType": "YulIdentifier",
																	"src": "3334:77:8"
																},
																"nativeSrc": "3334:79:8",
																"nodeType": "YulFunctionCall",
																"src": "3334:79:8"
															},
															"nativeSrc": "3334:79:8",
															"nodeType": "YulExpressionStatement",
															"src": "3334:79:8"
														}
													]
												},
												"condition": {
													"arguments": [
														{
															"name": "offset",
															"nativeSrc": "3304:6:8",
															"nodeType": "YulIdentifier",
															"src": "3304:6:8"
														},
														{
															"kind": "number",
															"nativeSrc": "3312:18:8",
															"nodeType": "YulLiteral",
															"src": "3312:18:8",
															"type": "",
															"value": "0xffffffffffffffff"
														}
													],
													"functionName": {
														"name": "gt",
														"nativeSrc": "3301:2:8",
														"nodeType": "YulIdentifier",
														"src": "3301:2:8"
													},
													"nativeSrc": "3301:30:8",
													"nodeType": "YulFunctionCall",
													"src": "3301:30:8"
												},
												"nativeSrc": "3298:117:8",
												"nodeType": "YulIf",
												"src": "3298:117:8"
											},
											{
												"nativeSrc": "3429:84:8",
												"nodeType": "YulAssignment",
												"src": "3429:84:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "3485:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "3485:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "3496:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "3496:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "3481:3:8",
																"nodeType": "YulIdentifier",
																"src": "3481:3:8"
															},
															"nativeSrc": "3481:22:8",
															"nodeType": "YulFunctionCall",
															"src": "3481:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "3505:7:8",
															"nodeType": "YulIdentifier",
															"src": "3505:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_string_memory_ptr_fromMemory",
														"nativeSrc": "3439:41:8",
														"nodeType": "YulIdentifier",
														"src": "3439:41:8"
													},
													"nativeSrc": "3439:74:8",
													"nodeType": "YulFunctionCall",
													"src": "3439:74:8"
												},
												"variableNames": [
													{
														"name": "value1",
														"nativeSrc": "3429:6:8",
														"nodeType": "YulIdentifier",
														"src": "3429:6:8"
													}
												]
											}
										]
									}
								]
							},
							"name": "abi_decode_tuple_t_string_memory_ptrt_string_memory_ptr_fromMemory",
							"nativeSrc": "2677:853:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "2753:9:8",
									"nodeType": "YulTypedName",
									"src": "2753:9:8",
									"type": ""
								},
								{
									"name": "dataEnd",
									"nativeSrc": "2764:7:8",
									"nodeType": "YulTypedName",
									"src": "2764:7:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "value0",
									"nativeSrc": "2776:6:8",
									"nodeType": "YulTypedName",
									"src": "2776:6:8",
									"type": ""
								},
								{
									"name": "value1",
									"nativeSrc": "2784:6:8",
									"nodeType": "YulTypedName",
									"src": "2784:6:8",
									"type": ""
								}
							],
							"src": "2677:853:8"
						},
						{
							"body": {
								"nativeSrc": "3595:40:8",
								"nodeType": "YulBlock",
								"src": "3595:40:8",
								"statements": [
									{
										"nativeSrc": "3606:22:8",
										"nodeType": "YulAssignment",
										"src": "3606:22:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "3622:5:8",
													"nodeType": "YulIdentifier",
													"src": "3622:5:8"
												}
											],
											"functionName": {
												"name": "mload",
												"nativeSrc": "3616:5:8",
												"nodeType": "YulIdentifier",
												"src": "3616:5:8"
											},
											"nativeSrc": "3616:12:8",
											"nodeType": "YulFunctionCall",
											"src": "3616:12:8"
										},
										"variableNames": [
											{
												"name": "length",
												"nativeSrc": "3606:6:8",
												"nodeType": "YulIdentifier",
												"src": "3606:6:8"
											}
										]
									}
								]
							},
							"name": "array_length_t_string_memory_ptr",
							"nativeSrc": "3536:99:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "3578:5:8",
									"nodeType": "YulTypedName",
									"src": "3578:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "length",
									"nativeSrc": "3588:6:8",
									"nodeType": "YulTypedName",
									"src": "3588:6:8",
									"type": ""
								}
							],
							"src": "3536:99:8"
						},
						{
							"body": {
								"nativeSrc": "3669:152:8",
								"nodeType": "YulBlock",
								"src": "3669:152:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "3686:1:8",
													"nodeType": "YulLiteral",
													"src": "3686:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "3689:77:8",
													"nodeType": "YulLiteral",
													"src": "3689:77:8",
													"type": "",
													"value": "35408467139433450592217433187231851964531694900788300625387963629091585785856"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "3679:6:8",
												"nodeType": "YulIdentifier",
												"src": "3679:6:8"
											},
											"nativeSrc": "3679:88:8",
											"nodeType": "YulFunctionCall",
											"src": "3679:88:8"
										},
										"nativeSrc": "3679:88:8",
										"nodeType": "YulExpressionStatement",
										"src": "3679:88:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "3783:1:8",
													"nodeType": "YulLiteral",
													"src": "3783:1:8",
													"type": "",
													"value": "4"
												},
												{
													"kind": "number",
													"nativeSrc": "3786:4:8",
													"nodeType": "YulLiteral",
													"src": "3786:4:8",
													"type": "",
													"value": "0x22"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "3776:6:8",
												"nodeType": "YulIdentifier",
												"src": "3776:6:8"
											},
											"nativeSrc": "3776:15:8",
											"nodeType": "YulFunctionCall",
											"src": "3776:15:8"
										},
										"nativeSrc": "3776:15:8",
										"nodeType": "YulExpressionStatement",
										"src": "3776:15:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "3807:1:8",
													"nodeType": "YulLiteral",
													"src": "3807:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "3810:4:8",
													"nodeType": "YulLiteral",
													"src": "3810:4:8",
													"type": "",
													"value": "0x24"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "3800:6:8",
												"nodeType": "YulIdentifier",
												"src": "3800:6:8"
											},
											"nativeSrc": "3800:15:8",
											"nodeType": "YulFunctionCall",
											"src": "3800:15:8"
										},
										"nativeSrc": "3800:15:8",
										"nodeType": "YulExpressionStatement",
										"src": "3800:15:8"
									}
								]
							},
							"name": "panic_error_0x22",
							"nativeSrc": "3641:180:8",
							"nodeType": "YulFunctionDefinition",
							"src": "3641:180:8"
						},
						{
							"body": {
								"nativeSrc": "3878:269:8",
								"nodeType": "YulBlock",
								"src": "3878:269:8",
								"statements": [
									{
										"nativeSrc": "3888:22:8",
										"nodeType": "YulAssignment",
										"src": "3888:22:8",
										"value": {
											"arguments": [
												{
													"name": "data",
													"nativeSrc": "3902:4:8",
													"nodeType": "YulIdentifier",
													"src": "3902:4:8"
												},
												{
													"kind": "number",
													"nativeSrc": "3908:1:8",
													"nodeType": "YulLiteral",
													"src": "3908:1:8",
													"type": "",
													"value": "2"
												}
											],
											"functionName": {
												"name": "div",
												"nativeSrc": "3898:3:8",
												"nodeType": "YulIdentifier",
												"src": "3898:3:8"
											},
											"nativeSrc": "3898:12:8",
											"nodeType": "YulFunctionCall",
											"src": "3898:12:8"
										},
										"variableNames": [
											{
												"name": "length",
												"nativeSrc": "3888:6:8",
												"nodeType": "YulIdentifier",
												"src": "3888:6:8"
											}
										]
									},
									{
										"nativeSrc": "3919:38:8",
										"nodeType": "YulVariableDeclaration",
										"src": "3919:38:8",
										"value": {
											"arguments": [
												{
													"name": "data",
													"nativeSrc": "3949:4:8",
													"nodeType": "YulIdentifier",
													"src": "3949:4:8"
												},
												{
													"kind": "number",
													"nativeSrc": "3955:1:8",
													"nodeType": "YulLiteral",
													"src": "3955:1:8",
													"type": "",
													"value": "1"
												}
											],
											"functionName": {
												"name": "and",
												"nativeSrc": "3945:3:8",
												"nodeType": "YulIdentifier",
												"src": "3945:3:8"
											},
											"nativeSrc": "3945:12:8",
											"nodeType": "YulFunctionCall",
											"src": "3945:12:8"
										},
										"variables": [
											{
												"name": "outOfPlaceEncoding",
												"nativeSrc": "3923:18:8",
												"nodeType": "YulTypedName",
												"src": "3923:18:8",
												"type": ""
											}
										]
									},
									{
										"body": {
											"nativeSrc": "3996:51:8",
											"nodeType": "YulBlock",
											"src": "3996:51:8",
											"statements": [
												{
													"nativeSrc": "4010:27:8",
													"nodeType": "YulAssignment",
													"src": "4010:27:8",
													"value": {
														"arguments": [
															{
																"name": "length",
																"nativeSrc": "4024:6:8",
																"nodeType": "YulIdentifier",
																"src": "4024:6:8"
															},
															{
																"kind": "number",
																"nativeSrc": "4032:4:8",
																"nodeType": "YulLiteral",
																"src": "4032:4:8",
																"type": "",
																"value": "0x7f"
															}
														],
														"functionName": {
															"name": "and",
															"nativeSrc": "4020:3:8",
															"nodeType": "YulIdentifier",
															"src": "4020:3:8"
														},
														"nativeSrc": "4020:17:8",
														"nodeType": "YulFunctionCall",
														"src": "4020:17:8"
													},
													"variableNames": [
														{
															"name": "length",
															"nativeSrc": "4010:6:8",
															"nodeType": "YulIdentifier",
															"src": "4010:6:8"
														}
													]
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "outOfPlaceEncoding",
													"nativeSrc": "3976:18:8",
													"nodeType": "YulIdentifier",
													"src": "3976:18:8"
												}
											],
											"functionName": {
												"name": "iszero",
												"nativeSrc": "3969:6:8",
												"nodeType": "YulIdentifier",
												"src": "3969:6:8"
											},
											"nativeSrc": "3969:26:8",
											"nodeType": "YulFunctionCall",
											"src": "3969:26:8"
										},
										"nativeSrc": "3966:81:8",
										"nodeType": "YulIf",
										"src": "3966:81:8"
									},
									{
										"body": {
											"nativeSrc": "4099:42:8",
											"nodeType": "YulBlock",
											"src": "4099:42:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "panic_error_0x22",
															"nativeSrc": "4113:16:8",
															"nodeType": "YulIdentifier",
															"src": "4113:16:8"
														},
														"nativeSrc": "4113:18:8",
														"nodeType": "YulFunctionCall",
														"src": "4113:18:8"
													},
													"nativeSrc": "4113:18:8",
													"nodeType": "YulExpressionStatement",
													"src": "4113:18:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "outOfPlaceEncoding",
													"nativeSrc": "4063:18:8",
													"nodeType": "YulIdentifier",
													"src": "4063:18:8"
												},
												{
													"arguments": [
														{
															"name": "length",
															"nativeSrc": "4086:6:8",
															"nodeType": "YulIdentifier",
															"src": "4086:6:8"
														},
														{
															"kind": "number",
															"nativeSrc": "4094:2:8",
															"nodeType": "YulLiteral",
															"src": "4094:2:8",
															"type": "",
															"value": "32"
														}
													],
													"functionName": {
														"name": "lt",
														"nativeSrc": "4083:2:8",
														"nodeType": "YulIdentifier",
														"src": "4083:2:8"
													},
													"nativeSrc": "4083:14:8",
													"nodeType": "YulFunctionCall",
													"src": "4083:14:8"
												}
											],
											"functionName": {
												"name": "eq",
												"nativeSrc": "4060:2:8",
												"nodeType": "YulIdentifier",
												"src": "4060:2:8"
											},
											"nativeSrc": "4060:38:8",
											"nodeType": "YulFunctionCall",
											"src": "4060:38:8"
										},
										"nativeSrc": "4057:84:8",
										"nodeType": "YulIf",
										"src": "4057:84:8"
									}
								]
							},
							"name": "extract_byte_array_length",
							"nativeSrc": "3827:320:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "data",
									"nativeSrc": "3862:4:8",
									"nodeType": "YulTypedName",
									"src": "3862:4:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "length",
									"nativeSrc": "3871:6:8",
									"nodeType": "YulTypedName",
									"src": "3871:6:8",
									"type": ""
								}
							],
							"src": "3827:320:8"
						},
						{
							"body": {
								"nativeSrc": "4207:87:8",
								"nodeType": "YulBlock",
								"src": "4207:87:8",
								"statements": [
									{
										"nativeSrc": "4217:11:8",
										"nodeType": "YulAssignment",
										"src": "4217:11:8",
										"value": {
											"name": "ptr",
											"nativeSrc": "4225:3:8",
											"nodeType": "YulIdentifier",
											"src": "4225:3:8"
										},
										"variableNames": [
											{
												"name": "data",
												"nativeSrc": "4217:4:8",
												"nodeType": "YulIdentifier",
												"src": "4217:4:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "4245:1:8",
													"nodeType": "YulLiteral",
													"src": "4245:1:8",
													"type": "",
													"value": "0"
												},
												{
													"name": "ptr",
													"nativeSrc": "4248:3:8",
													"nodeType": "YulIdentifier",
													"src": "4248:3:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "4238:6:8",
												"nodeType": "YulIdentifier",
												"src": "4238:6:8"
											},
											"nativeSrc": "4238:14:8",
											"nodeType": "YulFunctionCall",
											"src": "4238:14:8"
										},
										"nativeSrc": "4238:14:8",
										"nodeType": "YulExpressionStatement",
										"src": "4238:14:8"
									},
									{
										"nativeSrc": "4261:26:8",
										"nodeType": "YulAssignment",
										"src": "4261:26:8",
										"value": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "4279:1:8",
													"nodeType": "YulLiteral",
													"src": "4279:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "4282:4:8",
													"nodeType": "YulLiteral",
													"src": "4282:4:8",
													"type": "",
													"value": "0x20"
												}
											],
											"functionName": {
												"name": "keccak256",
												"nativeSrc": "4269:9:8",
												"nodeType": "YulIdentifier",
												"src": "4269:9:8"
											},
											"nativeSrc": "4269:18:8",
											"nodeType": "YulFunctionCall",
											"src": "4269:18:8"
										},
										"variableNames": [
											{
												"name": "data",
												"nativeSrc": "4261:4:8",
												"nodeType": "YulIdentifier",
												"src": "4261:4:8"
											}
										]
									}
								]
							},
							"name": "array_dataslot_t_string_storage",
							"nativeSrc": "4153:141:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "ptr",
									"nativeSrc": "4194:3:8",
									"nodeType": "YulTypedName",
									"src": "4194:3:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "data",
									"nativeSrc": "4202:4:8",
									"nodeType": "YulTypedName",
									"src": "4202:4:8",
									"type": ""
								}
							],
							"src": "4153:141:8"
						},
						{
							"body": {
								"nativeSrc": "4344:49:8",
								"nodeType": "YulBlock",
								"src": "4344:49:8",
								"statements": [
									{
										"nativeSrc": "4354:33:8",
										"nodeType": "YulAssignment",
										"src": "4354:33:8",
										"value": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "4372:5:8",
															"nodeType": "YulIdentifier",
															"src": "4372:5:8"
														},
														{
															"kind": "number",
															"nativeSrc": "4379:2:8",
															"nodeType": "YulLiteral",
															"src": "4379:2:8",
															"type": "",
															"value": "31"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "4368:3:8",
														"nodeType": "YulIdentifier",
														"src": "4368:3:8"
													},
													"nativeSrc": "4368:14:8",
													"nodeType": "YulFunctionCall",
													"src": "4368:14:8"
												},
												{
													"kind": "number",
													"nativeSrc": "4384:2:8",
													"nodeType": "YulLiteral",
													"src": "4384:2:8",
													"type": "",
													"value": "32"
												}
											],
											"functionName": {
												"name": "div",
												"nativeSrc": "4364:3:8",
												"nodeType": "YulIdentifier",
												"src": "4364:3:8"
											},
											"nativeSrc": "4364:23:8",
											"nodeType": "YulFunctionCall",
											"src": "4364:23:8"
										},
										"variableNames": [
											{
												"name": "result",
												"nativeSrc": "4354:6:8",
												"nodeType": "YulIdentifier",
												"src": "4354:6:8"
											}
										]
									}
								]
							},
							"name": "divide_by_32_ceil",
							"nativeSrc": "4300:93:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "4327:5:8",
									"nodeType": "YulTypedName",
									"src": "4327:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "result",
									"nativeSrc": "4337:6:8",
									"nodeType": "YulTypedName",
									"src": "4337:6:8",
									"type": ""
								}
							],
							"src": "4300:93:8"
						},
						{
							"body": {
								"nativeSrc": "4452:54:8",
								"nodeType": "YulBlock",
								"src": "4452:54:8",
								"statements": [
									{
										"nativeSrc": "4462:37:8",
										"nodeType": "YulAssignment",
										"src": "4462:37:8",
										"value": {
											"arguments": [
												{
													"name": "bits",
													"nativeSrc": "4487:4:8",
													"nodeType": "YulIdentifier",
													"src": "4487:4:8"
												},
												{
													"name": "value",
													"nativeSrc": "4493:5:8",
													"nodeType": "YulIdentifier",
													"src": "4493:5:8"
												}
											],
											"functionName": {
												"name": "shl",
												"nativeSrc": "4483:3:8",
												"nodeType": "YulIdentifier",
												"src": "4483:3:8"
											},
											"nativeSrc": "4483:16:8",
											"nodeType": "YulFunctionCall",
											"src": "4483:16:8"
										},
										"variableNames": [
											{
												"name": "newValue",
												"nativeSrc": "4462:8:8",
												"nodeType": "YulIdentifier",
												"src": "4462:8:8"
											}
										]
									}
								]
							},
							"name": "shift_left_dynamic",
							"nativeSrc": "4399:107:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "bits",
									"nativeSrc": "4427:4:8",
									"nodeType": "YulTypedName",
									"src": "4427:4:8",
									"type": ""
								},
								{
									"name": "value",
									"nativeSrc": "4433:5:8",
									"nodeType": "YulTypedName",
									"src": "4433:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "newValue",
									"nativeSrc": "4443:8:8",
									"nodeType": "YulTypedName",
									"src": "4443:8:8",
									"type": ""
								}
							],
							"src": "4399:107:8"
						},
						{
							"body": {
								"nativeSrc": "4588:317:8",
								"nodeType": "YulBlock",
								"src": "4588:317:8",
								"statements": [
									{
										"nativeSrc": "4598:35:8",
										"nodeType": "YulVariableDeclaration",
										"src": "4598:35:8",
										"value": {
											"arguments": [
												{
													"name": "shiftBytes",
													"nativeSrc": "4619:10:8",
													"nodeType": "YulIdentifier",
													"src": "4619:10:8"
												},
												{
													"kind": "number",
													"nativeSrc": "4631:1:8",
													"nodeType": "YulLiteral",
													"src": "4631:1:8",
													"type": "",
													"value": "8"
												}
											],
											"functionName": {
												"name": "mul",
												"nativeSrc": "4615:3:8",
												"nodeType": "YulIdentifier",
												"src": "4615:3:8"
											},
											"nativeSrc": "4615:18:8",
											"nodeType": "YulFunctionCall",
											"src": "4615:18:8"
										},
										"variables": [
											{
												"name": "shiftBits",
												"nativeSrc": "4602:9:8",
												"nodeType": "YulTypedName",
												"src": "4602:9:8",
												"type": ""
											}
										]
									},
									{
										"nativeSrc": "4642:109:8",
										"nodeType": "YulVariableDeclaration",
										"src": "4642:109:8",
										"value": {
											"arguments": [
												{
													"name": "shiftBits",
													"nativeSrc": "4673:9:8",
													"nodeType": "YulIdentifier",
													"src": "4673:9:8"
												},
												{
													"kind": "number",
													"nativeSrc": "4684:66:8",
													"nodeType": "YulLiteral",
													"src": "4684:66:8",
													"type": "",
													"value": "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
												}
											],
											"functionName": {
												"name": "shift_left_dynamic",
												"nativeSrc": "4654:18:8",
												"nodeType": "YulIdentifier",
												"src": "4654:18:8"
											},
											"nativeSrc": "4654:97:8",
											"nodeType": "YulFunctionCall",
											"src": "4654:97:8"
										},
										"variables": [
											{
												"name": "mask",
												"nativeSrc": "4646:4:8",
												"nodeType": "YulTypedName",
												"src": "4646:4:8",
												"type": ""
											}
										]
									},
									{
										"nativeSrc": "4760:51:8",
										"nodeType": "YulAssignment",
										"src": "4760:51:8",
										"value": {
											"arguments": [
												{
													"name": "shiftBits",
													"nativeSrc": "4791:9:8",
													"nodeType": "YulIdentifier",
													"src": "4791:9:8"
												},
												{
													"name": "toInsert",
													"nativeSrc": "4802:8:8",
													"nodeType": "YulIdentifier",
													"src": "4802:8:8"
												}
											],
											"functionName": {
												"name": "shift_left_dynamic",
												"nativeSrc": "4772:18:8",
												"nodeType": "YulIdentifier",
												"src": "4772:18:8"
											},
											"nativeSrc": "4772:39:8",
											"nodeType": "YulFunctionCall",
											"src": "4772:39:8"
										},
										"variableNames": [
											{
												"name": "toInsert",
												"nativeSrc": "4760:8:8",
												"nodeType": "YulIdentifier",
												"src": "4760:8:8"
											}
										]
									},
									{
										"nativeSrc": "4820:30:8",
										"nodeType": "YulAssignment",
										"src": "4820:30:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "4833:5:8",
													"nodeType": "YulIdentifier",
													"src": "4833:5:8"
												},
												{
													"arguments": [
														{
															"name": "mask",
															"nativeSrc": "4844:4:8",
															"nodeType": "YulIdentifier",
															"src": "4844:4:8"
														}
													],
													"functionName": {
														"name": "not",
														"nativeSrc": "4840:3:8",
														"nodeType": "YulIdentifier",
														"src": "4840:3:8"
													},
													"nativeSrc": "4840:9:8",
													"nodeType": "YulFunctionCall",
													"src": "4840:9:8"
												}
											],
											"functionName": {
												"name": "and",
												"nativeSrc": "4829:3:8",
												"nodeType": "YulIdentifier",
												"src": "4829:3:8"
											},
											"nativeSrc": "4829:21:8",
											"nodeType": "YulFunctionCall",
											"src": "4829:21:8"
										},
										"variableNames": [
											{
												"name": "value",
												"nativeSrc": "4820:5:8",
												"nodeType": "YulIdentifier",
												"src": "4820:5:8"
											}
										]
									},
									{
										"nativeSrc": "4859:40:8",
										"nodeType": "YulAssignment",
										"src": "4859:40:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "4872:5:8",
													"nodeType": "YulIdentifier",
													"src": "4872:5:8"
												},
												{
													"arguments": [
														{
															"name": "toInsert",
															"nativeSrc": "4883:8:8",
															"nodeType": "YulIdentifier",
															"src": "4883:8:8"
														},
														{
															"name": "mask",
															"nativeSrc": "4893:4:8",
															"nodeType": "YulIdentifier",
															"src": "4893:4:8"
														}
													],
													"functionName": {
														"name": "and",
														"nativeSrc": "4879:3:8",
														"nodeType": "YulIdentifier",
														"src": "4879:3:8"
													},
													"nativeSrc": "4879:19:8",
													"nodeType": "YulFunctionCall",
													"src": "4879:19:8"
												}
											],
											"functionName": {
												"name": "or",
												"nativeSrc": "4869:2:8",
												"nodeType": "YulIdentifier",
												"src": "4869:2:8"
											},
											"nativeSrc": "4869:30:8",
											"nodeType": "YulFunctionCall",
											"src": "4869:30:8"
										},
										"variableNames": [
											{
												"name": "result",
												"nativeSrc": "4859:6:8",
												"nodeType": "YulIdentifier",
												"src": "4859:6:8"
											}
										]
									}
								]
							},
							"name": "update_byte_slice_dynamic32",
							"nativeSrc": "4512:393:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "4549:5:8",
									"nodeType": "YulTypedName",
									"src": "4549:5:8",
									"type": ""
								},
								{
									"name": "shiftBytes",
									"nativeSrc": "4556:10:8",
									"nodeType": "YulTypedName",
									"src": "4556:10:8",
									"type": ""
								},
								{
									"name": "toInsert",
									"nativeSrc": "4568:8:8",
									"nodeType": "YulTypedName",
									"src": "4568:8:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "result",
									"nativeSrc": "4581:6:8",
									"nodeType": "YulTypedName",
									"src": "4581:6:8",
									"type": ""
								}
							],
							"src": "4512:393:8"
						},
						{
							"body": {
								"nativeSrc": "4956:32:8",
								"nodeType": "YulBlock",
								"src": "4956:32:8",
								"statements": [
									{
										"nativeSrc": "4966:16:8",
										"nodeType": "YulAssignment",
										"src": "4966:16:8",
										"value": {
											"name": "value",
											"nativeSrc": "4977:5:8",
											"nodeType": "YulIdentifier",
											"src": "4977:5:8"
										},
										"variableNames": [
											{
												"name": "cleaned",
												"nativeSrc": "4966:7:8",
												"nodeType": "YulIdentifier",
												"src": "4966:7:8"
											}
										]
									}
								]
							},
							"name": "cleanup_t_uint256",
							"nativeSrc": "4911:77:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "4938:5:8",
									"nodeType": "YulTypedName",
									"src": "4938:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "cleaned",
									"nativeSrc": "4948:7:8",
									"nodeType": "YulTypedName",
									"src": "4948:7:8",
									"type": ""
								}
							],
							"src": "4911:77:8"
						},
						{
							"body": {
								"nativeSrc": "5026:28:8",
								"nodeType": "YulBlock",
								"src": "5026:28:8",
								"statements": [
									{
										"nativeSrc": "5036:12:8",
										"nodeType": "YulAssignment",
										"src": "5036:12:8",
										"value": {
											"name": "value",
											"nativeSrc": "5043:5:8",
											"nodeType": "YulIdentifier",
											"src": "5043:5:8"
										},
										"variableNames": [
											{
												"name": "ret",
												"nativeSrc": "5036:3:8",
												"nodeType": "YulIdentifier",
												"src": "5036:3:8"
											}
										]
									}
								]
							},
							"name": "identity",
							"nativeSrc": "4994:60:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "5012:5:8",
									"nodeType": "YulTypedName",
									"src": "5012:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "ret",
									"nativeSrc": "5022:3:8",
									"nodeType": "YulTypedName",
									"src": "5022:3:8",
									"type": ""
								}
							],
							"src": "4994:60:8"
						},
						{
							"body": {
								"nativeSrc": "5120:82:8",
								"nodeType": "YulBlock",
								"src": "5120:82:8",
								"statements": [
									{
										"nativeSrc": "5130:66:8",
										"nodeType": "YulAssignment",
										"src": "5130:66:8",
										"value": {
											"arguments": [
												{
													"arguments": [
														{
															"arguments": [
																{
																	"name": "value",
																	"nativeSrc": "5188:5:8",
																	"nodeType": "YulIdentifier",
																	"src": "5188:5:8"
																}
															],
															"functionName": {
																"name": "cleanup_t_uint256",
																"nativeSrc": "5170:17:8",
																"nodeType": "YulIdentifier",
																"src": "5170:17:8"
															},
															"nativeSrc": "5170:24:8",
															"nodeType": "YulFunctionCall",
															"src": "5170:24:8"
														}
													],
													"functionName": {
														"name": "identity",
														"nativeSrc": "5161:8:8",
														"nodeType": "YulIdentifier",
														"src": "5161:8:8"
													},
													"nativeSrc": "5161:34:8",
													"nodeType": "YulFunctionCall",
													"src": "5161:34:8"
												}
											],
											"functionName": {
												"name": "cleanup_t_uint256",
												"nativeSrc": "5143:17:8",
												"nodeType": "YulIdentifier",
												"src": "5143:17:8"
											},
											"nativeSrc": "5143:53:8",
											"nodeType": "YulFunctionCall",
											"src": "5143:53:8"
										},
										"variableNames": [
											{
												"name": "converted",
												"nativeSrc": "5130:9:8",
												"nodeType": "YulIdentifier",
												"src": "5130:9:8"
											}
										]
									}
								]
							},
							"name": "convert_t_uint256_to_t_uint256",
							"nativeSrc": "5060:142:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "5100:5:8",
									"nodeType": "YulTypedName",
									"src": "5100:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "converted",
									"nativeSrc": "5110:9:8",
									"nodeType": "YulTypedName",
									"src": "5110:9:8",
									"type": ""
								}
							],
							"src": "5060:142:8"
						},
						{
							"body": {
								"nativeSrc": "5255:28:8",
								"nodeType": "YulBlock",
								"src": "5255:28:8",
								"statements": [
									{
										"nativeSrc": "5265:12:8",
										"nodeType": "YulAssignment",
										"src": "5265:12:8",
										"value": {
											"name": "value",
											"nativeSrc": "5272:5:8",
											"nodeType": "YulIdentifier",
											"src": "5272:5:8"
										},
										"variableNames": [
											{
												"name": "ret",
												"nativeSrc": "5265:3:8",
												"nodeType": "YulIdentifier",
												"src": "5265:3:8"
											}
										]
									}
								]
							},
							"name": "prepare_store_t_uint256",
							"nativeSrc": "5208:75:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "5241:5:8",
									"nodeType": "YulTypedName",
									"src": "5241:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "ret",
									"nativeSrc": "5251:3:8",
									"nodeType": "YulTypedName",
									"src": "5251:3:8",
									"type": ""
								}
							],
							"src": "5208:75:8"
						},
						{
							"body": {
								"nativeSrc": "5365:193:8",
								"nodeType": "YulBlock",
								"src": "5365:193:8",
								"statements": [
									{
										"nativeSrc": "5375:63:8",
										"nodeType": "YulVariableDeclaration",
										"src": "5375:63:8",
										"value": {
											"arguments": [
												{
													"name": "value_0",
													"nativeSrc": "5430:7:8",
													"nodeType": "YulIdentifier",
													"src": "5430:7:8"
												}
											],
											"functionName": {
												"name": "convert_t_uint256_to_t_uint256",
												"nativeSrc": "5399:30:8",
												"nodeType": "YulIdentifier",
												"src": "5399:30:8"
											},
											"nativeSrc": "5399:39:8",
											"nodeType": "YulFunctionCall",
											"src": "5399:39:8"
										},
										"variables": [
											{
												"name": "convertedValue_0",
												"nativeSrc": "5379:16:8",
												"nodeType": "YulTypedName",
												"src": "5379:16:8",
												"type": ""
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "slot",
													"nativeSrc": "5454:4:8",
													"nodeType": "YulIdentifier",
													"src": "5454:4:8"
												},
												{
													"arguments": [
														{
															"arguments": [
																{
																	"name": "slot",
																	"nativeSrc": "5494:4:8",
																	"nodeType": "YulIdentifier",
																	"src": "5494:4:8"
																}
															],
															"functionName": {
																"name": "sload",
																"nativeSrc": "5488:5:8",
																"nodeType": "YulIdentifier",
																"src": "5488:5:8"
															},
															"nativeSrc": "5488:11:8",
															"nodeType": "YulFunctionCall",
															"src": "5488:11:8"
														},
														{
															"name": "offset",
															"nativeSrc": "5501:6:8",
															"nodeType": "YulIdentifier",
															"src": "5501:6:8"
														},
														{
															"arguments": [
																{
																	"name": "convertedValue_0",
																	"nativeSrc": "5533:16:8",
																	"nodeType": "YulIdentifier",
																	"src": "5533:16:8"
																}
															],
															"functionName": {
																"name": "prepare_store_t_uint256",
																"nativeSrc": "5509:23:8",
																"nodeType": "YulIdentifier",
																"src": "5509:23:8"
															},
															"nativeSrc": "5509:41:8",
															"nodeType": "YulFunctionCall",
															"src": "5509:41:8"
														}
													],
													"functionName": {
														"name": "update_byte_slice_dynamic32",
														"nativeSrc": "5460:27:8",
														"nodeType": "YulIdentifier",
														"src": "5460:27:8"
													},
													"nativeSrc": "5460:91:8",
													"nodeType": "YulFunctionCall",
													"src": "5460:91:8"
												}
											],
											"functionName": {
												"name": "sstore",
												"nativeSrc": "5447:6:8",
												"nodeType": "YulIdentifier",
												"src": "5447:6:8"
											},
											"nativeSrc": "5447:105:8",
											"nodeType": "YulFunctionCall",
											"src": "5447:105:8"
										},
										"nativeSrc": "5447:105:8",
										"nodeType": "YulExpressionStatement",
										"src": "5447:105:8"
									}
								]
							},
							"name": "update_storage_value_t_uint256_to_t_uint256",
							"nativeSrc": "5289:269:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "slot",
									"nativeSrc": "5342:4:8",
									"nodeType": "YulTypedName",
									"src": "5342:4:8",
									"type": ""
								},
								{
									"name": "offset",
									"nativeSrc": "5348:6:8",
									"nodeType": "YulTypedName",
									"src": "5348:6:8",
									"type": ""
								},
								{
									"name": "value_0",
									"nativeSrc": "5356:7:8",
									"nodeType": "YulTypedName",
									"src": "5356:7:8",
									"type": ""
								}
							],
							"src": "5289:269:8"
						},
						{
							"body": {
								"nativeSrc": "5613:24:8",
								"nodeType": "YulBlock",
								"src": "5613:24:8",
								"statements": [
									{
										"nativeSrc": "5623:8:8",
										"nodeType": "YulAssignment",
										"src": "5623:8:8",
										"value": {
											"kind": "number",
											"nativeSrc": "5630:1:8",
											"nodeType": "YulLiteral",
											"src": "5630:1:8",
											"type": "",
											"value": "0"
										},
										"variableNames": [
											{
												"name": "ret",
												"nativeSrc": "5623:3:8",
												"nodeType": "YulIdentifier",
												"src": "5623:3:8"
											}
										]
									}
								]
							},
							"name": "zero_value_for_split_t_uint256",
							"nativeSrc": "5564:73:8",
							"nodeType": "YulFunctionDefinition",
							"returnVariables": [
								{
									"name": "ret",
									"nativeSrc": "5609:3:8",
									"nodeType": "YulTypedName",
									"src": "5609:3:8",
									"type": ""
								}
							],
							"src": "5564:73:8"
						},
						{
							"body": {
								"nativeSrc": "5696:136:8",
								"nodeType": "YulBlock",
								"src": "5696:136:8",
								"statements": [
									{
										"nativeSrc": "5706:46:8",
										"nodeType": "YulVariableDeclaration",
										"src": "5706:46:8",
										"value": {
											"arguments": [],
											"functionName": {
												"name": "zero_value_for_split_t_uint256",
												"nativeSrc": "5720:30:8",
												"nodeType": "YulIdentifier",
												"src": "5720:30:8"
											},
											"nativeSrc": "5720:32:8",
											"nodeType": "YulFunctionCall",
											"src": "5720:32:8"
										},
										"variables": [
											{
												"name": "zero_0",
												"nativeSrc": "5710:6:8",
												"nodeType": "YulTypedName",
												"src": "5710:6:8",
												"type": ""
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "slot",
													"nativeSrc": "5805:4:8",
													"nodeType": "YulIdentifier",
													"src": "5805:4:8"
												},
												{
													"name": "offset",
													"nativeSrc": "5811:6:8",
													"nodeType": "YulIdentifier",
													"src": "5811:6:8"
												},
												{
													"name": "zero_0",
													"nativeSrc": "5819:6:8",
													"nodeType": "YulIdentifier",
													"src": "5819:6:8"
												}
											],
											"functionName": {
												"name": "update_storage_value_t_uint256_to_t_uint256",
												"nativeSrc": "5761:43:8",
												"nodeType": "YulIdentifier",
												"src": "5761:43:8"
											},
											"nativeSrc": "5761:65:8",
											"nodeType": "YulFunctionCall",
											"src": "5761:65:8"
										},
										"nativeSrc": "5761:65:8",
										"nodeType": "YulExpressionStatement",
										"src": "5761:65:8"
									}
								]
							},
							"name": "storage_set_to_zero_t_uint256",
							"nativeSrc": "5643:189:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "slot",
									"nativeSrc": "5682:4:8",
									"nodeType": "YulTypedName",
									"src": "5682:4:8",
									"type": ""
								},
								{
									"name": "offset",
									"nativeSrc": "5688:6:8",
									"nodeType": "YulTypedName",
									"src": "5688:6:8",
									"type": ""
								}
							],
							"src": "5643:189:8"
						},
						{
							"body": {
								"nativeSrc": "5888:136:8",
								"nodeType": "YulBlock",
								"src": "5888:136:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "5955:63:8",
											"nodeType": "YulBlock",
											"src": "5955:63:8",
											"statements": [
												{
													"expression": {
														"arguments": [
															{
																"name": "start",
																"nativeSrc": "5999:5:8",
																"nodeType": "YulIdentifier",
																"src": "5999:5:8"
															},
															{
																"kind": "number",
																"nativeSrc": "6006:1:8",
																"nodeType": "YulLiteral",
																"src": "6006:1:8",
																"type": "",
																"value": "0"
															}
														],
														"functionName": {
															"name": "storage_set_to_zero_t_uint256",
															"nativeSrc": "5969:29:8",
															"nodeType": "YulIdentifier",
															"src": "5969:29:8"
														},
														"nativeSrc": "5969:39:8",
														"nodeType": "YulFunctionCall",
														"src": "5969:39:8"
													},
													"nativeSrc": "5969:39:8",
													"nodeType": "YulExpressionStatement",
													"src": "5969:39:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "start",
													"nativeSrc": "5908:5:8",
													"nodeType": "YulIdentifier",
													"src": "5908:5:8"
												},
												{
													"name": "end",
													"nativeSrc": "5915:3:8",
													"nodeType": "YulIdentifier",
													"src": "5915:3:8"
												}
											],
											"functionName": {
												"name": "lt",
												"nativeSrc": "5905:2:8",
												"nodeType": "YulIdentifier",
												"src": "5905:2:8"
											},
											"nativeSrc": "5905:14:8",
											"nodeType": "YulFunctionCall",
											"src": "5905:14:8"
										},
										"nativeSrc": "5898:120:8",
										"nodeType": "YulForLoop",
										"post": {
											"nativeSrc": "5920:26:8",
											"nodeType": "YulBlock",
											"src": "5920:26:8",
											"statements": [
												{
													"nativeSrc": "5922:22:8",
													"nodeType": "YulAssignment",
													"src": "5922:22:8",
													"value": {
														"arguments": [
															{
																"name": "start",
																"nativeSrc": "5935:5:8",
																"nodeType": "YulIdentifier",
																"src": "5935:5:8"
															},
															{
																"kind": "number",
																"nativeSrc": "5942:1:8",
																"nodeType": "YulLiteral",
																"src": "5942:1:8",
																"type": "",
																"value": "1"
															}
														],
														"functionName": {
															"name": "add",
															"nativeSrc": "5931:3:8",
															"nodeType": "YulIdentifier",
															"src": "5931:3:8"
														},
														"nativeSrc": "5931:13:8",
														"nodeType": "YulFunctionCall",
														"src": "5931:13:8"
													},
													"variableNames": [
														{
															"name": "start",
															"nativeSrc": "5922:5:8",
															"nodeType": "YulIdentifier",
															"src": "5922:5:8"
														}
													]
												}
											]
										},
										"pre": {
											"nativeSrc": "5902:2:8",
											"nodeType": "YulBlock",
											"src": "5902:2:8",
											"statements": []
										},
										"src": "5898:120:8"
									}
								]
							},
							"name": "clear_storage_range_t_bytes1",
							"nativeSrc": "5838:186:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "start",
									"nativeSrc": "5876:5:8",
									"nodeType": "YulTypedName",
									"src": "5876:5:8",
									"type": ""
								},
								{
									"name": "end",
									"nativeSrc": "5883:3:8",
									"nodeType": "YulTypedName",
									"src": "5883:3:8",
									"type": ""
								}
							],
							"src": "5838:186:8"
						},
						{
							"body": {
								"nativeSrc": "6109:464:8",
								"nodeType": "YulBlock",
								"src": "6109:464:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "6135:431:8",
											"nodeType": "YulBlock",
											"src": "6135:431:8",
											"statements": [
												{
													"nativeSrc": "6149:54:8",
													"nodeType": "YulVariableDeclaration",
													"src": "6149:54:8",
													"value": {
														"arguments": [
															{
																"name": "array",
																"nativeSrc": "6197:5:8",
																"nodeType": "YulIdentifier",
																"src": "6197:5:8"
															}
														],
														"functionName": {
															"name": "array_dataslot_t_string_storage",
															"nativeSrc": "6165:31:8",
															"nodeType": "YulIdentifier",
															"src": "6165:31:8"
														},
														"nativeSrc": "6165:38:8",
														"nodeType": "YulFunctionCall",
														"src": "6165:38:8"
													},
													"variables": [
														{
															"name": "dataArea",
															"nativeSrc": "6153:8:8",
															"nodeType": "YulTypedName",
															"src": "6153:8:8",
															"type": ""
														}
													]
												},
												{
													"nativeSrc": "6216:63:8",
													"nodeType": "YulVariableDeclaration",
													"src": "6216:63:8",
													"value": {
														"arguments": [
															{
																"name": "dataArea",
																"nativeSrc": "6239:8:8",
																"nodeType": "YulIdentifier",
																"src": "6239:8:8"
															},
															{
																"arguments": [
																	{
																		"name": "startIndex",
																		"nativeSrc": "6267:10:8",
																		"nodeType": "YulIdentifier",
																		"src": "6267:10:8"
																	}
																],
																"functionName": {
																	"name": "divide_by_32_ceil",
																	"nativeSrc": "6249:17:8",
																	"nodeType": "YulIdentifier",
																	"src": "6249:17:8"
																},
																"nativeSrc": "6249:29:8",
																"nodeType": "YulFunctionCall",
																"src": "6249:29:8"
															}
														],
														"functionName": {
															"name": "add",
															"nativeSrc": "6235:3:8",
															"nodeType": "YulIdentifier",
															"src": "6235:3:8"
														},
														"nativeSrc": "6235:44:8",
														"nodeType": "YulFunctionCall",
														"src": "6235:44:8"
													},
													"variables": [
														{
															"name": "deleteStart",
															"nativeSrc": "6220:11:8",
															"nodeType": "YulTypedName",
															"src": "6220:11:8",
															"type": ""
														}
													]
												},
												{
													"body": {
														"nativeSrc": "6436:27:8",
														"nodeType": "YulBlock",
														"src": "6436:27:8",
														"statements": [
															{
																"nativeSrc": "6438:23:8",
																"nodeType": "YulAssignment",
																"src": "6438:23:8",
																"value": {
																	"name": "dataArea",
																	"nativeSrc": "6453:8:8",
																	"nodeType": "YulIdentifier",
																	"src": "6453:8:8"
																},
																"variableNames": [
																	{
																		"name": "deleteStart",
																		"nativeSrc": "6438:11:8",
																		"nodeType": "YulIdentifier",
																		"src": "6438:11:8"
																	}
																]
															}
														]
													},
													"condition": {
														"arguments": [
															{
																"name": "startIndex",
																"nativeSrc": "6420:10:8",
																"nodeType": "YulIdentifier",
																"src": "6420:10:8"
															},
															{
																"kind": "number",
																"nativeSrc": "6432:2:8",
																"nodeType": "YulLiteral",
																"src": "6432:2:8",
																"type": "",
																"value": "32"
															}
														],
														"functionName": {
															"name": "lt",
															"nativeSrc": "6417:2:8",
															"nodeType": "YulIdentifier",
															"src": "6417:2:8"
														},
														"nativeSrc": "6417:18:8",
														"nodeType": "YulFunctionCall",
														"src": "6417:18:8"
													},
													"nativeSrc": "6414:49:8",
													"nodeType": "YulIf",
													"src": "6414:49:8"
												},
												{
													"expression": {
														"arguments": [
															{
																"name": "deleteStart",
																"nativeSrc": "6505:11:8",
																"nodeType": "YulIdentifier",
																"src": "6505:11:8"
															},
															{
																"arguments": [
																	{
																		"name": "dataArea",
																		"nativeSrc": "6522:8:8",
																		"nodeType": "YulIdentifier",
																		"src": "6522:8:8"
																	},
																	{
																		"arguments": [
																			{
																				"name": "len",
																				"nativeSrc": "6550:3:8",
																				"nodeType": "YulIdentifier",
																				"src": "6550:3:8"
																			}
																		],
																		"functionName": {
																			"name": "divide_by_32_ceil",
																			"nativeSrc": "6532:17:8",
																			"nodeType": "YulIdentifier",
																			"src": "6532:17:8"
																		},
																		"nativeSrc": "6532:22:8",
																		"nodeType": "YulFunctionCall",
																		"src": "6532:22:8"
																	}
																],
																"functionName": {
																	"name": "add",
																	"nativeSrc": "6518:3:8",
																	"nodeType": "YulIdentifier",
																	"src": "6518:3:8"
																},
																"nativeSrc": "6518:37:8",
																"nodeType": "YulFunctionCall",
																"src": "6518:37:8"
															}
														],
														"functionName": {
															"name": "clear_storage_range_t_bytes1",
															"nativeSrc": "6476:28:8",
															"nodeType": "YulIdentifier",
															"src": "6476:28:8"
														},
														"nativeSrc": "6476:80:8",
														"nodeType": "YulFunctionCall",
														"src": "6476:80:8"
													},
													"nativeSrc": "6476:80:8",
													"nodeType": "YulExpressionStatement",
													"src": "6476:80:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "len",
													"nativeSrc": "6126:3:8",
													"nodeType": "YulIdentifier",
													"src": "6126:3:8"
												},
												{
													"kind": "number",
													"nativeSrc": "6131:2:8",
													"nodeType": "YulLiteral",
													"src": "6131:2:8",
													"type": "",
													"value": "31"
												}
											],
											"functionName": {
												"name": "gt",
												"nativeSrc": "6123:2:8",
												"nodeType": "YulIdentifier",
												"src": "6123:2:8"
											},
											"nativeSrc": "6123:11:8",
											"nodeType": "YulFunctionCall",
											"src": "6123:11:8"
										},
										"nativeSrc": "6120:446:8",
										"nodeType": "YulIf",
										"src": "6120:446:8"
									}
								]
							},
							"name": "clean_up_bytearray_end_slots_t_string_storage",
							"nativeSrc": "6030:543:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "array",
									"nativeSrc": "6085:5:8",
									"nodeType": "YulTypedName",
									"src": "6085:5:8",
									"type": ""
								},
								{
									"name": "len",
									"nativeSrc": "6092:3:8",
									"nodeType": "YulTypedName",
									"src": "6092:3:8",
									"type": ""
								},
								{
									"name": "startIndex",
									"nativeSrc": "6097:10:8",
									"nodeType": "YulTypedName",
									"src": "6097:10:8",
									"type": ""
								}
							],
							"src": "6030:543:8"
						},
						{
							"body": {
								"nativeSrc": "6642:54:8",
								"nodeType": "YulBlock",
								"src": "6642:54:8",
								"statements": [
									{
										"nativeSrc": "6652:37:8",
										"nodeType": "YulAssignment",
										"src": "6652:37:8",
										"value": {
											"arguments": [
												{
													"name": "bits",
													"nativeSrc": "6677:4:8",
													"nodeType": "YulIdentifier",
													"src": "6677:4:8"
												},
												{
													"name": "value",
													"nativeSrc": "6683:5:8",
													"nodeType": "YulIdentifier",
													"src": "6683:5:8"
												}
											],
											"functionName": {
												"name": "shr",
												"nativeSrc": "6673:3:8",
												"nodeType": "YulIdentifier",
												"src": "6673:3:8"
											},
											"nativeSrc": "6673:16:8",
											"nodeType": "YulFunctionCall",
											"src": "6673:16:8"
										},
										"variableNames": [
											{
												"name": "newValue",
												"nativeSrc": "6652:8:8",
												"nodeType": "YulIdentifier",
												"src": "6652:8:8"
											}
										]
									}
								]
							},
							"name": "shift_right_unsigned_dynamic",
							"nativeSrc": "6579:117:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "bits",
									"nativeSrc": "6617:4:8",
									"nodeType": "YulTypedName",
									"src": "6617:4:8",
									"type": ""
								},
								{
									"name": "value",
									"nativeSrc": "6623:5:8",
									"nodeType": "YulTypedName",
									"src": "6623:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "newValue",
									"nativeSrc": "6633:8:8",
									"nodeType": "YulTypedName",
									"src": "6633:8:8",
									"type": ""
								}
							],
							"src": "6579:117:8"
						},
						{
							"body": {
								"nativeSrc": "6753:118:8",
								"nodeType": "YulBlock",
								"src": "6753:118:8",
								"statements": [
									{
										"nativeSrc": "6763:68:8",
										"nodeType": "YulVariableDeclaration",
										"src": "6763:68:8",
										"value": {
											"arguments": [
												{
													"arguments": [
														{
															"arguments": [
																{
																	"kind": "number",
																	"nativeSrc": "6812:1:8",
																	"nodeType": "YulLiteral",
																	"src": "6812:1:8",
																	"type": "",
																	"value": "8"
																},
																{
																	"name": "bytes",
																	"nativeSrc": "6815:5:8",
																	"nodeType": "YulIdentifier",
																	"src": "6815:5:8"
																}
															],
															"functionName": {
																"name": "mul",
																"nativeSrc": "6808:3:8",
																"nodeType": "YulIdentifier",
																"src": "6808:3:8"
															},
															"nativeSrc": "6808:13:8",
															"nodeType": "YulFunctionCall",
															"src": "6808:13:8"
														},
														{
															"arguments": [
																{
																	"kind": "number",
																	"nativeSrc": "6827:1:8",
																	"nodeType": "YulLiteral",
																	"src": "6827:1:8",
																	"type": "",
																	"value": "0"
																}
															],
															"functionName": {
																"name": "not",
																"nativeSrc": "6823:3:8",
																"nodeType": "YulIdentifier",
																"src": "6823:3:8"
															},
															"nativeSrc": "6823:6:8",
															"nodeType": "YulFunctionCall",
															"src": "6823:6:8"
														}
													],
													"functionName": {
														"name": "shift_right_unsigned_dynamic",
														"nativeSrc": "6779:28:8",
														"nodeType": "YulIdentifier",
														"src": "6779:28:8"
													},
													"nativeSrc": "6779:51:8",
													"nodeType": "YulFunctionCall",
													"src": "6779:51:8"
												}
											],
											"functionName": {
												"name": "not",
												"nativeSrc": "6775:3:8",
												"nodeType": "YulIdentifier",
												"src": "6775:3:8"
											},
											"nativeSrc": "6775:56:8",
											"nodeType": "YulFunctionCall",
											"src": "6775:56:8"
										},
										"variables": [
											{
												"name": "mask",
												"nativeSrc": "6767:4:8",
												"nodeType": "YulTypedName",
												"src": "6767:4:8",
												"type": ""
											}
										]
									},
									{
										"nativeSrc": "6840:25:8",
										"nodeType": "YulAssignment",
										"src": "6840:25:8",
										"value": {
											"arguments": [
												{
													"name": "data",
													"nativeSrc": "6854:4:8",
													"nodeType": "YulIdentifier",
													"src": "6854:4:8"
												},
												{
													"name": "mask",
													"nativeSrc": "6860:4:8",
													"nodeType": "YulIdentifier",
													"src": "6860:4:8"
												}
											],
											"functionName": {
												"name": "and",
												"nativeSrc": "6850:3:8",
												"nodeType": "YulIdentifier",
												"src": "6850:3:8"
											},
											"nativeSrc": "6850:15:8",
											"nodeType": "YulFunctionCall",
											"src": "6850:15:8"
										},
										"variableNames": [
											{
												"name": "result",
												"nativeSrc": "6840:6:8",
												"nodeType": "YulIdentifier",
												"src": "6840:6:8"
											}
										]
									}
								]
							},
							"name": "mask_bytes_dynamic",
							"nativeSrc": "6702:169:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "data",
									"nativeSrc": "6730:4:8",
									"nodeType": "YulTypedName",
									"src": "6730:4:8",
									"type": ""
								},
								{
									"name": "bytes",
									"nativeSrc": "6736:5:8",
									"nodeType": "YulTypedName",
									"src": "6736:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "result",
									"nativeSrc": "6746:6:8",
									"nodeType": "YulTypedName",
									"src": "6746:6:8",
									"type": ""
								}
							],
							"src": "6702:169:8"
						},
						{
							"body": {
								"nativeSrc": "6957:214:8",
								"nodeType": "YulBlock",
								"src": "6957:214:8",
								"statements": [
									{
										"nativeSrc": "7090:37:8",
										"nodeType": "YulAssignment",
										"src": "7090:37:8",
										"value": {
											"arguments": [
												{
													"name": "data",
													"nativeSrc": "7117:4:8",
													"nodeType": "YulIdentifier",
													"src": "7117:4:8"
												},
												{
													"name": "len",
													"nativeSrc": "7123:3:8",
													"nodeType": "YulIdentifier",
													"src": "7123:3:8"
												}
											],
											"functionName": {
												"name": "mask_bytes_dynamic",
												"nativeSrc": "7098:18:8",
												"nodeType": "YulIdentifier",
												"src": "7098:18:8"
											},
											"nativeSrc": "7098:29:8",
											"nodeType": "YulFunctionCall",
											"src": "7098:29:8"
										},
										"variableNames": [
											{
												"name": "data",
												"nativeSrc": "7090:4:8",
												"nodeType": "YulIdentifier",
												"src": "7090:4:8"
											}
										]
									},
									{
										"nativeSrc": "7136:29:8",
										"nodeType": "YulAssignment",
										"src": "7136:29:8",
										"value": {
											"arguments": [
												{
													"name": "data",
													"nativeSrc": "7147:4:8",
													"nodeType": "YulIdentifier",
													"src": "7147:4:8"
												},
												{
													"arguments": [
														{
															"kind": "number",
															"nativeSrc": "7157:1:8",
															"nodeType": "YulLiteral",
															"src": "7157:1:8",
															"type": "",
															"value": "2"
														},
														{
															"name": "len",
															"nativeSrc": "7160:3:8",
															"nodeType": "YulIdentifier",
															"src": "7160:3:8"
														}
													],
													"functionName": {
														"name": "mul",
														"nativeSrc": "7153:3:8",
														"nodeType": "YulIdentifier",
														"src": "7153:3:8"
													},
													"nativeSrc": "7153:11:8",
													"nodeType": "YulFunctionCall",
													"src": "7153:11:8"
												}
											],
											"functionName": {
												"name": "or",
												"nativeSrc": "7144:2:8",
												"nodeType": "YulIdentifier",
												"src": "7144:2:8"
											},
											"nativeSrc": "7144:21:8",
											"nodeType": "YulFunctionCall",
											"src": "7144:21:8"
										},
										"variableNames": [
											{
												"name": "used",
												"nativeSrc": "7136:4:8",
												"nodeType": "YulIdentifier",
												"src": "7136:4:8"
											}
										]
									}
								]
							},
							"name": "extract_used_part_and_set_length_of_short_byte_array",
							"nativeSrc": "6876:295:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "data",
									"nativeSrc": "6938:4:8",
									"nodeType": "YulTypedName",
									"src": "6938:4:8",
									"type": ""
								},
								{
									"name": "len",
									"nativeSrc": "6944:3:8",
									"nodeType": "YulTypedName",
									"src": "6944:3:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "used",
									"nativeSrc": "6952:4:8",
									"nodeType": "YulTypedName",
									"src": "6952:4:8",
									"type": ""
								}
							],
							"src": "6876:295:8"
						},
						{
							"body": {
								"nativeSrc": "7268:1303:8",
								"nodeType": "YulBlock",
								"src": "7268:1303:8",
								"statements": [
									{
										"nativeSrc": "7279:51:8",
										"nodeType": "YulVariableDeclaration",
										"src": "7279:51:8",
										"value": {
											"arguments": [
												{
													"name": "src",
													"nativeSrc": "7326:3:8",
													"nodeType": "YulIdentifier",
													"src": "7326:3:8"
												}
											],
											"functionName": {
												"name": "array_length_t_string_memory_ptr",
												"nativeSrc": "7293:32:8",
												"nodeType": "YulIdentifier",
												"src": "7293:32:8"
											},
											"nativeSrc": "7293:37:8",
											"nodeType": "YulFunctionCall",
											"src": "7293:37:8"
										},
										"variables": [
											{
												"name": "newLen",
												"nativeSrc": "7283:6:8",
												"nodeType": "YulTypedName",
												"src": "7283:6:8",
												"type": ""
											}
										]
									},
									{
										"body": {
											"nativeSrc": "7415:22:8",
											"nodeType": "YulBlock",
											"src": "7415:22:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "panic_error_0x41",
															"nativeSrc": "7417:16:8",
															"nodeType": "YulIdentifier",
															"src": "7417:16:8"
														},
														"nativeSrc": "7417:18:8",
														"nodeType": "YulFunctionCall",
														"src": "7417:18:8"
													},
													"nativeSrc": "7417:18:8",
													"nodeType": "YulExpressionStatement",
													"src": "7417:18:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "newLen",
													"nativeSrc": "7387:6:8",
													"nodeType": "YulIdentifier",
													"src": "7387:6:8"
												},
												{
													"kind": "number",
													"nativeSrc": "7395:18:8",
													"nodeType": "YulLiteral",
													"src": "7395:18:8",
													"type": "",
													"value": "0xffffffffffffffff"
												}
											],
											"functionName": {
												"name": "gt",
												"nativeSrc": "7384:2:8",
												"nodeType": "YulIdentifier",
												"src": "7384:2:8"
											},
											"nativeSrc": "7384:30:8",
											"nodeType": "YulFunctionCall",
											"src": "7384:30:8"
										},
										"nativeSrc": "7381:56:8",
										"nodeType": "YulIf",
										"src": "7381:56:8"
									},
									{
										"nativeSrc": "7447:52:8",
										"nodeType": "YulVariableDeclaration",
										"src": "7447:52:8",
										"value": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "slot",
															"nativeSrc": "7493:4:8",
															"nodeType": "YulIdentifier",
															"src": "7493:4:8"
														}
													],
													"functionName": {
														"name": "sload",
														"nativeSrc": "7487:5:8",
														"nodeType": "YulIdentifier",
														"src": "7487:5:8"
													},
													"nativeSrc": "7487:11:8",
													"nodeType": "YulFunctionCall",
													"src": "7487:11:8"
												}
											],
											"functionName": {
												"name": "extract_byte_array_length",
												"nativeSrc": "7461:25:8",
												"nodeType": "YulIdentifier",
												"src": "7461:25:8"
											},
											"nativeSrc": "7461:38:8",
											"nodeType": "YulFunctionCall",
											"src": "7461:38:8"
										},
										"variables": [
											{
												"name": "oldLen",
												"nativeSrc": "7451:6:8",
												"nodeType": "YulTypedName",
												"src": "7451:6:8",
												"type": ""
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "slot",
													"nativeSrc": "7592:4:8",
													"nodeType": "YulIdentifier",
													"src": "7592:4:8"
												},
												{
													"name": "oldLen",
													"nativeSrc": "7598:6:8",
													"nodeType": "YulIdentifier",
													"src": "7598:6:8"
												},
												{
													"name": "newLen",
													"nativeSrc": "7606:6:8",
													"nodeType": "YulIdentifier",
													"src": "7606:6:8"
												}
											],
											"functionName": {
												"name": "clean_up_bytearray_end_slots_t_string_storage",
												"nativeSrc": "7546:45:8",
												"nodeType": "YulIdentifier",
												"src": "7546:45:8"
											},
											"nativeSrc": "7546:67:8",
											"nodeType": "YulFunctionCall",
											"src": "7546:67:8"
										},
										"nativeSrc": "7546:67:8",
										"nodeType": "YulExpressionStatement",
										"src": "7546:67:8"
									},
									{
										"nativeSrc": "7623:18:8",
										"nodeType": "YulVariableDeclaration",
										"src": "7623:18:8",
										"value": {
											"kind": "number",
											"nativeSrc": "7640:1:8",
											"nodeType": "YulLiteral",
											"src": "7640:1:8",
											"type": "",
											"value": "0"
										},
										"variables": [
											{
												"name": "srcOffset",
												"nativeSrc": "7627:9:8",
												"nodeType": "YulTypedName",
												"src": "7627:9:8",
												"type": ""
											}
										]
									},
									{
										"nativeSrc": "7651:17:8",
										"nodeType": "YulAssignment",
										"src": "7651:17:8",
										"value": {
											"kind": "number",
											"nativeSrc": "7664:4:8",
											"nodeType": "YulLiteral",
											"src": "7664:4:8",
											"type": "",
											"value": "0x20"
										},
										"variableNames": [
											{
												"name": "srcOffset",
												"nativeSrc": "7651:9:8",
												"nodeType": "YulIdentifier",
												"src": "7651:9:8"
											}
										]
									},
									{
										"cases": [
											{
												"body": {
													"nativeSrc": "7715:611:8",
													"nodeType": "YulBlock",
													"src": "7715:611:8",
													"statements": [
														{
															"nativeSrc": "7729:37:8",
															"nodeType": "YulVariableDeclaration",
															"src": "7729:37:8",
															"value": {
																"arguments": [
																	{
																		"name": "newLen",
																		"nativeSrc": "7748:6:8",
																		"nodeType": "YulIdentifier",
																		"src": "7748:6:8"
																	},
																	{
																		"arguments": [
																			{
																				"kind": "number",
																				"nativeSrc": "7760:4:8",
																				"nodeType": "YulLiteral",
																				"src": "7760:4:8",
																				"type": "",
																				"value": "0x1f"
																			}
																		],
																		"functionName": {
																			"name": "not",
																			"nativeSrc": "7756:3:8",
																			"nodeType": "YulIdentifier",
																			"src": "7756:3:8"
																		},
																		"nativeSrc": "7756:9:8",
																		"nodeType": "YulFunctionCall",
																		"src": "7756:9:8"
																	}
																],
																"functionName": {
																	"name": "and",
																	"nativeSrc": "7744:3:8",
																	"nodeType": "YulIdentifier",
																	"src": "7744:3:8"
																},
																"nativeSrc": "7744:22:8",
																"nodeType": "YulFunctionCall",
																"src": "7744:22:8"
															},
															"variables": [
																{
																	"name": "loopEnd",
																	"nativeSrc": "7733:7:8",
																	"nodeType": "YulTypedName",
																	"src": "7733:7:8",
																	"type": ""
																}
															]
														},
														{
															"nativeSrc": "7780:51:8",
															"nodeType": "YulVariableDeclaration",
															"src": "7780:51:8",
															"value": {
																"arguments": [
																	{
																		"name": "slot",
																		"nativeSrc": "7826:4:8",
																		"nodeType": "YulIdentifier",
																		"src": "7826:4:8"
																	}
																],
																"functionName": {
																	"name": "array_dataslot_t_string_storage",
																	"nativeSrc": "7794:31:8",
																	"nodeType": "YulIdentifier",
																	"src": "7794:31:8"
																},
																"nativeSrc": "7794:37:8",
																"nodeType": "YulFunctionCall",
																"src": "7794:37:8"
															},
															"variables": [
																{
																	"name": "dstPtr",
																	"nativeSrc": "7784:6:8",
																	"nodeType": "YulTypedName",
																	"src": "7784:6:8",
																	"type": ""
																}
															]
														},
														{
															"nativeSrc": "7844:10:8",
															"nodeType": "YulVariableDeclaration",
															"src": "7844:10:8",
															"value": {
																"kind": "number",
																"nativeSrc": "7853:1:8",
																"nodeType": "YulLiteral",
																"src": "7853:1:8",
																"type": "",
																"value": "0"
															},
															"variables": [
																{
																	"name": "i",
																	"nativeSrc": "7848:1:8",
																	"nodeType": "YulTypedName",
																	"src": "7848:1:8",
																	"type": ""
																}
															]
														},
														{
															"body": {
																"nativeSrc": "7912:163:8",
																"nodeType": "YulBlock",
																"src": "7912:163:8",
																"statements": [
																	{
																		"expression": {
																			"arguments": [
																				{
																					"name": "dstPtr",
																					"nativeSrc": "7937:6:8",
																					"nodeType": "YulIdentifier",
																					"src": "7937:6:8"
																				},
																				{
																					"arguments": [
																						{
																							"arguments": [
																								{
																									"name": "src",
																									"nativeSrc": "7955:3:8",
																									"nodeType": "YulIdentifier",
																									"src": "7955:3:8"
																								},
																								{
																									"name": "srcOffset",
																									"nativeSrc": "7960:9:8",
																									"nodeType": "YulIdentifier",
																									"src": "7960:9:8"
																								}
																							],
																							"functionName": {
																								"name": "add",
																								"nativeSrc": "7951:3:8",
																								"nodeType": "YulIdentifier",
																								"src": "7951:3:8"
																							},
																							"nativeSrc": "7951:19:8",
																							"nodeType": "YulFunctionCall",
																							"src": "7951:19:8"
																						}
																					],
																					"functionName": {
																						"name": "mload",
																						"nativeSrc": "7945:5:8",
																						"nodeType": "YulIdentifier",
																						"src": "7945:5:8"
																					},
																					"nativeSrc": "7945:26:8",
																					"nodeType": "YulFunctionCall",
																					"src": "7945:26:8"
																				}
																			],
																			"functionName": {
																				"name": "sstore",
																				"nativeSrc": "7930:6:8",
																				"nodeType": "YulIdentifier",
																				"src": "7930:6:8"
																			},
																			"nativeSrc": "7930:42:8",
																			"nodeType": "YulFunctionCall",
																			"src": "7930:42:8"
																		},
																		"nativeSrc": "7930:42:8",
																		"nodeType": "YulExpressionStatement",
																		"src": "7930:42:8"
																	},
																	{
																		"nativeSrc": "7989:24:8",
																		"nodeType": "YulAssignment",
																		"src": "7989:24:8",
																		"value": {
																			"arguments": [
																				{
																					"name": "dstPtr",
																					"nativeSrc": "8003:6:8",
																					"nodeType": "YulIdentifier",
																					"src": "8003:6:8"
																				},
																				{
																					"kind": "number",
																					"nativeSrc": "8011:1:8",
																					"nodeType": "YulLiteral",
																					"src": "8011:1:8",
																					"type": "",
																					"value": "1"
																				}
																			],
																			"functionName": {
																				"name": "add",
																				"nativeSrc": "7999:3:8",
																				"nodeType": "YulIdentifier",
																				"src": "7999:3:8"
																			},
																			"nativeSrc": "7999:14:8",
																			"nodeType": "YulFunctionCall",
																			"src": "7999:14:8"
																		},
																		"variableNames": [
																			{
																				"name": "dstPtr",
																				"nativeSrc": "7989:6:8",
																				"nodeType": "YulIdentifier",
																				"src": "7989:6:8"
																			}
																		]
																	},
																	{
																		"nativeSrc": "8030:31:8",
																		"nodeType": "YulAssignment",
																		"src": "8030:31:8",
																		"value": {
																			"arguments": [
																				{
																					"name": "srcOffset",
																					"nativeSrc": "8047:9:8",
																					"nodeType": "YulIdentifier",
																					"src": "8047:9:8"
																				},
																				{
																					"kind": "number",
																					"nativeSrc": "8058:2:8",
																					"nodeType": "YulLiteral",
																					"src": "8058:2:8",
																					"type": "",
																					"value": "32"
																				}
																			],
																			"functionName": {
																				"name": "add",
																				"nativeSrc": "8043:3:8",
																				"nodeType": "YulIdentifier",
																				"src": "8043:3:8"
																			},
																			"nativeSrc": "8043:18:8",
																			"nodeType": "YulFunctionCall",
																			"src": "8043:18:8"
																		},
																		"variableNames": [
																			{
																				"name": "srcOffset",
																				"nativeSrc": "8030:9:8",
																				"nodeType": "YulIdentifier",
																				"src": "8030:9:8"
																			}
																		]
																	}
																]
															},
															"condition": {
																"arguments": [
																	{
																		"name": "i",
																		"nativeSrc": "7878:1:8",
																		"nodeType": "YulIdentifier",
																		"src": "7878:1:8"
																	},
																	{
																		"name": "loopEnd",
																		"nativeSrc": "7881:7:8",
																		"nodeType": "YulIdentifier",
																		"src": "7881:7:8"
																	}
																],
																"functionName": {
																	"name": "lt",
																	"nativeSrc": "7875:2:8",
																	"nodeType": "YulIdentifier",
																	"src": "7875:2:8"
																},
																"nativeSrc": "7875:14:8",
																"nodeType": "YulFunctionCall",
																"src": "7875:14:8"
															},
															"nativeSrc": "7867:208:8",
															"nodeType": "YulForLoop",
															"post": {
																"nativeSrc": "7890:21:8",
																"nodeType": "YulBlock",
																"src": "7890:21:8",
																"statements": [
																	{
																		"nativeSrc": "7892:17:8",
																		"nodeType": "YulAssignment",
																		"src": "7892:17:8",
																		"value": {
																			"arguments": [
																				{
																					"name": "i",
																					"nativeSrc": "7901:1:8",
																					"nodeType": "YulIdentifier",
																					"src": "7901:1:8"
																				},
																				{
																					"kind": "number",
																					"nativeSrc": "7904:4:8",
																					"nodeType": "YulLiteral",
																					"src": "7904:4:8",
																					"type": "",
																					"value": "0x20"
																				}
																			],
																			"functionName": {
																				"name": "add",
																				"nativeSrc": "7897:3:8",
																				"nodeType": "YulIdentifier",
																				"src": "7897:3:8"
																			},
																			"nativeSrc": "7897:12:8",
																			"nodeType": "YulFunctionCall",
																			"src": "7897:12:8"
																		},
																		"variableNames": [
																			{
																				"name": "i",
																				"nativeSrc": "7892:1:8",
																				"nodeType": "YulIdentifier",
																				"src": "7892:1:8"
																			}
																		]
																	}
																]
															},
															"pre": {
																"nativeSrc": "7871:3:8",
																"nodeType": "YulBlock",
																"src": "7871:3:8",
																"statements": []
															},
															"src": "7867:208:8"
														},
														{
															"body": {
																"nativeSrc": "8111:156:8",
																"nodeType": "YulBlock",
																"src": "8111:156:8",
																"statements": [
																	{
																		"nativeSrc": "8129:43:8",
																		"nodeType": "YulVariableDeclaration",
																		"src": "8129:43:8",
																		"value": {
																			"arguments": [
																				{
																					"arguments": [
																						{
																							"name": "src",
																							"nativeSrc": "8156:3:8",
																							"nodeType": "YulIdentifier",
																							"src": "8156:3:8"
																						},
																						{
																							"name": "srcOffset",
																							"nativeSrc": "8161:9:8",
																							"nodeType": "YulIdentifier",
																							"src": "8161:9:8"
																						}
																					],
																					"functionName": {
																						"name": "add",
																						"nativeSrc": "8152:3:8",
																						"nodeType": "YulIdentifier",
																						"src": "8152:3:8"
																					},
																					"nativeSrc": "8152:19:8",
																					"nodeType": "YulFunctionCall",
																					"src": "8152:19:8"
																				}
																			],
																			"functionName": {
																				"name": "mload",
																				"nativeSrc": "8146:5:8",
																				"nodeType": "YulIdentifier",
																				"src": "8146:5:8"
																			},
																			"nativeSrc": "8146:26:8",
																			"nodeType": "YulFunctionCall",
																			"src": "8146:26:8"
																		},
																		"variables": [
																			{
																				"name": "lastValue",
																				"nativeSrc": "8133:9:8",
																				"nodeType": "YulTypedName",
																				"src": "8133:9:8",
																				"type": ""
																			}
																		]
																	},
																	{
																		"expression": {
																			"arguments": [
																				{
																					"name": "dstPtr",
																					"nativeSrc": "8196:6:8",
																					"nodeType": "YulIdentifier",
																					"src": "8196:6:8"
																				},
																				{
																					"arguments": [
																						{
																							"name": "lastValue",
																							"nativeSrc": "8223:9:8",
																							"nodeType": "YulIdentifier",
																							"src": "8223:9:8"
																						},
																						{
																							"arguments": [
																								{
																									"name": "newLen",
																									"nativeSrc": "8238:6:8",
																									"nodeType": "YulIdentifier",
																									"src": "8238:6:8"
																								},
																								{
																									"kind": "number",
																									"nativeSrc": "8246:4:8",
																									"nodeType": "YulLiteral",
																									"src": "8246:4:8",
																									"type": "",
																									"value": "0x1f"
																								}
																							],
																							"functionName": {
																								"name": "and",
																								"nativeSrc": "8234:3:8",
																								"nodeType": "YulIdentifier",
																								"src": "8234:3:8"
																							},
																							"nativeSrc": "8234:17:8",
																							"nodeType": "YulFunctionCall",
																							"src": "8234:17:8"
																						}
																					],
																					"functionName": {
																						"name": "mask_bytes_dynamic",
																						"nativeSrc": "8204:18:8",
																						"nodeType": "YulIdentifier",
																						"src": "8204:18:8"
																					},
																					"nativeSrc": "8204:48:8",
																					"nodeType": "YulFunctionCall",
																					"src": "8204:48:8"
																				}
																			],
																			"functionName": {
																				"name": "sstore",
																				"nativeSrc": "8189:6:8",
																				"nodeType": "YulIdentifier",
																				"src": "8189:6:8"
																			},
																			"nativeSrc": "8189:64:8",
																			"nodeType": "YulFunctionCall",
																			"src": "8189:64:8"
																		},
																		"nativeSrc": "8189:64:8",
																		"nodeType": "YulExpressionStatement",
																		"src": "8189:64:8"
																	}
																]
															},
															"condition": {
																"arguments": [
																	{
																		"name": "loopEnd",
																		"nativeSrc": "8094:7:8",
																		"nodeType": "YulIdentifier",
																		"src": "8094:7:8"
																	},
																	{
																		"name": "newLen",
																		"nativeSrc": "8103:6:8",
																		"nodeType": "YulIdentifier",
																		"src": "8103:6:8"
																	}
																],
																"functionName": {
																	"name": "lt",
																	"nativeSrc": "8091:2:8",
																	"nodeType": "YulIdentifier",
																	"src": "8091:2:8"
																},
																"nativeSrc": "8091:19:8",
																"nodeType": "YulFunctionCall",
																"src": "8091:19:8"
															},
															"nativeSrc": "8088:179:8",
															"nodeType": "YulIf",
															"src": "8088:179:8"
														},
														{
															"expression": {
																"arguments": [
																	{
																		"name": "slot",
																		"nativeSrc": "8287:4:8",
																		"nodeType": "YulIdentifier",
																		"src": "8287:4:8"
																	},
																	{
																		"arguments": [
																			{
																				"arguments": [
																					{
																						"name": "newLen",
																						"nativeSrc": "8301:6:8",
																						"nodeType": "YulIdentifier",
																						"src": "8301:6:8"
																					},
																					{
																						"kind": "number",
																						"nativeSrc": "8309:1:8",
																						"nodeType": "YulLiteral",
																						"src": "8309:1:8",
																						"type": "",
																						"value": "2"
																					}
																				],
																				"functionName": {
																					"name": "mul",
																					"nativeSrc": "8297:3:8",
																					"nodeType": "YulIdentifier",
																					"src": "8297:3:8"
																				},
																				"nativeSrc": "8297:14:8",
																				"nodeType": "YulFunctionCall",
																				"src": "8297:14:8"
																			},
																			{
																				"kind": "number",
																				"nativeSrc": "8313:1:8",
																				"nodeType": "YulLiteral",
																				"src": "8313:1:8",
																				"type": "",
																				"value": "1"
																			}
																		],
																		"functionName": {
																			"name": "add",
																			"nativeSrc": "8293:3:8",
																			"nodeType": "YulIdentifier",
																			"src": "8293:3:8"
																		},
																		"nativeSrc": "8293:22:8",
																		"nodeType": "YulFunctionCall",
																		"src": "8293:22:8"
																	}
																],
																"functionName": {
																	"name": "sstore",
																	"nativeSrc": "8280:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "8280:6:8"
																},
																"nativeSrc": "8280:36:8",
																"nodeType": "YulFunctionCall",
																"src": "8280:36:8"
															},
															"nativeSrc": "8280:36:8",
															"nodeType": "YulExpressionStatement",
															"src": "8280:36:8"
														}
													]
												},
												"nativeSrc": "7708:618:8",
												"nodeType": "YulCase",
												"src": "7708:618:8",
												"value": {
													"kind": "number",
													"nativeSrc": "7713:1:8",
													"nodeType": "YulLiteral",
													"src": "7713:1:8",
													"type": "",
													"value": "1"
												}
											},
											{
												"body": {
													"nativeSrc": "8343:222:8",
													"nodeType": "YulBlock",
													"src": "8343:222:8",
													"statements": [
														{
															"nativeSrc": "8357:14:8",
															"nodeType": "YulVariableDeclaration",
															"src": "8357:14:8",
															"value": {
																"kind": "number",
																"nativeSrc": "8370:1:8",
																"nodeType": "YulLiteral",
																"src": "8370:1:8",
																"type": "",
																"value": "0"
															},
															"variables": [
																{
																	"name": "value",
																	"nativeSrc": "8361:5:8",
																	"nodeType": "YulTypedName",
																	"src": "8361:5:8",
																	"type": ""
																}
															]
														},
														{
															"body": {
																"nativeSrc": "8394:67:8",
																"nodeType": "YulBlock",
																"src": "8394:67:8",
																"statements": [
																	{
																		"nativeSrc": "8412:35:8",
																		"nodeType": "YulAssignment",
																		"src": "8412:35:8",
																		"value": {
																			"arguments": [
																				{
																					"arguments": [
																						{
																							"name": "src",
																							"nativeSrc": "8431:3:8",
																							"nodeType": "YulIdentifier",
																							"src": "8431:3:8"
																						},
																						{
																							"name": "srcOffset",
																							"nativeSrc": "8436:9:8",
																							"nodeType": "YulIdentifier",
																							"src": "8436:9:8"
																						}
																					],
																					"functionName": {
																						"name": "add",
																						"nativeSrc": "8427:3:8",
																						"nodeType": "YulIdentifier",
																						"src": "8427:3:8"
																					},
																					"nativeSrc": "8427:19:8",
																					"nodeType": "YulFunctionCall",
																					"src": "8427:19:8"
																				}
																			],
																			"functionName": {
																				"name": "mload",
																				"nativeSrc": "8421:5:8",
																				"nodeType": "YulIdentifier",
																				"src": "8421:5:8"
																			},
																			"nativeSrc": "8421:26:8",
																			"nodeType": "YulFunctionCall",
																			"src": "8421:26:8"
																		},
																		"variableNames": [
																			{
																				"name": "value",
																				"nativeSrc": "8412:5:8",
																				"nodeType": "YulIdentifier",
																				"src": "8412:5:8"
																			}
																		]
																	}
																]
															},
															"condition": {
																"name": "newLen",
																"nativeSrc": "8387:6:8",
																"nodeType": "YulIdentifier",
																"src": "8387:6:8"
															},
															"nativeSrc": "8384:77:8",
															"nodeType": "YulIf",
															"src": "8384:77:8"
														},
														{
															"expression": {
																"arguments": [
																	{
																		"name": "slot",
																		"nativeSrc": "8481:4:8",
																		"nodeType": "YulIdentifier",
																		"src": "8481:4:8"
																	},
																	{
																		"arguments": [
																			{
																				"name": "value",
																				"nativeSrc": "8540:5:8",
																				"nodeType": "YulIdentifier",
																				"src": "8540:5:8"
																			},
																			{
																				"name": "newLen",
																				"nativeSrc": "8547:6:8",
																				"nodeType": "YulIdentifier",
																				"src": "8547:6:8"
																			}
																		],
																		"functionName": {
																			"name": "extract_used_part_and_set_length_of_short_byte_array",
																			"nativeSrc": "8487:52:8",
																			"nodeType": "YulIdentifier",
																			"src": "8487:52:8"
																		},
																		"nativeSrc": "8487:67:8",
																		"nodeType": "YulFunctionCall",
																		"src": "8487:67:8"
																	}
																],
																"functionName": {
																	"name": "sstore",
																	"nativeSrc": "8474:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "8474:6:8"
																},
																"nativeSrc": "8474:81:8",
																"nodeType": "YulFunctionCall",
																"src": "8474:81:8"
															},
															"nativeSrc": "8474:81:8",
															"nodeType": "YulExpressionStatement",
															"src": "8474:81:8"
														}
													]
												},
												"nativeSrc": "8335:230:8",
												"nodeType": "YulCase",
												"src": "8335:230:8",
												"value": "default"
											}
										],
										"expression": {
											"arguments": [
												{
													"name": "newLen",
													"nativeSrc": "7688:6:8",
													"nodeType": "YulIdentifier",
													"src": "7688:6:8"
												},
												{
													"kind": "number",
													"nativeSrc": "7696:2:8",
													"nodeType": "YulLiteral",
													"src": "7696:2:8",
													"type": "",
													"value": "31"
												}
											],
											"functionName": {
												"name": "gt",
												"nativeSrc": "7685:2:8",
												"nodeType": "YulIdentifier",
												"src": "7685:2:8"
											},
											"nativeSrc": "7685:14:8",
											"nodeType": "YulFunctionCall",
											"src": "7685:14:8"
										},
										"nativeSrc": "7678:887:8",
										"nodeType": "YulSwitch",
										"src": "7678:887:8"
									}
								]
							},
							"name": "copy_byte_array_to_storage_from_t_string_memory_ptr_to_t_string_storage",
							"nativeSrc": "7176:1395:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "slot",
									"nativeSrc": "7257:4:8",
									"nodeType": "YulTypedName",
									"src": "7257:4:8",
									"type": ""
								},
								{
									"name": "src",
									"nativeSrc": "7263:3:8",
									"nodeType": "YulTypedName",
									"src": "7263:3:8",
									"type": ""
								}
							],
							"src": "7176:1395:8"
						},
						{
							"body": {
								"nativeSrc": "8622:81:8",
								"nodeType": "YulBlock",
								"src": "8622:81:8",
								"statements": [
									{
										"nativeSrc": "8632:65:8",
										"nodeType": "YulAssignment",
										"src": "8632:65:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "8647:5:8",
													"nodeType": "YulIdentifier",
													"src": "8647:5:8"
												},
												{
													"kind": "number",
													"nativeSrc": "8654:42:8",
													"nodeType": "YulLiteral",
													"src": "8654:42:8",
													"type": "",
													"value": "0xffffffffffffffffffffffffffffffffffffffff"
												}
											],
											"functionName": {
												"name": "and",
												"nativeSrc": "8643:3:8",
												"nodeType": "YulIdentifier",
												"src": "8643:3:8"
											},
											"nativeSrc": "8643:54:8",
											"nodeType": "YulFunctionCall",
											"src": "8643:54:8"
										},
										"variableNames": [
											{
												"name": "cleaned",
												"nativeSrc": "8632:7:8",
												"nodeType": "YulIdentifier",
												"src": "8632:7:8"
											}
										]
									}
								]
							},
							"name": "cleanup_t_uint160",
							"nativeSrc": "8577:126:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "8604:5:8",
									"nodeType": "YulTypedName",
									"src": "8604:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "cleaned",
									"nativeSrc": "8614:7:8",
									"nodeType": "YulTypedName",
									"src": "8614:7:8",
									"type": ""
								}
							],
							"src": "8577:126:8"
						},
						{
							"body": {
								"nativeSrc": "8754:51:8",
								"nodeType": "YulBlock",
								"src": "8754:51:8",
								"statements": [
									{
										"nativeSrc": "8764:35:8",
										"nodeType": "YulAssignment",
										"src": "8764:35:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "8793:5:8",
													"nodeType": "YulIdentifier",
													"src": "8793:5:8"
												}
											],
											"functionName": {
												"name": "cleanup_t_uint160",
												"nativeSrc": "8775:17:8",
												"nodeType": "YulIdentifier",
												"src": "8775:17:8"
											},
											"nativeSrc": "8775:24:8",
											"nodeType": "YulFunctionCall",
											"src": "8775:24:8"
										},
										"variableNames": [
											{
												"name": "cleaned",
												"nativeSrc": "8764:7:8",
												"nodeType": "YulIdentifier",
												"src": "8764:7:8"
											}
										]
									}
								]
							},
							"name": "cleanup_t_address",
							"nativeSrc": "8709:96:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "8736:5:8",
									"nodeType": "YulTypedName",
									"src": "8736:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "cleaned",
									"nativeSrc": "8746:7:8",
									"nodeType": "YulTypedName",
									"src": "8746:7:8",
									"type": ""
								}
							],
							"src": "8709:96:8"
						},
						{
							"body": {
								"nativeSrc": "8876:53:8",
								"nodeType": "YulBlock",
								"src": "8876:53:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"name": "pos",
													"nativeSrc": "8893:3:8",
													"nodeType": "YulIdentifier",
													"src": "8893:3:8"
												},
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "8916:5:8",
															"nodeType": "YulIdentifier",
															"src": "8916:5:8"
														}
													],
													"functionName": {
														"name": "cleanup_t_address",
														"nativeSrc": "8898:17:8",
														"nodeType": "YulIdentifier",
														"src": "8898:17:8"
													},
													"nativeSrc": "8898:24:8",
													"nodeType": "YulFunctionCall",
													"src": "8898:24:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "8886:6:8",
												"nodeType": "YulIdentifier",
												"src": "8886:6:8"
											},
											"nativeSrc": "8886:37:8",
											"nodeType": "YulFunctionCall",
											"src": "8886:37:8"
										},
										"nativeSrc": "8886:37:8",
										"nodeType": "YulExpressionStatement",
										"src": "8886:37:8"
									}
								]
							},
							"name": "abi_encode_t_address_to_t_address_fromStack",
							"nativeSrc": "8811:118:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "8864:5:8",
									"nodeType": "YulTypedName",
									"src": "8864:5:8",
									"type": ""
								},
								{
									"name": "pos",
									"nativeSrc": "8871:3:8",
									"nodeType": "YulTypedName",
									"src": "8871:3:8",
									"type": ""
								}
							],
							"src": "8811:118:8"
						},
						{
							"body": {
								"nativeSrc": "9033:124:8",
								"nodeType": "YulBlock",
								"src": "9033:124:8",
								"statements": [
									{
										"nativeSrc": "9043:26:8",
										"nodeType": "YulAssignment",
										"src": "9043:26:8",
										"value": {
											"arguments": [
												{
													"name": "headStart",
													"nativeSrc": "9055:9:8",
													"nodeType": "YulIdentifier",
													"src": "9055:9:8"
												},
												{
													"kind": "number",
													"nativeSrc": "9066:2:8",
													"nodeType": "YulLiteral",
													"src": "9066:2:8",
													"type": "",
													"value": "32"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "9051:3:8",
												"nodeType": "YulIdentifier",
												"src": "9051:3:8"
											},
											"nativeSrc": "9051:18:8",
											"nodeType": "YulFunctionCall",
											"src": "9051:18:8"
										},
										"variableNames": [
											{
												"name": "tail",
												"nativeSrc": "9043:4:8",
												"nodeType": "YulIdentifier",
												"src": "9043:4:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value0",
													"nativeSrc": "9123:6:8",
													"nodeType": "YulIdentifier",
													"src": "9123:6:8"
												},
												{
													"arguments": [
														{
															"name": "headStart",
															"nativeSrc": "9136:9:8",
															"nodeType": "YulIdentifier",
															"src": "9136:9:8"
														},
														{
															"kind": "number",
															"nativeSrc": "9147:1:8",
															"nodeType": "YulLiteral",
															"src": "9147:1:8",
															"type": "",
															"value": "0"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "9132:3:8",
														"nodeType": "YulIdentifier",
														"src": "9132:3:8"
													},
													"nativeSrc": "9132:17:8",
													"nodeType": "YulFunctionCall",
													"src": "9132:17:8"
												}
											],
											"functionName": {
												"name": "abi_encode_t_address_to_t_address_fromStack",
												"nativeSrc": "9079:43:8",
												"nodeType": "YulIdentifier",
												"src": "9079:43:8"
											},
											"nativeSrc": "9079:71:8",
											"nodeType": "YulFunctionCall",
											"src": "9079:71:8"
										},
										"nativeSrc": "9079:71:8",
										"nodeType": "YulExpressionStatement",
										"src": "9079:71:8"
									}
								]
							},
							"name": "abi_encode_tuple_t_address__to_t_address__fromStack_reversed",
							"nativeSrc": "8935:222:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "9005:9:8",
									"nodeType": "YulTypedName",
									"src": "9005:9:8",
									"type": ""
								},
								{
									"name": "value0",
									"nativeSrc": "9017:6:8",
									"nodeType": "YulTypedName",
									"src": "9017:6:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "tail",
									"nativeSrc": "9028:4:8",
									"nodeType": "YulTypedName",
									"src": "9028:4:8",
									"type": ""
								}
							],
							"src": "8935:222:8"
						}
					]
				},
				"contents": "{\n\n    function allocate_unbounded() -> memPtr {\n        memPtr := mload(64)\n    }\n\n    function revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() {\n        revert(0, 0)\n    }\n\n    function revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() {\n        revert(0, 0)\n    }\n\n    function revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d() {\n        revert(0, 0)\n    }\n\n    function revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae() {\n        revert(0, 0)\n    }\n\n    function round_up_to_mul_of_32(value) -> result {\n        result := and(add(value, 31), not(31))\n    }\n\n    function panic_error_0x41() {\n        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)\n        mstore(4, 0x41)\n        revert(0, 0x24)\n    }\n\n    function finalize_allocation(memPtr, size) {\n        let newFreePtr := add(memPtr, round_up_to_mul_of_32(size))\n        // protect against overflow\n        if or(gt(newFreePtr, 0xffffffffffffffff), lt(newFreePtr, memPtr)) { panic_error_0x41() }\n        mstore(64, newFreePtr)\n    }\n\n    function allocate_memory(size) -> memPtr {\n        memPtr := allocate_unbounded()\n        finalize_allocation(memPtr, size)\n    }\n\n    function array_allocation_size_t_string_memory_ptr(length) -> size {\n        // Make sure we can allocate memory without overflow\n        if gt(length, 0xffffffffffffffff) { panic_error_0x41() }\n\n        size := round_up_to_mul_of_32(length)\n\n        // add length slot\n        size := add(size, 0x20)\n\n    }\n\n    function copy_memory_to_memory_with_cleanup(src, dst, length) {\n        let i := 0\n        for { } lt(i, length) { i := add(i, 32) }\n        {\n            mstore(add(dst, i), mload(add(src, i)))\n        }\n        mstore(add(dst, length), 0)\n    }\n\n    function abi_decode_available_length_t_string_memory_ptr_fromMemory(src, length, end) -> array {\n        array := allocate_memory(array_allocation_size_t_string_memory_ptr(length))\n        mstore(array, length)\n        let dst := add(array, 0x20)\n        if gt(add(src, length), end) { revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae() }\n        copy_memory_to_memory_with_cleanup(src, dst, length)\n    }\n\n    // string\n    function abi_decode_t_string_memory_ptr_fromMemory(offset, end) -> array {\n        if iszero(slt(add(offset, 0x1f), end)) { revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d() }\n        let length := mload(offset)\n        array := abi_decode_available_length_t_string_memory_ptr_fromMemory(add(offset, 0x20), length, end)\n    }\n\n    function abi_decode_tuple_t_string_memory_ptrt_string_memory_ptr_fromMemory(headStart, dataEnd) -> value0, value1 {\n        if slt(sub(dataEnd, headStart), 64) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }\n\n        {\n\n            let offset := mload(add(headStart, 0))\n            if gt(offset, 0xffffffffffffffff) { revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() }\n\n            value0 := abi_decode_t_string_memory_ptr_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := mload(add(headStart, 32))\n            if gt(offset, 0xffffffffffffffff) { revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() }\n\n            value1 := abi_decode_t_string_memory_ptr_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function array_length_t_string_memory_ptr(value) -> length {\n\n        length := mload(value)\n\n    }\n\n    function panic_error_0x22() {\n        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)\n        mstore(4, 0x22)\n        revert(0, 0x24)\n    }\n\n    function extract_byte_array_length(data) -> length {\n        length := div(data, 2)\n        let outOfPlaceEncoding := and(data, 1)\n        if iszero(outOfPlaceEncoding) {\n            length := and(length, 0x7f)\n        }\n\n        if eq(outOfPlaceEncoding, lt(length, 32)) {\n            panic_error_0x22()\n        }\n    }\n\n    function array_dataslot_t_string_storage(ptr) -> data {\n        data := ptr\n\n        mstore(0, ptr)\n        data := keccak256(0, 0x20)\n\n    }\n\n    function divide_by_32_ceil(value) -> result {\n        result := div(add(value, 31), 32)\n    }\n\n    function shift_left_dynamic(bits, value) -> newValue {\n        newValue :=\n\n        shl(bits, value)\n\n    }\n\n    function update_byte_slice_dynamic32(value, shiftBytes, toInsert) -> result {\n        let shiftBits := mul(shiftBytes, 8)\n        let mask := shift_left_dynamic(shiftBits, 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)\n        toInsert := shift_left_dynamic(shiftBits, toInsert)\n        value := and(value, not(mask))\n        result := or(value, and(toInsert, mask))\n    }\n\n    function cleanup_t_uint256(value) -> cleaned {\n        cleaned := value\n    }\n\n    function identity(value) -> ret {\n        ret := value\n    }\n\n    function convert_t_uint256_to_t_uint256(value) -> converted {\n        converted := cleanup_t_uint256(identity(cleanup_t_uint256(value)))\n    }\n\n    function prepare_store_t_uint256(value) -> ret {\n        ret := value\n    }\n\n    function update_storage_value_t_uint256_to_t_uint256(slot, offset, value_0) {\n        let convertedValue_0 := convert_t_uint256_to_t_uint256(value_0)\n        sstore(slot, update_byte_slice_dynamic32(sload(slot), offset, prepare_store_t_uint256(convertedValue_0)))\n    }\n\n    function zero_value_for_split_t_uint256() -> ret {\n        ret := 0\n    }\n\n    function storage_set_to_zero_t_uint256(slot, offset) {\n        let zero_0 := zero_value_for_split_t_uint256()\n        update_storage_value_t_uint256_to_t_uint256(slot, offset, zero_0)\n    }\n\n    function clear_storage_range_t_bytes1(start, end) {\n        for {} lt(start, end) { start := add(start, 1) }\n        {\n            storage_set_to_zero_t_uint256(start, 0)\n        }\n    }\n\n    function clean_up_bytearray_end_slots_t_string_storage(array, len, startIndex) {\n\n        if gt(len, 31) {\n            let dataArea := array_dataslot_t_string_storage(array)\n            let deleteStart := add(dataArea, divide_by_32_ceil(startIndex))\n            // If we are clearing array to be short byte array, we want to clear only data starting from array data area.\n            if lt(startIndex, 32) { deleteStart := dataArea }\n            clear_storage_range_t_bytes1(deleteStart, add(dataArea, divide_by_32_ceil(len)))\n        }\n\n    }\n\n    function shift_right_unsigned_dynamic(bits, value) -> newValue {\n        newValue :=\n\n        shr(bits, value)\n\n    }\n\n    function mask_bytes_dynamic(data, bytes) -> result {\n        let mask := not(shift_right_unsigned_dynamic(mul(8, bytes), not(0)))\n        result := and(data, mask)\n    }\n    function extract_used_part_and_set_length_of_short_byte_array(data, len) -> used {\n        // we want to save only elements that are part of the array after resizing\n        // others should be set to zero\n        data := mask_bytes_dynamic(data, len)\n        used := or(data, mul(2, len))\n    }\n    function copy_byte_array_to_storage_from_t_string_memory_ptr_to_t_string_storage(slot, src) {\n\n        let newLen := array_length_t_string_memory_ptr(src)\n        // Make sure array length is sane\n        if gt(newLen, 0xffffffffffffffff) { panic_error_0x41() }\n\n        let oldLen := extract_byte_array_length(sload(slot))\n\n        // potentially truncate data\n        clean_up_bytearray_end_slots_t_string_storage(slot, oldLen, newLen)\n\n        let srcOffset := 0\n\n        srcOffset := 0x20\n\n        switch gt(newLen, 31)\n        case 1 {\n            let loopEnd := and(newLen, not(0x1f))\n\n            let dstPtr := array_dataslot_t_string_storage(slot)\n            let i := 0\n            for { } lt(i, loopEnd) { i := add(i, 0x20) } {\n                sstore(dstPtr, mload(add(src, srcOffset)))\n                dstPtr := add(dstPtr, 1)\n                srcOffset := add(srcOffset, 32)\n            }\n            if lt(loopEnd, newLen) {\n                let lastValue := mload(add(src, srcOffset))\n                sstore(dstPtr, mask_bytes_dynamic(lastValue, and(newLen, 0x1f)))\n            }\n            sstore(slot, add(mul(newLen, 2), 1))\n        }\n        default {\n            let value := 0\n            if newLen {\n                value := mload(add(src, srcOffset))\n            }\n            sstore(slot, extract_used_part_and_set_length_of_short_byte_array(value, newLen))\n        }\n    }\n\n    function cleanup_t_uint160(value) -> cleaned {\n        cleaned := and(value, 0xffffffffffffffffffffffffffffffffffffffff)\n    }\n\n    function cleanup_t_address(value) -> cleaned {\n        cleaned := cleanup_t_uint160(value)\n    }\n\n    function abi_encode_t_address_to_t_address_fromStack(value, pos) {\n        mstore(pos, cleanup_t_address(value))\n    }\n\n    function abi_encode_tuple_t_address__to_t_address__fromStack_reversed(headStart , value0) -> tail {\n        tail := add(headStart, 32)\n\n        abi_encode_t_address_to_t_address_fromStack(value0,  add(headStart, 0))\n\n    }\n\n}\n",
				"id": 8,
				"language": "Yul",
				"name": "#utility.yul"
			}
		],
		"linkReferences": {},
		"object": "608060405234801562000010575f80fd5b5060405162001c0238038062001c02833981810160405281019062000036919062000336565b33828281600390816200004a9190620005f0565b5080600490816200005c9190620005f0565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000d2575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000c9919062000717565b60405180910390fd5b620000e381620000ec60201b60201c565b50505062000732565b5f600560019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6200021282620001ca565b810181811067ffffffffffffffff82111715620002345762000233620001da565b5b80604052505050565b5f62000248620001b1565b905062000256828262000207565b919050565b5f67ffffffffffffffff821115620002785762000277620001da565b5b6200028382620001ca565b9050602081019050919050565b5f5b83811015620002af57808201518184015260208101905062000292565b5f8484015250505050565b5f620002d0620002ca846200025b565b6200023d565b905082815260208101848484011115620002ef57620002ee620001c6565b5b620002fc84828562000290565b509392505050565b5f82601f8301126200031b576200031a620001c2565b5b81516200032d848260208601620002ba565b91505092915050565b5f80604083850312156200034f576200034e620001ba565b5b5f83015167ffffffffffffffff8111156200036f576200036e620001be565b5b6200037d8582860162000304565b925050602083015167ffffffffffffffff811115620003a157620003a0620001be565b5b620003af8582860162000304565b9150509250929050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806200040857607f821691505b6020821081036200041e576200041d620003c3565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620004827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000445565b6200048e868362000445565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f620004d8620004d2620004cc84620004a6565b620004af565b620004a6565b9050919050565b5f819050919050565b620004f383620004b8565b6200050b6200050282620004df565b84845462000451565b825550505050565b5f90565b6200052162000513565b6200052e818484620004e8565b505050565b5b818110156200055557620005495f8262000517565b60018101905062000534565b5050565b601f821115620005a4576200056e8162000424565b620005798462000436565b8101602085101562000589578190505b620005a1620005988562000436565b83018262000533565b50505b505050565b5f82821c905092915050565b5f620005c65f1984600802620005a9565b1980831691505092915050565b5f620005e08383620005b5565b9150826002028217905092915050565b620005fb82620003b9565b67ffffffffffffffff811115620006175762000616620001da565b5b620006238254620003f0565b6200063082828562000559565b5f60209050601f83116001811462000666575f841562000651578287015190505b6200065d8582620005d3565b865550620006cc565b601f198416620006768662000424565b5f5b828110156200069f5784890151825560018201915060208501945060208101905062000678565b86831015620006bf5784890151620006bb601f891682620005b5565b8355505b6001600288020188555050505b505050505050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f620006ff82620006d4565b9050919050565b6200071181620006f3565b82525050565b5f6020820190506200072c5f83018462000706565b92915050565b6114c280620007405f395ff3fe608060405234801561000f575f80fd5b5060043610610109575f3560e01c80635c975abb116100a05780638da5cb5b1161006f5780638da5cb5b1461026b57806395d89b4114610289578063a9059cbb146102a7578063dd62ed3e146102d7578063f2fde38b1461030757610109565b80635c975abb1461020957806370a0823114610227578063715018a6146102575780638456cb591461026157610109565b8063313ce567116100dc578063313ce567146101a95780633f4ba83a146101c757806340c10f19146101d157806342966c68146101ed57610109565b806306fdde031461010d578063095ea7b31461012b57806318160ddd1461015b57806323b872dd14610179575b5f80fd5b610115610323565b6040516101229190611110565b60405180910390f35b610145600480360381019061014091906111c1565b6103b3565b6040516101529190611219565b60405180910390f35b6101636103d5565b6040516101709190611241565b60405180910390f35b610193600480360381019061018e919061125a565b6103de565b6040516101a09190611219565b60405180910390f35b6101b161040c565b6040516101be91906112c5565b60405180910390f35b6101cf610414565b005b6101eb60048036038101906101e691906111c1565b610426565b005b610207600480360381019061020291906112de565b610492565b005b6102116104f5565b60405161021e9190611219565b60405180910390f35b610241600480360381019061023c9190611309565b61050a565b60405161024e9190611241565b60405180910390f35b61025f61054f565b005b610269610581565b005b610273610593565b6040516102809190611343565b60405180910390f35b6102916105bc565b60405161029e9190611110565b60405180910390f35b6102c160048036038101906102bc91906111c1565b61064c565b6040516102ce9190611219565b60405180910390f35b6102f160048036038101906102ec919061135c565b61066e565b6040516102fe9190611241565b60405180910390f35b610321600480360381019061031c9190611309565b6106f0565b005b606060038054610332906113c7565b80601f016020809104026020016040519081016040528092919081815260200182805461035e906113c7565b80156103a95780601f10610380576101008083540402835291602001916103a9565b820191905f5260205f20905b81548152906001019060200180831161038c57829003601f168201915b5050505050905090565b5f806103bd610774565b90506103ca81858561077b565b600191505092915050565b5f600254905090565b5f806103e8610774565b90506103f585828561078d565b610400858585610820565b60019150509392505050565b5f6009905090565b61041c610910565b610424610997565b565b61042e6109f8565b610436610910565b6104408282610a39565b8173ffffffffffffffffffffffffffffffffffffffff167f0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885826040516104869190611241565b60405180910390a25050565b61049a6109f8565b6104a43382610ab8565b3373ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5826040516104ea9190611241565b60405180910390a250565b5f60055f9054906101000a900460ff16905090565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b6040517fc8f64faf00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610589610910565b610591610b37565b565b5f600560019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546105cb906113c7565b80601f01602080910402602001604051908101604052809291908181526020018280546105f7906113c7565b80156106425780601f1061061957610100808354040283529160200191610642565b820191905f5260205f20905b81548152906001019060200180831161062557829003601f168201915b5050505050905090565b5f80610656610774565b9050610663818585610820565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b6106f8610910565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610768575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161075f9190611343565b60405180910390fd5b61077181610b99565b50565b5f33905090565b6107888383836001610c5e565b505050565b5f610798848461066e565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81101561081a578181101561080b578281836040517ffb8f41b2000000000000000000000000000000000000000000000000000000008152600401610802939291906113f7565b60405180910390fd5b61081984848484035f610c5e565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610890575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016108879190611343565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610900575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108f79190611343565b60405180910390fd5b61090b838383610e2d565b505050565b610918610774565b73ffffffffffffffffffffffffffffffffffffffff16610936610593565b73ffffffffffffffffffffffffffffffffffffffff161461099557610959610774565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161098c9190611343565b60405180910390fd5b565b61099f611046565b5f60055f6101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6109e1610774565b6040516109ee9190611343565b60405180910390a1565b610a006104f5565b15610a37576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610aa9575f6040517fec442f05000000000000000000000000000000000000000000000000000000008152600401610aa09190611343565b60405180910390fd5b610ab45f8383610e2d565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610b28575f6040517f96c6fd1e000000000000000000000000000000000000000000000000000000008152600401610b1f9190611343565b60405180910390fd5b610b33825f83610e2d565b5050565b610b3f6109f8565b600160055f6101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610b82610774565b604051610b8f9190611343565b60405180910390a1565b5f600560019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610cce575f6040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610cc59190611343565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610d3e575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610d359190611343565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610e27578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610e1e9190611241565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610e7d578060025f828254610e719190611459565b92505081905550610f4b565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610f06578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610efd939291906113f7565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610f92578060025f8282540392505081905550610fdc565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516110399190611241565b60405180910390a3505050565b61104e6104f5565b611084576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f81519050919050565b5f82825260208201905092915050565b5f5b838110156110bd5780820151818401526020810190506110a2565b5f8484015250505050565b5f601f19601f8301169050919050565b5f6110e282611086565b6110ec8185611090565b93506110fc8185602086016110a0565b611105816110c8565b840191505092915050565b5f6020820190508181035f83015261112881846110d8565b905092915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61115d82611134565b9050919050565b61116d81611153565b8114611177575f80fd5b50565b5f8135905061118881611164565b92915050565b5f819050919050565b6111a08161118e565b81146111aa575f80fd5b50565b5f813590506111bb81611197565b92915050565b5f80604083850312156111d7576111d6611130565b5b5f6111e48582860161117a565b92505060206111f5858286016111ad565b9150509250929050565b5f8115159050919050565b611213816111ff565b82525050565b5f60208201905061122c5f83018461120a565b92915050565b61123b8161118e565b82525050565b5f6020820190506112545f830184611232565b92915050565b5f805f6060848603121561127157611270611130565b5b5f61127e8682870161117a565b935050602061128f8682870161117a565b92505060406112a0868287016111ad565b9150509250925092565b5f60ff82169050919050565b6112bf816112aa565b82525050565b5f6020820190506112d85f8301846112b6565b92915050565b5f602082840312156112f3576112f2611130565b5b5f611300848285016111ad565b91505092915050565b5f6020828403121561131e5761131d611130565b5b5f61132b8482850161117a565b91505092915050565b61133d81611153565b82525050565b5f6020820190506113565f830184611334565b92915050565b5f806040838503121561137257611371611130565b5b5f61137f8582860161117a565b92505060206113908582860161117a565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806113de57607f821691505b6020821081036113f1576113f061139a565b5b50919050565b5f60608201905061140a5f830186611334565b6114176020830185611232565b6114246040830184611232565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6114638261118e565b915061146e8361118e565b92508282019050808211156114865761148561142c565b5b9291505056fea2646970667358221220c5ec7eaa9aba044cbcd6fdc04777811ee796ed761afda2439203a061a9335d8f64736f6c63430008180033",
		"opcodes": "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH3 0x10 JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD PUSH3 0x1C02 CODESIZE SUB DUP1 PUSH3 0x1C02 DUP4 CODECOPY DUP2 DUP2 ADD PUSH1 0x40 MSTORE DUP2 ADD SWAP1 PUSH3 0x36 SWAP2 SWAP1 PUSH3 0x336 JUMP JUMPDEST CALLER DUP3 DUP3 DUP2 PUSH1 0x3 SWAP1 DUP2 PUSH3 0x4A SWAP2 SWAP1 PUSH3 0x5F0 JUMP JUMPDEST POP DUP1 PUSH1 0x4 SWAP1 DUP2 PUSH3 0x5C SWAP2 SWAP1 PUSH3 0x5F0 JUMP JUMPDEST POP POP POP PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH3 0xD2 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0x1E4FBDF700000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH3 0xC9 SWAP2 SWAP1 PUSH3 0x717 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH3 0xE3 DUP2 PUSH3 0xEC PUSH1 0x20 SHL PUSH1 0x20 SHR JUMP JUMPDEST POP POP POP PUSH3 0x732 JUMP JUMPDEST PUSH0 PUSH1 0x5 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP DUP2 PUSH1 0x5 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x40 MLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH0 PUSH1 0x1F NOT PUSH1 0x1F DUP4 ADD AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH0 MSTORE PUSH1 0x41 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST PUSH3 0x212 DUP3 PUSH3 0x1CA JUMP JUMPDEST DUP2 ADD DUP2 DUP2 LT PUSH8 0xFFFFFFFFFFFFFFFF DUP3 GT OR ISZERO PUSH3 0x234 JUMPI PUSH3 0x233 PUSH3 0x1DA JUMP JUMPDEST JUMPDEST DUP1 PUSH1 0x40 MSTORE POP POP POP JUMP JUMPDEST PUSH0 PUSH3 0x248 PUSH3 0x1B1 JUMP JUMPDEST SWAP1 POP PUSH3 0x256 DUP3 DUP3 PUSH3 0x207 JUMP JUMPDEST SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH8 0xFFFFFFFFFFFFFFFF DUP3 GT ISZERO PUSH3 0x278 JUMPI PUSH3 0x277 PUSH3 0x1DA JUMP JUMPDEST JUMPDEST PUSH3 0x283 DUP3 PUSH3 0x1CA JUMP JUMPDEST SWAP1 POP PUSH1 0x20 DUP2 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH3 0x2AF JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH3 0x292 JUMP JUMPDEST PUSH0 DUP5 DUP5 ADD MSTORE POP POP POP POP JUMP JUMPDEST PUSH0 PUSH3 0x2D0 PUSH3 0x2CA DUP5 PUSH3 0x25B JUMP JUMPDEST PUSH3 0x23D JUMP JUMPDEST SWAP1 POP DUP3 DUP2 MSTORE PUSH1 0x20 DUP2 ADD DUP5 DUP5 DUP5 ADD GT ISZERO PUSH3 0x2EF JUMPI PUSH3 0x2EE PUSH3 0x1C6 JUMP JUMPDEST JUMPDEST PUSH3 0x2FC DUP5 DUP3 DUP6 PUSH3 0x290 JUMP JUMPDEST POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH0 DUP3 PUSH1 0x1F DUP4 ADD SLT PUSH3 0x31B JUMPI PUSH3 0x31A PUSH3 0x1C2 JUMP JUMPDEST JUMPDEST DUP2 MLOAD PUSH3 0x32D DUP5 DUP3 PUSH1 0x20 DUP7 ADD PUSH3 0x2BA JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH3 0x34F JUMPI PUSH3 0x34E PUSH3 0x1BA JUMP JUMPDEST JUMPDEST PUSH0 DUP4 ADD MLOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH3 0x36F JUMPI PUSH3 0x36E PUSH3 0x1BE JUMP JUMPDEST JUMPDEST PUSH3 0x37D DUP6 DUP3 DUP7 ADD PUSH3 0x304 JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 DUP4 ADD MLOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH3 0x3A1 JUMPI PUSH3 0x3A0 PUSH3 0x1BE JUMP JUMPDEST JUMPDEST PUSH3 0x3AF DUP6 DUP3 DUP7 ADD PUSH3 0x304 JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH0 DUP2 MLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH0 MSTORE PUSH1 0x22 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST PUSH0 PUSH1 0x2 DUP3 DIV SWAP1 POP PUSH1 0x1 DUP3 AND DUP1 PUSH3 0x408 JUMPI PUSH1 0x7F DUP3 AND SWAP2 POP JUMPDEST PUSH1 0x20 DUP3 LT DUP2 SUB PUSH3 0x41E JUMPI PUSH3 0x41D PUSH3 0x3C3 JUMP JUMPDEST JUMPDEST POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 DUP2 SWAP1 POP DUP2 PUSH0 MSTORE PUSH1 0x20 PUSH0 KECCAK256 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH1 0x20 PUSH1 0x1F DUP4 ADD DIV SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 DUP3 DUP3 SHL SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x8 DUP4 MUL PUSH3 0x482 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 PUSH3 0x445 JUMP JUMPDEST PUSH3 0x48E DUP7 DUP4 PUSH3 0x445 JUMP JUMPDEST SWAP6 POP DUP1 NOT DUP5 AND SWAP4 POP DUP1 DUP7 AND DUP5 OR SWAP3 POP POP POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH3 0x4D8 PUSH3 0x4D2 PUSH3 0x4CC DUP5 PUSH3 0x4A6 JUMP JUMPDEST PUSH3 0x4AF JUMP JUMPDEST PUSH3 0x4A6 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH3 0x4F3 DUP4 PUSH3 0x4B8 JUMP JUMPDEST PUSH3 0x50B PUSH3 0x502 DUP3 PUSH3 0x4DF JUMP JUMPDEST DUP5 DUP5 SLOAD PUSH3 0x451 JUMP JUMPDEST DUP3 SSTORE POP POP POP POP JUMP JUMPDEST PUSH0 SWAP1 JUMP JUMPDEST PUSH3 0x521 PUSH3 0x513 JUMP JUMPDEST PUSH3 0x52E DUP2 DUP5 DUP5 PUSH3 0x4E8 JUMP JUMPDEST POP POP POP JUMP JUMPDEST JUMPDEST DUP2 DUP2 LT ISZERO PUSH3 0x555 JUMPI PUSH3 0x549 PUSH0 DUP3 PUSH3 0x517 JUMP JUMPDEST PUSH1 0x1 DUP2 ADD SWAP1 POP PUSH3 0x534 JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH1 0x1F DUP3 GT ISZERO PUSH3 0x5A4 JUMPI PUSH3 0x56E DUP2 PUSH3 0x424 JUMP JUMPDEST PUSH3 0x579 DUP5 PUSH3 0x436 JUMP JUMPDEST DUP2 ADD PUSH1 0x20 DUP6 LT ISZERO PUSH3 0x589 JUMPI DUP2 SWAP1 POP JUMPDEST PUSH3 0x5A1 PUSH3 0x598 DUP6 PUSH3 0x436 JUMP JUMPDEST DUP4 ADD DUP3 PUSH3 0x533 JUMP JUMPDEST POP POP JUMPDEST POP POP POP JUMP JUMPDEST PUSH0 DUP3 DUP3 SHR SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH3 0x5C6 PUSH0 NOT DUP5 PUSH1 0x8 MUL PUSH3 0x5A9 JUMP JUMPDEST NOT DUP1 DUP4 AND SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH3 0x5E0 DUP4 DUP4 PUSH3 0x5B5 JUMP JUMPDEST SWAP2 POP DUP3 PUSH1 0x2 MUL DUP3 OR SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH3 0x5FB DUP3 PUSH3 0x3B9 JUMP JUMPDEST PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH3 0x617 JUMPI PUSH3 0x616 PUSH3 0x1DA JUMP JUMPDEST JUMPDEST PUSH3 0x623 DUP3 SLOAD PUSH3 0x3F0 JUMP JUMPDEST PUSH3 0x630 DUP3 DUP3 DUP6 PUSH3 0x559 JUMP JUMPDEST PUSH0 PUSH1 0x20 SWAP1 POP PUSH1 0x1F DUP4 GT PUSH1 0x1 DUP2 EQ PUSH3 0x666 JUMPI PUSH0 DUP5 ISZERO PUSH3 0x651 JUMPI DUP3 DUP8 ADD MLOAD SWAP1 POP JUMPDEST PUSH3 0x65D DUP6 DUP3 PUSH3 0x5D3 JUMP JUMPDEST DUP7 SSTORE POP PUSH3 0x6CC JUMP JUMPDEST PUSH1 0x1F NOT DUP5 AND PUSH3 0x676 DUP7 PUSH3 0x424 JUMP JUMPDEST PUSH0 JUMPDEST DUP3 DUP2 LT ISZERO PUSH3 0x69F JUMPI DUP5 DUP10 ADD MLOAD DUP3 SSTORE PUSH1 0x1 DUP3 ADD SWAP2 POP PUSH1 0x20 DUP6 ADD SWAP5 POP PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH3 0x678 JUMP JUMPDEST DUP7 DUP4 LT ISZERO PUSH3 0x6BF JUMPI DUP5 DUP10 ADD MLOAD PUSH3 0x6BB PUSH1 0x1F DUP10 AND DUP3 PUSH3 0x5B5 JUMP JUMPDEST DUP4 SSTORE POP JUMPDEST PUSH1 0x1 PUSH1 0x2 DUP9 MUL ADD DUP9 SSTORE POP POP POP JUMPDEST POP POP POP POP POP POP JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH3 0x6FF DUP3 PUSH3 0x6D4 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH3 0x711 DUP2 PUSH3 0x6F3 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH3 0x72C PUSH0 DUP4 ADD DUP5 PUSH3 0x706 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x14C2 DUP1 PUSH3 0x740 PUSH0 CODECOPY PUSH0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0xF JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH2 0x109 JUMPI PUSH0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x5C975ABB GT PUSH2 0xA0 JUMPI DUP1 PUSH4 0x8DA5CB5B GT PUSH2 0x6F JUMPI DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0x26B JUMPI DUP1 PUSH4 0x95D89B41 EQ PUSH2 0x289 JUMPI DUP1 PUSH4 0xA9059CBB EQ PUSH2 0x2A7 JUMPI DUP1 PUSH4 0xDD62ED3E EQ PUSH2 0x2D7 JUMPI DUP1 PUSH4 0xF2FDE38B EQ PUSH2 0x307 JUMPI PUSH2 0x109 JUMP JUMPDEST DUP1 PUSH4 0x5C975ABB EQ PUSH2 0x209 JUMPI DUP1 PUSH4 0x70A08231 EQ PUSH2 0x227 JUMPI DUP1 PUSH4 0x715018A6 EQ PUSH2 0x257 JUMPI DUP1 PUSH4 0x8456CB59 EQ PUSH2 0x261 JUMPI PUSH2 0x109 JUMP JUMPDEST DUP1 PUSH4 0x313CE567 GT PUSH2 0xDC JUMPI DUP1 PUSH4 0x313CE567 EQ PUSH2 0x1A9 JUMPI DUP1 PUSH4 0x3F4BA83A EQ PUSH2 0x1C7 JUMPI DUP1 PUSH4 0x40C10F19 EQ PUSH2 0x1D1 JUMPI DUP1 PUSH4 0x42966C68 EQ PUSH2 0x1ED JUMPI PUSH2 0x109 JUMP JUMPDEST DUP1 PUSH4 0x6FDDE03 EQ PUSH2 0x10D JUMPI DUP1 PUSH4 0x95EA7B3 EQ PUSH2 0x12B JUMPI DUP1 PUSH4 0x18160DDD EQ PUSH2 0x15B JUMPI DUP1 PUSH4 0x23B872DD EQ PUSH2 0x179 JUMPI JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH2 0x115 PUSH2 0x323 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x122 SWAP2 SWAP1 PUSH2 0x1110 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x145 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x140 SWAP2 SWAP1 PUSH2 0x11C1 JUMP JUMPDEST PUSH2 0x3B3 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x152 SWAP2 SWAP1 PUSH2 0x1219 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x163 PUSH2 0x3D5 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x170 SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x193 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x18E SWAP2 SWAP1 PUSH2 0x125A JUMP JUMPDEST PUSH2 0x3DE JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1A0 SWAP2 SWAP1 PUSH2 0x1219 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x1B1 PUSH2 0x40C JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1BE SWAP2 SWAP1 PUSH2 0x12C5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x1CF PUSH2 0x414 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x1EB PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x1E6 SWAP2 SWAP1 PUSH2 0x11C1 JUMP JUMPDEST PUSH2 0x426 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x207 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x202 SWAP2 SWAP1 PUSH2 0x12DE JUMP JUMPDEST PUSH2 0x492 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x211 PUSH2 0x4F5 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x21E SWAP2 SWAP1 PUSH2 0x1219 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x241 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x23C SWAP2 SWAP1 PUSH2 0x1309 JUMP JUMPDEST PUSH2 0x50A JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x24E SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x25F PUSH2 0x54F JUMP JUMPDEST STOP JUMPDEST PUSH2 0x269 PUSH2 0x581 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x273 PUSH2 0x593 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x280 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x291 PUSH2 0x5BC JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x29E SWAP2 SWAP1 PUSH2 0x1110 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x2C1 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x2BC SWAP2 SWAP1 PUSH2 0x11C1 JUMP JUMPDEST PUSH2 0x64C JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2CE SWAP2 SWAP1 PUSH2 0x1219 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x2F1 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x2EC SWAP2 SWAP1 PUSH2 0x135C JUMP JUMPDEST PUSH2 0x66E JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2FE SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x321 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x31C SWAP2 SWAP1 PUSH2 0x1309 JUMP JUMPDEST PUSH2 0x6F0 JUMP JUMPDEST STOP JUMPDEST PUSH1 0x60 PUSH1 0x3 DUP1 SLOAD PUSH2 0x332 SWAP1 PUSH2 0x13C7 JUMP JUMPDEST DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH2 0x35E SWAP1 PUSH2 0x13C7 JUMP JUMPDEST DUP1 ISZERO PUSH2 0x3A9 JUMPI DUP1 PUSH1 0x1F LT PUSH2 0x380 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0x3A9 JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH0 MSTORE PUSH1 0x20 PUSH0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0x38C JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP1 PUSH2 0x3BD PUSH2 0x774 JUMP JUMPDEST SWAP1 POP PUSH2 0x3CA DUP2 DUP6 DUP6 PUSH2 0x77B JUMP JUMPDEST PUSH1 0x1 SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x2 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP1 PUSH2 0x3E8 PUSH2 0x774 JUMP JUMPDEST SWAP1 POP PUSH2 0x3F5 DUP6 DUP3 DUP6 PUSH2 0x78D JUMP JUMPDEST PUSH2 0x400 DUP6 DUP6 DUP6 PUSH2 0x820 JUMP JUMPDEST PUSH1 0x1 SWAP2 POP POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH0 PUSH1 0x9 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0x41C PUSH2 0x910 JUMP JUMPDEST PUSH2 0x424 PUSH2 0x997 JUMP JUMPDEST JUMP JUMPDEST PUSH2 0x42E PUSH2 0x9F8 JUMP JUMPDEST PUSH2 0x436 PUSH2 0x910 JUMP JUMPDEST PUSH2 0x440 DUP3 DUP3 PUSH2 0xA39 JUMP JUMPDEST DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xF6798A560793A54C3BCFE86A93CDE1E73087D944C0EA20544137D4121396885 DUP3 PUSH1 0x40 MLOAD PUSH2 0x486 SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG2 POP POP JUMP JUMPDEST PUSH2 0x49A PUSH2 0x9F8 JUMP JUMPDEST PUSH2 0x4A4 CALLER DUP3 PUSH2 0xAB8 JUMP JUMPDEST CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xCC16F5DBB4873280815C1EE09DBD06736CFFCC184412CF7A71A0FDB75D397CA5 DUP3 PUSH1 0x40 MLOAD PUSH2 0x4EA SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG2 POP JUMP JUMPDEST PUSH0 PUSH1 0x5 PUSH0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP1 PUSH0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 SLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH32 0xC8F64FAF00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x589 PUSH2 0x910 JUMP JUMPDEST PUSH2 0x591 PUSH2 0xB37 JUMP JUMPDEST JUMP JUMPDEST PUSH0 PUSH1 0x5 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x60 PUSH1 0x4 DUP1 SLOAD PUSH2 0x5CB SWAP1 PUSH2 0x13C7 JUMP JUMPDEST DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH2 0x5F7 SWAP1 PUSH2 0x13C7 JUMP JUMPDEST DUP1 ISZERO PUSH2 0x642 JUMPI DUP1 PUSH1 0x1F LT PUSH2 0x619 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0x642 JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH0 MSTORE PUSH1 0x20 PUSH0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0x625 JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP1 PUSH2 0x656 PUSH2 0x774 JUMP JUMPDEST SWAP1 POP PUSH2 0x663 DUP2 DUP6 DUP6 PUSH2 0x820 JUMP JUMPDEST PUSH1 0x1 SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x1 PUSH0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 PUSH0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 SLOAD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x6F8 PUSH2 0x910 JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0x768 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0x1E4FBDF700000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x75F SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x771 DUP2 PUSH2 0xB99 JUMP JUMPDEST POP JUMP JUMPDEST PUSH0 CALLER SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0x788 DUP4 DUP4 DUP4 PUSH1 0x1 PUSH2 0xC5E JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH0 PUSH2 0x798 DUP5 DUP5 PUSH2 0x66E JUMP JUMPDEST SWAP1 POP PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP2 LT ISZERO PUSH2 0x81A JUMPI DUP2 DUP2 LT ISZERO PUSH2 0x80B JUMPI DUP3 DUP2 DUP4 PUSH1 0x40 MLOAD PUSH32 0xFB8F41B200000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x802 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x13F7 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x819 DUP5 DUP5 DUP5 DUP5 SUB PUSH0 PUSH2 0xC5E JUMP JUMPDEST JUMPDEST POP POP POP POP JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0x890 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0x96C6FD1E00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x887 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0x900 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0xEC442F0500000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x8F7 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x90B DUP4 DUP4 DUP4 PUSH2 0xE2D JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH2 0x918 PUSH2 0x774 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x936 PUSH2 0x593 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x995 JUMPI PUSH2 0x959 PUSH2 0x774 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH32 0x118CDAA700000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x98C SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST JUMP JUMPDEST PUSH2 0x99F PUSH2 0x1046 JUMP JUMPDEST PUSH0 PUSH1 0x5 PUSH0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH32 0x5DB9EE0A495BF2E6FF9C91A7834C1BA4FDD244A5E8AA4E537BD38AEAE4B073AA PUSH2 0x9E1 PUSH2 0x774 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x9EE SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 JUMP JUMPDEST PUSH2 0xA00 PUSH2 0x4F5 JUMP JUMPDEST ISZERO PUSH2 0xA37 JUMPI PUSH1 0x40 MLOAD PUSH32 0xD93C066500000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xAA9 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0xEC442F0500000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xAA0 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0xAB4 PUSH0 DUP4 DUP4 PUSH2 0xE2D JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xB28 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0x96C6FD1E00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xB1F SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0xB33 DUP3 PUSH0 DUP4 PUSH2 0xE2D JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH2 0xB3F PUSH2 0x9F8 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x5 PUSH0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH32 0x62E78CEA01BEE320CD4E420270B5EA74000D11B0C9F74754EBDBFC544B05A258 PUSH2 0xB82 PUSH2 0x774 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0xB8F SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 JUMP JUMPDEST PUSH0 PUSH1 0x5 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP DUP2 PUSH1 0x5 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xCCE JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0xE602DF0500000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xCC5 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xD3E JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0x94280D6200000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xD35 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 PUSH1 0x1 PUSH0 DUP7 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 PUSH0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 DUP2 SWAP1 SSTORE POP DUP1 ISZERO PUSH2 0xE27 JUMPI DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8C5BE1E5EBEC7D5BD14F71427D1E84F3DD0314C0F7B2291E5B200AC8C7C3B925 DUP5 PUSH1 0x40 MLOAD PUSH2 0xE1E SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 JUMPDEST POP POP POP POP JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xE7D JUMPI DUP1 PUSH1 0x2 PUSH0 DUP3 DUP3 SLOAD PUSH2 0xE71 SWAP2 SWAP1 PUSH2 0x1459 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH2 0xF4B JUMP JUMPDEST PUSH0 DUP1 PUSH0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 SLOAD SWAP1 POP DUP2 DUP2 LT ISZERO PUSH2 0xF06 JUMPI DUP4 DUP2 DUP4 PUSH1 0x40 MLOAD PUSH32 0xE450D38C00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xEFD SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x13F7 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 DUP2 SUB PUSH0 DUP1 DUP7 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 DUP2 SWAP1 SSTORE POP POP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xF92 JUMPI DUP1 PUSH1 0x2 PUSH0 DUP3 DUP3 SLOAD SUB SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH2 0xFDC JUMP JUMPDEST DUP1 PUSH0 DUP1 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 PUSH0 DUP3 DUP3 SLOAD ADD SWAP3 POP POP DUP2 SWAP1 SSTORE POP JUMPDEST DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF DUP4 PUSH1 0x40 MLOAD PUSH2 0x1039 SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP JUMP JUMPDEST PUSH2 0x104E PUSH2 0x4F5 JUMP JUMPDEST PUSH2 0x1084 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8DFC202B00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST JUMP JUMPDEST PUSH0 DUP2 MLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x10BD JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x10A2 JUMP JUMPDEST PUSH0 DUP5 DUP5 ADD MSTORE POP POP POP POP JUMP JUMPDEST PUSH0 PUSH1 0x1F NOT PUSH1 0x1F DUP4 ADD AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH2 0x10E2 DUP3 PUSH2 0x1086 JUMP JUMPDEST PUSH2 0x10EC DUP2 DUP6 PUSH2 0x1090 JUMP JUMPDEST SWAP4 POP PUSH2 0x10FC DUP2 DUP6 PUSH1 0x20 DUP7 ADD PUSH2 0x10A0 JUMP JUMPDEST PUSH2 0x1105 DUP2 PUSH2 0x10C8 JUMP JUMPDEST DUP5 ADD SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH0 DUP4 ADD MSTORE PUSH2 0x1128 DUP2 DUP5 PUSH2 0x10D8 JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH2 0x115D DUP3 PUSH2 0x1134 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x116D DUP2 PUSH2 0x1153 JUMP JUMPDEST DUP2 EQ PUSH2 0x1177 JUMPI PUSH0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x1188 DUP2 PUSH2 0x1164 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x11A0 DUP2 PUSH2 0x118E JUMP JUMPDEST DUP2 EQ PUSH2 0x11AA JUMPI PUSH0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x11BB DUP2 PUSH2 0x1197 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x11D7 JUMPI PUSH2 0x11D6 PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x11E4 DUP6 DUP3 DUP7 ADD PUSH2 0x117A JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x11F5 DUP6 DUP3 DUP7 ADD PUSH2 0x11AD JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH0 DUP2 ISZERO ISZERO SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x1213 DUP2 PUSH2 0x11FF JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x122C PUSH0 DUP4 ADD DUP5 PUSH2 0x120A JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x123B DUP2 PUSH2 0x118E JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1254 PUSH0 DUP4 ADD DUP5 PUSH2 0x1232 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH0 PUSH1 0x60 DUP5 DUP7 SUB SLT ISZERO PUSH2 0x1271 JUMPI PUSH2 0x1270 PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x127E DUP7 DUP3 DUP8 ADD PUSH2 0x117A JUMP JUMPDEST SWAP4 POP POP PUSH1 0x20 PUSH2 0x128F DUP7 DUP3 DUP8 ADD PUSH2 0x117A JUMP JUMPDEST SWAP3 POP POP PUSH1 0x40 PUSH2 0x12A0 DUP7 DUP3 DUP8 ADD PUSH2 0x11AD JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 POP SWAP3 JUMP JUMPDEST PUSH0 PUSH1 0xFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x12BF DUP2 PUSH2 0x12AA JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x12D8 PUSH0 DUP4 ADD DUP5 PUSH2 0x12B6 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x12F3 JUMPI PUSH2 0x12F2 PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x1300 DUP5 DUP3 DUP6 ADD PUSH2 0x11AD JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x131E JUMPI PUSH2 0x131D PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x132B DUP5 DUP3 DUP6 ADD PUSH2 0x117A JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x133D DUP2 PUSH2 0x1153 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1356 PUSH0 DUP4 ADD DUP5 PUSH2 0x1334 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x1372 JUMPI PUSH2 0x1371 PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x137F DUP6 DUP3 DUP7 ADD PUSH2 0x117A JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x1390 DUP6 DUP3 DUP7 ADD PUSH2 0x117A JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH0 MSTORE PUSH1 0x22 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST PUSH0 PUSH1 0x2 DUP3 DIV SWAP1 POP PUSH1 0x1 DUP3 AND DUP1 PUSH2 0x13DE JUMPI PUSH1 0x7F DUP3 AND SWAP2 POP JUMPDEST PUSH1 0x20 DUP3 LT DUP2 SUB PUSH2 0x13F1 JUMPI PUSH2 0x13F0 PUSH2 0x139A JUMP JUMPDEST JUMPDEST POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH1 0x60 DUP3 ADD SWAP1 POP PUSH2 0x140A PUSH0 DUP4 ADD DUP7 PUSH2 0x1334 JUMP JUMPDEST PUSH2 0x1417 PUSH1 0x20 DUP4 ADD DUP6 PUSH2 0x1232 JUMP JUMPDEST PUSH2 0x1424 PUSH1 0x40 DUP4 ADD DUP5 PUSH2 0x1232 JUMP JUMPDEST SWAP5 SWAP4 POP POP POP POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST PUSH0 PUSH2 0x1463 DUP3 PUSH2 0x118E JUMP JUMPDEST SWAP2 POP PUSH2 0x146E DUP4 PUSH2 0x118E JUMP JUMPDEST SWAP3 POP DUP3 DUP3 ADD SWAP1 POP DUP1 DUP3 GT ISZERO PUSH2 0x1486 JUMPI PUSH2 0x1485 PUSH2 0x142C JUMP JUMPDEST JUMPDEST SWAP3 SWAP2 POP POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 0xC5 0xEC PUSH31 0xAA9ABA044CBCD6FDC04777811EE796ED761AFDA2439203A061A9335D8F6473 PUSH16 0x6C634300081800330000000000000000 ",
		"sourceMap": "221:949:7:-:0;;;441:105;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;270:10;511:5;518:7;1656:5:2;1648;:13;;;;;;:::i;:::-;;1681:7;1671;:17;;;;;;:::i;:::-;;1582:113;;1297:1:0;1273:26;;:12;:26;;;1269:95;;1350:1;1322:31;;;;;;;;;;;:::i;:::-;;;;;;;;1269:95;1373:32;1392:12;1373:18;;;:32;;:::i;:::-;1225:187;441:105:7;;221:949;;2912:187:0;2985:16;3004:6;;;;;;;;;;;2985:25;;3029:8;3020:6;;:17;;;;;;;;;;;;;;;;;;3083:8;3052:40;;3073:8;3052:40;;;;;;;;;;;;2975:124;2912:187;:::o;7:75:8:-;40:6;73:2;67:9;57:19;;7:75;:::o;88:117::-;197:1;194;187:12;211:117;320:1;317;310:12;334:117;443:1;440;433:12;457:117;566:1;563;556:12;580:102;621:6;672:2;668:7;663:2;656:5;652:14;648:28;638:38;;580:102;;;:::o;688:180::-;736:77;733:1;726:88;833:4;830:1;823:15;857:4;854:1;847:15;874:281;957:27;979:4;957:27;:::i;:::-;949:6;945:40;1087:6;1075:10;1072:22;1051:18;1039:10;1036:34;1033:62;1030:88;;;1098:18;;:::i;:::-;1030:88;1138:10;1134:2;1127:22;917:238;874:281;;:::o;1161:129::-;1195:6;1222:20;;:::i;:::-;1212:30;;1251:33;1279:4;1271:6;1251:33;:::i;:::-;1161:129;;;:::o;1296:308::-;1358:4;1448:18;1440:6;1437:30;1434:56;;;1470:18;;:::i;:::-;1434:56;1508:29;1530:6;1508:29;:::i;:::-;1500:37;;1592:4;1586;1582:15;1574:23;;1296:308;;;:::o;1610:246::-;1691:1;1701:113;1715:6;1712:1;1709:13;1701:113;;;1800:1;1795:3;1791:11;1785:18;1781:1;1776:3;1772:11;1765:39;1737:2;1734:1;1730:10;1725:15;;1701:113;;;1848:1;1839:6;1834:3;1830:16;1823:27;1672:184;1610:246;;;:::o;1862:434::-;1951:5;1976:66;1992:49;2034:6;1992:49;:::i;:::-;1976:66;:::i;:::-;1967:75;;2065:6;2058:5;2051:21;2103:4;2096:5;2092:16;2141:3;2132:6;2127:3;2123:16;2120:25;2117:112;;;2148:79;;:::i;:::-;2117:112;2238:52;2283:6;2278:3;2273;2238:52;:::i;:::-;1957:339;1862:434;;;;;:::o;2316:355::-;2383:5;2432:3;2425:4;2417:6;2413:17;2409:27;2399:122;;2440:79;;:::i;:::-;2399:122;2550:6;2544:13;2575:90;2661:3;2653:6;2646:4;2638:6;2634:17;2575:90;:::i;:::-;2566:99;;2389:282;2316:355;;;;:::o;2677:853::-;2776:6;2784;2833:2;2821:9;2812:7;2808:23;2804:32;2801:119;;;2839:79;;:::i;:::-;2801:119;2980:1;2969:9;2965:17;2959:24;3010:18;3002:6;2999:30;2996:117;;;3032:79;;:::i;:::-;2996:117;3137:74;3203:7;3194:6;3183:9;3179:22;3137:74;:::i;:::-;3127:84;;2930:291;3281:2;3270:9;3266:18;3260:25;3312:18;3304:6;3301:30;3298:117;;;3334:79;;:::i;:::-;3298:117;3439:74;3505:7;3496:6;3485:9;3481:22;3439:74;:::i;:::-;3429:84;;3231:292;2677:853;;;;;:::o;3536:99::-;3588:6;3622:5;3616:12;3606:22;;3536:99;;;:::o;3641:180::-;3689:77;3686:1;3679:88;3786:4;3783:1;3776:15;3810:4;3807:1;3800:15;3827:320;3871:6;3908:1;3902:4;3898:12;3888:22;;3955:1;3949:4;3945:12;3976:18;3966:81;;4032:4;4024:6;4020:17;4010:27;;3966:81;4094:2;4086:6;4083:14;4063:18;4060:38;4057:84;;4113:18;;:::i;:::-;4057:84;3878:269;3827:320;;;:::o;4153:141::-;4202:4;4225:3;4217:11;;4248:3;4245:1;4238:14;4282:4;4279:1;4269:18;4261:26;;4153:141;;;:::o;4300:93::-;4337:6;4384:2;4379;4372:5;4368:14;4364:23;4354:33;;4300:93;;;:::o;4399:107::-;4443:8;4493:5;4487:4;4483:16;4462:37;;4399:107;;;;:::o;4512:393::-;4581:6;4631:1;4619:10;4615:18;4654:97;4684:66;4673:9;4654:97;:::i;:::-;4772:39;4802:8;4791:9;4772:39;:::i;:::-;4760:51;;4844:4;4840:9;4833:5;4829:21;4820:30;;4893:4;4883:8;4879:19;4872:5;4869:30;4859:40;;4588:317;;4512:393;;;;;:::o;4911:77::-;4948:7;4977:5;4966:16;;4911:77;;;:::o;4994:60::-;5022:3;5043:5;5036:12;;4994:60;;;:::o;5060:142::-;5110:9;5143:53;5161:34;5170:24;5188:5;5170:24;:::i;:::-;5161:34;:::i;:::-;5143:53;:::i;:::-;5130:66;;5060:142;;;:::o;5208:75::-;5251:3;5272:5;5265:12;;5208:75;;;:::o;5289:269::-;5399:39;5430:7;5399:39;:::i;:::-;5460:91;5509:41;5533:16;5509:41;:::i;:::-;5501:6;5494:4;5488:11;5460:91;:::i;:::-;5454:4;5447:105;5365:193;5289:269;;;:::o;5564:73::-;5609:3;5564:73;:::o;5643:189::-;5720:32;;:::i;:::-;5761:65;5819:6;5811;5805:4;5761:65;:::i;:::-;5696:136;5643:189;;:::o;5838:186::-;5898:120;5915:3;5908:5;5905:14;5898:120;;;5969:39;6006:1;5999:5;5969:39;:::i;:::-;5942:1;5935:5;5931:13;5922:22;;5898:120;;;5838:186;;:::o;6030:543::-;6131:2;6126:3;6123:11;6120:446;;;6165:38;6197:5;6165:38;:::i;:::-;6249:29;6267:10;6249:29;:::i;:::-;6239:8;6235:44;6432:2;6420:10;6417:18;6414:49;;;6453:8;6438:23;;6414:49;6476:80;6532:22;6550:3;6532:22;:::i;:::-;6522:8;6518:37;6505:11;6476:80;:::i;:::-;6135:431;;6120:446;6030:543;;;:::o;6579:117::-;6633:8;6683:5;6677:4;6673:16;6652:37;;6579:117;;;;:::o;6702:169::-;6746:6;6779:51;6827:1;6823:6;6815:5;6812:1;6808:13;6779:51;:::i;:::-;6775:56;6860:4;6854;6850:15;6840:25;;6753:118;6702:169;;;;:::o;6876:295::-;6952:4;7098:29;7123:3;7117:4;7098:29;:::i;:::-;7090:37;;7160:3;7157:1;7153:11;7147:4;7144:21;7136:29;;6876:295;;;;:::o;7176:1395::-;7293:37;7326:3;7293:37;:::i;:::-;7395:18;7387:6;7384:30;7381:56;;;7417:18;;:::i;:::-;7381:56;7461:38;7493:4;7487:11;7461:38;:::i;:::-;7546:67;7606:6;7598;7592:4;7546:67;:::i;:::-;7640:1;7664:4;7651:17;;7696:2;7688:6;7685:14;7713:1;7708:618;;;;8370:1;8387:6;8384:77;;;8436:9;8431:3;8427:19;8421:26;8412:35;;8384:77;8487:67;8547:6;8540:5;8487:67;:::i;:::-;8481:4;8474:81;8343:222;7678:887;;7708:618;7760:4;7756:9;7748:6;7744:22;7794:37;7826:4;7794:37;:::i;:::-;7853:1;7867:208;7881:7;7878:1;7875:14;7867:208;;;7960:9;7955:3;7951:19;7945:26;7937:6;7930:42;8011:1;8003:6;7999:14;7989:24;;8058:2;8047:9;8043:18;8030:31;;7904:4;7901:1;7897:12;7892:17;;7867:208;;;8103:6;8094:7;8091:19;8088:179;;;8161:9;8156:3;8152:19;8146:26;8204:48;8246:4;8238:6;8234:17;8223:9;8204:48;:::i;:::-;8196:6;8189:64;8111:156;8088:179;8313:1;8309;8301:6;8297:14;8293:22;8287:4;8280:36;7715:611;;;7678:887;;7268:1303;;;7176:1395;;:::o;8577:126::-;8614:7;8654:42;8647:5;8643:54;8632:65;;8577:126;;;:::o;8709:96::-;8746:7;8775:24;8793:5;8775:24;:::i;:::-;8764:35;;8709:96;;;:::o;8811:118::-;8898:24;8916:5;8898:24;:::i;:::-;8893:3;8886:37;8811:118;;:::o;8935:222::-;9028:4;9066:2;9055:9;9051:18;9043:26;;9079:71;9147:1;9136:9;9132:17;9123:6;9079:71;:::i;:::-;8935:222;;;;:::o;221:949:7:-;;;;;;;"
	},
	"abi": [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "spender",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "approve",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "burn",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_symbol",
					"type": "string"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [],
			"name": "DisabledRenounceOwnership",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "spender",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "allowance",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "needed",
					"type": "uint256"
				}
			],
			"name": "ERC20InsufficientAllowance",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "sender",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "balance",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "needed",
					"type": "uint256"
				}
			],
			"name": "ERC20InsufficientBalance",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "approver",
					"type": "address"
				}
			],
			"name": "ERC20InvalidApprover",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "receiver",
					"type": "address"
				}
			],
			"name": "ERC20InvalidReceiver",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "sender",
					"type": "address"
				}
			],
			"name": "ERC20InvalidSender",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "spender",
					"type": "address"
				}
			],
			"name": "ERC20InvalidSpender",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "EnforcedPause",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "ExpectedPause",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_to",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "mint",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				}
			],
			"name": "OwnableInvalidOwner",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "account",
					"type": "address"
				}
			],
			"name": "OwnableUnauthorizedAccount",
			"type": "error"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "owner",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "spender",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "Approval",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "from",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "Burn",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "to",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "Mint",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"inputs": [],
			"name": "pause",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "account",
					"type": "address"
				}
			],
			"name": "Paused",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "to",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "transfer",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "from",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "to",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "Transfer",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "from",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "to",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "transferFrom",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "unpause",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "account",
					"type": "address"
				}
			],
			"name": "Unpaused",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "spender",
					"type": "address"
				}
			],
			"name": "allowance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "account",
					"type": "address"
				}
			],
			"name": "balanceOf",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "decimals",
			"outputs": [
				{
					"internalType": "uint8",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "name",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "paused",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "renounceOwnership",
			"outputs": [],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "symbol",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "totalSupply",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	],
	"storageLayout": {
		"storage": [
			{
				"astId": 307,
				"contract": "contracts/BeldexBEP20.sol:BeldexBEP20",
				"label": "_balances",
				"offset": 0,
				"slot": "0",
				"type": "t_mapping(t_address,t_uint256)"
			},
			{
				"astId": 313,
				"contract": "contracts/BeldexBEP20.sol:BeldexBEP20",
				"label": "_allowances",
				"offset": 0,
				"slot": "1",
				"type": "t_mapping(t_address,t_mapping(t_address,t_uint256))"
			},
			{
				"astId": 315,
				"contract": "contracts/BeldexBEP20.sol:BeldexBEP20",
				"label": "_totalSupply",
				"offset": 0,
				"slot": "2",
				"type": "t_uint256"
			},
			{
				"astId": 317,
				"contract": "contracts/BeldexBEP20.sol:BeldexBEP20",
				"label": "_name",
				"offset": 0,
				"slot": "3",
				"type": "t_string_storage"
			},
			{
				"astId": 319,
				"contract": "contracts/BeldexBEP20.sol:BeldexBEP20",
				"label": "_symbol",
				"offset": 0,
				"slot": "4",
				"type": "t_string_storage"
			},
			{
				"astId": 942,
				"contract": "contracts/BeldexBEP20.sol:BeldexBEP20",
				"label": "_paused",
				"offset": 0,
				"slot": "5",
				"type": "t_bool"
			},
			{
				"astId": 8,
				"contract": "contracts/BeldexBEP20.sol:BeldexBEP20",
				"label": "_owner",
				"offset": 1,
				"slot": "5",
				"type": "t_address"
			}
		],
		"types": {
			"t_address": {
				"encoding": "inplace",
				"label": "address",
				"numberOfBytes": "20"
			},
			"t_bool": {
				"encoding": "inplace",
				"label": "bool",
				"numberOfBytes": "1"
			},
			"t_mapping(t_address,t_mapping(t_address,t_uint256))": {
				"encoding": "mapping",
				"key": "t_address",
				"label": "mapping(address => mapping(address => uint256))",
				"numberOfBytes": "32",
				"value": "t_mapping(t_address,t_uint256)"
			},
			"t_mapping(t_address,t_uint256)": {
				"encoding": "mapping",
				"key": "t_address",
				"label": "mapping(address => uint256)",
				"numberOfBytes": "32",
				"value": "t_uint256"
			},
			"t_string_storage": {
				"encoding": "bytes",
				"label": "string",
				"numberOfBytes": "32"
			},
			"t_uint256": {
				"encoding": "inplace",
				"label": "uint256",
				"numberOfBytes": "32"
			}
		}
	},
	"web3Deploy": "var _name = /* var of type string here */ ;\nvar _symbol = /* var of type string here */ ;\nvar beldexbep20Contract = new web3.eth.Contract([{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_symbol\",\"type\":\"string\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"DisabledRenounceOwnership\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"allowance\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"needed\",\"type\":\"uint256\"}],\"name\":\"ERC20InsufficientAllowance\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"balance\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"needed\",\"type\":\"uint256\"}],\"name\":\"ERC20InsufficientBalance\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"approver\",\"type\":\"address\"}],\"name\":\"ERC20InvalidApprover\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"}],\"name\":\"ERC20InvalidReceiver\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"ERC20InvalidSender\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"ERC20InvalidSpender\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"EnforcedPause\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ExpectedPause\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"OwnableInvalidOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"OwnableUnauthorizedAccount\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Burn\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Mint\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Paused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Unpaused\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"mint\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"pause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"paused\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"unpause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]);\nvar beldexbep20 = beldexbep20Contract.deploy({\n     data: '0x608060405234801562000010575f80fd5b5060405162001c0238038062001c02833981810160405281019062000036919062000336565b33828281600390816200004a9190620005f0565b5080600490816200005c9190620005f0565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000d2575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000c9919062000717565b60405180910390fd5b620000e381620000ec60201b60201c565b50505062000732565b5f600560019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6200021282620001ca565b810181811067ffffffffffffffff82111715620002345762000233620001da565b5b80604052505050565b5f62000248620001b1565b905062000256828262000207565b919050565b5f67ffffffffffffffff821115620002785762000277620001da565b5b6200028382620001ca565b9050602081019050919050565b5f5b83811015620002af57808201518184015260208101905062000292565b5f8484015250505050565b5f620002d0620002ca846200025b565b6200023d565b905082815260208101848484011115620002ef57620002ee620001c6565b5b620002fc84828562000290565b509392505050565b5f82601f8301126200031b576200031a620001c2565b5b81516200032d848260208601620002ba565b91505092915050565b5f80604083850312156200034f576200034e620001ba565b5b5f83015167ffffffffffffffff8111156200036f576200036e620001be565b5b6200037d8582860162000304565b925050602083015167ffffffffffffffff811115620003a157620003a0620001be565b5b620003af8582860162000304565b9150509250929050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806200040857607f821691505b6020821081036200041e576200041d620003c3565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620004827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000445565b6200048e868362000445565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f620004d8620004d2620004cc84620004a6565b620004af565b620004a6565b9050919050565b5f819050919050565b620004f383620004b8565b6200050b6200050282620004df565b84845462000451565b825550505050565b5f90565b6200052162000513565b6200052e818484620004e8565b505050565b5b818110156200055557620005495f8262000517565b60018101905062000534565b5050565b601f821115620005a4576200056e8162000424565b620005798462000436565b8101602085101562000589578190505b620005a1620005988562000436565b83018262000533565b50505b505050565b5f82821c905092915050565b5f620005c65f1984600802620005a9565b1980831691505092915050565b5f620005e08383620005b5565b9150826002028217905092915050565b620005fb82620003b9565b67ffffffffffffffff811115620006175762000616620001da565b5b620006238254620003f0565b6200063082828562000559565b5f60209050601f83116001811462000666575f841562000651578287015190505b6200065d8582620005d3565b865550620006cc565b601f198416620006768662000424565b5f5b828110156200069f5784890151825560018201915060208501945060208101905062000678565b86831015620006bf5784890151620006bb601f891682620005b5565b8355505b6001600288020188555050505b505050505050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f620006ff82620006d4565b9050919050565b6200071181620006f3565b82525050565b5f6020820190506200072c5f83018462000706565b92915050565b6114c280620007405f395ff3fe608060405234801561000f575f80fd5b5060043610610109575f3560e01c80635c975abb116100a05780638da5cb5b1161006f5780638da5cb5b1461026b57806395d89b4114610289578063a9059cbb146102a7578063dd62ed3e146102d7578063f2fde38b1461030757610109565b80635c975abb1461020957806370a0823114610227578063715018a6146102575780638456cb591461026157610109565b8063313ce567116100dc578063313ce567146101a95780633f4ba83a146101c757806340c10f19146101d157806342966c68146101ed57610109565b806306fdde031461010d578063095ea7b31461012b57806318160ddd1461015b57806323b872dd14610179575b5f80fd5b610115610323565b6040516101229190611110565b60405180910390f35b610145600480360381019061014091906111c1565b6103b3565b6040516101529190611219565b60405180910390f35b6101636103d5565b6040516101709190611241565b60405180910390f35b610193600480360381019061018e919061125a565b6103de565b6040516101a09190611219565b60405180910390f35b6101b161040c565b6040516101be91906112c5565b60405180910390f35b6101cf610414565b005b6101eb60048036038101906101e691906111c1565b610426565b005b610207600480360381019061020291906112de565b610492565b005b6102116104f5565b60405161021e9190611219565b60405180910390f35b610241600480360381019061023c9190611309565b61050a565b60405161024e9190611241565b60405180910390f35b61025f61054f565b005b610269610581565b005b610273610593565b6040516102809190611343565b60405180910390f35b6102916105bc565b60405161029e9190611110565b60405180910390f35b6102c160048036038101906102bc91906111c1565b61064c565b6040516102ce9190611219565b60405180910390f35b6102f160048036038101906102ec919061135c565b61066e565b6040516102fe9190611241565b60405180910390f35b610321600480360381019061031c9190611309565b6106f0565b005b606060038054610332906113c7565b80601f016020809104026020016040519081016040528092919081815260200182805461035e906113c7565b80156103a95780601f10610380576101008083540402835291602001916103a9565b820191905f5260205f20905b81548152906001019060200180831161038c57829003601f168201915b5050505050905090565b5f806103bd610774565b90506103ca81858561077b565b600191505092915050565b5f600254905090565b5f806103e8610774565b90506103f585828561078d565b610400858585610820565b60019150509392505050565b5f6009905090565b61041c610910565b610424610997565b565b61042e6109f8565b610436610910565b6104408282610a39565b8173ffffffffffffffffffffffffffffffffffffffff167f0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885826040516104869190611241565b60405180910390a25050565b61049a6109f8565b6104a43382610ab8565b3373ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5826040516104ea9190611241565b60405180910390a250565b5f60055f9054906101000a900460ff16905090565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b6040517fc8f64faf00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610589610910565b610591610b37565b565b5f600560019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546105cb906113c7565b80601f01602080910402602001604051908101604052809291908181526020018280546105f7906113c7565b80156106425780601f1061061957610100808354040283529160200191610642565b820191905f5260205f20905b81548152906001019060200180831161062557829003601f168201915b5050505050905090565b5f80610656610774565b9050610663818585610820565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b6106f8610910565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610768575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161075f9190611343565b60405180910390fd5b61077181610b99565b50565b5f33905090565b6107888383836001610c5e565b505050565b5f610798848461066e565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81101561081a578181101561080b578281836040517ffb8f41b2000000000000000000000000000000000000000000000000000000008152600401610802939291906113f7565b60405180910390fd5b61081984848484035f610c5e565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610890575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016108879190611343565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610900575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108f79190611343565b60405180910390fd5b61090b838383610e2d565b505050565b610918610774565b73ffffffffffffffffffffffffffffffffffffffff16610936610593565b73ffffffffffffffffffffffffffffffffffffffff161461099557610959610774565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161098c9190611343565b60405180910390fd5b565b61099f611046565b5f60055f6101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6109e1610774565b6040516109ee9190611343565b60405180910390a1565b610a006104f5565b15610a37576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610aa9575f6040517fec442f05000000000000000000000000000000000000000000000000000000008152600401610aa09190611343565b60405180910390fd5b610ab45f8383610e2d565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610b28575f6040517f96c6fd1e000000000000000000000000000000000000000000000000000000008152600401610b1f9190611343565b60405180910390fd5b610b33825f83610e2d565b5050565b610b3f6109f8565b600160055f6101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610b82610774565b604051610b8f9190611343565b60405180910390a1565b5f600560019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610cce575f6040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610cc59190611343565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610d3e575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610d359190611343565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610e27578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610e1e9190611241565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610e7d578060025f828254610e719190611459565b92505081905550610f4b565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610f06578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610efd939291906113f7565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610f92578060025f8282540392505081905550610fdc565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516110399190611241565b60405180910390a3505050565b61104e6104f5565b611084576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f81519050919050565b5f82825260208201905092915050565b5f5b838110156110bd5780820151818401526020810190506110a2565b5f8484015250505050565b5f601f19601f8301169050919050565b5f6110e282611086565b6110ec8185611090565b93506110fc8185602086016110a0565b611105816110c8565b840191505092915050565b5f6020820190508181035f83015261112881846110d8565b905092915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61115d82611134565b9050919050565b61116d81611153565b8114611177575f80fd5b50565b5f8135905061118881611164565b92915050565b5f819050919050565b6111a08161118e565b81146111aa575f80fd5b50565b5f813590506111bb81611197565b92915050565b5f80604083850312156111d7576111d6611130565b5b5f6111e48582860161117a565b92505060206111f5858286016111ad565b9150509250929050565b5f8115159050919050565b611213816111ff565b82525050565b5f60208201905061122c5f83018461120a565b92915050565b61123b8161118e565b82525050565b5f6020820190506112545f830184611232565b92915050565b5f805f6060848603121561127157611270611130565b5b5f61127e8682870161117a565b935050602061128f8682870161117a565b92505060406112a0868287016111ad565b9150509250925092565b5f60ff82169050919050565b6112bf816112aa565b82525050565b5f6020820190506112d85f8301846112b6565b92915050565b5f602082840312156112f3576112f2611130565b5b5f611300848285016111ad565b91505092915050565b5f6020828403121561131e5761131d611130565b5b5f61132b8482850161117a565b91505092915050565b61133d81611153565b82525050565b5f6020820190506113565f830184611334565b92915050565b5f806040838503121561137257611371611130565b5b5f61137f8582860161117a565b92505060206113908582860161117a565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806113de57607f821691505b6020821081036113f1576113f061139a565b5b50919050565b5f60608201905061140a5f830186611334565b6114176020830185611232565b6114246040830184611232565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6114638261118e565b915061146e8361118e565b92508282019050808211156114865761148561142c565b5b9291505056fea2646970667358221220c5ec7eaa9aba044cbcd6fdc04777811ee796ed761afda2439203a061a9335d8f64736f6c63430008180033', \n     arguments: [\n          _name,\n          _symbol,\n     ]\n}).send({\n     from: web3.eth.accounts[0], \n     gas: '4700000'\n   }, function (e, contract){\n    console.log(e, contract);\n    if (typeof contract.address !== 'undefined') {\n         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);\n    }\n })",
	"functionHashes": {
		"dd62ed3e": "allowance(address,address)",
		"095ea7b3": "approve(address,uint256)",
		"70a08231": "balanceOf(address)",
		"42966c68": "burn(uint256)",
		"313ce567": "decimals()",
		"40c10f19": "mint(address,uint256)",
		"06fdde03": "name()",
		"8da5cb5b": "owner()",
		"8456cb59": "pause()",
		"5c975abb": "paused()",
		"715018a6": "renounceOwnership()",
		"95d89b41": "symbol()",
		"18160ddd": "totalSupply()",
		"a9059cbb": "transfer(address,uint256)",
		"23b872dd": "transferFrom(address,address,uint256)",
		"f2fde38b": "transferOwnership(address)",
		"3f4ba83a": "unpause()"
	},
	"gasEstimates": {
		"Creation": {
			"codeDepositCost": "1062800",
			"executionCost": "infinite",
			"totalCost": "infinite"
		},
		"External": {
			"allowance(address,address)": "infinite",
			"approve(address,uint256)": "infinite",
			"balanceOf(address)": "2874",
			"burn(uint256)": "infinite",
			"decimals()": "361",
			"mint(address,uint256)": "infinite",
			"name()": "infinite",
			"owner()": "2588",
			"pause()": "infinite",
			"paused()": "2496",
			"renounceOwnership()": "246",
			"symbol()": "infinite",
			"totalSupply()": "2500",
			"transfer(address,uint256)": "infinite",
			"transferFrom(address,address,uint256)": "infinite",
			"transferOwnership(address)": "infinite",
			"unpause()": "infinite"
		}
	},
	"devdoc": {
		"errors": {
			"ERC20InsufficientAllowance(address,uint256,uint256)": [
				{
					"details": "Indicates a failure with the `spender`’s `allowance`. Used in transfers.",
					"params": {
						"allowance": "Amount of tokens a `spender` is allowed to operate with.",
						"needed": "Minimum amount required to perform a transfer.",
						"spender": "Address that may be allowed to operate on tokens without being their owner."
					}
				}
			],
			"ERC20InsufficientBalance(address,uint256,uint256)": [
				{
					"details": "Indicates an error related to the current `balance` of a `sender`. Used in transfers.",
					"params": {
						"balance": "Current balance for the interacting account.",
						"needed": "Minimum amount required to perform a transfer.",
						"sender": "Address whose tokens are being transferred."
					}
				}
			],
			"ERC20InvalidApprover(address)": [
				{
					"details": "Indicates a failure with the `approver` of a token to be approved. Used in approvals.",
					"params": {
						"approver": "Address initiating an approval operation."
					}
				}
			],
			"ERC20InvalidReceiver(address)": [
				{
					"details": "Indicates a failure with the token `receiver`. Used in transfers.",
					"params": {
						"receiver": "Address to which tokens are being transferred."
					}
				}
			],
			"ERC20InvalidSender(address)": [
				{
					"details": "Indicates a failure with the token `sender`. Used in transfers.",
					"params": {
						"sender": "Address whose tokens are being transferred."
					}
				}
			],
			"ERC20InvalidSpender(address)": [
				{
					"details": "Indicates a failure with the `spender` to be approved. Used in approvals.",
					"params": {
						"spender": "Address that may be allowed to operate on tokens without being their owner."
					}
				}
			],
			"EnforcedPause()": [
				{
					"details": "The operation failed because the contract is paused."
				}
			],
			"ExpectedPause()": [
				{
					"details": "The operation failed because the contract is not paused."
				}
			],
			"OwnableInvalidOwner(address)": [
				{
					"details": "The owner is not a valid owner account. (eg. `address(0)`)"
				}
			],
			"OwnableUnauthorizedAccount(address)": [
				{
					"details": "The caller account is not authorized to perform an operation."
				}
			]
		},
		"events": {
			"Approval(address,address,uint256)": {
				"details": "Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance."
			},
			"Paused(address)": {
				"details": "Emitted when the pause is triggered by `account`."
			},
			"Transfer(address,address,uint256)": {
				"details": "Emitted when `value` tokens are moved from one account (`from`) to another (`to`). Note that `value` may be zero."
			},
			"Unpaused(address)": {
				"details": "Emitted when the pause is lifted by `account`."
			}
		},
		"kind": "dev",
		"methods": {
			"allowance(address,address)": {
				"details": "Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through {transferFrom}. This is zero by default. This value changes when {approve} or {transferFrom} are called."
			},
			"approve(address,uint256)": {
				"details": "See {IERC20-approve}. NOTE: If `value` is the maximum `uint256`, the allowance is not updated on `transferFrom`. This is semantically equivalent to an infinite approval. Requirements: - `spender` cannot be the zero address."
			},
			"balanceOf(address)": {
				"details": "Returns the value of tokens owned by `account`."
			},
			"decimals()": {
				"details": "Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5.05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the default value returned by this function, unless it's overridden. NOTE: This information is only used for _display_ purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}."
			},
			"name()": {
				"details": "Returns the name of the token."
			},
			"owner()": {
				"details": "Returns the address of the current owner."
			},
			"paused()": {
				"details": "Returns true if the contract is paused, and false otherwise."
			},
			"renounceOwnership()": {
				"details": "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner."
			},
			"symbol()": {
				"details": "Returns the symbol of the token, usually a shorter version of the name."
			},
			"totalSupply()": {
				"details": "Returns the value of tokens in existence."
			},
			"transfer(address,uint256)": {
				"details": "See {IERC20-transfer}. Requirements: - `to` cannot be the zero address. - the caller must have a balance of at least `value`."
			},
			"transferFrom(address,address,uint256)": {
				"details": "See {IERC20-transferFrom}. Skips emitting an {Approval} event indicating an allowance update. This is not required by the ERC. See {xref-ERC20-_approve-address-address-uint256-bool-}[_approve]. NOTE: Does not update the allowance if the current allowance is the maximum `uint256`. Requirements: - `from` and `to` cannot be the zero address. - `from` must have a balance of at least `value`. - the caller must have allowance for ``from``'s tokens of at least `value`."
			},
			"transferOwnership(address)": {
				"details": "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."
			}
		},
		"version": 1
	},
	"userdoc": {
		"kind": "user",
		"methods": {},
		"version": 1
	},
	"Runtime Bytecode": {
		"functionDebugData": {
			"@_approve_690": {
				"entryPoint": 1915,
				"id": 690,
				"parameterSlots": 3,
				"returnSlots": 0
			},
			"@_approve_750": {
				"entryPoint": 3166,
				"id": 750,
				"parameterSlots": 4,
				"returnSlots": 0
			},
			"@_burn_672": {
				"entryPoint": 2744,
				"id": 672,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"@_checkOwner_84": {
				"entryPoint": 2320,
				"id": 84,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"@_mint_639": {
				"entryPoint": 2617,
				"id": 639,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"@_msgSender_915": {
				"entryPoint": 1908,
				"id": 915,
				"parameterSlots": 0,
				"returnSlots": 1
			},
			"@_pause_1024": {
				"entryPoint": 2871,
				"id": 1024,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"@_requireNotPaused_995": {
				"entryPoint": 2552,
				"id": 995,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"@_requirePaused_1008": {
				"entryPoint": 4166,
				"id": 1008,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"@_spendAllowance_798": {
				"entryPoint": 1933,
				"id": 798,
				"parameterSlots": 3,
				"returnSlots": 0
			},
			"@_transferOwnership_146": {
				"entryPoint": 2969,
				"id": 146,
				"parameterSlots": 1,
				"returnSlots": 0
			},
			"@_transfer_529": {
				"entryPoint": 2080,
				"id": 529,
				"parameterSlots": 3,
				"returnSlots": 0
			},
			"@_unpause_1040": {
				"entryPoint": 2455,
				"id": 1040,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"@_update_606": {
				"entryPoint": 3629,
				"id": 606,
				"parameterSlots": 3,
				"returnSlots": 0
			},
			"@allowance_426": {
				"entryPoint": 1646,
				"id": 426,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"@approve_450": {
				"entryPoint": 947,
				"id": 450,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"@balanceOf_385": {
				"entryPoint": 1290,
				"id": 385,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"@burn_1157": {
				"entryPoint": 1170,
				"id": 1157,
				"parameterSlots": 1,
				"returnSlots": 0
			},
			"@decimals_1089": {
				"entryPoint": 1036,
				"id": 1089,
				"parameterSlots": 0,
				"returnSlots": 1
			},
			"@mint_1137": {
				"entryPoint": 1062,
				"id": 1137,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"@name_345": {
				"entryPoint": 803,
				"id": 345,
				"parameterSlots": 0,
				"returnSlots": 1
			},
			"@owner_67": {
				"entryPoint": 1427,
				"id": 67,
				"parameterSlots": 0,
				"returnSlots": 1
			},
			"@pause_1106": {
				"entryPoint": 1409,
				"id": 1106,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"@paused_983": {
				"entryPoint": 1269,
				"id": 983,
				"parameterSlots": 0,
				"returnSlots": 1
			},
			"@renounceOwnership_1097": {
				"entryPoint": 1359,
				"id": 1097,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"@symbol_354": {
				"entryPoint": 1468,
				"id": 354,
				"parameterSlots": 0,
				"returnSlots": 1
			},
			"@totalSupply_372": {
				"entryPoint": 981,
				"id": 372,
				"parameterSlots": 0,
				"returnSlots": 1
			},
			"@transferFrom_482": {
				"entryPoint": 990,
				"id": 482,
				"parameterSlots": 3,
				"returnSlots": 1
			},
			"@transferOwnership_126": {
				"entryPoint": 1776,
				"id": 126,
				"parameterSlots": 1,
				"returnSlots": 0
			},
			"@transfer_409": {
				"entryPoint": 1612,
				"id": 409,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"@unpause_1115": {
				"entryPoint": 1044,
				"id": 1115,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"abi_decode_t_address": {
				"entryPoint": 4474,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_decode_t_uint256": {
				"entryPoint": 4525,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_decode_tuple_t_address": {
				"entryPoint": 4873,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_decode_tuple_t_addresst_address": {
				"entryPoint": 4956,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 2
			},
			"abi_decode_tuple_t_addresst_addresst_uint256": {
				"entryPoint": 4698,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 3
			},
			"abi_decode_tuple_t_addresst_uint256": {
				"entryPoint": 4545,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 2
			},
			"abi_decode_tuple_t_uint256": {
				"entryPoint": 4830,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_encode_t_address_to_t_address_fromStack": {
				"entryPoint": 4916,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"abi_encode_t_bool_to_t_bool_fromStack": {
				"entryPoint": 4618,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack": {
				"entryPoint": 4312,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_encode_t_uint256_to_t_uint256_fromStack": {
				"entryPoint": 4658,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"abi_encode_t_uint8_to_t_uint8_fromStack": {
				"entryPoint": 4790,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 0
			},
			"abi_encode_tuple_t_address__to_t_address__fromStack_reversed": {
				"entryPoint": 4931,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_encode_tuple_t_address_t_uint256_t_uint256__to_t_address_t_uint256_t_uint256__fromStack_reversed": {
				"entryPoint": 5111,
				"id": null,
				"parameterSlots": 4,
				"returnSlots": 1
			},
			"abi_encode_tuple_t_bool__to_t_bool__fromStack_reversed": {
				"entryPoint": 4633,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_encode_tuple_t_string_memory_ptr__to_t_string_memory_ptr__fromStack_reversed": {
				"entryPoint": 4368,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_encode_tuple_t_uint256__to_t_uint256__fromStack_reversed": {
				"entryPoint": 4673,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"abi_encode_tuple_t_uint8__to_t_uint8__fromStack_reversed": {
				"entryPoint": 4805,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"allocate_unbounded": {
				"entryPoint": null,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 1
			},
			"array_length_t_string_memory_ptr": {
				"entryPoint": 4230,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"array_storeLengthForEncoding_t_string_memory_ptr_fromStack": {
				"entryPoint": 4240,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"checked_add_t_uint256": {
				"entryPoint": 5209,
				"id": null,
				"parameterSlots": 2,
				"returnSlots": 1
			},
			"cleanup_t_address": {
				"entryPoint": 4435,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"cleanup_t_bool": {
				"entryPoint": 4607,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"cleanup_t_uint160": {
				"entryPoint": 4404,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"cleanup_t_uint256": {
				"entryPoint": 4494,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"cleanup_t_uint8": {
				"entryPoint": 4778,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"copy_memory_to_memory_with_cleanup": {
				"entryPoint": 4256,
				"id": null,
				"parameterSlots": 3,
				"returnSlots": 0
			},
			"extract_byte_array_length": {
				"entryPoint": 5063,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"panic_error_0x11": {
				"entryPoint": 5164,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"panic_error_0x22": {
				"entryPoint": 5018,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db": {
				"entryPoint": null,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b": {
				"entryPoint": 4400,
				"id": null,
				"parameterSlots": 0,
				"returnSlots": 0
			},
			"round_up_to_mul_of_32": {
				"entryPoint": 4296,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 1
			},
			"validator_revert_t_address": {
				"entryPoint": 4452,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 0
			},
			"validator_revert_t_uint256": {
				"entryPoint": 4503,
				"id": null,
				"parameterSlots": 1,
				"returnSlots": 0
			}
		},
		"generatedSources": [
			{
				"ast": {
					"nativeSrc": "0:7695:8",
					"nodeType": "YulBlock",
					"src": "0:7695:8",
					"statements": [
						{
							"body": {
								"nativeSrc": "66:40:8",
								"nodeType": "YulBlock",
								"src": "66:40:8",
								"statements": [
									{
										"nativeSrc": "77:22:8",
										"nodeType": "YulAssignment",
										"src": "77:22:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "93:5:8",
													"nodeType": "YulIdentifier",
													"src": "93:5:8"
												}
											],
											"functionName": {
												"name": "mload",
												"nativeSrc": "87:5:8",
												"nodeType": "YulIdentifier",
												"src": "87:5:8"
											},
											"nativeSrc": "87:12:8",
											"nodeType": "YulFunctionCall",
											"src": "87:12:8"
										},
										"variableNames": [
											{
												"name": "length",
												"nativeSrc": "77:6:8",
												"nodeType": "YulIdentifier",
												"src": "77:6:8"
											}
										]
									}
								]
							},
							"name": "array_length_t_string_memory_ptr",
							"nativeSrc": "7:99:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "49:5:8",
									"nodeType": "YulTypedName",
									"src": "49:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "length",
									"nativeSrc": "59:6:8",
									"nodeType": "YulTypedName",
									"src": "59:6:8",
									"type": ""
								}
							],
							"src": "7:99:8"
						},
						{
							"body": {
								"nativeSrc": "208:73:8",
								"nodeType": "YulBlock",
								"src": "208:73:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"name": "pos",
													"nativeSrc": "225:3:8",
													"nodeType": "YulIdentifier",
													"src": "225:3:8"
												},
												{
													"name": "length",
													"nativeSrc": "230:6:8",
													"nodeType": "YulIdentifier",
													"src": "230:6:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "218:6:8",
												"nodeType": "YulIdentifier",
												"src": "218:6:8"
											},
											"nativeSrc": "218:19:8",
											"nodeType": "YulFunctionCall",
											"src": "218:19:8"
										},
										"nativeSrc": "218:19:8",
										"nodeType": "YulExpressionStatement",
										"src": "218:19:8"
									},
									{
										"nativeSrc": "246:29:8",
										"nodeType": "YulAssignment",
										"src": "246:29:8",
										"value": {
											"arguments": [
												{
													"name": "pos",
													"nativeSrc": "265:3:8",
													"nodeType": "YulIdentifier",
													"src": "265:3:8"
												},
												{
													"kind": "number",
													"nativeSrc": "270:4:8",
													"nodeType": "YulLiteral",
													"src": "270:4:8",
													"type": "",
													"value": "0x20"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "261:3:8",
												"nodeType": "YulIdentifier",
												"src": "261:3:8"
											},
											"nativeSrc": "261:14:8",
											"nodeType": "YulFunctionCall",
											"src": "261:14:8"
										},
										"variableNames": [
											{
												"name": "updated_pos",
												"nativeSrc": "246:11:8",
												"nodeType": "YulIdentifier",
												"src": "246:11:8"
											}
										]
									}
								]
							},
							"name": "array_storeLengthForEncoding_t_string_memory_ptr_fromStack",
							"nativeSrc": "112:169:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "pos",
									"nativeSrc": "180:3:8",
									"nodeType": "YulTypedName",
									"src": "180:3:8",
									"type": ""
								},
								{
									"name": "length",
									"nativeSrc": "185:6:8",
									"nodeType": "YulTypedName",
									"src": "185:6:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "updated_pos",
									"nativeSrc": "196:11:8",
									"nodeType": "YulTypedName",
									"src": "196:11:8",
									"type": ""
								}
							],
							"src": "112:169:8"
						},
						{
							"body": {
								"nativeSrc": "349:184:8",
								"nodeType": "YulBlock",
								"src": "349:184:8",
								"statements": [
									{
										"nativeSrc": "359:10:8",
										"nodeType": "YulVariableDeclaration",
										"src": "359:10:8",
										"value": {
											"kind": "number",
											"nativeSrc": "368:1:8",
											"nodeType": "YulLiteral",
											"src": "368:1:8",
											"type": "",
											"value": "0"
										},
										"variables": [
											{
												"name": "i",
												"nativeSrc": "363:1:8",
												"nodeType": "YulTypedName",
												"src": "363:1:8",
												"type": ""
											}
										]
									},
									{
										"body": {
											"nativeSrc": "428:63:8",
											"nodeType": "YulBlock",
											"src": "428:63:8",
											"statements": [
												{
													"expression": {
														"arguments": [
															{
																"arguments": [
																	{
																		"name": "dst",
																		"nativeSrc": "453:3:8",
																		"nodeType": "YulIdentifier",
																		"src": "453:3:8"
																	},
																	{
																		"name": "i",
																		"nativeSrc": "458:1:8",
																		"nodeType": "YulIdentifier",
																		"src": "458:1:8"
																	}
																],
																"functionName": {
																	"name": "add",
																	"nativeSrc": "449:3:8",
																	"nodeType": "YulIdentifier",
																	"src": "449:3:8"
																},
																"nativeSrc": "449:11:8",
																"nodeType": "YulFunctionCall",
																"src": "449:11:8"
															},
															{
																"arguments": [
																	{
																		"arguments": [
																			{
																				"name": "src",
																				"nativeSrc": "472:3:8",
																				"nodeType": "YulIdentifier",
																				"src": "472:3:8"
																			},
																			{
																				"name": "i",
																				"nativeSrc": "477:1:8",
																				"nodeType": "YulIdentifier",
																				"src": "477:1:8"
																			}
																		],
																		"functionName": {
																			"name": "add",
																			"nativeSrc": "468:3:8",
																			"nodeType": "YulIdentifier",
																			"src": "468:3:8"
																		},
																		"nativeSrc": "468:11:8",
																		"nodeType": "YulFunctionCall",
																		"src": "468:11:8"
																	}
																],
																"functionName": {
																	"name": "mload",
																	"nativeSrc": "462:5:8",
																	"nodeType": "YulIdentifier",
																	"src": "462:5:8"
																},
																"nativeSrc": "462:18:8",
																"nodeType": "YulFunctionCall",
																"src": "462:18:8"
															}
														],
														"functionName": {
															"name": "mstore",
															"nativeSrc": "442:6:8",
															"nodeType": "YulIdentifier",
															"src": "442:6:8"
														},
														"nativeSrc": "442:39:8",
														"nodeType": "YulFunctionCall",
														"src": "442:39:8"
													},
													"nativeSrc": "442:39:8",
													"nodeType": "YulExpressionStatement",
													"src": "442:39:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "i",
													"nativeSrc": "389:1:8",
													"nodeType": "YulIdentifier",
													"src": "389:1:8"
												},
												{
													"name": "length",
													"nativeSrc": "392:6:8",
													"nodeType": "YulIdentifier",
													"src": "392:6:8"
												}
											],
											"functionName": {
												"name": "lt",
												"nativeSrc": "386:2:8",
												"nodeType": "YulIdentifier",
												"src": "386:2:8"
											},
											"nativeSrc": "386:13:8",
											"nodeType": "YulFunctionCall",
											"src": "386:13:8"
										},
										"nativeSrc": "378:113:8",
										"nodeType": "YulForLoop",
										"post": {
											"nativeSrc": "400:19:8",
											"nodeType": "YulBlock",
											"src": "400:19:8",
											"statements": [
												{
													"nativeSrc": "402:15:8",
													"nodeType": "YulAssignment",
													"src": "402:15:8",
													"value": {
														"arguments": [
															{
																"name": "i",
																"nativeSrc": "411:1:8",
																"nodeType": "YulIdentifier",
																"src": "411:1:8"
															},
															{
																"kind": "number",
																"nativeSrc": "414:2:8",
																"nodeType": "YulLiteral",
																"src": "414:2:8",
																"type": "",
																"value": "32"
															}
														],
														"functionName": {
															"name": "add",
															"nativeSrc": "407:3:8",
															"nodeType": "YulIdentifier",
															"src": "407:3:8"
														},
														"nativeSrc": "407:10:8",
														"nodeType": "YulFunctionCall",
														"src": "407:10:8"
													},
													"variableNames": [
														{
															"name": "i",
															"nativeSrc": "402:1:8",
															"nodeType": "YulIdentifier",
															"src": "402:1:8"
														}
													]
												}
											]
										},
										"pre": {
											"nativeSrc": "382:3:8",
											"nodeType": "YulBlock",
											"src": "382:3:8",
											"statements": []
										},
										"src": "378:113:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "dst",
															"nativeSrc": "511:3:8",
															"nodeType": "YulIdentifier",
															"src": "511:3:8"
														},
														{
															"name": "length",
															"nativeSrc": "516:6:8",
															"nodeType": "YulIdentifier",
															"src": "516:6:8"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "507:3:8",
														"nodeType": "YulIdentifier",
														"src": "507:3:8"
													},
													"nativeSrc": "507:16:8",
													"nodeType": "YulFunctionCall",
													"src": "507:16:8"
												},
												{
													"kind": "number",
													"nativeSrc": "525:1:8",
													"nodeType": "YulLiteral",
													"src": "525:1:8",
													"type": "",
													"value": "0"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "500:6:8",
												"nodeType": "YulIdentifier",
												"src": "500:6:8"
											},
											"nativeSrc": "500:27:8",
											"nodeType": "YulFunctionCall",
											"src": "500:27:8"
										},
										"nativeSrc": "500:27:8",
										"nodeType": "YulExpressionStatement",
										"src": "500:27:8"
									}
								]
							},
							"name": "copy_memory_to_memory_with_cleanup",
							"nativeSrc": "287:246:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "src",
									"nativeSrc": "331:3:8",
									"nodeType": "YulTypedName",
									"src": "331:3:8",
									"type": ""
								},
								{
									"name": "dst",
									"nativeSrc": "336:3:8",
									"nodeType": "YulTypedName",
									"src": "336:3:8",
									"type": ""
								},
								{
									"name": "length",
									"nativeSrc": "341:6:8",
									"nodeType": "YulTypedName",
									"src": "341:6:8",
									"type": ""
								}
							],
							"src": "287:246:8"
						},
						{
							"body": {
								"nativeSrc": "587:54:8",
								"nodeType": "YulBlock",
								"src": "587:54:8",
								"statements": [
									{
										"nativeSrc": "597:38:8",
										"nodeType": "YulAssignment",
										"src": "597:38:8",
										"value": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "615:5:8",
															"nodeType": "YulIdentifier",
															"src": "615:5:8"
														},
														{
															"kind": "number",
															"nativeSrc": "622:2:8",
															"nodeType": "YulLiteral",
															"src": "622:2:8",
															"type": "",
															"value": "31"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "611:3:8",
														"nodeType": "YulIdentifier",
														"src": "611:3:8"
													},
													"nativeSrc": "611:14:8",
													"nodeType": "YulFunctionCall",
													"src": "611:14:8"
												},
												{
													"arguments": [
														{
															"kind": "number",
															"nativeSrc": "631:2:8",
															"nodeType": "YulLiteral",
															"src": "631:2:8",
															"type": "",
															"value": "31"
														}
													],
													"functionName": {
														"name": "not",
														"nativeSrc": "627:3:8",
														"nodeType": "YulIdentifier",
														"src": "627:3:8"
													},
													"nativeSrc": "627:7:8",
													"nodeType": "YulFunctionCall",
													"src": "627:7:8"
												}
											],
											"functionName": {
												"name": "and",
												"nativeSrc": "607:3:8",
												"nodeType": "YulIdentifier",
												"src": "607:3:8"
											},
											"nativeSrc": "607:28:8",
											"nodeType": "YulFunctionCall",
											"src": "607:28:8"
										},
										"variableNames": [
											{
												"name": "result",
												"nativeSrc": "597:6:8",
												"nodeType": "YulIdentifier",
												"src": "597:6:8"
											}
										]
									}
								]
							},
							"name": "round_up_to_mul_of_32",
							"nativeSrc": "539:102:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "570:5:8",
									"nodeType": "YulTypedName",
									"src": "570:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "result",
									"nativeSrc": "580:6:8",
									"nodeType": "YulTypedName",
									"src": "580:6:8",
									"type": ""
								}
							],
							"src": "539:102:8"
						},
						{
							"body": {
								"nativeSrc": "739:285:8",
								"nodeType": "YulBlock",
								"src": "739:285:8",
								"statements": [
									{
										"nativeSrc": "749:53:8",
										"nodeType": "YulVariableDeclaration",
										"src": "749:53:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "796:5:8",
													"nodeType": "YulIdentifier",
													"src": "796:5:8"
												}
											],
											"functionName": {
												"name": "array_length_t_string_memory_ptr",
												"nativeSrc": "763:32:8",
												"nodeType": "YulIdentifier",
												"src": "763:32:8"
											},
											"nativeSrc": "763:39:8",
											"nodeType": "YulFunctionCall",
											"src": "763:39:8"
										},
										"variables": [
											{
												"name": "length",
												"nativeSrc": "753:6:8",
												"nodeType": "YulTypedName",
												"src": "753:6:8",
												"type": ""
											}
										]
									},
									{
										"nativeSrc": "811:78:8",
										"nodeType": "YulAssignment",
										"src": "811:78:8",
										"value": {
											"arguments": [
												{
													"name": "pos",
													"nativeSrc": "877:3:8",
													"nodeType": "YulIdentifier",
													"src": "877:3:8"
												},
												{
													"name": "length",
													"nativeSrc": "882:6:8",
													"nodeType": "YulIdentifier",
													"src": "882:6:8"
												}
											],
											"functionName": {
												"name": "array_storeLengthForEncoding_t_string_memory_ptr_fromStack",
												"nativeSrc": "818:58:8",
												"nodeType": "YulIdentifier",
												"src": "818:58:8"
											},
											"nativeSrc": "818:71:8",
											"nodeType": "YulFunctionCall",
											"src": "818:71:8"
										},
										"variableNames": [
											{
												"name": "pos",
												"nativeSrc": "811:3:8",
												"nodeType": "YulIdentifier",
												"src": "811:3:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "937:5:8",
															"nodeType": "YulIdentifier",
															"src": "937:5:8"
														},
														{
															"kind": "number",
															"nativeSrc": "944:4:8",
															"nodeType": "YulLiteral",
															"src": "944:4:8",
															"type": "",
															"value": "0x20"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "933:3:8",
														"nodeType": "YulIdentifier",
														"src": "933:3:8"
													},
													"nativeSrc": "933:16:8",
													"nodeType": "YulFunctionCall",
													"src": "933:16:8"
												},
												{
													"name": "pos",
													"nativeSrc": "951:3:8",
													"nodeType": "YulIdentifier",
													"src": "951:3:8"
												},
												{
													"name": "length",
													"nativeSrc": "956:6:8",
													"nodeType": "YulIdentifier",
													"src": "956:6:8"
												}
											],
											"functionName": {
												"name": "copy_memory_to_memory_with_cleanup",
												"nativeSrc": "898:34:8",
												"nodeType": "YulIdentifier",
												"src": "898:34:8"
											},
											"nativeSrc": "898:65:8",
											"nodeType": "YulFunctionCall",
											"src": "898:65:8"
										},
										"nativeSrc": "898:65:8",
										"nodeType": "YulExpressionStatement",
										"src": "898:65:8"
									},
									{
										"nativeSrc": "972:46:8",
										"nodeType": "YulAssignment",
										"src": "972:46:8",
										"value": {
											"arguments": [
												{
													"name": "pos",
													"nativeSrc": "983:3:8",
													"nodeType": "YulIdentifier",
													"src": "983:3:8"
												},
												{
													"arguments": [
														{
															"name": "length",
															"nativeSrc": "1010:6:8",
															"nodeType": "YulIdentifier",
															"src": "1010:6:8"
														}
													],
													"functionName": {
														"name": "round_up_to_mul_of_32",
														"nativeSrc": "988:21:8",
														"nodeType": "YulIdentifier",
														"src": "988:21:8"
													},
													"nativeSrc": "988:29:8",
													"nodeType": "YulFunctionCall",
													"src": "988:29:8"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "979:3:8",
												"nodeType": "YulIdentifier",
												"src": "979:3:8"
											},
											"nativeSrc": "979:39:8",
											"nodeType": "YulFunctionCall",
											"src": "979:39:8"
										},
										"variableNames": [
											{
												"name": "end",
												"nativeSrc": "972:3:8",
												"nodeType": "YulIdentifier",
												"src": "972:3:8"
											}
										]
									}
								]
							},
							"name": "abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack",
							"nativeSrc": "647:377:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "720:5:8",
									"nodeType": "YulTypedName",
									"src": "720:5:8",
									"type": ""
								},
								{
									"name": "pos",
									"nativeSrc": "727:3:8",
									"nodeType": "YulTypedName",
									"src": "727:3:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "end",
									"nativeSrc": "735:3:8",
									"nodeType": "YulTypedName",
									"src": "735:3:8",
									"type": ""
								}
							],
							"src": "647:377:8"
						},
						{
							"body": {
								"nativeSrc": "1148:195:8",
								"nodeType": "YulBlock",
								"src": "1148:195:8",
								"statements": [
									{
										"nativeSrc": "1158:26:8",
										"nodeType": "YulAssignment",
										"src": "1158:26:8",
										"value": {
											"arguments": [
												{
													"name": "headStart",
													"nativeSrc": "1170:9:8",
													"nodeType": "YulIdentifier",
													"src": "1170:9:8"
												},
												{
													"kind": "number",
													"nativeSrc": "1181:2:8",
													"nodeType": "YulLiteral",
													"src": "1181:2:8",
													"type": "",
													"value": "32"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "1166:3:8",
												"nodeType": "YulIdentifier",
												"src": "1166:3:8"
											},
											"nativeSrc": "1166:18:8",
											"nodeType": "YulFunctionCall",
											"src": "1166:18:8"
										},
										"variableNames": [
											{
												"name": "tail",
												"nativeSrc": "1158:4:8",
												"nodeType": "YulIdentifier",
												"src": "1158:4:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "headStart",
															"nativeSrc": "1205:9:8",
															"nodeType": "YulIdentifier",
															"src": "1205:9:8"
														},
														{
															"kind": "number",
															"nativeSrc": "1216:1:8",
															"nodeType": "YulLiteral",
															"src": "1216:1:8",
															"type": "",
															"value": "0"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "1201:3:8",
														"nodeType": "YulIdentifier",
														"src": "1201:3:8"
													},
													"nativeSrc": "1201:17:8",
													"nodeType": "YulFunctionCall",
													"src": "1201:17:8"
												},
												{
													"arguments": [
														{
															"name": "tail",
															"nativeSrc": "1224:4:8",
															"nodeType": "YulIdentifier",
															"src": "1224:4:8"
														},
														{
															"name": "headStart",
															"nativeSrc": "1230:9:8",
															"nodeType": "YulIdentifier",
															"src": "1230:9:8"
														}
													],
													"functionName": {
														"name": "sub",
														"nativeSrc": "1220:3:8",
														"nodeType": "YulIdentifier",
														"src": "1220:3:8"
													},
													"nativeSrc": "1220:20:8",
													"nodeType": "YulFunctionCall",
													"src": "1220:20:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "1194:6:8",
												"nodeType": "YulIdentifier",
												"src": "1194:6:8"
											},
											"nativeSrc": "1194:47:8",
											"nodeType": "YulFunctionCall",
											"src": "1194:47:8"
										},
										"nativeSrc": "1194:47:8",
										"nodeType": "YulExpressionStatement",
										"src": "1194:47:8"
									},
									{
										"nativeSrc": "1250:86:8",
										"nodeType": "YulAssignment",
										"src": "1250:86:8",
										"value": {
											"arguments": [
												{
													"name": "value0",
													"nativeSrc": "1322:6:8",
													"nodeType": "YulIdentifier",
													"src": "1322:6:8"
												},
												{
													"name": "tail",
													"nativeSrc": "1331:4:8",
													"nodeType": "YulIdentifier",
													"src": "1331:4:8"
												}
											],
											"functionName": {
												"name": "abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack",
												"nativeSrc": "1258:63:8",
												"nodeType": "YulIdentifier",
												"src": "1258:63:8"
											},
											"nativeSrc": "1258:78:8",
											"nodeType": "YulFunctionCall",
											"src": "1258:78:8"
										},
										"variableNames": [
											{
												"name": "tail",
												"nativeSrc": "1250:4:8",
												"nodeType": "YulIdentifier",
												"src": "1250:4:8"
											}
										]
									}
								]
							},
							"name": "abi_encode_tuple_t_string_memory_ptr__to_t_string_memory_ptr__fromStack_reversed",
							"nativeSrc": "1030:313:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "1120:9:8",
									"nodeType": "YulTypedName",
									"src": "1120:9:8",
									"type": ""
								},
								{
									"name": "value0",
									"nativeSrc": "1132:6:8",
									"nodeType": "YulTypedName",
									"src": "1132:6:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "tail",
									"nativeSrc": "1143:4:8",
									"nodeType": "YulTypedName",
									"src": "1143:4:8",
									"type": ""
								}
							],
							"src": "1030:313:8"
						},
						{
							"body": {
								"nativeSrc": "1389:35:8",
								"nodeType": "YulBlock",
								"src": "1389:35:8",
								"statements": [
									{
										"nativeSrc": "1399:19:8",
										"nodeType": "YulAssignment",
										"src": "1399:19:8",
										"value": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "1415:2:8",
													"nodeType": "YulLiteral",
													"src": "1415:2:8",
													"type": "",
													"value": "64"
												}
											],
											"functionName": {
												"name": "mload",
												"nativeSrc": "1409:5:8",
												"nodeType": "YulIdentifier",
												"src": "1409:5:8"
											},
											"nativeSrc": "1409:9:8",
											"nodeType": "YulFunctionCall",
											"src": "1409:9:8"
										},
										"variableNames": [
											{
												"name": "memPtr",
												"nativeSrc": "1399:6:8",
												"nodeType": "YulIdentifier",
												"src": "1399:6:8"
											}
										]
									}
								]
							},
							"name": "allocate_unbounded",
							"nativeSrc": "1349:75:8",
							"nodeType": "YulFunctionDefinition",
							"returnVariables": [
								{
									"name": "memPtr",
									"nativeSrc": "1382:6:8",
									"nodeType": "YulTypedName",
									"src": "1382:6:8",
									"type": ""
								}
							],
							"src": "1349:75:8"
						},
						{
							"body": {
								"nativeSrc": "1519:28:8",
								"nodeType": "YulBlock",
								"src": "1519:28:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "1536:1:8",
													"nodeType": "YulLiteral",
													"src": "1536:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "1539:1:8",
													"nodeType": "YulLiteral",
													"src": "1539:1:8",
													"type": "",
													"value": "0"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "1529:6:8",
												"nodeType": "YulIdentifier",
												"src": "1529:6:8"
											},
											"nativeSrc": "1529:12:8",
											"nodeType": "YulFunctionCall",
											"src": "1529:12:8"
										},
										"nativeSrc": "1529:12:8",
										"nodeType": "YulExpressionStatement",
										"src": "1529:12:8"
									}
								]
							},
							"name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
							"nativeSrc": "1430:117:8",
							"nodeType": "YulFunctionDefinition",
							"src": "1430:117:8"
						},
						{
							"body": {
								"nativeSrc": "1642:28:8",
								"nodeType": "YulBlock",
								"src": "1642:28:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "1659:1:8",
													"nodeType": "YulLiteral",
													"src": "1659:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "1662:1:8",
													"nodeType": "YulLiteral",
													"src": "1662:1:8",
													"type": "",
													"value": "0"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "1652:6:8",
												"nodeType": "YulIdentifier",
												"src": "1652:6:8"
											},
											"nativeSrc": "1652:12:8",
											"nodeType": "YulFunctionCall",
											"src": "1652:12:8"
										},
										"nativeSrc": "1652:12:8",
										"nodeType": "YulExpressionStatement",
										"src": "1652:12:8"
									}
								]
							},
							"name": "revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db",
							"nativeSrc": "1553:117:8",
							"nodeType": "YulFunctionDefinition",
							"src": "1553:117:8"
						},
						{
							"body": {
								"nativeSrc": "1721:81:8",
								"nodeType": "YulBlock",
								"src": "1721:81:8",
								"statements": [
									{
										"nativeSrc": "1731:65:8",
										"nodeType": "YulAssignment",
										"src": "1731:65:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "1746:5:8",
													"nodeType": "YulIdentifier",
													"src": "1746:5:8"
												},
												{
													"kind": "number",
													"nativeSrc": "1753:42:8",
													"nodeType": "YulLiteral",
													"src": "1753:42:8",
													"type": "",
													"value": "0xffffffffffffffffffffffffffffffffffffffff"
												}
											],
											"functionName": {
												"name": "and",
												"nativeSrc": "1742:3:8",
												"nodeType": "YulIdentifier",
												"src": "1742:3:8"
											},
											"nativeSrc": "1742:54:8",
											"nodeType": "YulFunctionCall",
											"src": "1742:54:8"
										},
										"variableNames": [
											{
												"name": "cleaned",
												"nativeSrc": "1731:7:8",
												"nodeType": "YulIdentifier",
												"src": "1731:7:8"
											}
										]
									}
								]
							},
							"name": "cleanup_t_uint160",
							"nativeSrc": "1676:126:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "1703:5:8",
									"nodeType": "YulTypedName",
									"src": "1703:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "cleaned",
									"nativeSrc": "1713:7:8",
									"nodeType": "YulTypedName",
									"src": "1713:7:8",
									"type": ""
								}
							],
							"src": "1676:126:8"
						},
						{
							"body": {
								"nativeSrc": "1853:51:8",
								"nodeType": "YulBlock",
								"src": "1853:51:8",
								"statements": [
									{
										"nativeSrc": "1863:35:8",
										"nodeType": "YulAssignment",
										"src": "1863:35:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "1892:5:8",
													"nodeType": "YulIdentifier",
													"src": "1892:5:8"
												}
											],
											"functionName": {
												"name": "cleanup_t_uint160",
												"nativeSrc": "1874:17:8",
												"nodeType": "YulIdentifier",
												"src": "1874:17:8"
											},
											"nativeSrc": "1874:24:8",
											"nodeType": "YulFunctionCall",
											"src": "1874:24:8"
										},
										"variableNames": [
											{
												"name": "cleaned",
												"nativeSrc": "1863:7:8",
												"nodeType": "YulIdentifier",
												"src": "1863:7:8"
											}
										]
									}
								]
							},
							"name": "cleanup_t_address",
							"nativeSrc": "1808:96:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "1835:5:8",
									"nodeType": "YulTypedName",
									"src": "1835:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "cleaned",
									"nativeSrc": "1845:7:8",
									"nodeType": "YulTypedName",
									"src": "1845:7:8",
									"type": ""
								}
							],
							"src": "1808:96:8"
						},
						{
							"body": {
								"nativeSrc": "1953:79:8",
								"nodeType": "YulBlock",
								"src": "1953:79:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "2010:16:8",
											"nodeType": "YulBlock",
											"src": "2010:16:8",
											"statements": [
												{
													"expression": {
														"arguments": [
															{
																"kind": "number",
																"nativeSrc": "2019:1:8",
																"nodeType": "YulLiteral",
																"src": "2019:1:8",
																"type": "",
																"value": "0"
															},
															{
																"kind": "number",
																"nativeSrc": "2022:1:8",
																"nodeType": "YulLiteral",
																"src": "2022:1:8",
																"type": "",
																"value": "0"
															}
														],
														"functionName": {
															"name": "revert",
															"nativeSrc": "2012:6:8",
															"nodeType": "YulIdentifier",
															"src": "2012:6:8"
														},
														"nativeSrc": "2012:12:8",
														"nodeType": "YulFunctionCall",
														"src": "2012:12:8"
													},
													"nativeSrc": "2012:12:8",
													"nodeType": "YulExpressionStatement",
													"src": "2012:12:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "1976:5:8",
															"nodeType": "YulIdentifier",
															"src": "1976:5:8"
														},
														{
															"arguments": [
																{
																	"name": "value",
																	"nativeSrc": "2001:5:8",
																	"nodeType": "YulIdentifier",
																	"src": "2001:5:8"
																}
															],
															"functionName": {
																"name": "cleanup_t_address",
																"nativeSrc": "1983:17:8",
																"nodeType": "YulIdentifier",
																"src": "1983:17:8"
															},
															"nativeSrc": "1983:24:8",
															"nodeType": "YulFunctionCall",
															"src": "1983:24:8"
														}
													],
													"functionName": {
														"name": "eq",
														"nativeSrc": "1973:2:8",
														"nodeType": "YulIdentifier",
														"src": "1973:2:8"
													},
													"nativeSrc": "1973:35:8",
													"nodeType": "YulFunctionCall",
													"src": "1973:35:8"
												}
											],
											"functionName": {
												"name": "iszero",
												"nativeSrc": "1966:6:8",
												"nodeType": "YulIdentifier",
												"src": "1966:6:8"
											},
											"nativeSrc": "1966:43:8",
											"nodeType": "YulFunctionCall",
											"src": "1966:43:8"
										},
										"nativeSrc": "1963:63:8",
										"nodeType": "YulIf",
										"src": "1963:63:8"
									}
								]
							},
							"name": "validator_revert_t_address",
							"nativeSrc": "1910:122:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "1946:5:8",
									"nodeType": "YulTypedName",
									"src": "1946:5:8",
									"type": ""
								}
							],
							"src": "1910:122:8"
						},
						{
							"body": {
								"nativeSrc": "2090:87:8",
								"nodeType": "YulBlock",
								"src": "2090:87:8",
								"statements": [
									{
										"nativeSrc": "2100:29:8",
										"nodeType": "YulAssignment",
										"src": "2100:29:8",
										"value": {
											"arguments": [
												{
													"name": "offset",
													"nativeSrc": "2122:6:8",
													"nodeType": "YulIdentifier",
													"src": "2122:6:8"
												}
											],
											"functionName": {
												"name": "calldataload",
												"nativeSrc": "2109:12:8",
												"nodeType": "YulIdentifier",
												"src": "2109:12:8"
											},
											"nativeSrc": "2109:20:8",
											"nodeType": "YulFunctionCall",
											"src": "2109:20:8"
										},
										"variableNames": [
											{
												"name": "value",
												"nativeSrc": "2100:5:8",
												"nodeType": "YulIdentifier",
												"src": "2100:5:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "2165:5:8",
													"nodeType": "YulIdentifier",
													"src": "2165:5:8"
												}
											],
											"functionName": {
												"name": "validator_revert_t_address",
												"nativeSrc": "2138:26:8",
												"nodeType": "YulIdentifier",
												"src": "2138:26:8"
											},
											"nativeSrc": "2138:33:8",
											"nodeType": "YulFunctionCall",
											"src": "2138:33:8"
										},
										"nativeSrc": "2138:33:8",
										"nodeType": "YulExpressionStatement",
										"src": "2138:33:8"
									}
								]
							},
							"name": "abi_decode_t_address",
							"nativeSrc": "2038:139:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "offset",
									"nativeSrc": "2068:6:8",
									"nodeType": "YulTypedName",
									"src": "2068:6:8",
									"type": ""
								},
								{
									"name": "end",
									"nativeSrc": "2076:3:8",
									"nodeType": "YulTypedName",
									"src": "2076:3:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "value",
									"nativeSrc": "2084:5:8",
									"nodeType": "YulTypedName",
									"src": "2084:5:8",
									"type": ""
								}
							],
							"src": "2038:139:8"
						},
						{
							"body": {
								"nativeSrc": "2228:32:8",
								"nodeType": "YulBlock",
								"src": "2228:32:8",
								"statements": [
									{
										"nativeSrc": "2238:16:8",
										"nodeType": "YulAssignment",
										"src": "2238:16:8",
										"value": {
											"name": "value",
											"nativeSrc": "2249:5:8",
											"nodeType": "YulIdentifier",
											"src": "2249:5:8"
										},
										"variableNames": [
											{
												"name": "cleaned",
												"nativeSrc": "2238:7:8",
												"nodeType": "YulIdentifier",
												"src": "2238:7:8"
											}
										]
									}
								]
							},
							"name": "cleanup_t_uint256",
							"nativeSrc": "2183:77:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "2210:5:8",
									"nodeType": "YulTypedName",
									"src": "2210:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "cleaned",
									"nativeSrc": "2220:7:8",
									"nodeType": "YulTypedName",
									"src": "2220:7:8",
									"type": ""
								}
							],
							"src": "2183:77:8"
						},
						{
							"body": {
								"nativeSrc": "2309:79:8",
								"nodeType": "YulBlock",
								"src": "2309:79:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "2366:16:8",
											"nodeType": "YulBlock",
											"src": "2366:16:8",
											"statements": [
												{
													"expression": {
														"arguments": [
															{
																"kind": "number",
																"nativeSrc": "2375:1:8",
																"nodeType": "YulLiteral",
																"src": "2375:1:8",
																"type": "",
																"value": "0"
															},
															{
																"kind": "number",
																"nativeSrc": "2378:1:8",
																"nodeType": "YulLiteral",
																"src": "2378:1:8",
																"type": "",
																"value": "0"
															}
														],
														"functionName": {
															"name": "revert",
															"nativeSrc": "2368:6:8",
															"nodeType": "YulIdentifier",
															"src": "2368:6:8"
														},
														"nativeSrc": "2368:12:8",
														"nodeType": "YulFunctionCall",
														"src": "2368:12:8"
													},
													"nativeSrc": "2368:12:8",
													"nodeType": "YulExpressionStatement",
													"src": "2368:12:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "2332:5:8",
															"nodeType": "YulIdentifier",
															"src": "2332:5:8"
														},
														{
															"arguments": [
																{
																	"name": "value",
																	"nativeSrc": "2357:5:8",
																	"nodeType": "YulIdentifier",
																	"src": "2357:5:8"
																}
															],
															"functionName": {
																"name": "cleanup_t_uint256",
																"nativeSrc": "2339:17:8",
																"nodeType": "YulIdentifier",
																"src": "2339:17:8"
															},
															"nativeSrc": "2339:24:8",
															"nodeType": "YulFunctionCall",
															"src": "2339:24:8"
														}
													],
													"functionName": {
														"name": "eq",
														"nativeSrc": "2329:2:8",
														"nodeType": "YulIdentifier",
														"src": "2329:2:8"
													},
													"nativeSrc": "2329:35:8",
													"nodeType": "YulFunctionCall",
													"src": "2329:35:8"
												}
											],
											"functionName": {
												"name": "iszero",
												"nativeSrc": "2322:6:8",
												"nodeType": "YulIdentifier",
												"src": "2322:6:8"
											},
											"nativeSrc": "2322:43:8",
											"nodeType": "YulFunctionCall",
											"src": "2322:43:8"
										},
										"nativeSrc": "2319:63:8",
										"nodeType": "YulIf",
										"src": "2319:63:8"
									}
								]
							},
							"name": "validator_revert_t_uint256",
							"nativeSrc": "2266:122:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "2302:5:8",
									"nodeType": "YulTypedName",
									"src": "2302:5:8",
									"type": ""
								}
							],
							"src": "2266:122:8"
						},
						{
							"body": {
								"nativeSrc": "2446:87:8",
								"nodeType": "YulBlock",
								"src": "2446:87:8",
								"statements": [
									{
										"nativeSrc": "2456:29:8",
										"nodeType": "YulAssignment",
										"src": "2456:29:8",
										"value": {
											"arguments": [
												{
													"name": "offset",
													"nativeSrc": "2478:6:8",
													"nodeType": "YulIdentifier",
													"src": "2478:6:8"
												}
											],
											"functionName": {
												"name": "calldataload",
												"nativeSrc": "2465:12:8",
												"nodeType": "YulIdentifier",
												"src": "2465:12:8"
											},
											"nativeSrc": "2465:20:8",
											"nodeType": "YulFunctionCall",
											"src": "2465:20:8"
										},
										"variableNames": [
											{
												"name": "value",
												"nativeSrc": "2456:5:8",
												"nodeType": "YulIdentifier",
												"src": "2456:5:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "2521:5:8",
													"nodeType": "YulIdentifier",
													"src": "2521:5:8"
												}
											],
											"functionName": {
												"name": "validator_revert_t_uint256",
												"nativeSrc": "2494:26:8",
												"nodeType": "YulIdentifier",
												"src": "2494:26:8"
											},
											"nativeSrc": "2494:33:8",
											"nodeType": "YulFunctionCall",
											"src": "2494:33:8"
										},
										"nativeSrc": "2494:33:8",
										"nodeType": "YulExpressionStatement",
										"src": "2494:33:8"
									}
								]
							},
							"name": "abi_decode_t_uint256",
							"nativeSrc": "2394:139:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "offset",
									"nativeSrc": "2424:6:8",
									"nodeType": "YulTypedName",
									"src": "2424:6:8",
									"type": ""
								},
								{
									"name": "end",
									"nativeSrc": "2432:3:8",
									"nodeType": "YulTypedName",
									"src": "2432:3:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "value",
									"nativeSrc": "2440:5:8",
									"nodeType": "YulTypedName",
									"src": "2440:5:8",
									"type": ""
								}
							],
							"src": "2394:139:8"
						},
						{
							"body": {
								"nativeSrc": "2622:391:8",
								"nodeType": "YulBlock",
								"src": "2622:391:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "2668:83:8",
											"nodeType": "YulBlock",
											"src": "2668:83:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
															"nativeSrc": "2670:77:8",
															"nodeType": "YulIdentifier",
															"src": "2670:77:8"
														},
														"nativeSrc": "2670:79:8",
														"nodeType": "YulFunctionCall",
														"src": "2670:79:8"
													},
													"nativeSrc": "2670:79:8",
													"nodeType": "YulExpressionStatement",
													"src": "2670:79:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "dataEnd",
															"nativeSrc": "2643:7:8",
															"nodeType": "YulIdentifier",
															"src": "2643:7:8"
														},
														{
															"name": "headStart",
															"nativeSrc": "2652:9:8",
															"nodeType": "YulIdentifier",
															"src": "2652:9:8"
														}
													],
													"functionName": {
														"name": "sub",
														"nativeSrc": "2639:3:8",
														"nodeType": "YulIdentifier",
														"src": "2639:3:8"
													},
													"nativeSrc": "2639:23:8",
													"nodeType": "YulFunctionCall",
													"src": "2639:23:8"
												},
												{
													"kind": "number",
													"nativeSrc": "2664:2:8",
													"nodeType": "YulLiteral",
													"src": "2664:2:8",
													"type": "",
													"value": "64"
												}
											],
											"functionName": {
												"name": "slt",
												"nativeSrc": "2635:3:8",
												"nodeType": "YulIdentifier",
												"src": "2635:3:8"
											},
											"nativeSrc": "2635:32:8",
											"nodeType": "YulFunctionCall",
											"src": "2635:32:8"
										},
										"nativeSrc": "2632:119:8",
										"nodeType": "YulIf",
										"src": "2632:119:8"
									},
									{
										"nativeSrc": "2761:117:8",
										"nodeType": "YulBlock",
										"src": "2761:117:8",
										"statements": [
											{
												"nativeSrc": "2776:15:8",
												"nodeType": "YulVariableDeclaration",
												"src": "2776:15:8",
												"value": {
													"kind": "number",
													"nativeSrc": "2790:1:8",
													"nodeType": "YulLiteral",
													"src": "2790:1:8",
													"type": "",
													"value": "0"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "2780:6:8",
														"nodeType": "YulTypedName",
														"src": "2780:6:8",
														"type": ""
													}
												]
											},
											{
												"nativeSrc": "2805:63:8",
												"nodeType": "YulAssignment",
												"src": "2805:63:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "2840:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "2840:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "2851:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "2851:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "2836:3:8",
																"nodeType": "YulIdentifier",
																"src": "2836:3:8"
															},
															"nativeSrc": "2836:22:8",
															"nodeType": "YulFunctionCall",
															"src": "2836:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "2860:7:8",
															"nodeType": "YulIdentifier",
															"src": "2860:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_address",
														"nativeSrc": "2815:20:8",
														"nodeType": "YulIdentifier",
														"src": "2815:20:8"
													},
													"nativeSrc": "2815:53:8",
													"nodeType": "YulFunctionCall",
													"src": "2815:53:8"
												},
												"variableNames": [
													{
														"name": "value0",
														"nativeSrc": "2805:6:8",
														"nodeType": "YulIdentifier",
														"src": "2805:6:8"
													}
												]
											}
										]
									},
									{
										"nativeSrc": "2888:118:8",
										"nodeType": "YulBlock",
										"src": "2888:118:8",
										"statements": [
											{
												"nativeSrc": "2903:16:8",
												"nodeType": "YulVariableDeclaration",
												"src": "2903:16:8",
												"value": {
													"kind": "number",
													"nativeSrc": "2917:2:8",
													"nodeType": "YulLiteral",
													"src": "2917:2:8",
													"type": "",
													"value": "32"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "2907:6:8",
														"nodeType": "YulTypedName",
														"src": "2907:6:8",
														"type": ""
													}
												]
											},
											{
												"nativeSrc": "2933:63:8",
												"nodeType": "YulAssignment",
												"src": "2933:63:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "2968:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "2968:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "2979:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "2979:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "2964:3:8",
																"nodeType": "YulIdentifier",
																"src": "2964:3:8"
															},
															"nativeSrc": "2964:22:8",
															"nodeType": "YulFunctionCall",
															"src": "2964:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "2988:7:8",
															"nodeType": "YulIdentifier",
															"src": "2988:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_uint256",
														"nativeSrc": "2943:20:8",
														"nodeType": "YulIdentifier",
														"src": "2943:20:8"
													},
													"nativeSrc": "2943:53:8",
													"nodeType": "YulFunctionCall",
													"src": "2943:53:8"
												},
												"variableNames": [
													{
														"name": "value1",
														"nativeSrc": "2933:6:8",
														"nodeType": "YulIdentifier",
														"src": "2933:6:8"
													}
												]
											}
										]
									}
								]
							},
							"name": "abi_decode_tuple_t_addresst_uint256",
							"nativeSrc": "2539:474:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "2584:9:8",
									"nodeType": "YulTypedName",
									"src": "2584:9:8",
									"type": ""
								},
								{
									"name": "dataEnd",
									"nativeSrc": "2595:7:8",
									"nodeType": "YulTypedName",
									"src": "2595:7:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "value0",
									"nativeSrc": "2607:6:8",
									"nodeType": "YulTypedName",
									"src": "2607:6:8",
									"type": ""
								},
								{
									"name": "value1",
									"nativeSrc": "2615:6:8",
									"nodeType": "YulTypedName",
									"src": "2615:6:8",
									"type": ""
								}
							],
							"src": "2539:474:8"
						},
						{
							"body": {
								"nativeSrc": "3061:48:8",
								"nodeType": "YulBlock",
								"src": "3061:48:8",
								"statements": [
									{
										"nativeSrc": "3071:32:8",
										"nodeType": "YulAssignment",
										"src": "3071:32:8",
										"value": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "3096:5:8",
															"nodeType": "YulIdentifier",
															"src": "3096:5:8"
														}
													],
													"functionName": {
														"name": "iszero",
														"nativeSrc": "3089:6:8",
														"nodeType": "YulIdentifier",
														"src": "3089:6:8"
													},
													"nativeSrc": "3089:13:8",
													"nodeType": "YulFunctionCall",
													"src": "3089:13:8"
												}
											],
											"functionName": {
												"name": "iszero",
												"nativeSrc": "3082:6:8",
												"nodeType": "YulIdentifier",
												"src": "3082:6:8"
											},
											"nativeSrc": "3082:21:8",
											"nodeType": "YulFunctionCall",
											"src": "3082:21:8"
										},
										"variableNames": [
											{
												"name": "cleaned",
												"nativeSrc": "3071:7:8",
												"nodeType": "YulIdentifier",
												"src": "3071:7:8"
											}
										]
									}
								]
							},
							"name": "cleanup_t_bool",
							"nativeSrc": "3019:90:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "3043:5:8",
									"nodeType": "YulTypedName",
									"src": "3043:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "cleaned",
									"nativeSrc": "3053:7:8",
									"nodeType": "YulTypedName",
									"src": "3053:7:8",
									"type": ""
								}
							],
							"src": "3019:90:8"
						},
						{
							"body": {
								"nativeSrc": "3174:50:8",
								"nodeType": "YulBlock",
								"src": "3174:50:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"name": "pos",
													"nativeSrc": "3191:3:8",
													"nodeType": "YulIdentifier",
													"src": "3191:3:8"
												},
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "3211:5:8",
															"nodeType": "YulIdentifier",
															"src": "3211:5:8"
														}
													],
													"functionName": {
														"name": "cleanup_t_bool",
														"nativeSrc": "3196:14:8",
														"nodeType": "YulIdentifier",
														"src": "3196:14:8"
													},
													"nativeSrc": "3196:21:8",
													"nodeType": "YulFunctionCall",
													"src": "3196:21:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "3184:6:8",
												"nodeType": "YulIdentifier",
												"src": "3184:6:8"
											},
											"nativeSrc": "3184:34:8",
											"nodeType": "YulFunctionCall",
											"src": "3184:34:8"
										},
										"nativeSrc": "3184:34:8",
										"nodeType": "YulExpressionStatement",
										"src": "3184:34:8"
									}
								]
							},
							"name": "abi_encode_t_bool_to_t_bool_fromStack",
							"nativeSrc": "3115:109:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "3162:5:8",
									"nodeType": "YulTypedName",
									"src": "3162:5:8",
									"type": ""
								},
								{
									"name": "pos",
									"nativeSrc": "3169:3:8",
									"nodeType": "YulTypedName",
									"src": "3169:3:8",
									"type": ""
								}
							],
							"src": "3115:109:8"
						},
						{
							"body": {
								"nativeSrc": "3322:118:8",
								"nodeType": "YulBlock",
								"src": "3322:118:8",
								"statements": [
									{
										"nativeSrc": "3332:26:8",
										"nodeType": "YulAssignment",
										"src": "3332:26:8",
										"value": {
											"arguments": [
												{
													"name": "headStart",
													"nativeSrc": "3344:9:8",
													"nodeType": "YulIdentifier",
													"src": "3344:9:8"
												},
												{
													"kind": "number",
													"nativeSrc": "3355:2:8",
													"nodeType": "YulLiteral",
													"src": "3355:2:8",
													"type": "",
													"value": "32"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "3340:3:8",
												"nodeType": "YulIdentifier",
												"src": "3340:3:8"
											},
											"nativeSrc": "3340:18:8",
											"nodeType": "YulFunctionCall",
											"src": "3340:18:8"
										},
										"variableNames": [
											{
												"name": "tail",
												"nativeSrc": "3332:4:8",
												"nodeType": "YulIdentifier",
												"src": "3332:4:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value0",
													"nativeSrc": "3406:6:8",
													"nodeType": "YulIdentifier",
													"src": "3406:6:8"
												},
												{
													"arguments": [
														{
															"name": "headStart",
															"nativeSrc": "3419:9:8",
															"nodeType": "YulIdentifier",
															"src": "3419:9:8"
														},
														{
															"kind": "number",
															"nativeSrc": "3430:1:8",
															"nodeType": "YulLiteral",
															"src": "3430:1:8",
															"type": "",
															"value": "0"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "3415:3:8",
														"nodeType": "YulIdentifier",
														"src": "3415:3:8"
													},
													"nativeSrc": "3415:17:8",
													"nodeType": "YulFunctionCall",
													"src": "3415:17:8"
												}
											],
											"functionName": {
												"name": "abi_encode_t_bool_to_t_bool_fromStack",
												"nativeSrc": "3368:37:8",
												"nodeType": "YulIdentifier",
												"src": "3368:37:8"
											},
											"nativeSrc": "3368:65:8",
											"nodeType": "YulFunctionCall",
											"src": "3368:65:8"
										},
										"nativeSrc": "3368:65:8",
										"nodeType": "YulExpressionStatement",
										"src": "3368:65:8"
									}
								]
							},
							"name": "abi_encode_tuple_t_bool__to_t_bool__fromStack_reversed",
							"nativeSrc": "3230:210:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "3294:9:8",
									"nodeType": "YulTypedName",
									"src": "3294:9:8",
									"type": ""
								},
								{
									"name": "value0",
									"nativeSrc": "3306:6:8",
									"nodeType": "YulTypedName",
									"src": "3306:6:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "tail",
									"nativeSrc": "3317:4:8",
									"nodeType": "YulTypedName",
									"src": "3317:4:8",
									"type": ""
								}
							],
							"src": "3230:210:8"
						},
						{
							"body": {
								"nativeSrc": "3511:53:8",
								"nodeType": "YulBlock",
								"src": "3511:53:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"name": "pos",
													"nativeSrc": "3528:3:8",
													"nodeType": "YulIdentifier",
													"src": "3528:3:8"
												},
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "3551:5:8",
															"nodeType": "YulIdentifier",
															"src": "3551:5:8"
														}
													],
													"functionName": {
														"name": "cleanup_t_uint256",
														"nativeSrc": "3533:17:8",
														"nodeType": "YulIdentifier",
														"src": "3533:17:8"
													},
													"nativeSrc": "3533:24:8",
													"nodeType": "YulFunctionCall",
													"src": "3533:24:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "3521:6:8",
												"nodeType": "YulIdentifier",
												"src": "3521:6:8"
											},
											"nativeSrc": "3521:37:8",
											"nodeType": "YulFunctionCall",
											"src": "3521:37:8"
										},
										"nativeSrc": "3521:37:8",
										"nodeType": "YulExpressionStatement",
										"src": "3521:37:8"
									}
								]
							},
							"name": "abi_encode_t_uint256_to_t_uint256_fromStack",
							"nativeSrc": "3446:118:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "3499:5:8",
									"nodeType": "YulTypedName",
									"src": "3499:5:8",
									"type": ""
								},
								{
									"name": "pos",
									"nativeSrc": "3506:3:8",
									"nodeType": "YulTypedName",
									"src": "3506:3:8",
									"type": ""
								}
							],
							"src": "3446:118:8"
						},
						{
							"body": {
								"nativeSrc": "3668:124:8",
								"nodeType": "YulBlock",
								"src": "3668:124:8",
								"statements": [
									{
										"nativeSrc": "3678:26:8",
										"nodeType": "YulAssignment",
										"src": "3678:26:8",
										"value": {
											"arguments": [
												{
													"name": "headStart",
													"nativeSrc": "3690:9:8",
													"nodeType": "YulIdentifier",
													"src": "3690:9:8"
												},
												{
													"kind": "number",
													"nativeSrc": "3701:2:8",
													"nodeType": "YulLiteral",
													"src": "3701:2:8",
													"type": "",
													"value": "32"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "3686:3:8",
												"nodeType": "YulIdentifier",
												"src": "3686:3:8"
											},
											"nativeSrc": "3686:18:8",
											"nodeType": "YulFunctionCall",
											"src": "3686:18:8"
										},
										"variableNames": [
											{
												"name": "tail",
												"nativeSrc": "3678:4:8",
												"nodeType": "YulIdentifier",
												"src": "3678:4:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value0",
													"nativeSrc": "3758:6:8",
													"nodeType": "YulIdentifier",
													"src": "3758:6:8"
												},
												{
													"arguments": [
														{
															"name": "headStart",
															"nativeSrc": "3771:9:8",
															"nodeType": "YulIdentifier",
															"src": "3771:9:8"
														},
														{
															"kind": "number",
															"nativeSrc": "3782:1:8",
															"nodeType": "YulLiteral",
															"src": "3782:1:8",
															"type": "",
															"value": "0"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "3767:3:8",
														"nodeType": "YulIdentifier",
														"src": "3767:3:8"
													},
													"nativeSrc": "3767:17:8",
													"nodeType": "YulFunctionCall",
													"src": "3767:17:8"
												}
											],
											"functionName": {
												"name": "abi_encode_t_uint256_to_t_uint256_fromStack",
												"nativeSrc": "3714:43:8",
												"nodeType": "YulIdentifier",
												"src": "3714:43:8"
											},
											"nativeSrc": "3714:71:8",
											"nodeType": "YulFunctionCall",
											"src": "3714:71:8"
										},
										"nativeSrc": "3714:71:8",
										"nodeType": "YulExpressionStatement",
										"src": "3714:71:8"
									}
								]
							},
							"name": "abi_encode_tuple_t_uint256__to_t_uint256__fromStack_reversed",
							"nativeSrc": "3570:222:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "3640:9:8",
									"nodeType": "YulTypedName",
									"src": "3640:9:8",
									"type": ""
								},
								{
									"name": "value0",
									"nativeSrc": "3652:6:8",
									"nodeType": "YulTypedName",
									"src": "3652:6:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "tail",
									"nativeSrc": "3663:4:8",
									"nodeType": "YulTypedName",
									"src": "3663:4:8",
									"type": ""
								}
							],
							"src": "3570:222:8"
						},
						{
							"body": {
								"nativeSrc": "3898:519:8",
								"nodeType": "YulBlock",
								"src": "3898:519:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "3944:83:8",
											"nodeType": "YulBlock",
											"src": "3944:83:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
															"nativeSrc": "3946:77:8",
															"nodeType": "YulIdentifier",
															"src": "3946:77:8"
														},
														"nativeSrc": "3946:79:8",
														"nodeType": "YulFunctionCall",
														"src": "3946:79:8"
													},
													"nativeSrc": "3946:79:8",
													"nodeType": "YulExpressionStatement",
													"src": "3946:79:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "dataEnd",
															"nativeSrc": "3919:7:8",
															"nodeType": "YulIdentifier",
															"src": "3919:7:8"
														},
														{
															"name": "headStart",
															"nativeSrc": "3928:9:8",
															"nodeType": "YulIdentifier",
															"src": "3928:9:8"
														}
													],
													"functionName": {
														"name": "sub",
														"nativeSrc": "3915:3:8",
														"nodeType": "YulIdentifier",
														"src": "3915:3:8"
													},
													"nativeSrc": "3915:23:8",
													"nodeType": "YulFunctionCall",
													"src": "3915:23:8"
												},
												{
													"kind": "number",
													"nativeSrc": "3940:2:8",
													"nodeType": "YulLiteral",
													"src": "3940:2:8",
													"type": "",
													"value": "96"
												}
											],
											"functionName": {
												"name": "slt",
												"nativeSrc": "3911:3:8",
												"nodeType": "YulIdentifier",
												"src": "3911:3:8"
											},
											"nativeSrc": "3911:32:8",
											"nodeType": "YulFunctionCall",
											"src": "3911:32:8"
										},
										"nativeSrc": "3908:119:8",
										"nodeType": "YulIf",
										"src": "3908:119:8"
									},
									{
										"nativeSrc": "4037:117:8",
										"nodeType": "YulBlock",
										"src": "4037:117:8",
										"statements": [
											{
												"nativeSrc": "4052:15:8",
												"nodeType": "YulVariableDeclaration",
												"src": "4052:15:8",
												"value": {
													"kind": "number",
													"nativeSrc": "4066:1:8",
													"nodeType": "YulLiteral",
													"src": "4066:1:8",
													"type": "",
													"value": "0"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "4056:6:8",
														"nodeType": "YulTypedName",
														"src": "4056:6:8",
														"type": ""
													}
												]
											},
											{
												"nativeSrc": "4081:63:8",
												"nodeType": "YulAssignment",
												"src": "4081:63:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "4116:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "4116:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "4127:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "4127:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "4112:3:8",
																"nodeType": "YulIdentifier",
																"src": "4112:3:8"
															},
															"nativeSrc": "4112:22:8",
															"nodeType": "YulFunctionCall",
															"src": "4112:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "4136:7:8",
															"nodeType": "YulIdentifier",
															"src": "4136:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_address",
														"nativeSrc": "4091:20:8",
														"nodeType": "YulIdentifier",
														"src": "4091:20:8"
													},
													"nativeSrc": "4091:53:8",
													"nodeType": "YulFunctionCall",
													"src": "4091:53:8"
												},
												"variableNames": [
													{
														"name": "value0",
														"nativeSrc": "4081:6:8",
														"nodeType": "YulIdentifier",
														"src": "4081:6:8"
													}
												]
											}
										]
									},
									{
										"nativeSrc": "4164:118:8",
										"nodeType": "YulBlock",
										"src": "4164:118:8",
										"statements": [
											{
												"nativeSrc": "4179:16:8",
												"nodeType": "YulVariableDeclaration",
												"src": "4179:16:8",
												"value": {
													"kind": "number",
													"nativeSrc": "4193:2:8",
													"nodeType": "YulLiteral",
													"src": "4193:2:8",
													"type": "",
													"value": "32"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "4183:6:8",
														"nodeType": "YulTypedName",
														"src": "4183:6:8",
														"type": ""
													}
												]
											},
											{
												"nativeSrc": "4209:63:8",
												"nodeType": "YulAssignment",
												"src": "4209:63:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "4244:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "4244:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "4255:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "4255:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "4240:3:8",
																"nodeType": "YulIdentifier",
																"src": "4240:3:8"
															},
															"nativeSrc": "4240:22:8",
															"nodeType": "YulFunctionCall",
															"src": "4240:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "4264:7:8",
															"nodeType": "YulIdentifier",
															"src": "4264:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_address",
														"nativeSrc": "4219:20:8",
														"nodeType": "YulIdentifier",
														"src": "4219:20:8"
													},
													"nativeSrc": "4219:53:8",
													"nodeType": "YulFunctionCall",
													"src": "4219:53:8"
												},
												"variableNames": [
													{
														"name": "value1",
														"nativeSrc": "4209:6:8",
														"nodeType": "YulIdentifier",
														"src": "4209:6:8"
													}
												]
											}
										]
									},
									{
										"nativeSrc": "4292:118:8",
										"nodeType": "YulBlock",
										"src": "4292:118:8",
										"statements": [
											{
												"nativeSrc": "4307:16:8",
												"nodeType": "YulVariableDeclaration",
												"src": "4307:16:8",
												"value": {
													"kind": "number",
													"nativeSrc": "4321:2:8",
													"nodeType": "YulLiteral",
													"src": "4321:2:8",
													"type": "",
													"value": "64"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "4311:6:8",
														"nodeType": "YulTypedName",
														"src": "4311:6:8",
														"type": ""
													}
												]
											},
											{
												"nativeSrc": "4337:63:8",
												"nodeType": "YulAssignment",
												"src": "4337:63:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "4372:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "4372:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "4383:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "4383:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "4368:3:8",
																"nodeType": "YulIdentifier",
																"src": "4368:3:8"
															},
															"nativeSrc": "4368:22:8",
															"nodeType": "YulFunctionCall",
															"src": "4368:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "4392:7:8",
															"nodeType": "YulIdentifier",
															"src": "4392:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_uint256",
														"nativeSrc": "4347:20:8",
														"nodeType": "YulIdentifier",
														"src": "4347:20:8"
													},
													"nativeSrc": "4347:53:8",
													"nodeType": "YulFunctionCall",
													"src": "4347:53:8"
												},
												"variableNames": [
													{
														"name": "value2",
														"nativeSrc": "4337:6:8",
														"nodeType": "YulIdentifier",
														"src": "4337:6:8"
													}
												]
											}
										]
									}
								]
							},
							"name": "abi_decode_tuple_t_addresst_addresst_uint256",
							"nativeSrc": "3798:619:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "3852:9:8",
									"nodeType": "YulTypedName",
									"src": "3852:9:8",
									"type": ""
								},
								{
									"name": "dataEnd",
									"nativeSrc": "3863:7:8",
									"nodeType": "YulTypedName",
									"src": "3863:7:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "value0",
									"nativeSrc": "3875:6:8",
									"nodeType": "YulTypedName",
									"src": "3875:6:8",
									"type": ""
								},
								{
									"name": "value1",
									"nativeSrc": "3883:6:8",
									"nodeType": "YulTypedName",
									"src": "3883:6:8",
									"type": ""
								},
								{
									"name": "value2",
									"nativeSrc": "3891:6:8",
									"nodeType": "YulTypedName",
									"src": "3891:6:8",
									"type": ""
								}
							],
							"src": "3798:619:8"
						},
						{
							"body": {
								"nativeSrc": "4466:43:8",
								"nodeType": "YulBlock",
								"src": "4466:43:8",
								"statements": [
									{
										"nativeSrc": "4476:27:8",
										"nodeType": "YulAssignment",
										"src": "4476:27:8",
										"value": {
											"arguments": [
												{
													"name": "value",
													"nativeSrc": "4491:5:8",
													"nodeType": "YulIdentifier",
													"src": "4491:5:8"
												},
												{
													"kind": "number",
													"nativeSrc": "4498:4:8",
													"nodeType": "YulLiteral",
													"src": "4498:4:8",
													"type": "",
													"value": "0xff"
												}
											],
											"functionName": {
												"name": "and",
												"nativeSrc": "4487:3:8",
												"nodeType": "YulIdentifier",
												"src": "4487:3:8"
											},
											"nativeSrc": "4487:16:8",
											"nodeType": "YulFunctionCall",
											"src": "4487:16:8"
										},
										"variableNames": [
											{
												"name": "cleaned",
												"nativeSrc": "4476:7:8",
												"nodeType": "YulIdentifier",
												"src": "4476:7:8"
											}
										]
									}
								]
							},
							"name": "cleanup_t_uint8",
							"nativeSrc": "4423:86:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "4448:5:8",
									"nodeType": "YulTypedName",
									"src": "4448:5:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "cleaned",
									"nativeSrc": "4458:7:8",
									"nodeType": "YulTypedName",
									"src": "4458:7:8",
									"type": ""
								}
							],
							"src": "4423:86:8"
						},
						{
							"body": {
								"nativeSrc": "4576:51:8",
								"nodeType": "YulBlock",
								"src": "4576:51:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"name": "pos",
													"nativeSrc": "4593:3:8",
													"nodeType": "YulIdentifier",
													"src": "4593:3:8"
												},
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "4614:5:8",
															"nodeType": "YulIdentifier",
															"src": "4614:5:8"
														}
													],
													"functionName": {
														"name": "cleanup_t_uint8",
														"nativeSrc": "4598:15:8",
														"nodeType": "YulIdentifier",
														"src": "4598:15:8"
													},
													"nativeSrc": "4598:22:8",
													"nodeType": "YulFunctionCall",
													"src": "4598:22:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "4586:6:8",
												"nodeType": "YulIdentifier",
												"src": "4586:6:8"
											},
											"nativeSrc": "4586:35:8",
											"nodeType": "YulFunctionCall",
											"src": "4586:35:8"
										},
										"nativeSrc": "4586:35:8",
										"nodeType": "YulExpressionStatement",
										"src": "4586:35:8"
									}
								]
							},
							"name": "abi_encode_t_uint8_to_t_uint8_fromStack",
							"nativeSrc": "4515:112:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "4564:5:8",
									"nodeType": "YulTypedName",
									"src": "4564:5:8",
									"type": ""
								},
								{
									"name": "pos",
									"nativeSrc": "4571:3:8",
									"nodeType": "YulTypedName",
									"src": "4571:3:8",
									"type": ""
								}
							],
							"src": "4515:112:8"
						},
						{
							"body": {
								"nativeSrc": "4727:120:8",
								"nodeType": "YulBlock",
								"src": "4727:120:8",
								"statements": [
									{
										"nativeSrc": "4737:26:8",
										"nodeType": "YulAssignment",
										"src": "4737:26:8",
										"value": {
											"arguments": [
												{
													"name": "headStart",
													"nativeSrc": "4749:9:8",
													"nodeType": "YulIdentifier",
													"src": "4749:9:8"
												},
												{
													"kind": "number",
													"nativeSrc": "4760:2:8",
													"nodeType": "YulLiteral",
													"src": "4760:2:8",
													"type": "",
													"value": "32"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "4745:3:8",
												"nodeType": "YulIdentifier",
												"src": "4745:3:8"
											},
											"nativeSrc": "4745:18:8",
											"nodeType": "YulFunctionCall",
											"src": "4745:18:8"
										},
										"variableNames": [
											{
												"name": "tail",
												"nativeSrc": "4737:4:8",
												"nodeType": "YulIdentifier",
												"src": "4737:4:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value0",
													"nativeSrc": "4813:6:8",
													"nodeType": "YulIdentifier",
													"src": "4813:6:8"
												},
												{
													"arguments": [
														{
															"name": "headStart",
															"nativeSrc": "4826:9:8",
															"nodeType": "YulIdentifier",
															"src": "4826:9:8"
														},
														{
															"kind": "number",
															"nativeSrc": "4837:1:8",
															"nodeType": "YulLiteral",
															"src": "4837:1:8",
															"type": "",
															"value": "0"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "4822:3:8",
														"nodeType": "YulIdentifier",
														"src": "4822:3:8"
													},
													"nativeSrc": "4822:17:8",
													"nodeType": "YulFunctionCall",
													"src": "4822:17:8"
												}
											],
											"functionName": {
												"name": "abi_encode_t_uint8_to_t_uint8_fromStack",
												"nativeSrc": "4773:39:8",
												"nodeType": "YulIdentifier",
												"src": "4773:39:8"
											},
											"nativeSrc": "4773:67:8",
											"nodeType": "YulFunctionCall",
											"src": "4773:67:8"
										},
										"nativeSrc": "4773:67:8",
										"nodeType": "YulExpressionStatement",
										"src": "4773:67:8"
									}
								]
							},
							"name": "abi_encode_tuple_t_uint8__to_t_uint8__fromStack_reversed",
							"nativeSrc": "4633:214:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "4699:9:8",
									"nodeType": "YulTypedName",
									"src": "4699:9:8",
									"type": ""
								},
								{
									"name": "value0",
									"nativeSrc": "4711:6:8",
									"nodeType": "YulTypedName",
									"src": "4711:6:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "tail",
									"nativeSrc": "4722:4:8",
									"nodeType": "YulTypedName",
									"src": "4722:4:8",
									"type": ""
								}
							],
							"src": "4633:214:8"
						},
						{
							"body": {
								"nativeSrc": "4919:263:8",
								"nodeType": "YulBlock",
								"src": "4919:263:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "4965:83:8",
											"nodeType": "YulBlock",
											"src": "4965:83:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
															"nativeSrc": "4967:77:8",
															"nodeType": "YulIdentifier",
															"src": "4967:77:8"
														},
														"nativeSrc": "4967:79:8",
														"nodeType": "YulFunctionCall",
														"src": "4967:79:8"
													},
													"nativeSrc": "4967:79:8",
													"nodeType": "YulExpressionStatement",
													"src": "4967:79:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "dataEnd",
															"nativeSrc": "4940:7:8",
															"nodeType": "YulIdentifier",
															"src": "4940:7:8"
														},
														{
															"name": "headStart",
															"nativeSrc": "4949:9:8",
															"nodeType": "YulIdentifier",
															"src": "4949:9:8"
														}
													],
													"functionName": {
														"name": "sub",
														"nativeSrc": "4936:3:8",
														"nodeType": "YulIdentifier",
														"src": "4936:3:8"
													},
													"nativeSrc": "4936:23:8",
													"nodeType": "YulFunctionCall",
													"src": "4936:23:8"
												},
												{
													"kind": "number",
													"nativeSrc": "4961:2:8",
													"nodeType": "YulLiteral",
													"src": "4961:2:8",
													"type": "",
													"value": "32"
												}
											],
											"functionName": {
												"name": "slt",
												"nativeSrc": "4932:3:8",
												"nodeType": "YulIdentifier",
												"src": "4932:3:8"
											},
											"nativeSrc": "4932:32:8",
											"nodeType": "YulFunctionCall",
											"src": "4932:32:8"
										},
										"nativeSrc": "4929:119:8",
										"nodeType": "YulIf",
										"src": "4929:119:8"
									},
									{
										"nativeSrc": "5058:117:8",
										"nodeType": "YulBlock",
										"src": "5058:117:8",
										"statements": [
											{
												"nativeSrc": "5073:15:8",
												"nodeType": "YulVariableDeclaration",
												"src": "5073:15:8",
												"value": {
													"kind": "number",
													"nativeSrc": "5087:1:8",
													"nodeType": "YulLiteral",
													"src": "5087:1:8",
													"type": "",
													"value": "0"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "5077:6:8",
														"nodeType": "YulTypedName",
														"src": "5077:6:8",
														"type": ""
													}
												]
											},
											{
												"nativeSrc": "5102:63:8",
												"nodeType": "YulAssignment",
												"src": "5102:63:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "5137:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "5137:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "5148:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "5148:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "5133:3:8",
																"nodeType": "YulIdentifier",
																"src": "5133:3:8"
															},
															"nativeSrc": "5133:22:8",
															"nodeType": "YulFunctionCall",
															"src": "5133:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "5157:7:8",
															"nodeType": "YulIdentifier",
															"src": "5157:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_uint256",
														"nativeSrc": "5112:20:8",
														"nodeType": "YulIdentifier",
														"src": "5112:20:8"
													},
													"nativeSrc": "5112:53:8",
													"nodeType": "YulFunctionCall",
													"src": "5112:53:8"
												},
												"variableNames": [
													{
														"name": "value0",
														"nativeSrc": "5102:6:8",
														"nodeType": "YulIdentifier",
														"src": "5102:6:8"
													}
												]
											}
										]
									}
								]
							},
							"name": "abi_decode_tuple_t_uint256",
							"nativeSrc": "4853:329:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "4889:9:8",
									"nodeType": "YulTypedName",
									"src": "4889:9:8",
									"type": ""
								},
								{
									"name": "dataEnd",
									"nativeSrc": "4900:7:8",
									"nodeType": "YulTypedName",
									"src": "4900:7:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "value0",
									"nativeSrc": "4912:6:8",
									"nodeType": "YulTypedName",
									"src": "4912:6:8",
									"type": ""
								}
							],
							"src": "4853:329:8"
						},
						{
							"body": {
								"nativeSrc": "5254:263:8",
								"nodeType": "YulBlock",
								"src": "5254:263:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "5300:83:8",
											"nodeType": "YulBlock",
											"src": "5300:83:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
															"nativeSrc": "5302:77:8",
															"nodeType": "YulIdentifier",
															"src": "5302:77:8"
														},
														"nativeSrc": "5302:79:8",
														"nodeType": "YulFunctionCall",
														"src": "5302:79:8"
													},
													"nativeSrc": "5302:79:8",
													"nodeType": "YulExpressionStatement",
													"src": "5302:79:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "dataEnd",
															"nativeSrc": "5275:7:8",
															"nodeType": "YulIdentifier",
															"src": "5275:7:8"
														},
														{
															"name": "headStart",
															"nativeSrc": "5284:9:8",
															"nodeType": "YulIdentifier",
															"src": "5284:9:8"
														}
													],
													"functionName": {
														"name": "sub",
														"nativeSrc": "5271:3:8",
														"nodeType": "YulIdentifier",
														"src": "5271:3:8"
													},
													"nativeSrc": "5271:23:8",
													"nodeType": "YulFunctionCall",
													"src": "5271:23:8"
												},
												{
													"kind": "number",
													"nativeSrc": "5296:2:8",
													"nodeType": "YulLiteral",
													"src": "5296:2:8",
													"type": "",
													"value": "32"
												}
											],
											"functionName": {
												"name": "slt",
												"nativeSrc": "5267:3:8",
												"nodeType": "YulIdentifier",
												"src": "5267:3:8"
											},
											"nativeSrc": "5267:32:8",
											"nodeType": "YulFunctionCall",
											"src": "5267:32:8"
										},
										"nativeSrc": "5264:119:8",
										"nodeType": "YulIf",
										"src": "5264:119:8"
									},
									{
										"nativeSrc": "5393:117:8",
										"nodeType": "YulBlock",
										"src": "5393:117:8",
										"statements": [
											{
												"nativeSrc": "5408:15:8",
												"nodeType": "YulVariableDeclaration",
												"src": "5408:15:8",
												"value": {
													"kind": "number",
													"nativeSrc": "5422:1:8",
													"nodeType": "YulLiteral",
													"src": "5422:1:8",
													"type": "",
													"value": "0"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "5412:6:8",
														"nodeType": "YulTypedName",
														"src": "5412:6:8",
														"type": ""
													}
												]
											},
											{
												"nativeSrc": "5437:63:8",
												"nodeType": "YulAssignment",
												"src": "5437:63:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "5472:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "5472:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "5483:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "5483:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "5468:3:8",
																"nodeType": "YulIdentifier",
																"src": "5468:3:8"
															},
															"nativeSrc": "5468:22:8",
															"nodeType": "YulFunctionCall",
															"src": "5468:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "5492:7:8",
															"nodeType": "YulIdentifier",
															"src": "5492:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_address",
														"nativeSrc": "5447:20:8",
														"nodeType": "YulIdentifier",
														"src": "5447:20:8"
													},
													"nativeSrc": "5447:53:8",
													"nodeType": "YulFunctionCall",
													"src": "5447:53:8"
												},
												"variableNames": [
													{
														"name": "value0",
														"nativeSrc": "5437:6:8",
														"nodeType": "YulIdentifier",
														"src": "5437:6:8"
													}
												]
											}
										]
									}
								]
							},
							"name": "abi_decode_tuple_t_address",
							"nativeSrc": "5188:329:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "5224:9:8",
									"nodeType": "YulTypedName",
									"src": "5224:9:8",
									"type": ""
								},
								{
									"name": "dataEnd",
									"nativeSrc": "5235:7:8",
									"nodeType": "YulTypedName",
									"src": "5235:7:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "value0",
									"nativeSrc": "5247:6:8",
									"nodeType": "YulTypedName",
									"src": "5247:6:8",
									"type": ""
								}
							],
							"src": "5188:329:8"
						},
						{
							"body": {
								"nativeSrc": "5588:53:8",
								"nodeType": "YulBlock",
								"src": "5588:53:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"name": "pos",
													"nativeSrc": "5605:3:8",
													"nodeType": "YulIdentifier",
													"src": "5605:3:8"
												},
												{
													"arguments": [
														{
															"name": "value",
															"nativeSrc": "5628:5:8",
															"nodeType": "YulIdentifier",
															"src": "5628:5:8"
														}
													],
													"functionName": {
														"name": "cleanup_t_address",
														"nativeSrc": "5610:17:8",
														"nodeType": "YulIdentifier",
														"src": "5610:17:8"
													},
													"nativeSrc": "5610:24:8",
													"nodeType": "YulFunctionCall",
													"src": "5610:24:8"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "5598:6:8",
												"nodeType": "YulIdentifier",
												"src": "5598:6:8"
											},
											"nativeSrc": "5598:37:8",
											"nodeType": "YulFunctionCall",
											"src": "5598:37:8"
										},
										"nativeSrc": "5598:37:8",
										"nodeType": "YulExpressionStatement",
										"src": "5598:37:8"
									}
								]
							},
							"name": "abi_encode_t_address_to_t_address_fromStack",
							"nativeSrc": "5523:118:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "value",
									"nativeSrc": "5576:5:8",
									"nodeType": "YulTypedName",
									"src": "5576:5:8",
									"type": ""
								},
								{
									"name": "pos",
									"nativeSrc": "5583:3:8",
									"nodeType": "YulTypedName",
									"src": "5583:3:8",
									"type": ""
								}
							],
							"src": "5523:118:8"
						},
						{
							"body": {
								"nativeSrc": "5745:124:8",
								"nodeType": "YulBlock",
								"src": "5745:124:8",
								"statements": [
									{
										"nativeSrc": "5755:26:8",
										"nodeType": "YulAssignment",
										"src": "5755:26:8",
										"value": {
											"arguments": [
												{
													"name": "headStart",
													"nativeSrc": "5767:9:8",
													"nodeType": "YulIdentifier",
													"src": "5767:9:8"
												},
												{
													"kind": "number",
													"nativeSrc": "5778:2:8",
													"nodeType": "YulLiteral",
													"src": "5778:2:8",
													"type": "",
													"value": "32"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "5763:3:8",
												"nodeType": "YulIdentifier",
												"src": "5763:3:8"
											},
											"nativeSrc": "5763:18:8",
											"nodeType": "YulFunctionCall",
											"src": "5763:18:8"
										},
										"variableNames": [
											{
												"name": "tail",
												"nativeSrc": "5755:4:8",
												"nodeType": "YulIdentifier",
												"src": "5755:4:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value0",
													"nativeSrc": "5835:6:8",
													"nodeType": "YulIdentifier",
													"src": "5835:6:8"
												},
												{
													"arguments": [
														{
															"name": "headStart",
															"nativeSrc": "5848:9:8",
															"nodeType": "YulIdentifier",
															"src": "5848:9:8"
														},
														{
															"kind": "number",
															"nativeSrc": "5859:1:8",
															"nodeType": "YulLiteral",
															"src": "5859:1:8",
															"type": "",
															"value": "0"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "5844:3:8",
														"nodeType": "YulIdentifier",
														"src": "5844:3:8"
													},
													"nativeSrc": "5844:17:8",
													"nodeType": "YulFunctionCall",
													"src": "5844:17:8"
												}
											],
											"functionName": {
												"name": "abi_encode_t_address_to_t_address_fromStack",
												"nativeSrc": "5791:43:8",
												"nodeType": "YulIdentifier",
												"src": "5791:43:8"
											},
											"nativeSrc": "5791:71:8",
											"nodeType": "YulFunctionCall",
											"src": "5791:71:8"
										},
										"nativeSrc": "5791:71:8",
										"nodeType": "YulExpressionStatement",
										"src": "5791:71:8"
									}
								]
							},
							"name": "abi_encode_tuple_t_address__to_t_address__fromStack_reversed",
							"nativeSrc": "5647:222:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "5717:9:8",
									"nodeType": "YulTypedName",
									"src": "5717:9:8",
									"type": ""
								},
								{
									"name": "value0",
									"nativeSrc": "5729:6:8",
									"nodeType": "YulTypedName",
									"src": "5729:6:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "tail",
									"nativeSrc": "5740:4:8",
									"nodeType": "YulTypedName",
									"src": "5740:4:8",
									"type": ""
								}
							],
							"src": "5647:222:8"
						},
						{
							"body": {
								"nativeSrc": "5958:391:8",
								"nodeType": "YulBlock",
								"src": "5958:391:8",
								"statements": [
									{
										"body": {
											"nativeSrc": "6004:83:8",
											"nodeType": "YulBlock",
											"src": "6004:83:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
															"nativeSrc": "6006:77:8",
															"nodeType": "YulIdentifier",
															"src": "6006:77:8"
														},
														"nativeSrc": "6006:79:8",
														"nodeType": "YulFunctionCall",
														"src": "6006:79:8"
													},
													"nativeSrc": "6006:79:8",
													"nodeType": "YulExpressionStatement",
													"src": "6006:79:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"arguments": [
														{
															"name": "dataEnd",
															"nativeSrc": "5979:7:8",
															"nodeType": "YulIdentifier",
															"src": "5979:7:8"
														},
														{
															"name": "headStart",
															"nativeSrc": "5988:9:8",
															"nodeType": "YulIdentifier",
															"src": "5988:9:8"
														}
													],
													"functionName": {
														"name": "sub",
														"nativeSrc": "5975:3:8",
														"nodeType": "YulIdentifier",
														"src": "5975:3:8"
													},
													"nativeSrc": "5975:23:8",
													"nodeType": "YulFunctionCall",
													"src": "5975:23:8"
												},
												{
													"kind": "number",
													"nativeSrc": "6000:2:8",
													"nodeType": "YulLiteral",
													"src": "6000:2:8",
													"type": "",
													"value": "64"
												}
											],
											"functionName": {
												"name": "slt",
												"nativeSrc": "5971:3:8",
												"nodeType": "YulIdentifier",
												"src": "5971:3:8"
											},
											"nativeSrc": "5971:32:8",
											"nodeType": "YulFunctionCall",
											"src": "5971:32:8"
										},
										"nativeSrc": "5968:119:8",
										"nodeType": "YulIf",
										"src": "5968:119:8"
									},
									{
										"nativeSrc": "6097:117:8",
										"nodeType": "YulBlock",
										"src": "6097:117:8",
										"statements": [
											{
												"nativeSrc": "6112:15:8",
												"nodeType": "YulVariableDeclaration",
												"src": "6112:15:8",
												"value": {
													"kind": "number",
													"nativeSrc": "6126:1:8",
													"nodeType": "YulLiteral",
													"src": "6126:1:8",
													"type": "",
													"value": "0"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "6116:6:8",
														"nodeType": "YulTypedName",
														"src": "6116:6:8",
														"type": ""
													}
												]
											},
											{
												"nativeSrc": "6141:63:8",
												"nodeType": "YulAssignment",
												"src": "6141:63:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "6176:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "6176:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "6187:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "6187:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "6172:3:8",
																"nodeType": "YulIdentifier",
																"src": "6172:3:8"
															},
															"nativeSrc": "6172:22:8",
															"nodeType": "YulFunctionCall",
															"src": "6172:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "6196:7:8",
															"nodeType": "YulIdentifier",
															"src": "6196:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_address",
														"nativeSrc": "6151:20:8",
														"nodeType": "YulIdentifier",
														"src": "6151:20:8"
													},
													"nativeSrc": "6151:53:8",
													"nodeType": "YulFunctionCall",
													"src": "6151:53:8"
												},
												"variableNames": [
													{
														"name": "value0",
														"nativeSrc": "6141:6:8",
														"nodeType": "YulIdentifier",
														"src": "6141:6:8"
													}
												]
											}
										]
									},
									{
										"nativeSrc": "6224:118:8",
										"nodeType": "YulBlock",
										"src": "6224:118:8",
										"statements": [
											{
												"nativeSrc": "6239:16:8",
												"nodeType": "YulVariableDeclaration",
												"src": "6239:16:8",
												"value": {
													"kind": "number",
													"nativeSrc": "6253:2:8",
													"nodeType": "YulLiteral",
													"src": "6253:2:8",
													"type": "",
													"value": "32"
												},
												"variables": [
													{
														"name": "offset",
														"nativeSrc": "6243:6:8",
														"nodeType": "YulTypedName",
														"src": "6243:6:8",
														"type": ""
													}
												]
											},
											{
												"nativeSrc": "6269:63:8",
												"nodeType": "YulAssignment",
												"src": "6269:63:8",
												"value": {
													"arguments": [
														{
															"arguments": [
																{
																	"name": "headStart",
																	"nativeSrc": "6304:9:8",
																	"nodeType": "YulIdentifier",
																	"src": "6304:9:8"
																},
																{
																	"name": "offset",
																	"nativeSrc": "6315:6:8",
																	"nodeType": "YulIdentifier",
																	"src": "6315:6:8"
																}
															],
															"functionName": {
																"name": "add",
																"nativeSrc": "6300:3:8",
																"nodeType": "YulIdentifier",
																"src": "6300:3:8"
															},
															"nativeSrc": "6300:22:8",
															"nodeType": "YulFunctionCall",
															"src": "6300:22:8"
														},
														{
															"name": "dataEnd",
															"nativeSrc": "6324:7:8",
															"nodeType": "YulIdentifier",
															"src": "6324:7:8"
														}
													],
													"functionName": {
														"name": "abi_decode_t_address",
														"nativeSrc": "6279:20:8",
														"nodeType": "YulIdentifier",
														"src": "6279:20:8"
													},
													"nativeSrc": "6279:53:8",
													"nodeType": "YulFunctionCall",
													"src": "6279:53:8"
												},
												"variableNames": [
													{
														"name": "value1",
														"nativeSrc": "6269:6:8",
														"nodeType": "YulIdentifier",
														"src": "6269:6:8"
													}
												]
											}
										]
									}
								]
							},
							"name": "abi_decode_tuple_t_addresst_address",
							"nativeSrc": "5875:474:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "5920:9:8",
									"nodeType": "YulTypedName",
									"src": "5920:9:8",
									"type": ""
								},
								{
									"name": "dataEnd",
									"nativeSrc": "5931:7:8",
									"nodeType": "YulTypedName",
									"src": "5931:7:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "value0",
									"nativeSrc": "5943:6:8",
									"nodeType": "YulTypedName",
									"src": "5943:6:8",
									"type": ""
								},
								{
									"name": "value1",
									"nativeSrc": "5951:6:8",
									"nodeType": "YulTypedName",
									"src": "5951:6:8",
									"type": ""
								}
							],
							"src": "5875:474:8"
						},
						{
							"body": {
								"nativeSrc": "6383:152:8",
								"nodeType": "YulBlock",
								"src": "6383:152:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "6400:1:8",
													"nodeType": "YulLiteral",
													"src": "6400:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "6403:77:8",
													"nodeType": "YulLiteral",
													"src": "6403:77:8",
													"type": "",
													"value": "35408467139433450592217433187231851964531694900788300625387963629091585785856"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "6393:6:8",
												"nodeType": "YulIdentifier",
												"src": "6393:6:8"
											},
											"nativeSrc": "6393:88:8",
											"nodeType": "YulFunctionCall",
											"src": "6393:88:8"
										},
										"nativeSrc": "6393:88:8",
										"nodeType": "YulExpressionStatement",
										"src": "6393:88:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "6497:1:8",
													"nodeType": "YulLiteral",
													"src": "6497:1:8",
													"type": "",
													"value": "4"
												},
												{
													"kind": "number",
													"nativeSrc": "6500:4:8",
													"nodeType": "YulLiteral",
													"src": "6500:4:8",
													"type": "",
													"value": "0x22"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "6490:6:8",
												"nodeType": "YulIdentifier",
												"src": "6490:6:8"
											},
											"nativeSrc": "6490:15:8",
											"nodeType": "YulFunctionCall",
											"src": "6490:15:8"
										},
										"nativeSrc": "6490:15:8",
										"nodeType": "YulExpressionStatement",
										"src": "6490:15:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "6521:1:8",
													"nodeType": "YulLiteral",
													"src": "6521:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "6524:4:8",
													"nodeType": "YulLiteral",
													"src": "6524:4:8",
													"type": "",
													"value": "0x24"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "6514:6:8",
												"nodeType": "YulIdentifier",
												"src": "6514:6:8"
											},
											"nativeSrc": "6514:15:8",
											"nodeType": "YulFunctionCall",
											"src": "6514:15:8"
										},
										"nativeSrc": "6514:15:8",
										"nodeType": "YulExpressionStatement",
										"src": "6514:15:8"
									}
								]
							},
							"name": "panic_error_0x22",
							"nativeSrc": "6355:180:8",
							"nodeType": "YulFunctionDefinition",
							"src": "6355:180:8"
						},
						{
							"body": {
								"nativeSrc": "6592:269:8",
								"nodeType": "YulBlock",
								"src": "6592:269:8",
								"statements": [
									{
										"nativeSrc": "6602:22:8",
										"nodeType": "YulAssignment",
										"src": "6602:22:8",
										"value": {
											"arguments": [
												{
													"name": "data",
													"nativeSrc": "6616:4:8",
													"nodeType": "YulIdentifier",
													"src": "6616:4:8"
												},
												{
													"kind": "number",
													"nativeSrc": "6622:1:8",
													"nodeType": "YulLiteral",
													"src": "6622:1:8",
													"type": "",
													"value": "2"
												}
											],
											"functionName": {
												"name": "div",
												"nativeSrc": "6612:3:8",
												"nodeType": "YulIdentifier",
												"src": "6612:3:8"
											},
											"nativeSrc": "6612:12:8",
											"nodeType": "YulFunctionCall",
											"src": "6612:12:8"
										},
										"variableNames": [
											{
												"name": "length",
												"nativeSrc": "6602:6:8",
												"nodeType": "YulIdentifier",
												"src": "6602:6:8"
											}
										]
									},
									{
										"nativeSrc": "6633:38:8",
										"nodeType": "YulVariableDeclaration",
										"src": "6633:38:8",
										"value": {
											"arguments": [
												{
													"name": "data",
													"nativeSrc": "6663:4:8",
													"nodeType": "YulIdentifier",
													"src": "6663:4:8"
												},
												{
													"kind": "number",
													"nativeSrc": "6669:1:8",
													"nodeType": "YulLiteral",
													"src": "6669:1:8",
													"type": "",
													"value": "1"
												}
											],
											"functionName": {
												"name": "and",
												"nativeSrc": "6659:3:8",
												"nodeType": "YulIdentifier",
												"src": "6659:3:8"
											},
											"nativeSrc": "6659:12:8",
											"nodeType": "YulFunctionCall",
											"src": "6659:12:8"
										},
										"variables": [
											{
												"name": "outOfPlaceEncoding",
												"nativeSrc": "6637:18:8",
												"nodeType": "YulTypedName",
												"src": "6637:18:8",
												"type": ""
											}
										]
									},
									{
										"body": {
											"nativeSrc": "6710:51:8",
											"nodeType": "YulBlock",
											"src": "6710:51:8",
											"statements": [
												{
													"nativeSrc": "6724:27:8",
													"nodeType": "YulAssignment",
													"src": "6724:27:8",
													"value": {
														"arguments": [
															{
																"name": "length",
																"nativeSrc": "6738:6:8",
																"nodeType": "YulIdentifier",
																"src": "6738:6:8"
															},
															{
																"kind": "number",
																"nativeSrc": "6746:4:8",
																"nodeType": "YulLiteral",
																"src": "6746:4:8",
																"type": "",
																"value": "0x7f"
															}
														],
														"functionName": {
															"name": "and",
															"nativeSrc": "6734:3:8",
															"nodeType": "YulIdentifier",
															"src": "6734:3:8"
														},
														"nativeSrc": "6734:17:8",
														"nodeType": "YulFunctionCall",
														"src": "6734:17:8"
													},
													"variableNames": [
														{
															"name": "length",
															"nativeSrc": "6724:6:8",
															"nodeType": "YulIdentifier",
															"src": "6724:6:8"
														}
													]
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "outOfPlaceEncoding",
													"nativeSrc": "6690:18:8",
													"nodeType": "YulIdentifier",
													"src": "6690:18:8"
												}
											],
											"functionName": {
												"name": "iszero",
												"nativeSrc": "6683:6:8",
												"nodeType": "YulIdentifier",
												"src": "6683:6:8"
											},
											"nativeSrc": "6683:26:8",
											"nodeType": "YulFunctionCall",
											"src": "6683:26:8"
										},
										"nativeSrc": "6680:81:8",
										"nodeType": "YulIf",
										"src": "6680:81:8"
									},
									{
										"body": {
											"nativeSrc": "6813:42:8",
											"nodeType": "YulBlock",
											"src": "6813:42:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "panic_error_0x22",
															"nativeSrc": "6827:16:8",
															"nodeType": "YulIdentifier",
															"src": "6827:16:8"
														},
														"nativeSrc": "6827:18:8",
														"nodeType": "YulFunctionCall",
														"src": "6827:18:8"
													},
													"nativeSrc": "6827:18:8",
													"nodeType": "YulExpressionStatement",
													"src": "6827:18:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "outOfPlaceEncoding",
													"nativeSrc": "6777:18:8",
													"nodeType": "YulIdentifier",
													"src": "6777:18:8"
												},
												{
													"arguments": [
														{
															"name": "length",
															"nativeSrc": "6800:6:8",
															"nodeType": "YulIdentifier",
															"src": "6800:6:8"
														},
														{
															"kind": "number",
															"nativeSrc": "6808:2:8",
															"nodeType": "YulLiteral",
															"src": "6808:2:8",
															"type": "",
															"value": "32"
														}
													],
													"functionName": {
														"name": "lt",
														"nativeSrc": "6797:2:8",
														"nodeType": "YulIdentifier",
														"src": "6797:2:8"
													},
													"nativeSrc": "6797:14:8",
													"nodeType": "YulFunctionCall",
													"src": "6797:14:8"
												}
											],
											"functionName": {
												"name": "eq",
												"nativeSrc": "6774:2:8",
												"nodeType": "YulIdentifier",
												"src": "6774:2:8"
											},
											"nativeSrc": "6774:38:8",
											"nodeType": "YulFunctionCall",
											"src": "6774:38:8"
										},
										"nativeSrc": "6771:84:8",
										"nodeType": "YulIf",
										"src": "6771:84:8"
									}
								]
							},
							"name": "extract_byte_array_length",
							"nativeSrc": "6541:320:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "data",
									"nativeSrc": "6576:4:8",
									"nodeType": "YulTypedName",
									"src": "6576:4:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "length",
									"nativeSrc": "6585:6:8",
									"nodeType": "YulTypedName",
									"src": "6585:6:8",
									"type": ""
								}
							],
							"src": "6541:320:8"
						},
						{
							"body": {
								"nativeSrc": "7021:288:8",
								"nodeType": "YulBlock",
								"src": "7021:288:8",
								"statements": [
									{
										"nativeSrc": "7031:26:8",
										"nodeType": "YulAssignment",
										"src": "7031:26:8",
										"value": {
											"arguments": [
												{
													"name": "headStart",
													"nativeSrc": "7043:9:8",
													"nodeType": "YulIdentifier",
													"src": "7043:9:8"
												},
												{
													"kind": "number",
													"nativeSrc": "7054:2:8",
													"nodeType": "YulLiteral",
													"src": "7054:2:8",
													"type": "",
													"value": "96"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "7039:3:8",
												"nodeType": "YulIdentifier",
												"src": "7039:3:8"
											},
											"nativeSrc": "7039:18:8",
											"nodeType": "YulFunctionCall",
											"src": "7039:18:8"
										},
										"variableNames": [
											{
												"name": "tail",
												"nativeSrc": "7031:4:8",
												"nodeType": "YulIdentifier",
												"src": "7031:4:8"
											}
										]
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value0",
													"nativeSrc": "7111:6:8",
													"nodeType": "YulIdentifier",
													"src": "7111:6:8"
												},
												{
													"arguments": [
														{
															"name": "headStart",
															"nativeSrc": "7124:9:8",
															"nodeType": "YulIdentifier",
															"src": "7124:9:8"
														},
														{
															"kind": "number",
															"nativeSrc": "7135:1:8",
															"nodeType": "YulLiteral",
															"src": "7135:1:8",
															"type": "",
															"value": "0"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "7120:3:8",
														"nodeType": "YulIdentifier",
														"src": "7120:3:8"
													},
													"nativeSrc": "7120:17:8",
													"nodeType": "YulFunctionCall",
													"src": "7120:17:8"
												}
											],
											"functionName": {
												"name": "abi_encode_t_address_to_t_address_fromStack",
												"nativeSrc": "7067:43:8",
												"nodeType": "YulIdentifier",
												"src": "7067:43:8"
											},
											"nativeSrc": "7067:71:8",
											"nodeType": "YulFunctionCall",
											"src": "7067:71:8"
										},
										"nativeSrc": "7067:71:8",
										"nodeType": "YulExpressionStatement",
										"src": "7067:71:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value1",
													"nativeSrc": "7192:6:8",
													"nodeType": "YulIdentifier",
													"src": "7192:6:8"
												},
												{
													"arguments": [
														{
															"name": "headStart",
															"nativeSrc": "7205:9:8",
															"nodeType": "YulIdentifier",
															"src": "7205:9:8"
														},
														{
															"kind": "number",
															"nativeSrc": "7216:2:8",
															"nodeType": "YulLiteral",
															"src": "7216:2:8",
															"type": "",
															"value": "32"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "7201:3:8",
														"nodeType": "YulIdentifier",
														"src": "7201:3:8"
													},
													"nativeSrc": "7201:18:8",
													"nodeType": "YulFunctionCall",
													"src": "7201:18:8"
												}
											],
											"functionName": {
												"name": "abi_encode_t_uint256_to_t_uint256_fromStack",
												"nativeSrc": "7148:43:8",
												"nodeType": "YulIdentifier",
												"src": "7148:43:8"
											},
											"nativeSrc": "7148:72:8",
											"nodeType": "YulFunctionCall",
											"src": "7148:72:8"
										},
										"nativeSrc": "7148:72:8",
										"nodeType": "YulExpressionStatement",
										"src": "7148:72:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"name": "value2",
													"nativeSrc": "7274:6:8",
													"nodeType": "YulIdentifier",
													"src": "7274:6:8"
												},
												{
													"arguments": [
														{
															"name": "headStart",
															"nativeSrc": "7287:9:8",
															"nodeType": "YulIdentifier",
															"src": "7287:9:8"
														},
														{
															"kind": "number",
															"nativeSrc": "7298:2:8",
															"nodeType": "YulLiteral",
															"src": "7298:2:8",
															"type": "",
															"value": "64"
														}
													],
													"functionName": {
														"name": "add",
														"nativeSrc": "7283:3:8",
														"nodeType": "YulIdentifier",
														"src": "7283:3:8"
													},
													"nativeSrc": "7283:18:8",
													"nodeType": "YulFunctionCall",
													"src": "7283:18:8"
												}
											],
											"functionName": {
												"name": "abi_encode_t_uint256_to_t_uint256_fromStack",
												"nativeSrc": "7230:43:8",
												"nodeType": "YulIdentifier",
												"src": "7230:43:8"
											},
											"nativeSrc": "7230:72:8",
											"nodeType": "YulFunctionCall",
											"src": "7230:72:8"
										},
										"nativeSrc": "7230:72:8",
										"nodeType": "YulExpressionStatement",
										"src": "7230:72:8"
									}
								]
							},
							"name": "abi_encode_tuple_t_address_t_uint256_t_uint256__to_t_address_t_uint256_t_uint256__fromStack_reversed",
							"nativeSrc": "6867:442:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "headStart",
									"nativeSrc": "6977:9:8",
									"nodeType": "YulTypedName",
									"src": "6977:9:8",
									"type": ""
								},
								{
									"name": "value2",
									"nativeSrc": "6989:6:8",
									"nodeType": "YulTypedName",
									"src": "6989:6:8",
									"type": ""
								},
								{
									"name": "value1",
									"nativeSrc": "6997:6:8",
									"nodeType": "YulTypedName",
									"src": "6997:6:8",
									"type": ""
								},
								{
									"name": "value0",
									"nativeSrc": "7005:6:8",
									"nodeType": "YulTypedName",
									"src": "7005:6:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "tail",
									"nativeSrc": "7016:4:8",
									"nodeType": "YulTypedName",
									"src": "7016:4:8",
									"type": ""
								}
							],
							"src": "6867:442:8"
						},
						{
							"body": {
								"nativeSrc": "7343:152:8",
								"nodeType": "YulBlock",
								"src": "7343:152:8",
								"statements": [
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "7360:1:8",
													"nodeType": "YulLiteral",
													"src": "7360:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "7363:77:8",
													"nodeType": "YulLiteral",
													"src": "7363:77:8",
													"type": "",
													"value": "35408467139433450592217433187231851964531694900788300625387963629091585785856"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "7353:6:8",
												"nodeType": "YulIdentifier",
												"src": "7353:6:8"
											},
											"nativeSrc": "7353:88:8",
											"nodeType": "YulFunctionCall",
											"src": "7353:88:8"
										},
										"nativeSrc": "7353:88:8",
										"nodeType": "YulExpressionStatement",
										"src": "7353:88:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "7457:1:8",
													"nodeType": "YulLiteral",
													"src": "7457:1:8",
													"type": "",
													"value": "4"
												},
												{
													"kind": "number",
													"nativeSrc": "7460:4:8",
													"nodeType": "YulLiteral",
													"src": "7460:4:8",
													"type": "",
													"value": "0x11"
												}
											],
											"functionName": {
												"name": "mstore",
												"nativeSrc": "7450:6:8",
												"nodeType": "YulIdentifier",
												"src": "7450:6:8"
											},
											"nativeSrc": "7450:15:8",
											"nodeType": "YulFunctionCall",
											"src": "7450:15:8"
										},
										"nativeSrc": "7450:15:8",
										"nodeType": "YulExpressionStatement",
										"src": "7450:15:8"
									},
									{
										"expression": {
											"arguments": [
												{
													"kind": "number",
													"nativeSrc": "7481:1:8",
													"nodeType": "YulLiteral",
													"src": "7481:1:8",
													"type": "",
													"value": "0"
												},
												{
													"kind": "number",
													"nativeSrc": "7484:4:8",
													"nodeType": "YulLiteral",
													"src": "7484:4:8",
													"type": "",
													"value": "0x24"
												}
											],
											"functionName": {
												"name": "revert",
												"nativeSrc": "7474:6:8",
												"nodeType": "YulIdentifier",
												"src": "7474:6:8"
											},
											"nativeSrc": "7474:15:8",
											"nodeType": "YulFunctionCall",
											"src": "7474:15:8"
										},
										"nativeSrc": "7474:15:8",
										"nodeType": "YulExpressionStatement",
										"src": "7474:15:8"
									}
								]
							},
							"name": "panic_error_0x11",
							"nativeSrc": "7315:180:8",
							"nodeType": "YulFunctionDefinition",
							"src": "7315:180:8"
						},
						{
							"body": {
								"nativeSrc": "7545:147:8",
								"nodeType": "YulBlock",
								"src": "7545:147:8",
								"statements": [
									{
										"nativeSrc": "7555:25:8",
										"nodeType": "YulAssignment",
										"src": "7555:25:8",
										"value": {
											"arguments": [
												{
													"name": "x",
													"nativeSrc": "7578:1:8",
													"nodeType": "YulIdentifier",
													"src": "7578:1:8"
												}
											],
											"functionName": {
												"name": "cleanup_t_uint256",
												"nativeSrc": "7560:17:8",
												"nodeType": "YulIdentifier",
												"src": "7560:17:8"
											},
											"nativeSrc": "7560:20:8",
											"nodeType": "YulFunctionCall",
											"src": "7560:20:8"
										},
										"variableNames": [
											{
												"name": "x",
												"nativeSrc": "7555:1:8",
												"nodeType": "YulIdentifier",
												"src": "7555:1:8"
											}
										]
									},
									{
										"nativeSrc": "7589:25:8",
										"nodeType": "YulAssignment",
										"src": "7589:25:8",
										"value": {
											"arguments": [
												{
													"name": "y",
													"nativeSrc": "7612:1:8",
													"nodeType": "YulIdentifier",
													"src": "7612:1:8"
												}
											],
											"functionName": {
												"name": "cleanup_t_uint256",
												"nativeSrc": "7594:17:8",
												"nodeType": "YulIdentifier",
												"src": "7594:17:8"
											},
											"nativeSrc": "7594:20:8",
											"nodeType": "YulFunctionCall",
											"src": "7594:20:8"
										},
										"variableNames": [
											{
												"name": "y",
												"nativeSrc": "7589:1:8",
												"nodeType": "YulIdentifier",
												"src": "7589:1:8"
											}
										]
									},
									{
										"nativeSrc": "7623:16:8",
										"nodeType": "YulAssignment",
										"src": "7623:16:8",
										"value": {
											"arguments": [
												{
													"name": "x",
													"nativeSrc": "7634:1:8",
													"nodeType": "YulIdentifier",
													"src": "7634:1:8"
												},
												{
													"name": "y",
													"nativeSrc": "7637:1:8",
													"nodeType": "YulIdentifier",
													"src": "7637:1:8"
												}
											],
											"functionName": {
												"name": "add",
												"nativeSrc": "7630:3:8",
												"nodeType": "YulIdentifier",
												"src": "7630:3:8"
											},
											"nativeSrc": "7630:9:8",
											"nodeType": "YulFunctionCall",
											"src": "7630:9:8"
										},
										"variableNames": [
											{
												"name": "sum",
												"nativeSrc": "7623:3:8",
												"nodeType": "YulIdentifier",
												"src": "7623:3:8"
											}
										]
									},
									{
										"body": {
											"nativeSrc": "7663:22:8",
											"nodeType": "YulBlock",
											"src": "7663:22:8",
											"statements": [
												{
													"expression": {
														"arguments": [],
														"functionName": {
															"name": "panic_error_0x11",
															"nativeSrc": "7665:16:8",
															"nodeType": "YulIdentifier",
															"src": "7665:16:8"
														},
														"nativeSrc": "7665:18:8",
														"nodeType": "YulFunctionCall",
														"src": "7665:18:8"
													},
													"nativeSrc": "7665:18:8",
													"nodeType": "YulExpressionStatement",
													"src": "7665:18:8"
												}
											]
										},
										"condition": {
											"arguments": [
												{
													"name": "x",
													"nativeSrc": "7655:1:8",
													"nodeType": "YulIdentifier",
													"src": "7655:1:8"
												},
												{
													"name": "sum",
													"nativeSrc": "7658:3:8",
													"nodeType": "YulIdentifier",
													"src": "7658:3:8"
												}
											],
											"functionName": {
												"name": "gt",
												"nativeSrc": "7652:2:8",
												"nodeType": "YulIdentifier",
												"src": "7652:2:8"
											},
											"nativeSrc": "7652:10:8",
											"nodeType": "YulFunctionCall",
											"src": "7652:10:8"
										},
										"nativeSrc": "7649:36:8",
										"nodeType": "YulIf",
										"src": "7649:36:8"
									}
								]
							},
							"name": "checked_add_t_uint256",
							"nativeSrc": "7501:191:8",
							"nodeType": "YulFunctionDefinition",
							"parameters": [
								{
									"name": "x",
									"nativeSrc": "7532:1:8",
									"nodeType": "YulTypedName",
									"src": "7532:1:8",
									"type": ""
								},
								{
									"name": "y",
									"nativeSrc": "7535:1:8",
									"nodeType": "YulTypedName",
									"src": "7535:1:8",
									"type": ""
								}
							],
							"returnVariables": [
								{
									"name": "sum",
									"nativeSrc": "7541:3:8",
									"nodeType": "YulTypedName",
									"src": "7541:3:8",
									"type": ""
								}
							],
							"src": "7501:191:8"
						}
					]
				},
				"contents": "{\n\n    function array_length_t_string_memory_ptr(value) -> length {\n\n        length := mload(value)\n\n    }\n\n    function array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, length) -> updated_pos {\n        mstore(pos, length)\n        updated_pos := add(pos, 0x20)\n    }\n\n    function copy_memory_to_memory_with_cleanup(src, dst, length) {\n        let i := 0\n        for { } lt(i, length) { i := add(i, 32) }\n        {\n            mstore(add(dst, i), mload(add(src, i)))\n        }\n        mstore(add(dst, length), 0)\n    }\n\n    function round_up_to_mul_of_32(value) -> result {\n        result := and(add(value, 31), not(31))\n    }\n\n    function abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack(value, pos) -> end {\n        let length := array_length_t_string_memory_ptr(value)\n        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, length)\n        copy_memory_to_memory_with_cleanup(add(value, 0x20), pos, length)\n        end := add(pos, round_up_to_mul_of_32(length))\n    }\n\n    function abi_encode_tuple_t_string_memory_ptr__to_t_string_memory_ptr__fromStack_reversed(headStart , value0) -> tail {\n        tail := add(headStart, 32)\n\n        mstore(add(headStart, 0), sub(tail, headStart))\n        tail := abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack(value0,  tail)\n\n    }\n\n    function allocate_unbounded() -> memPtr {\n        memPtr := mload(64)\n    }\n\n    function revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() {\n        revert(0, 0)\n    }\n\n    function revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() {\n        revert(0, 0)\n    }\n\n    function cleanup_t_uint160(value) -> cleaned {\n        cleaned := and(value, 0xffffffffffffffffffffffffffffffffffffffff)\n    }\n\n    function cleanup_t_address(value) -> cleaned {\n        cleaned := cleanup_t_uint160(value)\n    }\n\n    function validator_revert_t_address(value) {\n        if iszero(eq(value, cleanup_t_address(value))) { revert(0, 0) }\n    }\n\n    function abi_decode_t_address(offset, end) -> value {\n        value := calldataload(offset)\n        validator_revert_t_address(value)\n    }\n\n    function cleanup_t_uint256(value) -> cleaned {\n        cleaned := value\n    }\n\n    function validator_revert_t_uint256(value) {\n        if iszero(eq(value, cleanup_t_uint256(value))) { revert(0, 0) }\n    }\n\n    function abi_decode_t_uint256(offset, end) -> value {\n        value := calldataload(offset)\n        validator_revert_t_uint256(value)\n    }\n\n    function abi_decode_tuple_t_addresst_uint256(headStart, dataEnd) -> value0, value1 {\n        if slt(sub(dataEnd, headStart), 64) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }\n\n        {\n\n            let offset := 0\n\n            value0 := abi_decode_t_address(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 32\n\n            value1 := abi_decode_t_uint256(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function cleanup_t_bool(value) -> cleaned {\n        cleaned := iszero(iszero(value))\n    }\n\n    function abi_encode_t_bool_to_t_bool_fromStack(value, pos) {\n        mstore(pos, cleanup_t_bool(value))\n    }\n\n    function abi_encode_tuple_t_bool__to_t_bool__fromStack_reversed(headStart , value0) -> tail {\n        tail := add(headStart, 32)\n\n        abi_encode_t_bool_to_t_bool_fromStack(value0,  add(headStart, 0))\n\n    }\n\n    function abi_encode_t_uint256_to_t_uint256_fromStack(value, pos) {\n        mstore(pos, cleanup_t_uint256(value))\n    }\n\n    function abi_encode_tuple_t_uint256__to_t_uint256__fromStack_reversed(headStart , value0) -> tail {\n        tail := add(headStart, 32)\n\n        abi_encode_t_uint256_to_t_uint256_fromStack(value0,  add(headStart, 0))\n\n    }\n\n    function abi_decode_tuple_t_addresst_addresst_uint256(headStart, dataEnd) -> value0, value1, value2 {\n        if slt(sub(dataEnd, headStart), 96) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }\n\n        {\n\n            let offset := 0\n\n            value0 := abi_decode_t_address(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 32\n\n            value1 := abi_decode_t_address(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 64\n\n            value2 := abi_decode_t_uint256(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function cleanup_t_uint8(value) -> cleaned {\n        cleaned := and(value, 0xff)\n    }\n\n    function abi_encode_t_uint8_to_t_uint8_fromStack(value, pos) {\n        mstore(pos, cleanup_t_uint8(value))\n    }\n\n    function abi_encode_tuple_t_uint8__to_t_uint8__fromStack_reversed(headStart , value0) -> tail {\n        tail := add(headStart, 32)\n\n        abi_encode_t_uint8_to_t_uint8_fromStack(value0,  add(headStart, 0))\n\n    }\n\n    function abi_decode_tuple_t_uint256(headStart, dataEnd) -> value0 {\n        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }\n\n        {\n\n            let offset := 0\n\n            value0 := abi_decode_t_uint256(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function abi_decode_tuple_t_address(headStart, dataEnd) -> value0 {\n        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }\n\n        {\n\n            let offset := 0\n\n            value0 := abi_decode_t_address(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function abi_encode_t_address_to_t_address_fromStack(value, pos) {\n        mstore(pos, cleanup_t_address(value))\n    }\n\n    function abi_encode_tuple_t_address__to_t_address__fromStack_reversed(headStart , value0) -> tail {\n        tail := add(headStart, 32)\n\n        abi_encode_t_address_to_t_address_fromStack(value0,  add(headStart, 0))\n\n    }\n\n    function abi_decode_tuple_t_addresst_address(headStart, dataEnd) -> value0, value1 {\n        if slt(sub(dataEnd, headStart), 64) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }\n\n        {\n\n            let offset := 0\n\n            value0 := abi_decode_t_address(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 32\n\n            value1 := abi_decode_t_address(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function panic_error_0x22() {\n        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)\n        mstore(4, 0x22)\n        revert(0, 0x24)\n    }\n\n    function extract_byte_array_length(data) -> length {\n        length := div(data, 2)\n        let outOfPlaceEncoding := and(data, 1)\n        if iszero(outOfPlaceEncoding) {\n            length := and(length, 0x7f)\n        }\n\n        if eq(outOfPlaceEncoding, lt(length, 32)) {\n            panic_error_0x22()\n        }\n    }\n\n    function abi_encode_tuple_t_address_t_uint256_t_uint256__to_t_address_t_uint256_t_uint256__fromStack_reversed(headStart , value2, value1, value0) -> tail {\n        tail := add(headStart, 96)\n\n        abi_encode_t_address_to_t_address_fromStack(value0,  add(headStart, 0))\n\n        abi_encode_t_uint256_to_t_uint256_fromStack(value1,  add(headStart, 32))\n\n        abi_encode_t_uint256_to_t_uint256_fromStack(value2,  add(headStart, 64))\n\n    }\n\n    function panic_error_0x11() {\n        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)\n        mstore(4, 0x11)\n        revert(0, 0x24)\n    }\n\n    function checked_add_t_uint256(x, y) -> sum {\n        x := cleanup_t_uint256(x)\n        y := cleanup_t_uint256(y)\n        sum := add(x, y)\n\n        if gt(x, sum) { panic_error_0x11() }\n\n    }\n\n}\n",
				"id": 8,
				"language": "Yul",
				"name": "#utility.yul"
			}
		],
		"immutableReferences": {},
		"linkReferences": {},
		"object": "608060405234801561000f575f80fd5b5060043610610109575f3560e01c80635c975abb116100a05780638da5cb5b1161006f5780638da5cb5b1461026b57806395d89b4114610289578063a9059cbb146102a7578063dd62ed3e146102d7578063f2fde38b1461030757610109565b80635c975abb1461020957806370a0823114610227578063715018a6146102575780638456cb591461026157610109565b8063313ce567116100dc578063313ce567146101a95780633f4ba83a146101c757806340c10f19146101d157806342966c68146101ed57610109565b806306fdde031461010d578063095ea7b31461012b57806318160ddd1461015b57806323b872dd14610179575b5f80fd5b610115610323565b6040516101229190611110565b60405180910390f35b610145600480360381019061014091906111c1565b6103b3565b6040516101529190611219565b60405180910390f35b6101636103d5565b6040516101709190611241565b60405180910390f35b610193600480360381019061018e919061125a565b6103de565b6040516101a09190611219565b60405180910390f35b6101b161040c565b6040516101be91906112c5565b60405180910390f35b6101cf610414565b005b6101eb60048036038101906101e691906111c1565b610426565b005b610207600480360381019061020291906112de565b610492565b005b6102116104f5565b60405161021e9190611219565b60405180910390f35b610241600480360381019061023c9190611309565b61050a565b60405161024e9190611241565b60405180910390f35b61025f61054f565b005b610269610581565b005b610273610593565b6040516102809190611343565b60405180910390f35b6102916105bc565b60405161029e9190611110565b60405180910390f35b6102c160048036038101906102bc91906111c1565b61064c565b6040516102ce9190611219565b60405180910390f35b6102f160048036038101906102ec919061135c565b61066e565b6040516102fe9190611241565b60405180910390f35b610321600480360381019061031c9190611309565b6106f0565b005b606060038054610332906113c7565b80601f016020809104026020016040519081016040528092919081815260200182805461035e906113c7565b80156103a95780601f10610380576101008083540402835291602001916103a9565b820191905f5260205f20905b81548152906001019060200180831161038c57829003601f168201915b5050505050905090565b5f806103bd610774565b90506103ca81858561077b565b600191505092915050565b5f600254905090565b5f806103e8610774565b90506103f585828561078d565b610400858585610820565b60019150509392505050565b5f6009905090565b61041c610910565b610424610997565b565b61042e6109f8565b610436610910565b6104408282610a39565b8173ffffffffffffffffffffffffffffffffffffffff167f0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885826040516104869190611241565b60405180910390a25050565b61049a6109f8565b6104a43382610ab8565b3373ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5826040516104ea9190611241565b60405180910390a250565b5f60055f9054906101000a900460ff16905090565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b6040517fc8f64faf00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610589610910565b610591610b37565b565b5f600560019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546105cb906113c7565b80601f01602080910402602001604051908101604052809291908181526020018280546105f7906113c7565b80156106425780601f1061061957610100808354040283529160200191610642565b820191905f5260205f20905b81548152906001019060200180831161062557829003601f168201915b5050505050905090565b5f80610656610774565b9050610663818585610820565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b6106f8610910565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610768575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161075f9190611343565b60405180910390fd5b61077181610b99565b50565b5f33905090565b6107888383836001610c5e565b505050565b5f610798848461066e565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81101561081a578181101561080b578281836040517ffb8f41b2000000000000000000000000000000000000000000000000000000008152600401610802939291906113f7565b60405180910390fd5b61081984848484035f610c5e565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610890575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016108879190611343565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610900575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108f79190611343565b60405180910390fd5b61090b838383610e2d565b505050565b610918610774565b73ffffffffffffffffffffffffffffffffffffffff16610936610593565b73ffffffffffffffffffffffffffffffffffffffff161461099557610959610774565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161098c9190611343565b60405180910390fd5b565b61099f611046565b5f60055f6101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6109e1610774565b6040516109ee9190611343565b60405180910390a1565b610a006104f5565b15610a37576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610aa9575f6040517fec442f05000000000000000000000000000000000000000000000000000000008152600401610aa09190611343565b60405180910390fd5b610ab45f8383610e2d565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610b28575f6040517f96c6fd1e000000000000000000000000000000000000000000000000000000008152600401610b1f9190611343565b60405180910390fd5b610b33825f83610e2d565b5050565b610b3f6109f8565b600160055f6101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610b82610774565b604051610b8f9190611343565b60405180910390a1565b5f600560019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610cce575f6040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610cc59190611343565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610d3e575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610d359190611343565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610e27578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610e1e9190611241565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610e7d578060025f828254610e719190611459565b92505081905550610f4b565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610f06578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610efd939291906113f7565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610f92578060025f8282540392505081905550610fdc565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516110399190611241565b60405180910390a3505050565b61104e6104f5565b611084576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f81519050919050565b5f82825260208201905092915050565b5f5b838110156110bd5780820151818401526020810190506110a2565b5f8484015250505050565b5f601f19601f8301169050919050565b5f6110e282611086565b6110ec8185611090565b93506110fc8185602086016110a0565b611105816110c8565b840191505092915050565b5f6020820190508181035f83015261112881846110d8565b905092915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61115d82611134565b9050919050565b61116d81611153565b8114611177575f80fd5b50565b5f8135905061118881611164565b92915050565b5f819050919050565b6111a08161118e565b81146111aa575f80fd5b50565b5f813590506111bb81611197565b92915050565b5f80604083850312156111d7576111d6611130565b5b5f6111e48582860161117a565b92505060206111f5858286016111ad565b9150509250929050565b5f8115159050919050565b611213816111ff565b82525050565b5f60208201905061122c5f83018461120a565b92915050565b61123b8161118e565b82525050565b5f6020820190506112545f830184611232565b92915050565b5f805f6060848603121561127157611270611130565b5b5f61127e8682870161117a565b935050602061128f8682870161117a565b92505060406112a0868287016111ad565b9150509250925092565b5f60ff82169050919050565b6112bf816112aa565b82525050565b5f6020820190506112d85f8301846112b6565b92915050565b5f602082840312156112f3576112f2611130565b5b5f611300848285016111ad565b91505092915050565b5f6020828403121561131e5761131d611130565b5b5f61132b8482850161117a565b91505092915050565b61133d81611153565b82525050565b5f6020820190506113565f830184611334565b92915050565b5f806040838503121561137257611371611130565b5b5f61137f8582860161117a565b92505060206113908582860161117a565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806113de57607f821691505b6020821081036113f1576113f061139a565b5b50919050565b5f60608201905061140a5f830186611334565b6114176020830185611232565b6114246040830184611232565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6114638261118e565b915061146e8361118e565b92508282019050808211156114865761148561142c565b5b9291505056fea2646970667358221220c5ec7eaa9aba044cbcd6fdc04777811ee796ed761afda2439203a061a9335d8f64736f6c63430008180033",
		"opcodes": "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0xF JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH2 0x109 JUMPI PUSH0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x5C975ABB GT PUSH2 0xA0 JUMPI DUP1 PUSH4 0x8DA5CB5B GT PUSH2 0x6F JUMPI DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0x26B JUMPI DUP1 PUSH4 0x95D89B41 EQ PUSH2 0x289 JUMPI DUP1 PUSH4 0xA9059CBB EQ PUSH2 0x2A7 JUMPI DUP1 PUSH4 0xDD62ED3E EQ PUSH2 0x2D7 JUMPI DUP1 PUSH4 0xF2FDE38B EQ PUSH2 0x307 JUMPI PUSH2 0x109 JUMP JUMPDEST DUP1 PUSH4 0x5C975ABB EQ PUSH2 0x209 JUMPI DUP1 PUSH4 0x70A08231 EQ PUSH2 0x227 JUMPI DUP1 PUSH4 0x715018A6 EQ PUSH2 0x257 JUMPI DUP1 PUSH4 0x8456CB59 EQ PUSH2 0x261 JUMPI PUSH2 0x109 JUMP JUMPDEST DUP1 PUSH4 0x313CE567 GT PUSH2 0xDC JUMPI DUP1 PUSH4 0x313CE567 EQ PUSH2 0x1A9 JUMPI DUP1 PUSH4 0x3F4BA83A EQ PUSH2 0x1C7 JUMPI DUP1 PUSH4 0x40C10F19 EQ PUSH2 0x1D1 JUMPI DUP1 PUSH4 0x42966C68 EQ PUSH2 0x1ED JUMPI PUSH2 0x109 JUMP JUMPDEST DUP1 PUSH4 0x6FDDE03 EQ PUSH2 0x10D JUMPI DUP1 PUSH4 0x95EA7B3 EQ PUSH2 0x12B JUMPI DUP1 PUSH4 0x18160DDD EQ PUSH2 0x15B JUMPI DUP1 PUSH4 0x23B872DD EQ PUSH2 0x179 JUMPI JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH2 0x115 PUSH2 0x323 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x122 SWAP2 SWAP1 PUSH2 0x1110 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x145 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x140 SWAP2 SWAP1 PUSH2 0x11C1 JUMP JUMPDEST PUSH2 0x3B3 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x152 SWAP2 SWAP1 PUSH2 0x1219 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x163 PUSH2 0x3D5 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x170 SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x193 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x18E SWAP2 SWAP1 PUSH2 0x125A JUMP JUMPDEST PUSH2 0x3DE JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1A0 SWAP2 SWAP1 PUSH2 0x1219 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x1B1 PUSH2 0x40C JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1BE SWAP2 SWAP1 PUSH2 0x12C5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x1CF PUSH2 0x414 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x1EB PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x1E6 SWAP2 SWAP1 PUSH2 0x11C1 JUMP JUMPDEST PUSH2 0x426 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x207 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x202 SWAP2 SWAP1 PUSH2 0x12DE JUMP JUMPDEST PUSH2 0x492 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x211 PUSH2 0x4F5 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x21E SWAP2 SWAP1 PUSH2 0x1219 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x241 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x23C SWAP2 SWAP1 PUSH2 0x1309 JUMP JUMPDEST PUSH2 0x50A JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x24E SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x25F PUSH2 0x54F JUMP JUMPDEST STOP JUMPDEST PUSH2 0x269 PUSH2 0x581 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x273 PUSH2 0x593 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x280 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x291 PUSH2 0x5BC JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x29E SWAP2 SWAP1 PUSH2 0x1110 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x2C1 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x2BC SWAP2 SWAP1 PUSH2 0x11C1 JUMP JUMPDEST PUSH2 0x64C JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2CE SWAP2 SWAP1 PUSH2 0x1219 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x2F1 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x2EC SWAP2 SWAP1 PUSH2 0x135C JUMP JUMPDEST PUSH2 0x66E JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2FE SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x321 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x31C SWAP2 SWAP1 PUSH2 0x1309 JUMP JUMPDEST PUSH2 0x6F0 JUMP JUMPDEST STOP JUMPDEST PUSH1 0x60 PUSH1 0x3 DUP1 SLOAD PUSH2 0x332 SWAP1 PUSH2 0x13C7 JUMP JUMPDEST DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH2 0x35E SWAP1 PUSH2 0x13C7 JUMP JUMPDEST DUP1 ISZERO PUSH2 0x3A9 JUMPI DUP1 PUSH1 0x1F LT PUSH2 0x380 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0x3A9 JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH0 MSTORE PUSH1 0x20 PUSH0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0x38C JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP1 PUSH2 0x3BD PUSH2 0x774 JUMP JUMPDEST SWAP1 POP PUSH2 0x3CA DUP2 DUP6 DUP6 PUSH2 0x77B JUMP JUMPDEST PUSH1 0x1 SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x2 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP1 PUSH2 0x3E8 PUSH2 0x774 JUMP JUMPDEST SWAP1 POP PUSH2 0x3F5 DUP6 DUP3 DUP6 PUSH2 0x78D JUMP JUMPDEST PUSH2 0x400 DUP6 DUP6 DUP6 PUSH2 0x820 JUMP JUMPDEST PUSH1 0x1 SWAP2 POP POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH0 PUSH1 0x9 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0x41C PUSH2 0x910 JUMP JUMPDEST PUSH2 0x424 PUSH2 0x997 JUMP JUMPDEST JUMP JUMPDEST PUSH2 0x42E PUSH2 0x9F8 JUMP JUMPDEST PUSH2 0x436 PUSH2 0x910 JUMP JUMPDEST PUSH2 0x440 DUP3 DUP3 PUSH2 0xA39 JUMP JUMPDEST DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xF6798A560793A54C3BCFE86A93CDE1E73087D944C0EA20544137D4121396885 DUP3 PUSH1 0x40 MLOAD PUSH2 0x486 SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG2 POP POP JUMP JUMPDEST PUSH2 0x49A PUSH2 0x9F8 JUMP JUMPDEST PUSH2 0x4A4 CALLER DUP3 PUSH2 0xAB8 JUMP JUMPDEST CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xCC16F5DBB4873280815C1EE09DBD06736CFFCC184412CF7A71A0FDB75D397CA5 DUP3 PUSH1 0x40 MLOAD PUSH2 0x4EA SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG2 POP JUMP JUMPDEST PUSH0 PUSH1 0x5 PUSH0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP1 PUSH0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 SLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH32 0xC8F64FAF00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x589 PUSH2 0x910 JUMP JUMPDEST PUSH2 0x591 PUSH2 0xB37 JUMP JUMPDEST JUMP JUMPDEST PUSH0 PUSH1 0x5 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x60 PUSH1 0x4 DUP1 SLOAD PUSH2 0x5CB SWAP1 PUSH2 0x13C7 JUMP JUMPDEST DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH2 0x5F7 SWAP1 PUSH2 0x13C7 JUMP JUMPDEST DUP1 ISZERO PUSH2 0x642 JUMPI DUP1 PUSH1 0x1F LT PUSH2 0x619 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0x642 JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH0 MSTORE PUSH1 0x20 PUSH0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0x625 JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP1 PUSH2 0x656 PUSH2 0x774 JUMP JUMPDEST SWAP1 POP PUSH2 0x663 DUP2 DUP6 DUP6 PUSH2 0x820 JUMP JUMPDEST PUSH1 0x1 SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x1 PUSH0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 PUSH0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 SLOAD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x6F8 PUSH2 0x910 JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0x768 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0x1E4FBDF700000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x75F SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x771 DUP2 PUSH2 0xB99 JUMP JUMPDEST POP JUMP JUMPDEST PUSH0 CALLER SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0x788 DUP4 DUP4 DUP4 PUSH1 0x1 PUSH2 0xC5E JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH0 PUSH2 0x798 DUP5 DUP5 PUSH2 0x66E JUMP JUMPDEST SWAP1 POP PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP2 LT ISZERO PUSH2 0x81A JUMPI DUP2 DUP2 LT ISZERO PUSH2 0x80B JUMPI DUP3 DUP2 DUP4 PUSH1 0x40 MLOAD PUSH32 0xFB8F41B200000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x802 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x13F7 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x819 DUP5 DUP5 DUP5 DUP5 SUB PUSH0 PUSH2 0xC5E JUMP JUMPDEST JUMPDEST POP POP POP POP JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0x890 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0x96C6FD1E00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x887 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0x900 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0xEC442F0500000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x8F7 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x90B DUP4 DUP4 DUP4 PUSH2 0xE2D JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH2 0x918 PUSH2 0x774 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x936 PUSH2 0x593 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x995 JUMPI PUSH2 0x959 PUSH2 0x774 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH32 0x118CDAA700000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x98C SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST JUMP JUMPDEST PUSH2 0x99F PUSH2 0x1046 JUMP JUMPDEST PUSH0 PUSH1 0x5 PUSH0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH32 0x5DB9EE0A495BF2E6FF9C91A7834C1BA4FDD244A5E8AA4E537BD38AEAE4B073AA PUSH2 0x9E1 PUSH2 0x774 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x9EE SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 JUMP JUMPDEST PUSH2 0xA00 PUSH2 0x4F5 JUMP JUMPDEST ISZERO PUSH2 0xA37 JUMPI PUSH1 0x40 MLOAD PUSH32 0xD93C066500000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xAA9 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0xEC442F0500000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xAA0 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0xAB4 PUSH0 DUP4 DUP4 PUSH2 0xE2D JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xB28 JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0x96C6FD1E00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xB1F SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0xB33 DUP3 PUSH0 DUP4 PUSH2 0xE2D JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH2 0xB3F PUSH2 0x9F8 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x5 PUSH0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH32 0x62E78CEA01BEE320CD4E420270B5EA74000D11B0C9F74754EBDBFC544B05A258 PUSH2 0xB82 PUSH2 0x774 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0xB8F SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 JUMP JUMPDEST PUSH0 PUSH1 0x5 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP DUP2 PUSH1 0x5 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xCCE JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0xE602DF0500000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xCC5 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xD3E JUMPI PUSH0 PUSH1 0x40 MLOAD PUSH32 0x94280D6200000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xD35 SWAP2 SWAP1 PUSH2 0x1343 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 PUSH1 0x1 PUSH0 DUP7 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 PUSH0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 DUP2 SWAP1 SSTORE POP DUP1 ISZERO PUSH2 0xE27 JUMPI DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8C5BE1E5EBEC7D5BD14F71427D1E84F3DD0314C0F7B2291E5B200AC8C7C3B925 DUP5 PUSH1 0x40 MLOAD PUSH2 0xE1E SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 JUMPDEST POP POP POP POP JUMP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xE7D JUMPI DUP1 PUSH1 0x2 PUSH0 DUP3 DUP3 SLOAD PUSH2 0xE71 SWAP2 SWAP1 PUSH2 0x1459 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH2 0xF4B JUMP JUMPDEST PUSH0 DUP1 PUSH0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 SLOAD SWAP1 POP DUP2 DUP2 LT ISZERO PUSH2 0xF06 JUMPI DUP4 DUP2 DUP4 PUSH1 0x40 MLOAD PUSH32 0xE450D38C00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xEFD SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x13F7 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 DUP2 SUB PUSH0 DUP1 DUP7 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 DUP2 SWAP1 SSTORE POP POP JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SUB PUSH2 0xF92 JUMPI DUP1 PUSH1 0x2 PUSH0 DUP3 DUP3 SLOAD SUB SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH2 0xFDC JUMP JUMPDEST DUP1 PUSH0 DUP1 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 PUSH0 DUP3 DUP3 SLOAD ADD SWAP3 POP POP DUP2 SWAP1 SSTORE POP JUMPDEST DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF DUP4 PUSH1 0x40 MLOAD PUSH2 0x1039 SWAP2 SWAP1 PUSH2 0x1241 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP JUMP JUMPDEST PUSH2 0x104E PUSH2 0x4F5 JUMP JUMPDEST PUSH2 0x1084 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8DFC202B00000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST JUMP JUMPDEST PUSH0 DUP2 MLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x10BD JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x10A2 JUMP JUMPDEST PUSH0 DUP5 DUP5 ADD MSTORE POP POP POP POP JUMP JUMPDEST PUSH0 PUSH1 0x1F NOT PUSH1 0x1F DUP4 ADD AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH2 0x10E2 DUP3 PUSH2 0x1086 JUMP JUMPDEST PUSH2 0x10EC DUP2 DUP6 PUSH2 0x1090 JUMP JUMPDEST SWAP4 POP PUSH2 0x10FC DUP2 DUP6 PUSH1 0x20 DUP7 ADD PUSH2 0x10A0 JUMP JUMPDEST PUSH2 0x1105 DUP2 PUSH2 0x10C8 JUMP JUMPDEST DUP5 ADD SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH0 DUP4 ADD MSTORE PUSH2 0x1128 DUP2 DUP5 PUSH2 0x10D8 JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH2 0x115D DUP3 PUSH2 0x1134 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x116D DUP2 PUSH2 0x1153 JUMP JUMPDEST DUP2 EQ PUSH2 0x1177 JUMPI PUSH0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x1188 DUP2 PUSH2 0x1164 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x11A0 DUP2 PUSH2 0x118E JUMP JUMPDEST DUP2 EQ PUSH2 0x11AA JUMPI PUSH0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x11BB DUP2 PUSH2 0x1197 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x11D7 JUMPI PUSH2 0x11D6 PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x11E4 DUP6 DUP3 DUP7 ADD PUSH2 0x117A JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x11F5 DUP6 DUP3 DUP7 ADD PUSH2 0x11AD JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH0 DUP2 ISZERO ISZERO SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x1213 DUP2 PUSH2 0x11FF JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x122C PUSH0 DUP4 ADD DUP5 PUSH2 0x120A JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x123B DUP2 PUSH2 0x118E JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1254 PUSH0 DUP4 ADD DUP5 PUSH2 0x1232 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH0 PUSH1 0x60 DUP5 DUP7 SUB SLT ISZERO PUSH2 0x1271 JUMPI PUSH2 0x1270 PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x127E DUP7 DUP3 DUP8 ADD PUSH2 0x117A JUMP JUMPDEST SWAP4 POP POP PUSH1 0x20 PUSH2 0x128F DUP7 DUP3 DUP8 ADD PUSH2 0x117A JUMP JUMPDEST SWAP3 POP POP PUSH1 0x40 PUSH2 0x12A0 DUP7 DUP3 DUP8 ADD PUSH2 0x11AD JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 POP SWAP3 JUMP JUMPDEST PUSH0 PUSH1 0xFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x12BF DUP2 PUSH2 0x12AA JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x12D8 PUSH0 DUP4 ADD DUP5 PUSH2 0x12B6 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x12F3 JUMPI PUSH2 0x12F2 PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x1300 DUP5 DUP3 DUP6 ADD PUSH2 0x11AD JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x131E JUMPI PUSH2 0x131D PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x132B DUP5 DUP3 DUP6 ADD PUSH2 0x117A JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x133D DUP2 PUSH2 0x1153 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1356 PUSH0 DUP4 ADD DUP5 PUSH2 0x1334 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x1372 JUMPI PUSH2 0x1371 PUSH2 0x1130 JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x137F DUP6 DUP3 DUP7 ADD PUSH2 0x117A JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x1390 DUP6 DUP3 DUP7 ADD PUSH2 0x117A JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH0 MSTORE PUSH1 0x22 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST PUSH0 PUSH1 0x2 DUP3 DIV SWAP1 POP PUSH1 0x1 DUP3 AND DUP1 PUSH2 0x13DE JUMPI PUSH1 0x7F DUP3 AND SWAP2 POP JUMPDEST PUSH1 0x20 DUP3 LT DUP2 SUB PUSH2 0x13F1 JUMPI PUSH2 0x13F0 PUSH2 0x139A JUMP JUMPDEST JUMPDEST POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH1 0x60 DUP3 ADD SWAP1 POP PUSH2 0x140A PUSH0 DUP4 ADD DUP7 PUSH2 0x1334 JUMP JUMPDEST PUSH2 0x1417 PUSH1 0x20 DUP4 ADD DUP6 PUSH2 0x1232 JUMP JUMPDEST PUSH2 0x1424 PUSH1 0x40 DUP4 ADD DUP5 PUSH2 0x1232 JUMP JUMPDEST SWAP5 SWAP4 POP POP POP POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST PUSH0 PUSH2 0x1463 DUP3 PUSH2 0x118E JUMP JUMPDEST SWAP2 POP PUSH2 0x146E DUP4 PUSH2 0x118E JUMP JUMPDEST SWAP3 POP DUP3 DUP3 ADD SWAP1 POP DUP1 DUP3 GT ISZERO PUSH2 0x1486 JUMPI PUSH2 0x1485 PUSH2 0x142C JUMP JUMPDEST JUMPDEST SWAP3 SWAP2 POP POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 0xC5 0xEC PUSH31 0xAA9ABA044CBCD6FDC04777811EE796ED761AFDA2439203A061A9335D8F6473 PUSH16 0x6C634300081800330000000000000000 ",
		"sourceMap": "221:949:7:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1760:89:2;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;3902:186;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;2803:97;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;4680:244;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;552:82:7;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;814:65;;;:::i;:::-;;885:143;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;1034:134;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;1726:84:6;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;2933:116:2;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;640:101:7;;;:::i;:::-;;747:61;;;:::i;:::-;;1638:85:0;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;1962:93:2;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;3244:178;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;3455:140;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;2543:215:0;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;1760:89:2;1805:13;1837:5;1830:12;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1760:89;:::o;3902:186::-;3975:4;3991:13;4007:12;:10;:12::i;:::-;3991:28;;4029:31;4038:5;4045:7;4054:5;4029:8;:31::i;:::-;4077:4;4070:11;;;3902:186;;;;:::o;2803:97::-;2855:7;2881:12;;2874:19;;2803:97;:::o;4680:244::-;4767:4;4783:15;4801:12;:10;:12::i;:::-;4783:30;;4823:37;4839:4;4845:7;4854:5;4823:15;:37::i;:::-;4870:26;4880:4;4886:2;4890:5;4870:9;:26::i;:::-;4913:4;4906:11;;;4680:244;;;;;:::o;552:82:7:-;602:5;626:1;619:8;;552:82;:::o;814:65::-;1531:13:0;:11;:13::i;:::-;862:10:7::1;:8;:10::i;:::-;814:65::o:0;885:143::-;1350:19:6;:17;:19::i;:::-;1531:13:0::1;:11;:13::i;:::-;971:18:7::2;977:3;982:6;971:5;:18::i;:::-;1009:3;1004:17;;;1014:6;1004:17;;;;;;:::i;:::-;;;;;;;;885:143:::0;;:::o;1034:134::-;1350:19:6;:17;:19::i;:::-;1097:25:7::1;1103:10;1115:6;1097:5;:25::i;:::-;1142:10;1137:24;;;1154:6;1137:24;;;;;;:::i;:::-;;;;;;;;1034:134:::0;:::o;1726:84:6:-;1773:4;1796:7;;;;;;;;;;;1789:14;;1726:84;:::o;2933:116:2:-;2998:7;3024:9;:18;3034:7;3024:18;;;;;;;;;;;;;;;;3017:25;;2933:116;;;:::o;640:101:7:-;707:27;;;;;;;;;;;;;;747:61;1531:13:0;:11;:13::i;:::-;793:8:7::1;:6;:8::i;:::-;747:61::o:0;1638:85:0:-;1684:7;1710:6;;;;;;;;;;;1703:13;;1638:85;:::o;1962:93:2:-;2009:13;2041:7;2034:14;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1962:93;:::o;3244:178::-;3313:4;3329:13;3345:12;:10;:12::i;:::-;3329:28;;3367:27;3377:5;3384:2;3388:5;3367:9;:27::i;:::-;3411:4;3404:11;;;3244:178;;;;:::o;3455:140::-;3535:7;3561:11;:18;3573:5;3561:18;;;;;;;;;;;;;;;:27;3580:7;3561:27;;;;;;;;;;;;;;;;3554:34;;3455:140;;;;:::o;2543:215:0:-;1531:13;:11;:13::i;:::-;2647:1:::1;2627:22;;:8;:22;;::::0;2623:91:::1;;2700:1;2672:31;;;;;;;;;;;:::i;:::-;;;;;;;;2623:91;2723:28;2742:8;2723:18;:28::i;:::-;2543:215:::0;:::o;656:96:5:-;709:7;735:10;728:17;;656:96;:::o;8630:128:2:-;8714:37;8723:5;8730:7;8739:5;8746:4;8714:8;:37::i;:::-;8630:128;;;:::o;10319:476::-;10418:24;10445:25;10455:5;10462:7;10445:9;:25::i;:::-;10418:52;;10503:17;10484:16;:36;10480:309;;;10559:5;10540:16;:24;10536:130;;;10618:7;10627:16;10645:5;10591:60;;;;;;;;;;;;;:::i;:::-;;;;;;;;10536:130;10707:57;10716:5;10723:7;10751:5;10732:16;:24;10758:5;10707:8;:57::i;:::-;10480:309;10408:387;10319:476;;;:::o;5297:300::-;5396:1;5380:18;;:4;:18;;;5376:86;;5448:1;5421:30;;;;;;;;;;;:::i;:::-;;;;;;;;5376:86;5489:1;5475:16;;:2;:16;;;5471:86;;5543:1;5514:32;;;;;;;;;;;:::i;:::-;;;;;;;;5471:86;5566:24;5574:4;5580:2;5584:5;5566:7;:24::i;:::-;5297:300;;;:::o;1796:162:0:-;1866:12;:10;:12::i;:::-;1855:23;;:7;:5;:7::i;:::-;:23;;;1851:101;;1928:12;:10;:12::i;:::-;1901:40;;;;;;;;;;;:::i;:::-;;;;;;;;1851:101;1796:162::o;2586:117:6:-;1597:16;:14;:16::i;:::-;2654:5:::1;2644:7;;:15;;;;;;;;;;;;;;;;;;2674:22;2683:12;:10;:12::i;:::-;2674:22;;;;;;:::i;:::-;;;;;;;;2586:117::o:0;1878:128::-;1943:8;:6;:8::i;:::-;1939:61;;;1974:15;;;;;;;;;;;;;;1939:61;1878:128::o;7362:208:2:-;7451:1;7432:21;;:7;:21;;;7428:91;;7505:1;7476:32;;;;;;;;;;;:::i;:::-;;;;;;;;7428:91;7528:35;7544:1;7548:7;7557:5;7528:7;:35::i;:::-;7362:208;;:::o;7888:206::-;7977:1;7958:21;;:7;:21;;;7954:89;;8029:1;8002:30;;;;;;;;;;;:::i;:::-;;;;;;;;7954:89;8052:35;8060:7;8077:1;8081:5;8052:7;:35::i;:::-;7888:206;;:::o;2339:115:6:-;1350:19;:17;:19::i;:::-;2408:4:::1;2398:7;;:14;;;;;;;;;;;;;;;;;;2427:20;2434:12;:10;:12::i;:::-;2427:20;;;;;;:::i;:::-;;;;;;;;2339:115::o:0;2912:187:0:-;2985:16;3004:6;;;;;;;;;;;2985:25;;3029:8;3020:6;;:17;;;;;;;;;;;;;;;;;;3083:8;3052:40;;3073:8;3052:40;;;;;;;;;;;;2975:124;2912:187;:::o;9605:432:2:-;9734:1;9717:19;;:5;:19;;;9713:89;;9788:1;9759:32;;;;;;;;;;;:::i;:::-;;;;;;;;9713:89;9834:1;9815:21;;:7;:21;;;9811:90;;9887:1;9859:31;;;;;;;;;;;:::i;:::-;;;;;;;;9811:90;9940:5;9910:11;:18;9922:5;9910:18;;;;;;;;;;;;;;;:27;9929:7;9910:27;;;;;;;;;;;;;;;:35;;;;9959:9;9955:76;;;10005:7;9989:31;;9998:5;9989:31;;;10014:5;9989:31;;;;;;:::i;:::-;;;;;;;;9955:76;9605:432;;;;:::o;5912:1107::-;6017:1;6001:18;;:4;:18;;;5997:540;;6153:5;6137:12;;:21;;;;;;;:::i;:::-;;;;;;;;5997:540;;;6189:19;6211:9;:15;6221:4;6211:15;;;;;;;;;;;;;;;;6189:37;;6258:5;6244:11;:19;6240:115;;;6315:4;6321:11;6334:5;6290:50;;;;;;;;;;;;;:::i;:::-;;;;;;;;6240:115;6507:5;6493:11;:19;6475:9;:15;6485:4;6475:15;;;;;;;;;;;;;;;:37;;;;6175:362;5997:540;6565:1;6551:16;;:2;:16;;;6547:425;;6730:5;6714:12;;:21;;;;;;;;;;;6547:425;;;6942:5;6925:9;:13;6935:2;6925:13;;;;;;;;;;;;;;;;:22;;;;;;;;;;;6547:425;7002:2;6987:25;;6996:4;6987:25;;;7006:5;6987:25;;;;;;:::i;:::-;;;;;;;;5912:1107;;;:::o;2078:126:6:-;2141:8;:6;:8::i;:::-;2136:62;;2172:15;;;;;;;;;;;;;;2136:62;2078:126::o;7:99:8:-;59:6;93:5;87:12;77:22;;7:99;;;:::o;112:169::-;196:11;230:6;225:3;218:19;270:4;265:3;261:14;246:29;;112:169;;;;:::o;287:246::-;368:1;378:113;392:6;389:1;386:13;378:113;;;477:1;472:3;468:11;462:18;458:1;453:3;449:11;442:39;414:2;411:1;407:10;402:15;;378:113;;;525:1;516:6;511:3;507:16;500:27;349:184;287:246;;;:::o;539:102::-;580:6;631:2;627:7;622:2;615:5;611:14;607:28;597:38;;539:102;;;:::o;647:377::-;735:3;763:39;796:5;763:39;:::i;:::-;818:71;882:6;877:3;818:71;:::i;:::-;811:78;;898:65;956:6;951:3;944:4;937:5;933:16;898:65;:::i;:::-;988:29;1010:6;988:29;:::i;:::-;983:3;979:39;972:46;;739:285;647:377;;;;:::o;1030:313::-;1143:4;1181:2;1170:9;1166:18;1158:26;;1230:9;1224:4;1220:20;1216:1;1205:9;1201:17;1194:47;1258:78;1331:4;1322:6;1258:78;:::i;:::-;1250:86;;1030:313;;;;:::o;1430:117::-;1539:1;1536;1529:12;1676:126;1713:7;1753:42;1746:5;1742:54;1731:65;;1676:126;;;:::o;1808:96::-;1845:7;1874:24;1892:5;1874:24;:::i;:::-;1863:35;;1808:96;;;:::o;1910:122::-;1983:24;2001:5;1983:24;:::i;:::-;1976:5;1973:35;1963:63;;2022:1;2019;2012:12;1963:63;1910:122;:::o;2038:139::-;2084:5;2122:6;2109:20;2100:29;;2138:33;2165:5;2138:33;:::i;:::-;2038:139;;;;:::o;2183:77::-;2220:7;2249:5;2238:16;;2183:77;;;:::o;2266:122::-;2339:24;2357:5;2339:24;:::i;:::-;2332:5;2329:35;2319:63;;2378:1;2375;2368:12;2319:63;2266:122;:::o;2394:139::-;2440:5;2478:6;2465:20;2456:29;;2494:33;2521:5;2494:33;:::i;:::-;2394:139;;;;:::o;2539:474::-;2607:6;2615;2664:2;2652:9;2643:7;2639:23;2635:32;2632:119;;;2670:79;;:::i;:::-;2632:119;2790:1;2815:53;2860:7;2851:6;2840:9;2836:22;2815:53;:::i;:::-;2805:63;;2761:117;2917:2;2943:53;2988:7;2979:6;2968:9;2964:22;2943:53;:::i;:::-;2933:63;;2888:118;2539:474;;;;;:::o;3019:90::-;3053:7;3096:5;3089:13;3082:21;3071:32;;3019:90;;;:::o;3115:109::-;3196:21;3211:5;3196:21;:::i;:::-;3191:3;3184:34;3115:109;;:::o;3230:210::-;3317:4;3355:2;3344:9;3340:18;3332:26;;3368:65;3430:1;3419:9;3415:17;3406:6;3368:65;:::i;:::-;3230:210;;;;:::o;3446:118::-;3533:24;3551:5;3533:24;:::i;:::-;3528:3;3521:37;3446:118;;:::o;3570:222::-;3663:4;3701:2;3690:9;3686:18;3678:26;;3714:71;3782:1;3771:9;3767:17;3758:6;3714:71;:::i;:::-;3570:222;;;;:::o;3798:619::-;3875:6;3883;3891;3940:2;3928:9;3919:7;3915:23;3911:32;3908:119;;;3946:79;;:::i;:::-;3908:119;4066:1;4091:53;4136:7;4127:6;4116:9;4112:22;4091:53;:::i;:::-;4081:63;;4037:117;4193:2;4219:53;4264:7;4255:6;4244:9;4240:22;4219:53;:::i;:::-;4209:63;;4164:118;4321:2;4347:53;4392:7;4383:6;4372:9;4368:22;4347:53;:::i;:::-;4337:63;;4292:118;3798:619;;;;;:::o;4423:86::-;4458:7;4498:4;4491:5;4487:16;4476:27;;4423:86;;;:::o;4515:112::-;4598:22;4614:5;4598:22;:::i;:::-;4593:3;4586:35;4515:112;;:::o;4633:214::-;4722:4;4760:2;4749:9;4745:18;4737:26;;4773:67;4837:1;4826:9;4822:17;4813:6;4773:67;:::i;:::-;4633:214;;;;:::o;4853:329::-;4912:6;4961:2;4949:9;4940:7;4936:23;4932:32;4929:119;;;4967:79;;:::i;:::-;4929:119;5087:1;5112:53;5157:7;5148:6;5137:9;5133:22;5112:53;:::i;:::-;5102:63;;5058:117;4853:329;;;;:::o;5188:::-;5247:6;5296:2;5284:9;5275:7;5271:23;5267:32;5264:119;;;5302:79;;:::i;:::-;5264:119;5422:1;5447:53;5492:7;5483:6;5472:9;5468:22;5447:53;:::i;:::-;5437:63;;5393:117;5188:329;;;;:::o;5523:118::-;5610:24;5628:5;5610:24;:::i;:::-;5605:3;5598:37;5523:118;;:::o;5647:222::-;5740:4;5778:2;5767:9;5763:18;5755:26;;5791:71;5859:1;5848:9;5844:17;5835:6;5791:71;:::i;:::-;5647:222;;;;:::o;5875:474::-;5943:6;5951;6000:2;5988:9;5979:7;5975:23;5971:32;5968:119;;;6006:79;;:::i;:::-;5968:119;6126:1;6151:53;6196:7;6187:6;6176:9;6172:22;6151:53;:::i;:::-;6141:63;;6097:117;6253:2;6279:53;6324:7;6315:6;6304:9;6300:22;6279:53;:::i;:::-;6269:63;;6224:118;5875:474;;;;;:::o;6355:180::-;6403:77;6400:1;6393:88;6500:4;6497:1;6490:15;6524:4;6521:1;6514:15;6541:320;6585:6;6622:1;6616:4;6612:12;6602:22;;6669:1;6663:4;6659:12;6690:18;6680:81;;6746:4;6738:6;6734:17;6724:27;;6680:81;6808:2;6800:6;6797:14;6777:18;6774:38;6771:84;;6827:18;;:::i;:::-;6771:84;6592:269;6541:320;;;:::o;6867:442::-;7016:4;7054:2;7043:9;7039:18;7031:26;;7067:71;7135:1;7124:9;7120:17;7111:6;7067:71;:::i;:::-;7148:72;7216:2;7205:9;7201:18;7192:6;7148:72;:::i;:::-;7230;7298:2;7287:9;7283:18;7274:6;7230:72;:::i;:::-;6867:442;;;;;;:::o;7315:180::-;7363:77;7360:1;7353:88;7460:4;7457:1;7450:15;7484:4;7481:1;7474:15;7501:191;7541:3;7560:20;7578:1;7560:20;:::i;:::-;7555:25;;7594:20;7612:1;7594:20;:::i;:::-;7589:25;;7637:1;7634;7630:9;7623:16;;7658:3;7655:1;7652:10;7649:36;;;7665:18;;:::i;:::-;7649:36;7501:191;;;;:::o"
	},
	"Assembly": ".code\n  PUSH 80\t\t\tcontract BeldexBEP20 is ERC20,...\n  PUSH 40\t\t\tcontract BeldexBEP20 is ERC20,...\n  MSTORE \t\t\tcontract BeldexBEP20 is ERC20,...\n  CALLVALUE \t\t\tconstructor(string memory _nam...\n  DUP1 \t\t\tconstructor(string memory _nam...\n  ISZERO \t\t\tconstructor(string memory _nam...\n  PUSH [tag] 1\t\t\tconstructor(string memory _nam...\n  JUMPI \t\t\tconstructor(string memory _nam...\n  PUSH 0\t\t\tconstructor(string memory _nam...\n  DUP1 \t\t\tconstructor(string memory _nam...\n  REVERT \t\t\tconstructor(string memory _nam...\ntag 1\t\t\tconstructor(string memory _nam...\n  JUMPDEST \t\t\tconstructor(string memory _nam...\n  POP \t\t\tconstructor(string memory _nam...\n  PUSH 40\t\t\tconstructor(string memory _nam...\n  MLOAD \t\t\tconstructor(string memory _nam...\n  PUSHSIZE \t\t\tconstructor(string memory _nam...\n  CODESIZE \t\t\tconstructor(string memory _nam...\n  SUB \t\t\tconstructor(string memory _nam...\n  DUP1 \t\t\tconstructor(string memory _nam...\n  PUSHSIZE \t\t\tconstructor(string memory _nam...\n  DUP4 \t\t\tconstructor(string memory _nam...\n  CODECOPY \t\t\tconstructor(string memory _nam...\n  DUP2 \t\t\tconstructor(string memory _nam...\n  DUP2 \t\t\tconstructor(string memory _nam...\n  ADD \t\t\tconstructor(string memory _nam...\n  PUSH 40\t\t\tconstructor(string memory _nam...\n  MSTORE \t\t\tconstructor(string memory _nam...\n  DUP2 \t\t\tconstructor(string memory _nam...\n  ADD \t\t\tconstructor(string memory _nam...\n  SWAP1 \t\t\tconstructor(string memory _nam...\n  PUSH [tag] 2\t\t\tconstructor(string memory _nam...\n  SWAP2 \t\t\tconstructor(string memory _nam...\n  SWAP1 \t\t\tconstructor(string memory _nam...\n  PUSH [tag] 3\t\t\tconstructor(string memory _nam...\n  JUMP \t\t\tconstructor(string memory _nam...\ntag 2\t\t\tconstructor(string memory _nam...\n  JUMPDEST \t\t\tconstructor(string memory _nam...\n  CALLER \t\t\tmsg.sender\n  DUP3 \t\t\t_name\n  DUP3 \t\t\t_symbol\n  DUP2 \t\t\t\n  PUSH 3\t\t\t\n  SWAP1 \t\t\t\n  DUP2 \t\t\t\n  PUSH [tag] 8\t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  PUSH [tag] 9\t\t\t\n  JUMP \t\t\t\ntag 8\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  DUP1 \t\t\t\n  PUSH 4\t\t\t\n  SWAP1 \t\t\t\n  DUP2 \t\t\t\n  PUSH [tag] 10\t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  PUSH [tag] 9\t\t\t\n  JUMP \t\t\t\ntag 10\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  PUSH 0\t\t\t\n  PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n  AND \t\t\t\n  DUP2 \t\t\t\n  PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n  AND \t\t\t\n  SUB \t\t\t\n  PUSH [tag] 12\t\t\t\n  JUMPI \t\t\t\n  PUSH 0\t\t\t\n  PUSH 40\t\t\t\n  MLOAD \t\t\t\n  PUSH 1E4FBDF700000000000000000000000000000000000000000000000000000000\t\t\t\n  DUP2 \t\t\t\n  MSTORE \t\t\t\n  PUSH 4\t\t\t\n  ADD \t\t\t\n  PUSH [tag] 13\t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  PUSH [tag] 14\t\t\t\n  JUMP \t\t\t\ntag 13\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 40\t\t\t\n  MLOAD \t\t\t\n  DUP1 \t\t\t\n  SWAP2 \t\t\t\n  SUB \t\t\t\n  SWAP1 \t\t\t\n  REVERT \t\t\t\ntag 12\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 15\t\t\t\n  DUP2 \t\t\t\n  PUSH [tag] 16\t\t\t\n  PUSH 20\t\t\t\n  SHL \t\t\t\n  PUSH 20\t\t\t\n  SHR \t\t\t\n  JUMP \t\t\t\ntag 15\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  POP \t\t\tconstructor(string memory _nam...\n  POP \t\t\tconstructor(string memory _nam...\n  PUSH [tag] 18\t\t\tcontract BeldexBEP20 is ERC20,...\n  JUMP \t\t\tcontract BeldexBEP20 is ERC20,...\ntag 16\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH 5\t\t\t\n  PUSH 1\t\t\t\n  SWAP1 \t\t\t\n  SLOAD \t\t\t\n  SWAP1 \t\t\t\n  PUSH 100\t\t\t\n  EXP \t\t\t\n  SWAP1 \t\t\t\n  DIV \t\t\t\n  PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n  AND \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  DUP2 \t\t\t\n  PUSH 5\t\t\t\n  PUSH 1\t\t\t\n  PUSH 100\t\t\t\n  EXP \t\t\t\n  DUP2 \t\t\t\n  SLOAD \t\t\t\n  DUP2 \t\t\t\n  PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n  MUL \t\t\t\n  NOT \t\t\t\n  AND \t\t\t\n  SWAP1 \t\t\t\n  DUP4 \t\t\t\n  PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n  AND \t\t\t\n  MUL \t\t\t\n  OR \t\t\t\n  SWAP1 \t\t\t\n  SSTORE \t\t\t\n  POP \t\t\t\n  DUP2 \t\t\t\n  PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n  AND \t\t\t\n  DUP2 \t\t\t\n  PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n  AND \t\t\t\n  PUSH 8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0\t\t\t\n  PUSH 40\t\t\t\n  MLOAD \t\t\t\n  PUSH 40\t\t\t\n  MLOAD \t\t\t\n  DUP1 \t\t\t\n  SWAP2 \t\t\t\n  SUB \t\t\t\n  SWAP1 \t\t\t\n  LOG3 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 20\t\t\t-License-Identifier: MIT\\nprag...\n  JUMPDEST \t\t\t-License-Identifier: MIT\\nprag...\n  PUSH 0\t\t\tolidit\n  PUSH 40\t\t\tpp\n  MLOAD \t\t\topenzeppe\n  SWAP1 \t\t\t\\nimport \"@openzeppe\n  POP \t\t\t\\nimport \"@openzeppe\n  SWAP1 \t\t\t-License-Identifier: MIT\\nprag...\n  JUMP \t\t\t-License-Identifier: MIT\\nprag...\ntag 21\t\t\ts/token/ERC20/ERC20.sol\";\\nimp...\n  JUMPDEST \t\t\ts/token/ERC20/ERC20.sol\";\\nimp...\n  PUSH 0\t\t\ts\n  DUP1 \t\t\ta\n  REVERT \t\t\tn/contracts/\ntag 22\t\t\tle.sol\";\\n\\ncontract BeldexBEP...\n  JUMPDEST \t\t\tle.sol\";\\n\\ncontract BeldexBEP...\n  PUSH 0\t\t\t)\n  DUP1 \t\t\ti\n  REVERT \t\t\tOwnership();\ntag 23\t\t\t  event Mint(address indexed t...\n  JUMPDEST \t\t\t  event Mint(address indexed t...\n  PUSH 0\t\t\tn\n  DUP1 \t\t\t \n  REVERT \t\t\t);\\n\\n    cons\ntag 24\t\t\tng memory _name, string memory...\n  JUMPDEST \t\t\tng memory _name, string memory...\n  PUSH 0\t\t\ta\n  DUP1 \t\t\tc\n  REVERT \t\t\ttion decimal\ntag 25\t\t\ture override returns (uint8) {...\n  JUMPDEST \t\t\ture override returns (uint8) {...\n  PUSH 0\t\t\tturn 9\n  PUSH 1F\t\t\tli\n  NOT \t\t\t public\n  PUSH 1F\t\t\thi\n  DUP4 \t\t\teOwne\n  ADD \t\t\tounceOwnership\n  AND \t\t\t renounceOwnership() public \n  SWAP1 \t\t\t  function renounceOwnership()...\n  POP \t\t\t  function renounceOwnership()...\n  SWAP2 \t\t\ture override returns (uint8) {...\n  SWAP1 \t\t\ture override returns (uint8) {...\n  POP \t\t\ture override returns (uint8) {...\n  JUMP \t\t\ture override returns (uint8) {...\ntag 26\t\t\te {\\n        revert DisabledRe...\n  JUMPDEST \t\t\te {\\n        revert DisabledRe...\n  PUSH 4E487B7100000000000000000000000000000000000000000000000000000000\t\t\t    }\\n\\n    function pause() ...\n  PUSH 0\t\t\t)\n  MSTORE \t\t\tership();\\n    }\\n\\n    functi...\n  PUSH 41\t\t\texte\n  PUSH 4\t\t\t(\n  MSTORE \t\t\tunpause() exter\n  PUSH 24\t\t\t    \n  PUSH 0\t\t\t \n  REVERT \t\t\twner {\\n        \ntag 27\t\t\t    }\\n\\n    function mint(add...\n  JUMPDEST \t\t\t    }\\n\\n    function mint(add...\n  PUSH [tag] 64\t\t\tner {\\n        _mint(_to, _v\n  DUP3 \t\t\to, _\n  PUSH [tag] 25\t\t\tner {\\n        _mint(_to, _v\n  JUMP \t\t\tner {\\n        _mint(_to, _v\ntag 64\t\t\tner {\\n        _mint(_to, _v\n  JUMPDEST \t\t\tner {\\n        _mint(_to, _v\n  DUP2 \t\t\td only\n  ADD \t\t\taused onlyOwner {\\n        _mi...\n  DUP2 \t\t\t{\\n    \n  DUP2 \t\t\tenNotPause\n  LT \t\t\t whenNotPaused {\\n     \n  PUSH FFFFFFFFFFFFFFFF\t\t\tt256 _value) exter\n  DUP3 \t\t\tion burn(u\n  GT \t\t\tnction burn(uint256 _value) ex...\n  OR \t\t\t function burn(uint256 _value)...\n  ISZERO \t\t\t    function burn(uint256 _val...\n  PUSH [tag] 65\t\t\t    function burn(uint256 _val...\n  JUMPI \t\t\t    function burn(uint256 _val...\n  PUSH [tag] 66\t\t\tburn(msg.sender, _\n  PUSH [tag] 26\t\t\tburn(msg.sender, _\n  JUMP \t\t\tburn(msg.sender, _\ntag 66\t\t\tburn(msg.sender, _\n  JUMPDEST \t\t\tburn(msg.sender, _\ntag 65\t\t\t    function burn(uint256 _val...\n  JUMPDEST \t\t\t    function burn(uint256 _val...\n  DUP1 \t\t\turn(msg.se\n  PUSH 40\t\t\tit\n  MSTORE \t\t\t     emit Burn(msg.sen\n  POP \t\t\t56 _value) external whenNotPau...\n  POP \t\t\t    }\\n\\n    function mint(add...\n  POP \t\t\t    }\\n\\n    function mint(add...\n  JUMP \t\t\t    }\\n\\n    function mint(add...\ntag 28\t\t\t;\\n    }\\n}\n  JUMPDEST \t\t\t;\\n    }\\n}\n  PUSH 0\t\t\t\n  PUSH [tag] 68\t\t\t\n  PUSH [tag] 20\t\t\t\n  JUMP \t\t\t\ntag 68\t\t\t\n  JUMPDEST \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  PUSH [tag] 69\t\t\t\n  DUP3 \t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 27\t\t\t\n  JUMP \t\t\t\ntag 69\t\t\t\n  JUMPDEST \t\t\t\n  SWAP2 \t\t\t;\\n    }\\n}\n  SWAP1 \t\t\t;\\n    }\\n}\n  POP \t\t\t;\\n    }\\n}\n  JUMP \t\t\t;\\n    }\\n}\ntag 29\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH FFFFFFFFFFFFFFFF\t\t\t\n  DUP3 \t\t\t\n  GT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 71\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 72\t\t\t\n  PUSH [tag] 26\t\t\t\n  JUMP \t\t\t\ntag 72\t\t\t\n  JUMPDEST \t\t\t\ntag 71\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 73\t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 25\t\t\t\n  JUMP \t\t\t\ntag 73\t\t\t\n  JUMPDEST \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  PUSH 20\t\t\t\n  DUP2 \t\t\t\n  ADD \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 30\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\ntag 75\t\t\t\n  JUMPDEST \t\t\t\n  DUP4 \t\t\t\n  DUP2 \t\t\t\n  LT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 77\t\t\t\n  JUMPI \t\t\t\n  DUP1 \t\t\t\n  DUP3 \t\t\t\n  ADD \t\t\t\n  MLOAD \t\t\t\n  DUP2 \t\t\t\n  DUP5 \t\t\t\n  ADD \t\t\t\n  MSTORE \t\t\t\n  PUSH 20\t\t\t\n  DUP2 \t\t\t\n  ADD \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  PUSH [tag] 75\t\t\t\n  JUMP \t\t\t\ntag 77\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP5 \t\t\t\n  DUP5 \t\t\t\n  ADD \t\t\t\n  MSTORE \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 31\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH [tag] 79\t\t\t\n  PUSH [tag] 80\t\t\t\n  DUP5 \t\t\t\n  PUSH [tag] 29\t\t\t\n  JUMP \t\t\t\ntag 80\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 28\t\t\t\n  JUMP \t\t\t\ntag 79\t\t\t\n  JUMPDEST \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  DUP3 \t\t\t\n  DUP2 \t\t\t\n  MSTORE \t\t\t\n  PUSH 20\t\t\t\n  DUP2 \t\t\t\n  ADD \t\t\t\n  DUP5 \t\t\t\n  DUP5 \t\t\t\n  DUP5 \t\t\t\n  ADD \t\t\t\n  GT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 81\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 82\t\t\t\n  PUSH [tag] 24\t\t\t\n  JUMP \t\t\t\ntag 82\t\t\t\n  JUMPDEST \t\t\t\ntag 81\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 83\t\t\t\n  DUP5 \t\t\t\n  DUP3 \t\t\t\n  DUP6 \t\t\t\n  PUSH [tag] 30\t\t\t\n  JUMP \t\t\t\ntag 83\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  SWAP4 \t\t\t\n  SWAP3 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 32\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP3 \t\t\t\n  PUSH 1F\t\t\t\n  DUP4 \t\t\t\n  ADD \t\t\t\n  SLT \t\t\t\n  PUSH [tag] 85\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 86\t\t\t\n  PUSH [tag] 23\t\t\t\n  JUMP \t\t\t\ntag 86\t\t\t\n  JUMPDEST \t\t\t\ntag 85\t\t\t\n  JUMPDEST \t\t\t\n  DUP2 \t\t\t\n  MLOAD \t\t\t\n  PUSH [tag] 87\t\t\t\n  DUP5 \t\t\t\n  DUP3 \t\t\t\n  PUSH 20\t\t\t\n  DUP7 \t\t\t\n  ADD \t\t\t\n  PUSH [tag] 31\t\t\t\n  JUMP \t\t\t\ntag 87\t\t\t\n  JUMPDEST \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  SWAP3 \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 3\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP1 \t\t\t\n  PUSH 40\t\t\t\n  DUP4 \t\t\t\n  DUP6 \t\t\t\n  SUB \t\t\t\n  SLT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 89\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 90\t\t\t\n  PUSH [tag] 21\t\t\t\n  JUMP \t\t\t\ntag 90\t\t\t\n  JUMPDEST \t\t\t\ntag 89\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP4 \t\t\t\n  ADD \t\t\t\n  MLOAD \t\t\t\n  PUSH FFFFFFFFFFFFFFFF\t\t\t\n  DUP2 \t\t\t\n  GT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 91\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 92\t\t\t\n  PUSH [tag] 22\t\t\t\n  JUMP \t\t\t\ntag 92\t\t\t\n  JUMPDEST \t\t\t\ntag 91\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 93\t\t\t\n  DUP6 \t\t\t\n  DUP3 \t\t\t\n  DUP7 \t\t\t\n  ADD \t\t\t\n  PUSH [tag] 32\t\t\t\n  JUMP \t\t\t\ntag 93\t\t\t\n  JUMPDEST \t\t\t\n  SWAP3 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  PUSH 20\t\t\t\n  DUP4 \t\t\t\n  ADD \t\t\t\n  MLOAD \t\t\t\n  PUSH FFFFFFFFFFFFFFFF\t\t\t\n  DUP2 \t\t\t\n  GT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 94\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 95\t\t\t\n  PUSH [tag] 22\t\t\t\n  JUMP \t\t\t\ntag 95\t\t\t\n  JUMPDEST \t\t\t\ntag 94\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 96\t\t\t\n  DUP6 \t\t\t\n  DUP3 \t\t\t\n  DUP7 \t\t\t\n  ADD \t\t\t\n  PUSH [tag] 32\t\t\t\n  JUMP \t\t\t\ntag 96\t\t\t\n  JUMPDEST \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  SWAP3 \t\t\t\n  POP \t\t\t\n  SWAP3 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 33\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP2 \t\t\t\n  MLOAD \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 34\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 4E487B7100000000000000000000000000000000000000000000000000000000\t\t\t\n  PUSH 0\t\t\t\n  MSTORE \t\t\t\n  PUSH 22\t\t\t\n  PUSH 4\t\t\t\n  MSTORE \t\t\t\n  PUSH 24\t\t\t\n  PUSH 0\t\t\t\n  REVERT \t\t\t\ntag 35\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH 2\t\t\t\n  DUP3 \t\t\t\n  DIV \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  PUSH 1\t\t\t\n  DUP3 \t\t\t\n  AND \t\t\t\n  DUP1 \t\t\t\n  PUSH [tag] 100\t\t\t\n  JUMPI \t\t\t\n  PUSH 7F\t\t\t\n  DUP3 \t\t\t\n  AND \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\ntag 100\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 20\t\t\t\n  DUP3 \t\t\t\n  LT \t\t\t\n  DUP2 \t\t\t\n  SUB \t\t\t\n  PUSH [tag] 101\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 102\t\t\t\n  PUSH [tag] 34\t\t\t\n  JUMP \t\t\t\ntag 102\t\t\t\n  JUMPDEST \t\t\t\ntag 101\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 36\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  DUP2 \t\t\t\n  PUSH 0\t\t\t\n  MSTORE \t\t\t\n  PUSH 20\t\t\t\n  PUSH 0\t\t\t\n  KECCAK256 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 37\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH 20\t\t\t\n  PUSH 1F\t\t\t\n  DUP4 \t\t\t\n  ADD \t\t\t\n  DIV \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 38\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP3 \t\t\t\n  DUP3 \t\t\t\n  SHL \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP3 \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 39\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH 8\t\t\t\n  DUP4 \t\t\t\n  MUL \t\t\t\n  PUSH [tag] 107\t\t\t\n  PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 38\t\t\t\n  JUMP \t\t\t\ntag 107\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 108\t\t\t\n  DUP7 \t\t\t\n  DUP4 \t\t\t\n  PUSH [tag] 38\t\t\t\n  JUMP \t\t\t\ntag 108\t\t\t\n  JUMPDEST \t\t\t\n  SWAP6 \t\t\t\n  POP \t\t\t\n  DUP1 \t\t\t\n  NOT \t\t\t\n  DUP5 \t\t\t\n  AND \t\t\t\n  SWAP4 \t\t\t\n  POP \t\t\t\n  DUP1 \t\t\t\n  DUP7 \t\t\t\n  AND \t\t\t\n  DUP5 \t\t\t\n  OR \t\t\t\n  SWAP3 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  SWAP4 \t\t\t\n  SWAP3 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 40\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 41\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 42\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH [tag] 112\t\t\t\n  PUSH [tag] 113\t\t\t\n  PUSH [tag] 114\t\t\t\n  DUP5 \t\t\t\n  PUSH [tag] 40\t\t\t\n  JUMP \t\t\t\ntag 114\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 41\t\t\t\n  JUMP \t\t\t\ntag 113\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 40\t\t\t\n  JUMP \t\t\t\ntag 112\t\t\t\n  JUMPDEST \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 43\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 44\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 117\t\t\t\n  DUP4 \t\t\t\n  PUSH [tag] 42\t\t\t\n  JUMP \t\t\t\ntag 117\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 118\t\t\t\n  PUSH [tag] 119\t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 43\t\t\t\n  JUMP \t\t\t\ntag 119\t\t\t\n  JUMPDEST \t\t\t\n  DUP5 \t\t\t\n  DUP5 \t\t\t\n  SLOAD \t\t\t\n  PUSH [tag] 39\t\t\t\n  JUMP \t\t\t\ntag 118\t\t\t\n  JUMPDEST \t\t\t\n  DUP3 \t\t\t\n  SSTORE \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 45\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  SWAP1 \t\t\t\n  JUMP \t\t\t\ntag 46\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 122\t\t\t\n  PUSH [tag] 45\t\t\t\n  JUMP \t\t\t\ntag 122\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 123\t\t\t\n  DUP2 \t\t\t\n  DUP5 \t\t\t\n  DUP5 \t\t\t\n  PUSH [tag] 44\t\t\t\n  JUMP \t\t\t\ntag 123\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 47\t\t\t\n  JUMPDEST \t\t\t\ntag 125\t\t\t\n  JUMPDEST \t\t\t\n  DUP2 \t\t\t\n  DUP2 \t\t\t\n  LT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 127\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 128\t\t\t\n  PUSH 0\t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 46\t\t\t\n  JUMP \t\t\t\ntag 128\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 1\t\t\t\n  DUP2 \t\t\t\n  ADD \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  PUSH [tag] 125\t\t\t\n  JUMP \t\t\t\ntag 127\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 48\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 1F\t\t\t\n  DUP3 \t\t\t\n  GT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 130\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 131\t\t\t\n  DUP2 \t\t\t\n  PUSH [tag] 36\t\t\t\n  JUMP \t\t\t\ntag 131\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 132\t\t\t\n  DUP5 \t\t\t\n  PUSH [tag] 37\t\t\t\n  JUMP \t\t\t\ntag 132\t\t\t\n  JUMPDEST \t\t\t\n  DUP2 \t\t\t\n  ADD \t\t\t\n  PUSH 20\t\t\t\n  DUP6 \t\t\t\n  LT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 133\t\t\t\n  JUMPI \t\t\t\n  DUP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\ntag 133\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 134\t\t\t\n  PUSH [tag] 135\t\t\t\n  DUP6 \t\t\t\n  PUSH [tag] 37\t\t\t\n  JUMP \t\t\t\ntag 135\t\t\t\n  JUMPDEST \t\t\t\n  DUP4 \t\t\t\n  ADD \t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 47\t\t\t\n  JUMP \t\t\t\ntag 134\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  POP \t\t\t\ntag 130\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 49\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  DUP3 \t\t\t\n  DUP3 \t\t\t\n  SHR \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP3 \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 50\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH [tag] 138\t\t\t\n  PUSH 0\t\t\t\n  NOT \t\t\t\n  DUP5 \t\t\t\n  PUSH 8\t\t\t\n  MUL \t\t\t\n  PUSH [tag] 49\t\t\t\n  JUMP \t\t\t\ntag 138\t\t\t\n  JUMPDEST \t\t\t\n  NOT \t\t\t\n  DUP1 \t\t\t\n  DUP4 \t\t\t\n  AND \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  SWAP3 \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 51\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH [tag] 140\t\t\t\n  DUP4 \t\t\t\n  DUP4 \t\t\t\n  PUSH [tag] 50\t\t\t\n  JUMP \t\t\t\ntag 140\t\t\t\n  JUMPDEST \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  DUP3 \t\t\t\n  PUSH 2\t\t\t\n  MUL \t\t\t\n  DUP3 \t\t\t\n  OR \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP3 \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 9\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 142\t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 33\t\t\t\n  JUMP \t\t\t\ntag 142\t\t\t\n  JUMPDEST \t\t\t\n  PUSH FFFFFFFFFFFFFFFF\t\t\t\n  DUP2 \t\t\t\n  GT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 143\t\t\t\n  JUMPI \t\t\t\n  PUSH [tag] 144\t\t\t\n  PUSH [tag] 26\t\t\t\n  JUMP \t\t\t\ntag 144\t\t\t\n  JUMPDEST \t\t\t\ntag 143\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 145\t\t\t\n  DUP3 \t\t\t\n  SLOAD \t\t\t\n  PUSH [tag] 35\t\t\t\n  JUMP \t\t\t\ntag 145\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 146\t\t\t\n  DUP3 \t\t\t\n  DUP3 \t\t\t\n  DUP6 \t\t\t\n  PUSH [tag] 48\t\t\t\n  JUMP \t\t\t\ntag 146\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH 20\t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  PUSH 1F\t\t\t\n  DUP4 \t\t\t\n  GT \t\t\t\n  PUSH 1\t\t\t\n  DUP2 \t\t\t\n  EQ \t\t\t\n  PUSH [tag] 148\t\t\t\n  JUMPI \t\t\t\n  PUSH 0\t\t\t\n  DUP5 \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 149\t\t\t\n  JUMPI \t\t\t\n  DUP3 \t\t\t\n  DUP8 \t\t\t\n  ADD \t\t\t\n  MLOAD \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\ntag 149\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 150\t\t\t\n  DUP6 \t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 51\t\t\t\n  JUMP \t\t\t\ntag 150\t\t\t\n  JUMPDEST \t\t\t\n  DUP7 \t\t\t\n  SSTORE \t\t\t\n  POP \t\t\t\n  PUSH [tag] 147\t\t\t\n  JUMP \t\t\t\ntag 148\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 1F\t\t\t\n  NOT \t\t\t\n  DUP5 \t\t\t\n  AND \t\t\t\n  PUSH [tag] 151\t\t\t\n  DUP7 \t\t\t\n  PUSH [tag] 36\t\t\t\n  JUMP \t\t\t\ntag 151\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\ntag 152\t\t\t\n  JUMPDEST \t\t\t\n  DUP3 \t\t\t\n  DUP2 \t\t\t\n  LT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 154\t\t\t\n  JUMPI \t\t\t\n  DUP5 \t\t\t\n  DUP10 \t\t\t\n  ADD \t\t\t\n  MLOAD \t\t\t\n  DUP3 \t\t\t\n  SSTORE \t\t\t\n  PUSH 1\t\t\t\n  DUP3 \t\t\t\n  ADD \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  PUSH 20\t\t\t\n  DUP6 \t\t\t\n  ADD \t\t\t\n  SWAP5 \t\t\t\n  POP \t\t\t\n  PUSH 20\t\t\t\n  DUP2 \t\t\t\n  ADD \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  PUSH [tag] 152\t\t\t\n  JUMP \t\t\t\ntag 154\t\t\t\n  JUMPDEST \t\t\t\n  DUP7 \t\t\t\n  DUP4 \t\t\t\n  LT \t\t\t\n  ISZERO \t\t\t\n  PUSH [tag] 155\t\t\t\n  JUMPI \t\t\t\n  DUP5 \t\t\t\n  DUP10 \t\t\t\n  ADD \t\t\t\n  MLOAD \t\t\t\n  PUSH [tag] 156\t\t\t\n  PUSH 1F\t\t\t\n  DUP10 \t\t\t\n  AND \t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 50\t\t\t\n  JUMP \t\t\t\ntag 156\t\t\t\n  JUMPDEST \t\t\t\n  DUP4 \t\t\t\n  SSTORE \t\t\t\n  POP \t\t\t\ntag 155\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 1\t\t\t\n  PUSH 2\t\t\t\n  DUP9 \t\t\t\n  MUL \t\t\t\n  ADD \t\t\t\n  DUP9 \t\t\t\n  SSTORE \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\ntag 147\t\t\t\n  JUMPDEST \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 52\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n  DUP3 \t\t\t\n  AND \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 53\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH [tag] 159\t\t\t\n  DUP3 \t\t\t\n  PUSH [tag] 52\t\t\t\n  JUMP \t\t\t\ntag 159\t\t\t\n  JUMPDEST \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  SWAP2 \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 54\t\t\t\n  JUMPDEST \t\t\t\n  PUSH [tag] 161\t\t\t\n  DUP2 \t\t\t\n  PUSH [tag] 53\t\t\t\n  JUMP \t\t\t\ntag 161\t\t\t\n  JUMPDEST \t\t\t\n  DUP3 \t\t\t\n  MSTORE \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 14\t\t\t\n  JUMPDEST \t\t\t\n  PUSH 0\t\t\t\n  PUSH 20\t\t\t\n  DUP3 \t\t\t\n  ADD \t\t\t\n  SWAP1 \t\t\t\n  POP \t\t\t\n  PUSH [tag] 163\t\t\t\n  PUSH 0\t\t\t\n  DUP4 \t\t\t\n  ADD \t\t\t\n  DUP5 \t\t\t\n  PUSH [tag] 54\t\t\t\n  JUMP \t\t\t\ntag 163\t\t\t\n  JUMPDEST \t\t\t\n  SWAP3 \t\t\t\n  SWAP2 \t\t\t\n  POP \t\t\t\n  POP \t\t\t\n  JUMP \t\t\t\ntag 18\t\t\tcontract BeldexBEP20 is ERC20,...\n  JUMPDEST \t\t\tcontract BeldexBEP20 is ERC20,...\n  PUSH #[$] 0000000000000000000000000000000000000000000000000000000000000000\t\t\tcontract BeldexBEP20 is ERC20,...\n  DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n  PUSH [$] 0000000000000000000000000000000000000000000000000000000000000000\t\t\tcontract BeldexBEP20 is ERC20,...\n  PUSH 0\t\t\tcontract BeldexBEP20 is ERC20,...\n  CODECOPY \t\t\tcontract BeldexBEP20 is ERC20,...\n  PUSH 0\t\t\tcontract BeldexBEP20 is ERC20,...\n  RETURN \t\t\tcontract BeldexBEP20 is ERC20,...\n.data\n  0:\n    .code\n      PUSH 80\t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 40\t\t\tcontract BeldexBEP20 is ERC20,...\n      MSTORE \t\t\tcontract BeldexBEP20 is ERC20,...\n      CALLVALUE \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      ISZERO \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 1\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 0\t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      REVERT \t\t\tcontract BeldexBEP20 is ERC20,...\n    tag 1\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPDEST \t\t\tcontract BeldexBEP20 is ERC20,...\n      POP \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 4\t\t\tcontract BeldexBEP20 is ERC20,...\n      CALLDATASIZE \t\t\tcontract BeldexBEP20 is ERC20,...\n      LT \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 2\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 0\t\t\tcontract BeldexBEP20 is ERC20,...\n      CALLDATALOAD \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH E0\t\t\tcontract BeldexBEP20 is ERC20,...\n      SHR \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 5C975ABB\t\t\tcontract BeldexBEP20 is ERC20,...\n      GT \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 20\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 8DA5CB5B\t\t\tcontract BeldexBEP20 is ERC20,...\n      GT \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 21\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 8DA5CB5B\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 15\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 95D89B41\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 16\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH A9059CBB\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 17\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH DD62ED3E\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 18\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH F2FDE38B\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 19\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 2\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMP \t\t\tcontract BeldexBEP20 is ERC20,...\n    tag 21\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPDEST \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 5C975ABB\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 11\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 70A08231\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 12\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 715018A6\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 13\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 8456CB59\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 14\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 2\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMP \t\t\tcontract BeldexBEP20 is ERC20,...\n    tag 20\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPDEST \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 313CE567\t\t\tcontract BeldexBEP20 is ERC20,...\n      GT \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 22\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 313CE567\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 7\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 3F4BA83A\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 8\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 40C10F19\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 9\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 42966C68\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 10\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 2\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMP \t\t\tcontract BeldexBEP20 is ERC20,...\n    tag 22\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPDEST \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 6FDDE03\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 3\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 95EA7B3\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 4\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 18160DDD\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 5\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 23B872DD\t\t\tcontract BeldexBEP20 is ERC20,...\n      EQ \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH [tag] 6\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPI \t\t\tcontract BeldexBEP20 is ERC20,...\n    tag 2\t\t\tcontract BeldexBEP20 is ERC20,...\n      JUMPDEST \t\t\tcontract BeldexBEP20 is ERC20,...\n      PUSH 0\t\t\tcontract BeldexBEP20 is ERC20,...\n      DUP1 \t\t\tcontract BeldexBEP20 is ERC20,...\n      REVERT \t\t\tcontract BeldexBEP20 is ERC20,...\n    tag 3\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 23\t\t\t\n      PUSH [tag] 24\t\t\t\n      JUMP \t\t\t\n    tag 23\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 25\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 26\t\t\t\n      JUMP \t\t\t\n    tag 25\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 4\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 27\t\t\t\n      PUSH 4\t\t\t\n      DUP1 \t\t\t\n      CALLDATASIZE \t\t\t\n      SUB \t\t\t\n      DUP2 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 28\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 29\t\t\t\n      JUMP \t\t\t\n    tag 28\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 30\t\t\t\n      JUMP \t\t\t\n    tag 27\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 31\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 32\t\t\t\n      JUMP \t\t\t\n    tag 31\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 5\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 33\t\t\t\n      PUSH [tag] 34\t\t\t\n      JUMP \t\t\t\n    tag 33\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 35\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 36\t\t\t\n      JUMP \t\t\t\n    tag 35\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 6\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 37\t\t\t\n      PUSH 4\t\t\t\n      DUP1 \t\t\t\n      CALLDATASIZE \t\t\t\n      SUB \t\t\t\n      DUP2 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 38\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 39\t\t\t\n      JUMP \t\t\t\n    tag 38\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 40\t\t\t\n      JUMP \t\t\t\n    tag 37\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 41\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 32\t\t\t\n      JUMP \t\t\t\n    tag 41\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 7\t\t\tfunction decimals() public pur...\n      JUMPDEST \t\t\tfunction decimals() public pur...\n      PUSH [tag] 42\t\t\tfunction decimals() public pur...\n      PUSH [tag] 43\t\t\tfunction decimals() public pur...\n      JUMP \t\t\tfunction decimals() public pur...\n    tag 42\t\t\tfunction decimals() public pur...\n      JUMPDEST \t\t\tfunction decimals() public pur...\n      PUSH 40\t\t\tfunction decimals() public pur...\n      MLOAD \t\t\tfunction decimals() public pur...\n      PUSH [tag] 44\t\t\tfunction decimals() public pur...\n      SWAP2 \t\t\tfunction decimals() public pur...\n      SWAP1 \t\t\tfunction decimals() public pur...\n      PUSH [tag] 45\t\t\tfunction decimals() public pur...\n      JUMP \t\t\tfunction decimals() public pur...\n    tag 44\t\t\tfunction decimals() public pur...\n      JUMPDEST \t\t\tfunction decimals() public pur...\n      PUSH 40\t\t\tfunction decimals() public pur...\n      MLOAD \t\t\tfunction decimals() public pur...\n      DUP1 \t\t\tfunction decimals() public pur...\n      SWAP2 \t\t\tfunction decimals() public pur...\n      SUB \t\t\tfunction decimals() public pur...\n      SWAP1 \t\t\tfunction decimals() public pur...\n      RETURN \t\t\tfunction decimals() public pur...\n    tag 8\t\t\tfunction unpause() external on...\n      JUMPDEST \t\t\tfunction unpause() external on...\n      PUSH [tag] 46\t\t\tfunction unpause() external on...\n      PUSH [tag] 47\t\t\tfunction unpause() external on...\n      JUMP \t\t\tfunction unpause() external on...\n    tag 46\t\t\tfunction unpause() external on...\n      JUMPDEST \t\t\tfunction unpause() external on...\n      STOP \t\t\tfunction unpause() external on...\n    tag 9\t\t\tfunction mint(address _to, uin...\n      JUMPDEST \t\t\tfunction mint(address _to, uin...\n      PUSH [tag] 48\t\t\tfunction mint(address _to, uin...\n      PUSH 4\t\t\tfunction mint(address _to, uin...\n      DUP1 \t\t\tfunction mint(address _to, uin...\n      CALLDATASIZE \t\t\tfunction mint(address _to, uin...\n      SUB \t\t\tfunction mint(address _to, uin...\n      DUP2 \t\t\tfunction mint(address _to, uin...\n      ADD \t\t\tfunction mint(address _to, uin...\n      SWAP1 \t\t\tfunction mint(address _to, uin...\n      PUSH [tag] 49\t\t\tfunction mint(address _to, uin...\n      SWAP2 \t\t\tfunction mint(address _to, uin...\n      SWAP1 \t\t\tfunction mint(address _to, uin...\n      PUSH [tag] 29\t\t\tfunction mint(address _to, uin...\n      JUMP \t\t\tfunction mint(address _to, uin...\n    tag 49\t\t\tfunction mint(address _to, uin...\n      JUMPDEST \t\t\tfunction mint(address _to, uin...\n      PUSH [tag] 50\t\t\tfunction mint(address _to, uin...\n      JUMP \t\t\tfunction mint(address _to, uin...\n    tag 48\t\t\tfunction mint(address _to, uin...\n      JUMPDEST \t\t\tfunction mint(address _to, uin...\n      STOP \t\t\tfunction mint(address _to, uin...\n    tag 10\t\t\tfunction burn(uint256 _value) ...\n      JUMPDEST \t\t\tfunction burn(uint256 _value) ...\n      PUSH [tag] 51\t\t\tfunction burn(uint256 _value) ...\n      PUSH 4\t\t\tfunction burn(uint256 _value) ...\n      DUP1 \t\t\tfunction burn(uint256 _value) ...\n      CALLDATASIZE \t\t\tfunction burn(uint256 _value) ...\n      SUB \t\t\tfunction burn(uint256 _value) ...\n      DUP2 \t\t\tfunction burn(uint256 _value) ...\n      ADD \t\t\tfunction burn(uint256 _value) ...\n      SWAP1 \t\t\tfunction burn(uint256 _value) ...\n      PUSH [tag] 52\t\t\tfunction burn(uint256 _value) ...\n      SWAP2 \t\t\tfunction burn(uint256 _value) ...\n      SWAP1 \t\t\tfunction burn(uint256 _value) ...\n      PUSH [tag] 53\t\t\tfunction burn(uint256 _value) ...\n      JUMP \t\t\tfunction burn(uint256 _value) ...\n    tag 52\t\t\tfunction burn(uint256 _value) ...\n      JUMPDEST \t\t\tfunction burn(uint256 _value) ...\n      PUSH [tag] 54\t\t\tfunction burn(uint256 _value) ...\n      JUMP \t\t\tfunction burn(uint256 _value) ...\n    tag 51\t\t\tfunction burn(uint256 _value) ...\n      JUMPDEST \t\t\tfunction burn(uint256 _value) ...\n      STOP \t\t\tfunction burn(uint256 _value) ...\n    tag 11\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 55\t\t\t\n      PUSH [tag] 56\t\t\t\n      JUMP \t\t\t\n    tag 55\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 57\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 32\t\t\t\n      JUMP \t\t\t\n    tag 57\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 12\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 58\t\t\t\n      PUSH 4\t\t\t\n      DUP1 \t\t\t\n      CALLDATASIZE \t\t\t\n      SUB \t\t\t\n      DUP2 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 59\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 60\t\t\t\n      JUMP \t\t\t\n    tag 59\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 61\t\t\t\n      JUMP \t\t\t\n    tag 58\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 62\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 36\t\t\t\n      JUMP \t\t\t\n    tag 62\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 13\t\t\tfunction renounceOwnership() p...\n      JUMPDEST \t\t\tfunction renounceOwnership() p...\n      PUSH [tag] 63\t\t\tfunction renounceOwnership() p...\n      PUSH [tag] 64\t\t\tfunction renounceOwnership() p...\n      JUMP \t\t\tfunction renounceOwnership() p...\n    tag 63\t\t\tfunction renounceOwnership() p...\n      JUMPDEST \t\t\tfunction renounceOwnership() p...\n      STOP \t\t\tfunction renounceOwnership() p...\n    tag 14\t\t\tfunction pause() external only...\n      JUMPDEST \t\t\tfunction pause() external only...\n      PUSH [tag] 65\t\t\tfunction pause() external only...\n      PUSH [tag] 66\t\t\tfunction pause() external only...\n      JUMP \t\t\tfunction pause() external only...\n    tag 65\t\t\tfunction pause() external only...\n      JUMPDEST \t\t\tfunction pause() external only...\n      STOP \t\t\tfunction pause() external only...\n    tag 15\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 67\t\t\t\n      PUSH [tag] 68\t\t\t\n      JUMP \t\t\t\n    tag 67\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 69\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 69\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 16\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 71\t\t\t\n      PUSH [tag] 72\t\t\t\n      JUMP \t\t\t\n    tag 71\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 73\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 26\t\t\t\n      JUMP \t\t\t\n    tag 73\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 17\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 74\t\t\t\n      PUSH 4\t\t\t\n      DUP1 \t\t\t\n      CALLDATASIZE \t\t\t\n      SUB \t\t\t\n      DUP2 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 75\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 29\t\t\t\n      JUMP \t\t\t\n    tag 75\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 76\t\t\t\n      JUMP \t\t\t\n    tag 74\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 77\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 32\t\t\t\n      JUMP \t\t\t\n    tag 77\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 18\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 78\t\t\t\n      PUSH 4\t\t\t\n      DUP1 \t\t\t\n      CALLDATASIZE \t\t\t\n      SUB \t\t\t\n      DUP2 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 79\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 80\t\t\t\n      JUMP \t\t\t\n    tag 79\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 81\t\t\t\n      JUMP \t\t\t\n    tag 78\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 82\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 36\t\t\t\n      JUMP \t\t\t\n    tag 82\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      RETURN \t\t\t\n    tag 19\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 83\t\t\t\n      PUSH 4\t\t\t\n      DUP1 \t\t\t\n      CALLDATASIZE \t\t\t\n      SUB \t\t\t\n      DUP2 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 84\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 60\t\t\t\n      JUMP \t\t\t\n    tag 84\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 85\t\t\t\n      JUMP \t\t\t\n    tag 83\t\t\t\n      JUMPDEST \t\t\t\n      STOP \t\t\t\n    tag 24\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 60\t\t\t\n      PUSH 3\t\t\t\n      DUP1 \t\t\t\n      SLOAD \t\t\t\n      PUSH [tag] 87\t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 88\t\t\t\n      JUMP \t\t\t\n    tag 87\t\t\t\n      JUMPDEST \t\t\t\n      DUP1 \t\t\t\n      PUSH 1F\t\t\t\n      ADD \t\t\t\n      PUSH 20\t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      DIV \t\t\t\n      MUL \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      ADD \t\t\t\n      PUSH 40\t\t\t\n      MSTORE \t\t\t\n      DUP1 \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      DUP3 \t\t\t\n      DUP1 \t\t\t\n      SLOAD \t\t\t\n      PUSH [tag] 89\t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 88\t\t\t\n      JUMP \t\t\t\n    tag 89\t\t\t\n      JUMPDEST \t\t\t\n      DUP1 \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 90\t\t\t\n      JUMPI \t\t\t\n      DUP1 \t\t\t\n      PUSH 1F\t\t\t\n      LT \t\t\t\n      PUSH [tag] 91\t\t\t\n      JUMPI \t\t\t\n      PUSH 100\t\t\t\n      DUP1 \t\t\t\n      DUP4 \t\t\t\n      SLOAD \t\t\t\n      DIV \t\t\t\n      MUL \t\t\t\n      DUP4 \t\t\t\n      MSTORE \t\t\t\n      SWAP2 \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP2 \t\t\t\n      PUSH [tag] 90\t\t\t\n      JUMP \t\t\t\n    tag 91\t\t\t\n      JUMPDEST \t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH 0\t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      SWAP1 \t\t\t\n    tag 92\t\t\t\n      JUMPDEST \t\t\t\n      DUP2 \t\t\t\n      SLOAD \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      SWAP1 \t\t\t\n      PUSH 1\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      DUP1 \t\t\t\n      DUP4 \t\t\t\n      GT \t\t\t\n      PUSH [tag] 92\t\t\t\n      JUMPI \t\t\t\n      DUP3 \t\t\t\n      SWAP1 \t\t\t\n      SUB \t\t\t\n      PUSH 1F\t\t\t\n      AND \t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP2 \t\t\t\n    tag 90\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP1 \t\t\t\n      JUMP \t\t\t\n    tag 30\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      PUSH [tag] 94\t\t\t\n      PUSH [tag] 95\t\t\t\n      JUMP \t\t\t\n    tag 94\t\t\t\n      JUMPDEST \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 96\t\t\t\n      DUP2 \t\t\t\n      DUP6 \t\t\t\n      DUP6 \t\t\t\n      PUSH [tag] 97\t\t\t\n      JUMP \t\t\t\n    tag 96\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 1\t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 34\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 2\t\t\t\n      SLOAD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP1 \t\t\t\n      JUMP \t\t\t\n    tag 40\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      PUSH [tag] 100\t\t\t\n      PUSH [tag] 95\t\t\t\n      JUMP \t\t\t\n    tag 100\t\t\t\n      JUMPDEST \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 101\t\t\t\n      DUP6 \t\t\t\n      DUP3 \t\t\t\n      DUP6 \t\t\t\n      PUSH [tag] 102\t\t\t\n      JUMP \t\t\t\n    tag 101\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 103\t\t\t\n      DUP6 \t\t\t\n      DUP6 \t\t\t\n      DUP6 \t\t\t\n      PUSH [tag] 104\t\t\t\n      JUMP \t\t\t\n    tag 103\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 1\t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP4 \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 43\t\t\tfunction decimals() public pur...\n      JUMPDEST \t\t\tfunction decimals() public pur...\n      PUSH 0\t\t\tuint8\n      PUSH 9\t\t\t9\n      SWAP1 \t\t\treturn 9\n      POP \t\t\treturn 9\n      SWAP1 \t\t\tfunction decimals() public pur...\n      JUMP \t\t\tfunction decimals() public pur...\n    tag 47\t\t\tfunction unpause() external on...\n      JUMPDEST \t\t\tfunction unpause() external on...\n      PUSH [tag] 107\t\t\t\n      PUSH [tag] 108\t\t\t\n      JUMP \t\t\t\n    tag 107\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 110\t\t\t_unpause()\n      PUSH [tag] 111\t\t\t_unpause\n      JUMP \t\t\t_unpause()\n    tag 110\t\t\t_unpause()\n      JUMPDEST \t\t\t_unpause()\n      JUMP \t\t\tfunction unpause() external on...\n    tag 50\t\t\tfunction mint(address _to, uin...\n      JUMPDEST \t\t\tfunction mint(address _to, uin...\n      PUSH [tag] 113\t\t\t\n      PUSH [tag] 114\t\t\t\n      JUMP \t\t\t\n    tag 113\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 116\t\t\t\n      PUSH [tag] 108\t\t\t\n      JUMP \t\t\t\n    tag 116\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 118\t\t\t_mint(_to, _value)\n      DUP3 \t\t\t_to\n      DUP3 \t\t\t_value\n      PUSH [tag] 119\t\t\t_mint\n      JUMP \t\t\t_mint(_to, _value)\n    tag 118\t\t\t_mint(_to, _value)\n      JUMPDEST \t\t\t_mint(_to, _value)\n      DUP2 \t\t\t_to\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\tMint(_to, _value)\n      AND \t\t\tMint(_to, _value)\n      PUSH F6798A560793A54C3BCFE86A93CDE1E73087D944C0EA20544137D4121396885\t\t\tMint(_to, _value)\n      DUP3 \t\t\t_value\n      PUSH 40\t\t\tMint(_to, _value)\n      MLOAD \t\t\tMint(_to, _value)\n      PUSH [tag] 120\t\t\tMint(_to, _value)\n      SWAP2 \t\t\tMint(_to, _value)\n      SWAP1 \t\t\tMint(_to, _value)\n      PUSH [tag] 36\t\t\tMint(_to, _value)\n      JUMP \t\t\tMint(_to, _value)\n    tag 120\t\t\tMint(_to, _value)\n      JUMPDEST \t\t\tMint(_to, _value)\n      PUSH 40\t\t\tMint(_to, _value)\n      MLOAD \t\t\tMint(_to, _value)\n      DUP1 \t\t\tMint(_to, _value)\n      SWAP2 \t\t\tMint(_to, _value)\n      SUB \t\t\tMint(_to, _value)\n      SWAP1 \t\t\tMint(_to, _value)\n      LOG2 \t\t\tMint(_to, _value)\n      POP \t\t\tfunction mint(address _to, uin...\n      POP \t\t\tfunction mint(address _to, uin...\n      JUMP \t\t\tfunction mint(address _to, uin...\n    tag 54\t\t\tfunction burn(uint256 _value) ...\n      JUMPDEST \t\t\tfunction burn(uint256 _value) ...\n      PUSH [tag] 122\t\t\t\n      PUSH [tag] 114\t\t\t\n      JUMP \t\t\t\n    tag 122\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 124\t\t\t_burn(msg.sender, _value)\n      CALLER \t\t\tmsg.sender\n      DUP3 \t\t\t_value\n      PUSH [tag] 125\t\t\t_burn\n      JUMP \t\t\t_burn(msg.sender, _value)\n    tag 124\t\t\t_burn(msg.sender, _value)\n      JUMPDEST \t\t\t_burn(msg.sender, _value)\n      CALLER \t\t\tmsg.sender\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\tBurn(msg.sender, _value)\n      AND \t\t\tBurn(msg.sender, _value)\n      PUSH CC16F5DBB4873280815C1EE09DBD06736CFFCC184412CF7A71A0FDB75D397CA5\t\t\tBurn(msg.sender, _value)\n      DUP3 \t\t\t_value\n      PUSH 40\t\t\tBurn(msg.sender, _value)\n      MLOAD \t\t\tBurn(msg.sender, _value)\n      PUSH [tag] 126\t\t\tBurn(msg.sender, _value)\n      SWAP2 \t\t\tBurn(msg.sender, _value)\n      SWAP1 \t\t\tBurn(msg.sender, _value)\n      PUSH [tag] 36\t\t\tBurn(msg.sender, _value)\n      JUMP \t\t\tBurn(msg.sender, _value)\n    tag 126\t\t\tBurn(msg.sender, _value)\n      JUMPDEST \t\t\tBurn(msg.sender, _value)\n      PUSH 40\t\t\tBurn(msg.sender, _value)\n      MLOAD \t\t\tBurn(msg.sender, _value)\n      DUP1 \t\t\tBurn(msg.sender, _value)\n      SWAP2 \t\t\tBurn(msg.sender, _value)\n      SUB \t\t\tBurn(msg.sender, _value)\n      SWAP1 \t\t\tBurn(msg.sender, _value)\n      LOG2 \t\t\tBurn(msg.sender, _value)\n      POP \t\t\tfunction burn(uint256 _value) ...\n      JUMP \t\t\tfunction burn(uint256 _value) ...\n    tag 56\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 5\t\t\t\n      PUSH 0\t\t\t\n      SWAP1 \t\t\t\n      SLOAD \t\t\t\n      SWAP1 \t\t\t\n      PUSH 100\t\t\t\n      EXP \t\t\t\n      SWAP1 \t\t\t\n      DIV \t\t\t\n      PUSH FF\t\t\t\n      AND \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP1 \t\t\t\n      JUMP \t\t\t\n    tag 61\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      SLOAD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 64\t\t\tfunction renounceOwnership() p...\n      JUMPDEST \t\t\tfunction renounceOwnership() p...\n      PUSH 40\t\t\tDisabledRenounceOwnership()\n      MLOAD \t\t\tDisabledRenounceOwnership()\n      PUSH C8F64FAF00000000000000000000000000000000000000000000000000000000\t\t\tDisabledRenounceOwnership()\n      DUP2 \t\t\tDisabledRenounceOwnership()\n      MSTORE \t\t\tDisabledRenounceOwnership()\n      PUSH 4\t\t\tDisabledRenounceOwnership()\n      ADD \t\t\tDisabledRenounceOwnership()\n      PUSH 40\t\t\tDisabledRenounceOwnership()\n      MLOAD \t\t\tDisabledRenounceOwnership()\n      DUP1 \t\t\tDisabledRenounceOwnership()\n      SWAP2 \t\t\tDisabledRenounceOwnership()\n      SUB \t\t\tDisabledRenounceOwnership()\n      SWAP1 \t\t\tDisabledRenounceOwnership()\n      REVERT \t\t\tDisabledRenounceOwnership()\n    tag 66\t\t\tfunction pause() external only...\n      JUMPDEST \t\t\tfunction pause() external only...\n      PUSH [tag] 131\t\t\t\n      PUSH [tag] 108\t\t\t\n      JUMP \t\t\t\n    tag 131\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 133\t\t\t_pause()\n      PUSH [tag] 134\t\t\t_pause\n      JUMP \t\t\t_pause()\n    tag 133\t\t\t_pause()\n      JUMPDEST \t\t\t_pause()\n      JUMP \t\t\tfunction pause() external only...\n    tag 68\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 5\t\t\t\n      PUSH 1\t\t\t\n      SWAP1 \t\t\t\n      SLOAD \t\t\t\n      SWAP1 \t\t\t\n      PUSH 100\t\t\t\n      EXP \t\t\t\n      SWAP1 \t\t\t\n      DIV \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP1 \t\t\t\n      JUMP \t\t\t\n    tag 72\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 60\t\t\t\n      PUSH 4\t\t\t\n      DUP1 \t\t\t\n      SLOAD \t\t\t\n      PUSH [tag] 137\t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 88\t\t\t\n      JUMP \t\t\t\n    tag 137\t\t\t\n      JUMPDEST \t\t\t\n      DUP1 \t\t\t\n      PUSH 1F\t\t\t\n      ADD \t\t\t\n      PUSH 20\t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      DIV \t\t\t\n      MUL \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      ADD \t\t\t\n      PUSH 40\t\t\t\n      MSTORE \t\t\t\n      DUP1 \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      DUP3 \t\t\t\n      DUP1 \t\t\t\n      SLOAD \t\t\t\n      PUSH [tag] 138\t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 88\t\t\t\n      JUMP \t\t\t\n    tag 138\t\t\t\n      JUMPDEST \t\t\t\n      DUP1 \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 139\t\t\t\n      JUMPI \t\t\t\n      DUP1 \t\t\t\n      PUSH 1F\t\t\t\n      LT \t\t\t\n      PUSH [tag] 140\t\t\t\n      JUMPI \t\t\t\n      PUSH 100\t\t\t\n      DUP1 \t\t\t\n      DUP4 \t\t\t\n      SLOAD \t\t\t\n      DIV \t\t\t\n      MUL \t\t\t\n      DUP4 \t\t\t\n      MSTORE \t\t\t\n      SWAP2 \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP2 \t\t\t\n      PUSH [tag] 139\t\t\t\n      JUMP \t\t\t\n    tag 140\t\t\t\n      JUMPDEST \t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH 0\t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      SWAP1 \t\t\t\n    tag 141\t\t\t\n      JUMPDEST \t\t\t\n      DUP2 \t\t\t\n      SLOAD \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      SWAP1 \t\t\t\n      PUSH 1\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      DUP1 \t\t\t\n      DUP4 \t\t\t\n      GT \t\t\t\n      PUSH [tag] 141\t\t\t\n      JUMPI \t\t\t\n      DUP3 \t\t\t\n      SWAP1 \t\t\t\n      SUB \t\t\t\n      PUSH 1F\t\t\t\n      AND \t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP2 \t\t\t\n    tag 139\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP1 \t\t\t\n      JUMP \t\t\t\n    tag 76\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      PUSH [tag] 143\t\t\t\n      PUSH [tag] 95\t\t\t\n      JUMP \t\t\t\n    tag 143\t\t\t\n      JUMPDEST \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 144\t\t\t\n      DUP2 \t\t\t\n      DUP6 \t\t\t\n      DUP6 \t\t\t\n      PUSH [tag] 104\t\t\t\n      JUMP \t\t\t\n    tag 144\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 1\t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 81\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 1\t\t\t\n      PUSH 0\t\t\t\n      DUP5 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      SLOAD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 85\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 147\t\t\t\n      PUSH [tag] 108\t\t\t\n      JUMP \t\t\t\n    tag 147\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 149\t\t\t\n      JUMPI \t\t\t\n      PUSH 0\t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH 1E4FBDF700000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 150\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 150\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 149\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 151\t\t\t\n      DUP2 \t\t\t\n      PUSH [tag] 152\t\t\t\n      JUMP \t\t\t\n    tag 151\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 95\t\t\teOwnership() public pure overr...\n      JUMPDEST \t\t\teOwnership() public pure overr...\n      PUSH 0\t\t\tsabledR\n      CALLER \t\t\t\\n    }\\n\\n  \n      SWAP1 \t\t\tship();\\n    }\\n\\n  \n      POP \t\t\tship();\\n    }\\n\\n  \n      SWAP1 \t\t\teOwnership() public pure overr...\n      JUMP \t\t\teOwnership() public pure overr...\n    tag 97\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 155\t\t\t\n      DUP4 \t\t\t\n      DUP4 \t\t\t\n      DUP4 \t\t\t\n      PUSH 1\t\t\t\n      PUSH [tag] 156\t\t\t\n      JUMP \t\t\t\n    tag 155\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 102\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH [tag] 158\t\t\t\n      DUP5 \t\t\t\n      DUP5 \t\t\t\n      PUSH [tag] 81\t\t\t\n      JUMP \t\t\t\n    tag 158\t\t\t\n      JUMPDEST \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      DUP2 \t\t\t\n      LT \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 159\t\t\t\n      JUMPI \t\t\t\n      DUP2 \t\t\t\n      DUP2 \t\t\t\n      LT \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 160\t\t\t\n      JUMPI \t\t\t\n      DUP3 \t\t\t\n      DUP2 \t\t\t\n      DUP4 \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH FB8F41B200000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 161\t\t\t\n      SWAP4 \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 162\t\t\t\n      JUMP \t\t\t\n    tag 161\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 160\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 163\t\t\t\n      DUP5 \t\t\t\n      DUP5 \t\t\t\n      DUP5 \t\t\t\n      DUP5 \t\t\t\n      SUB \t\t\t\n      PUSH 0\t\t\t\n      PUSH [tag] 156\t\t\t\n      JUMP \t\t\t\n    tag 163\t\t\t\n      JUMPDEST \t\t\t\n    tag 159\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 104\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP4 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 165\t\t\t\n      JUMPI \t\t\t\n      PUSH 0\t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH 96C6FD1E00000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 166\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 166\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 165\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP3 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 167\t\t\t\n      JUMPI \t\t\t\n      PUSH 0\t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH EC442F0500000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 168\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 168\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 167\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 169\t\t\t\n      DUP4 \t\t\t\n      DUP4 \t\t\t\n      DUP4 \t\t\t\n      PUSH [tag] 170\t\t\t\n      JUMP \t\t\t\n    tag 169\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 108\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 172\t\t\t\n      PUSH [tag] 95\t\t\t\n      JUMP \t\t\t\n    tag 172\t\t\t\n      JUMPDEST \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH [tag] 173\t\t\t\n      PUSH [tag] 68\t\t\t\n      JUMP \t\t\t\n    tag 173\t\t\t\n      JUMPDEST \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      EQ \t\t\t\n      PUSH [tag] 174\t\t\t\n      JUMPI \t\t\t\n      PUSH [tag] 175\t\t\t\n      PUSH [tag] 95\t\t\t\n      JUMP \t\t\t\n    tag 175\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH 118CDAA700000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 176\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 176\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 174\t\t\t\n      JUMPDEST \t\t\t\n      JUMP \t\t\t\n    tag 111\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 178\t\t\t\n      PUSH [tag] 179\t\t\t\n      JUMP \t\t\t\n    tag 178\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 5\t\t\t\n      PUSH 0\t\t\t\n      PUSH 100\t\t\t\n      EXP \t\t\t\n      DUP2 \t\t\t\n      SLOAD \t\t\t\n      DUP2 \t\t\t\n      PUSH FF\t\t\t\n      MUL \t\t\t\n      NOT \t\t\t\n      AND \t\t\t\n      SWAP1 \t\t\t\n      DUP4 \t\t\t\n      ISZERO \t\t\t\n      ISZERO \t\t\t\n      MUL \t\t\t\n      OR \t\t\t\n      SWAP1 \t\t\t\n      SSTORE \t\t\t\n      POP \t\t\t\n      PUSH 5DB9EE0A495BF2E6FF9C91A7834C1BA4FDD244A5E8AA4E537BD38AEAE4B073AA\t\t\t\n      PUSH [tag] 181\t\t\t\n      PUSH [tag] 95\t\t\t\n      JUMP \t\t\t\n    tag 181\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 182\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 182\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      LOG1 \t\t\t\n      JUMP \t\t\t\n    tag 114\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 184\t\t\t\n      PUSH [tag] 56\t\t\t\n      JUMP \t\t\t\n    tag 184\t\t\t\n      JUMPDEST \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 185\t\t\t\n      JUMPI \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH D93C066500000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 185\t\t\t\n      JUMPDEST \t\t\t\n      JUMP \t\t\t\n    tag 119\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP3 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 187\t\t\t\n      JUMPI \t\t\t\n      PUSH 0\t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH EC442F0500000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 188\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 188\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 187\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 189\t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      DUP4 \t\t\t\n      PUSH [tag] 170\t\t\t\n      JUMP \t\t\t\n    tag 189\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 125\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP3 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 191\t\t\t\n      JUMPI \t\t\t\n      PUSH 0\t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH 96C6FD1E00000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 192\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 192\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 191\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 193\t\t\t\n      DUP3 \t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      PUSH [tag] 170\t\t\t\n      JUMP \t\t\t\n    tag 193\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 134\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 195\t\t\t\n      PUSH [tag] 114\t\t\t\n      JUMP \t\t\t\n    tag 195\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 1\t\t\t\n      PUSH 5\t\t\t\n      PUSH 0\t\t\t\n      PUSH 100\t\t\t\n      EXP \t\t\t\n      DUP2 \t\t\t\n      SLOAD \t\t\t\n      DUP2 \t\t\t\n      PUSH FF\t\t\t\n      MUL \t\t\t\n      NOT \t\t\t\n      AND \t\t\t\n      SWAP1 \t\t\t\n      DUP4 \t\t\t\n      ISZERO \t\t\t\n      ISZERO \t\t\t\n      MUL \t\t\t\n      OR \t\t\t\n      SWAP1 \t\t\t\n      SSTORE \t\t\t\n      POP \t\t\t\n      PUSH 62E78CEA01BEE320CD4E420270B5EA74000D11B0C9F74754EBDBFC544B05A258\t\t\t\n      PUSH [tag] 197\t\t\t\n      PUSH [tag] 95\t\t\t\n      JUMP \t\t\t\n    tag 197\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 198\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 198\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      LOG1 \t\t\t\n      JUMP \t\t\t\n    tag 152\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 5\t\t\t\n      PUSH 1\t\t\t\n      SWAP1 \t\t\t\n      SLOAD \t\t\t\n      SWAP1 \t\t\t\n      PUSH 100\t\t\t\n      EXP \t\t\t\n      SWAP1 \t\t\t\n      DIV \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      DUP2 \t\t\t\n      PUSH 5\t\t\t\n      PUSH 1\t\t\t\n      PUSH 100\t\t\t\n      EXP \t\t\t\n      DUP2 \t\t\t\n      SLOAD \t\t\t\n      DUP2 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      MUL \t\t\t\n      NOT \t\t\t\n      AND \t\t\t\n      SWAP1 \t\t\t\n      DUP4 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      MUL \t\t\t\n      OR \t\t\t\n      SWAP1 \t\t\t\n      SSTORE \t\t\t\n      POP \t\t\t\n      DUP2 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH 8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0\t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      LOG3 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 156\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP5 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 201\t\t\t\n      JUMPI \t\t\t\n      PUSH 0\t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH E602DF0500000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 202\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 202\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 201\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP4 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 203\t\t\t\n      JUMPI \t\t\t\n      PUSH 0\t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH 94280D6200000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 204\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 70\t\t\t\n      JUMP \t\t\t\n    tag 204\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 203\t\t\t\n      JUMPDEST \t\t\t\n      DUP2 \t\t\t\n      PUSH 1\t\t\t\n      PUSH 0\t\t\t\n      DUP7 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      PUSH 0\t\t\t\n      DUP6 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      DUP2 \t\t\t\n      SWAP1 \t\t\t\n      SSTORE \t\t\t\n      POP \t\t\t\n      DUP1 \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 205\t\t\t\n      JUMPI \t\t\t\n      DUP3 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP5 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH 8C5BE1E5EBEC7D5BD14F71427D1E84F3DD0314C0F7B2291E5B200AC8C7C3B925\t\t\t\n      DUP5 \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 206\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 36\t\t\t\n      JUMP \t\t\t\n    tag 206\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      LOG3 \t\t\t\n    tag 205\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 170\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP4 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 208\t\t\t\n      JUMPI \t\t\t\n      DUP1 \t\t\t\n      PUSH 2\t\t\t\n      PUSH 0\t\t\t\n      DUP3 \t\t\t\n      DUP3 \t\t\t\n      SLOAD \t\t\t\n      PUSH [tag] 209\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 210\t\t\t\n      JUMP \t\t\t\n    tag 209\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      DUP2 \t\t\t\n      SWAP1 \t\t\t\n      SSTORE \t\t\t\n      POP \t\t\t\n      PUSH [tag] 211\t\t\t\n      JUMP \t\t\t\n    tag 208\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      PUSH 0\t\t\t\n      DUP6 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      SLOAD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      DUP2 \t\t\t\n      DUP2 \t\t\t\n      LT \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 212\t\t\t\n      JUMPI \t\t\t\n      DUP4 \t\t\t\n      DUP2 \t\t\t\n      DUP4 \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH E450D38C00000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH [tag] 213\t\t\t\n      SWAP4 \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 162\t\t\t\n      JUMP \t\t\t\n    tag 213\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 212\t\t\t\n      JUMPDEST \t\t\t\n      DUP2 \t\t\t\n      DUP2 \t\t\t\n      SUB \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      DUP7 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      DUP2 \t\t\t\n      SWAP1 \t\t\t\n      SSTORE \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n    tag 211\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP3 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 214\t\t\t\n      JUMPI \t\t\t\n      DUP1 \t\t\t\n      PUSH 2\t\t\t\n      PUSH 0\t\t\t\n      DUP3 \t\t\t\n      DUP3 \t\t\t\n      SLOAD \t\t\t\n      SUB \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      DUP2 \t\t\t\n      SWAP1 \t\t\t\n      SSTORE \t\t\t\n      POP \t\t\t\n      PUSH [tag] 215\t\t\t\n      JUMP \t\t\t\n    tag 214\t\t\t\n      JUMPDEST \t\t\t\n      DUP1 \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      DUP5 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 20\t\t\t\n      ADD \t\t\t\n      PUSH 0\t\t\t\n      KECCAK256 \t\t\t\n      PUSH 0\t\t\t\n      DUP3 \t\t\t\n      DUP3 \t\t\t\n      SLOAD \t\t\t\n      ADD \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      DUP2 \t\t\t\n      SWAP1 \t\t\t\n      SSTORE \t\t\t\n      POP \t\t\t\n    tag 215\t\t\t\n      JUMPDEST \t\t\t\n      DUP2 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      DUP4 \t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      AND \t\t\t\n      PUSH DDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF\t\t\t\n      DUP4 \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH [tag] 216\t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      PUSH [tag] 36\t\t\t\n      JUMP \t\t\t\n    tag 216\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      LOG3 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 179\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 218\t\t\t\n      PUSH [tag] 56\t\t\t\n      JUMP \t\t\t\n    tag 218\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 219\t\t\t\n      JUMPI \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      PUSH 8DFC202B00000000000000000000000000000000000000000000000000000000\t\t\t\n      DUP2 \t\t\t\n      MSTORE \t\t\t\n      PUSH 4\t\t\t\n      ADD \t\t\t\n      PUSH 40\t\t\t\n      MLOAD \t\t\t\n      DUP1 \t\t\t\n      SWAP2 \t\t\t\n      SUB \t\t\t\n      SWAP1 \t\t\t\n      REVERT \t\t\t\n    tag 219\t\t\t\n      JUMPDEST \t\t\t\n      JUMP \t\t\t\n    tag 220\t\t\t-License-Identifier: MIT\\nprag...\n      JUMPDEST \t\t\t-License-Identifier: MIT\\nprag...\n      PUSH 0\t\t\tmport \n      DUP2 \t\t\ten/ER\n      MLOAD \t\t\tts/token/ERC\n      SWAP1 \t\t\tin/contracts/token/ERC\n      POP \t\t\tin/contracts/token/ERC\n      SWAP2 \t\t\t-License-Identifier: MIT\\nprag...\n      SWAP1 \t\t\t-License-Identifier: MIT\\nprag...\n      POP \t\t\t-License-Identifier: MIT\\nprag...\n      JUMP \t\t\t-License-Identifier: MIT\\nprag...\n    tag 221\t\t\t;\\nimport \"@openzeppelin/contr...\n      JUMPDEST \t\t\t;\\nimport \"@openzeppelin/contr...\n      PUSH 0\t\t\tts/access/O\n      DUP3 \t\t\tBeldex\n      DUP3 \t\t\trac\n      MSTORE \t\t\t;\\n\\ncontract BeldexB\n      PUSH 20\t\t\tmsg.\n      DUP3 \t\t\tabl\n      ADD \t\t\t Ownable(msg.s\n      SWAP1 \t\t\tRC20, Pausable, Ownable(msg.s\n      POP \t\t\tRC20, Pausable, Ownable(msg.s\n      SWAP3 \t\t\t;\\nimport \"@openzeppelin/contr...\n      SWAP2 \t\t\t;\\nimport \"@openzeppelin/contr...\n      POP \t\t\t;\\nimport \"@openzeppelin/contr...\n      POP \t\t\t;\\nimport \"@openzeppelin/contr...\n      JUMP \t\t\t;\\nimport \"@openzeppelin/contr...\n    tag 222\t\t\t error DisabledRenounceOwnersh...\n      JUMPDEST \t\t\t error DisabledRenounceOwnersh...\n      PUSH 0\t\t\ti\n    tag 247\t\t\tue);\\n    event Burn(address i...\n      JUMPDEST \t\t\tue);\\n    event Burn(address i...\n      DUP4 \t\t\t Burn(\n      DUP2 \t\t\te\n      LT \t\t\t event Burn(a\n      ISZERO \t\t\tue);\\n    event Burn(address i...\n      PUSH [tag] 249\t\t\tue);\\n    event Burn(address i...\n      JUMPI \t\t\tue);\\n    event Burn(address i...\n      DUP1 \t\t\ti\n      DUP3 \t\t\t, s\n      ADD \t\t\tname, strin\n      MLOAD \t\t\tmory _name, string\n      DUP2 \t\t\tg\n      DUP5 \t\t\tstr\n      ADD \t\t\ttor(string \n      MSTORE \t\t\tonstructor(string memory _name...\n      PUSH 20\t\t\tfr\n      DUP2 \t\t\te\n      ADD \t\t\tndexed fro\n      SWAP1 \t\t\tess indexed fro\n      POP \t\t\tess indexed fro\n      PUSH [tag] 247\t\t\tue);\\n    event Burn(address i...\n      JUMP \t\t\tue);\\n    event Burn(address i...\n    tag 249\t\t\tue);\\n    event Burn(address i...\n      JUMPDEST \t\t\tue);\\n    event Burn(address i...\n      PUSH 0\t\t\t)\n      DUP5 \t\t\t, _sym\n      DUP5 \t\t\t_na\n      ADD \t\t\tC20(_name, _symb\n      MSTORE \t\t\t     ERC20(_name, _symbol)\\n\n      POP \t\t\tdress indexed to, uint256 valu...\n      POP \t\t\t error DisabledRenounceOwnersh...\n      POP \t\t\t error DisabledRenounceOwnersh...\n      POP \t\t\t error DisabledRenounceOwnersh...\n      JUMP \t\t\t error DisabledRenounceOwnersh...\n    tag 223\t\t\t \\n    }\\n\\n    function decim...\n      JUMPDEST \t\t\t \\n    }\\n\\n    function decim...\n      PUSH 0\t\t\ture ov\n      PUSH 1F\t\t\t  \n      NOT \t\t\t;\\n    }\n      PUSH 1F\t\t\tur\n      DUP4 \t\t\t    r\n      ADD \t\t\t        return\n      AND \t\t\t) {\\n        return 9;\\n    }\\...\n      SWAP1 \t\t\trns (uint8) {\\n        return ...\n      POP \t\t\trns (uint8) {\\n        return ...\n      SWAP2 \t\t\t \\n    }\\n\\n    function decim...\n      SWAP1 \t\t\t \\n    }\\n\\n    function decim...\n      POP \t\t\t \\n    }\\n\\n    function decim...\n      JUMP \t\t\t \\n    }\\n\\n    function decim...\n    tag 224\t\t\tn renounceOwnership() public p...\n      JUMPDEST \t\t\tn renounceOwnership() public p...\n      PUSH 0\t\t\t\\n  \n      PUSH [tag] 252\t\t\t external onlyOwner {\\n       ...\n      DUP3 \t\t\tuse()\n      PUSH [tag] 220\t\t\t external onlyOwner {\\n       ...\n      JUMP \t\t\t external onlyOwner {\\n       ...\n    tag 252\t\t\t external onlyOwner {\\n       ...\n      JUMPDEST \t\t\t external onlyOwner {\\n       ...\n      PUSH [tag] 253\t\t\ttion unpause() external onlyOw...\n      DUP2 \t\t\t   fun\n      DUP6 \t\t\t }\\n\n      PUSH [tag] 221\t\t\ttion unpause() external onlyOw...\n      JUMP \t\t\ttion unpause() external onlyOw...\n    tag 253\t\t\ttion unpause() external onlyOw...\n      JUMPDEST \t\t\ttion unpause() external onlyOw...\n      SWAP4 \t\t\t   function unpause() external...\n      POP \t\t\t   function unpause() external...\n      PUSH [tag] 254\t\t\t(address _to, uint256 _value) ...\n      DUP2 \t\t\twner {\n      DUP6 \t\t\tonl\n      PUSH 20\t\t\tPaus\n      DUP7 \t\t\twhenN\n      ADD \t\t\tnal whenNotPause\n      PUSH [tag] 222\t\t\t(address _to, uint256 _value) ...\n      JUMP \t\t\t(address _to, uint256 _value) ...\n    tag 254\t\t\t(address _to, uint256 _value) ...\n      JUMPDEST \t\t\t(address _to, uint256 _value) ...\n      PUSH [tag] 255\t\t\t);\\n        emit Mint(_to, _va\n      DUP2 \t\t\tto, _v\n      PUSH [tag] 223\t\t\t);\\n        emit Mint(_to, _va\n      JUMP \t\t\t);\\n        emit Mint(_to, _va\n    tag 255\t\t\t);\\n        emit Mint(_to, _va\n      JUMPDEST \t\t\t);\\n        emit Mint(_to, _va\n      DUP5 \t\t\tval\n      ADD \t\t\to, _value);\\n        emit Mint...\n      SWAP2 \t\t\tmint(_to, _value);\\n        em...\n      POP \t\t\tmint(_to, _value);\\n        em...\n      POP \t\t\t }\\n\\n    function pause() ext...\n      SWAP3 \t\t\tn renounceOwnership() public p...\n      SWAP2 \t\t\tn renounceOwnership() public p...\n      POP \t\t\tn renounceOwnership() public p...\n      POP \t\t\tn renounceOwnership() public p...\n      JUMP \t\t\tn renounceOwnership() public p...\n    tag 26\t\t\t    function burn(uint256 _val...\n      JUMPDEST \t\t\t    function burn(uint256 _val...\n      PUSH 0\t\t\tsg.s\n      PUSH 20\t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t }\\n}\n      SWAP1 \t\t\tue);\\n    }\\n}\n      POP \t\t\tue);\\n    }\\n}\n      DUP2 \t\t\t\n      DUP2 \t\t\t\n      SUB \t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      ADD \t\t\t\n      MSTORE \t\t\t\n      PUSH [tag] 257\t\t\t\n      DUP2 \t\t\t\n      DUP5 \t\t\t\n      PUSH [tag] 224\t\t\t\n      JUMP \t\t\t\n    tag 257\t\t\t\n      JUMPDEST \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t    function burn(uint256 _val...\n      SWAP2 \t\t\t    function burn(uint256 _val...\n      POP \t\t\t    function burn(uint256 _val...\n      POP \t\t\t    function burn(uint256 _val...\n      JUMP \t\t\t    function burn(uint256 _val...\n    tag 226\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      REVERT \t\t\t\n    tag 228\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\t\t\t\n      DUP3 \t\t\t\n      AND \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 229\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH [tag] 263\t\t\t\n      DUP3 \t\t\t\n      PUSH [tag] 228\t\t\t\n      JUMP \t\t\t\n    tag 263\t\t\t\n      JUMPDEST \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 230\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 265\t\t\t\n      DUP2 \t\t\t\n      PUSH [tag] 229\t\t\t\n      JUMP \t\t\t\n    tag 265\t\t\t\n      JUMPDEST \t\t\t\n      DUP2 \t\t\t\n      EQ \t\t\t\n      PUSH [tag] 266\t\t\t\n      JUMPI \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      REVERT \t\t\t\n    tag 266\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 231\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP2 \t\t\t\n      CALLDATALOAD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 268\t\t\t\n      DUP2 \t\t\t\n      PUSH [tag] 230\t\t\t\n      JUMP \t\t\t\n    tag 268\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 232\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP2 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 233\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 271\t\t\t\n      DUP2 \t\t\t\n      PUSH [tag] 232\t\t\t\n      JUMP \t\t\t\n    tag 271\t\t\t\n      JUMPDEST \t\t\t\n      DUP2 \t\t\t\n      EQ \t\t\t\n      PUSH [tag] 272\t\t\t\n      JUMPI \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      REVERT \t\t\t\n    tag 272\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 234\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP2 \t\t\t\n      CALLDATALOAD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 274\t\t\t\n      DUP2 \t\t\t\n      PUSH [tag] 233\t\t\t\n      JUMP \t\t\t\n    tag 274\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 29\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      PUSH 40\t\t\t\n      DUP4 \t\t\t\n      DUP6 \t\t\t\n      SUB \t\t\t\n      SLT \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 276\t\t\t\n      JUMPI \t\t\t\n      PUSH [tag] 277\t\t\t\n      PUSH [tag] 226\t\t\t\n      JUMP \t\t\t\n    tag 277\t\t\t\n      JUMPDEST \t\t\t\n    tag 276\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH [tag] 278\t\t\t\n      DUP6 \t\t\t\n      DUP3 \t\t\t\n      DUP7 \t\t\t\n      ADD \t\t\t\n      PUSH [tag] 231\t\t\t\n      JUMP \t\t\t\n    tag 278\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      PUSH 20\t\t\t\n      PUSH [tag] 279\t\t\t\n      DUP6 \t\t\t\n      DUP3 \t\t\t\n      DUP7 \t\t\t\n      ADD \t\t\t\n      PUSH [tag] 234\t\t\t\n      JUMP \t\t\t\n    tag 279\t\t\t\n      JUMPDEST \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 235\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP2 \t\t\t\n      ISZERO \t\t\t\n      ISZERO \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 236\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 282\t\t\t\n      DUP2 \t\t\t\n      PUSH [tag] 235\t\t\t\n      JUMP \t\t\t\n    tag 282\t\t\t\n      JUMPDEST \t\t\t\n      DUP3 \t\t\t\n      MSTORE \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 32\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 20\t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 284\t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      ADD \t\t\t\n      DUP5 \t\t\t\n      PUSH [tag] 236\t\t\t\n      JUMP \t\t\t\n    tag 284\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 237\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 286\t\t\t\n      DUP2 \t\t\t\n      PUSH [tag] 232\t\t\t\n      JUMP \t\t\t\n    tag 286\t\t\t\n      JUMPDEST \t\t\t\n      DUP3 \t\t\t\n      MSTORE \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 36\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 20\t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 288\t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      ADD \t\t\t\n      DUP5 \t\t\t\n      PUSH [tag] 237\t\t\t\n      JUMP \t\t\t\n    tag 288\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 39\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      PUSH 0\t\t\t\n      PUSH 60\t\t\t\n      DUP5 \t\t\t\n      DUP7 \t\t\t\n      SUB \t\t\t\n      SLT \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 290\t\t\t\n      JUMPI \t\t\t\n      PUSH [tag] 291\t\t\t\n      PUSH [tag] 226\t\t\t\n      JUMP \t\t\t\n    tag 291\t\t\t\n      JUMPDEST \t\t\t\n    tag 290\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH [tag] 292\t\t\t\n      DUP7 \t\t\t\n      DUP3 \t\t\t\n      DUP8 \t\t\t\n      ADD \t\t\t\n      PUSH [tag] 231\t\t\t\n      JUMP \t\t\t\n    tag 292\t\t\t\n      JUMPDEST \t\t\t\n      SWAP4 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      PUSH 20\t\t\t\n      PUSH [tag] 293\t\t\t\n      DUP7 \t\t\t\n      DUP3 \t\t\t\n      DUP8 \t\t\t\n      ADD \t\t\t\n      PUSH [tag] 231\t\t\t\n      JUMP \t\t\t\n    tag 293\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      PUSH 40\t\t\t\n      PUSH [tag] 294\t\t\t\n      DUP7 \t\t\t\n      DUP3 \t\t\t\n      DUP8 \t\t\t\n      ADD \t\t\t\n      PUSH [tag] 234\t\t\t\n      JUMP \t\t\t\n    tag 294\t\t\t\n      JUMPDEST \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      JUMP \t\t\t\n    tag 238\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH FF\t\t\t\n      DUP3 \t\t\t\n      AND \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 239\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 297\t\t\t\n      DUP2 \t\t\t\n      PUSH [tag] 238\t\t\t\n      JUMP \t\t\t\n    tag 297\t\t\t\n      JUMPDEST \t\t\t\n      DUP3 \t\t\t\n      MSTORE \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 45\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 20\t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 299\t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      ADD \t\t\t\n      DUP5 \t\t\t\n      PUSH [tag] 239\t\t\t\n      JUMP \t\t\t\n    tag 299\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 53\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 20\t\t\t\n      DUP3 \t\t\t\n      DUP5 \t\t\t\n      SUB \t\t\t\n      SLT \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 301\t\t\t\n      JUMPI \t\t\t\n      PUSH [tag] 302\t\t\t\n      PUSH [tag] 226\t\t\t\n      JUMP \t\t\t\n    tag 302\t\t\t\n      JUMPDEST \t\t\t\n    tag 301\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH [tag] 303\t\t\t\n      DUP5 \t\t\t\n      DUP3 \t\t\t\n      DUP6 \t\t\t\n      ADD \t\t\t\n      PUSH [tag] 234\t\t\t\n      JUMP \t\t\t\n    tag 303\t\t\t\n      JUMPDEST \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 60\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 20\t\t\t\n      DUP3 \t\t\t\n      DUP5 \t\t\t\n      SUB \t\t\t\n      SLT \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 305\t\t\t\n      JUMPI \t\t\t\n      PUSH [tag] 306\t\t\t\n      PUSH [tag] 226\t\t\t\n      JUMP \t\t\t\n    tag 306\t\t\t\n      JUMPDEST \t\t\t\n    tag 305\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH [tag] 307\t\t\t\n      DUP5 \t\t\t\n      DUP3 \t\t\t\n      DUP6 \t\t\t\n      ADD \t\t\t\n      PUSH [tag] 231\t\t\t\n      JUMP \t\t\t\n    tag 307\t\t\t\n      JUMPDEST \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 240\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 309\t\t\t\n      DUP2 \t\t\t\n      PUSH [tag] 229\t\t\t\n      JUMP \t\t\t\n    tag 309\t\t\t\n      JUMPDEST \t\t\t\n      DUP3 \t\t\t\n      MSTORE \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 70\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 20\t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 311\t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      ADD \t\t\t\n      DUP5 \t\t\t\n      PUSH [tag] 240\t\t\t\n      JUMP \t\t\t\n    tag 311\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 80\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      DUP1 \t\t\t\n      PUSH 40\t\t\t\n      DUP4 \t\t\t\n      DUP6 \t\t\t\n      SUB \t\t\t\n      SLT \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 313\t\t\t\n      JUMPI \t\t\t\n      PUSH [tag] 314\t\t\t\n      PUSH [tag] 226\t\t\t\n      JUMP \t\t\t\n    tag 314\t\t\t\n      JUMPDEST \t\t\t\n    tag 313\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH [tag] 315\t\t\t\n      DUP6 \t\t\t\n      DUP3 \t\t\t\n      DUP7 \t\t\t\n      ADD \t\t\t\n      PUSH [tag] 231\t\t\t\n      JUMP \t\t\t\n    tag 315\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      PUSH 20\t\t\t\n      PUSH [tag] 316\t\t\t\n      DUP6 \t\t\t\n      DUP3 \t\t\t\n      DUP7 \t\t\t\n      ADD \t\t\t\n      PUSH [tag] 231\t\t\t\n      JUMP \t\t\t\n    tag 316\t\t\t\n      JUMPDEST \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      SWAP3 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 241\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 4E487B7100000000000000000000000000000000000000000000000000000000\t\t\t\n      PUSH 0\t\t\t\n      MSTORE \t\t\t\n      PUSH 22\t\t\t\n      PUSH 4\t\t\t\n      MSTORE \t\t\t\n      PUSH 24\t\t\t\n      PUSH 0\t\t\t\n      REVERT \t\t\t\n    tag 88\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 2\t\t\t\n      DUP3 \t\t\t\n      DIV \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH 1\t\t\t\n      DUP3 \t\t\t\n      AND \t\t\t\n      DUP1 \t\t\t\n      PUSH [tag] 319\t\t\t\n      JUMPI \t\t\t\n      PUSH 7F\t\t\t\n      DUP3 \t\t\t\n      AND \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n    tag 319\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 20\t\t\t\n      DUP3 \t\t\t\n      LT \t\t\t\n      DUP2 \t\t\t\n      SUB \t\t\t\n      PUSH [tag] 320\t\t\t\n      JUMPI \t\t\t\n      PUSH [tag] 321\t\t\t\n      PUSH [tag] 241\t\t\t\n      JUMP \t\t\t\n    tag 321\t\t\t\n      JUMPDEST \t\t\t\n    tag 320\t\t\t\n      JUMPDEST \t\t\t\n      POP \t\t\t\n      SWAP2 \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 162\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH 60\t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 323\t\t\t\n      PUSH 0\t\t\t\n      DUP4 \t\t\t\n      ADD \t\t\t\n      DUP7 \t\t\t\n      PUSH [tag] 240\t\t\t\n      JUMP \t\t\t\n    tag 323\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 324\t\t\t\n      PUSH 20\t\t\t\n      DUP4 \t\t\t\n      ADD \t\t\t\n      DUP6 \t\t\t\n      PUSH [tag] 237\t\t\t\n      JUMP \t\t\t\n    tag 324\t\t\t\n      JUMPDEST \t\t\t\n      PUSH [tag] 325\t\t\t\n      PUSH 40\t\t\t\n      DUP4 \t\t\t\n      ADD \t\t\t\n      DUP5 \t\t\t\n      PUSH [tag] 237\t\t\t\n      JUMP \t\t\t\n    tag 325\t\t\t\n      JUMPDEST \t\t\t\n      SWAP5 \t\t\t\n      SWAP4 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    tag 242\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 4E487B7100000000000000000000000000000000000000000000000000000000\t\t\t\n      PUSH 0\t\t\t\n      MSTORE \t\t\t\n      PUSH 11\t\t\t\n      PUSH 4\t\t\t\n      MSTORE \t\t\t\n      PUSH 24\t\t\t\n      PUSH 0\t\t\t\n      REVERT \t\t\t\n    tag 210\t\t\t\n      JUMPDEST \t\t\t\n      PUSH 0\t\t\t\n      PUSH [tag] 328\t\t\t\n      DUP3 \t\t\t\n      PUSH [tag] 232\t\t\t\n      JUMP \t\t\t\n    tag 328\t\t\t\n      JUMPDEST \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      PUSH [tag] 329\t\t\t\n      DUP4 \t\t\t\n      PUSH [tag] 232\t\t\t\n      JUMP \t\t\t\n    tag 329\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      POP \t\t\t\n      DUP3 \t\t\t\n      DUP3 \t\t\t\n      ADD \t\t\t\n      SWAP1 \t\t\t\n      POP \t\t\t\n      DUP1 \t\t\t\n      DUP3 \t\t\t\n      GT \t\t\t\n      ISZERO \t\t\t\n      PUSH [tag] 330\t\t\t\n      JUMPI \t\t\t\n      PUSH [tag] 331\t\t\t\n      PUSH [tag] 242\t\t\t\n      JUMP \t\t\t\n    tag 331\t\t\t\n      JUMPDEST \t\t\t\n    tag 330\t\t\t\n      JUMPDEST \t\t\t\n      SWAP3 \t\t\t\n      SWAP2 \t\t\t\n      POP \t\t\t\n      POP \t\t\t\n      JUMP \t\t\t\n    .data\n"
}
export default matrixAbi;
