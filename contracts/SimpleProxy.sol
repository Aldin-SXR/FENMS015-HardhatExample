// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

contract SimpleProxy {
    
    address public proxyOwner;
    address public implementation;

    constructor(address implementation) public {
        proxyOwner = msg.sender;
        _setImplementation(implementation);
    }

    modifier onlyProxyOwner() {
        require(msg.sender == proxyOwner);
        _;
    }

    function upgrade(address implementation) external onlyProxyOwner {
        _setImplementation(implementation);
    }

    function _setImplementation(address imp) private {
        implementation = imp;
    }

    fallback() payable external {
        address impl = implementation;

        assembly {
            let ptr := 0
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(0, 0, size)

            switch result
            case 0 { revert(0, size) }
            default { return(0, size) }
        }
    }
}