// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Lightsaber {
    uint battery;
    string color;
    address owner;
    bool activated;

    event LightsaberActivated(address owner);
    event LightsaberDeactivated(address owner);
    event LightsaberSwing(address owner, uint battery);
    event LightsaberRecharged(uint battery);

    modifier onlyOwner {
        require(msg.sender == owner, "Only the wielder can use the lightsaber.");
        _;
    }

    // necessary change for upgradeability
    function initialize(string memory _color) external {
        color = _color;
        battery = 100;
        owner = msg.sender;
    }

    // before upgradeable
    // constructor(string memory _color) {
    //     color = _color;
    //     battery = 100;
    //     owner = msg.sender;
    // }

    function activateLightsaber() external onlyOwner {
        require(!activated, "Lightsaber is already activated!");
        // require(msg.sender == owner, "Only the wielder can use the lightsaber.");

        activated = true;
        emit LightsaberActivated(msg.sender);
    }

    function deactivateLightsaber() external onlyOwner {
        require(activated, "Lightsaber is not activated!");

        activated = false;
        emit LightsaberDeactivated(msg.sender);
    }

    function swingLightsaber() external onlyOwner {
        require(activated, "Lightsaber is not activated!");
        battery -= 1;
        emit LightsaberSwing(msg.sender, battery);
    }

    function rechargeBattery(uint _amount) external onlyOwner {
        battery += _amount;
        if (battery > 100) {
            battery = 100;
        }

        emit LightsaberRecharged(battery);
    }

    function getBatteryLevel() external view returns (uint256) {
        return battery;
    }
}