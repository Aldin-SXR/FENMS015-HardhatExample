// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract GardeningClub {
    struct Plant {
        string name;
        uint256 lastWatered;
        address owner;
    }

    Plant[] public plants;
    mapping(address => uint256[]) public ownerPlants;

    event PlantAdded(uint256 plantId, string name, address indexed owner);
    event PlantWatered(uint256 plantId, address indexed owner);

    function addPlant(string memory name) public {
        require(bytes(name).length > 0, "Plant name cannot be empty");
        plants.push(Plant({
            name: name,
            lastWatered: block.timestamp,
            owner: msg.sender
        }));
        uint256 plantId = plants.length - 1;
        ownerPlants[msg.sender].push(plantId);

        emit PlantAdded(plantId, name, msg.sender);
    }

    function waterPlant(uint256 plantId) public {
        require(plantId < plants.length, "Invalid plant ID");
        Plant storage plant = plants[plantId];
        require(plant.owner == msg.sender, "You do not own this plant");

        plant.lastWatered = block.timestamp;

        emit PlantWatered(plantId, msg.sender);
    }

    function getPlant(uint256 plantId) public view returns (string memory name, uint256 lastWatered, address owner) {
        require(plantId < plants.length, "Invalid plant ID");
        Plant memory plant = plants[plantId];
        return (plant.name, plant.lastWatered, plant.owner);
    }

    function getMyPlants() public view returns (uint256[] memory) {
        return ownerPlants[msg.sender];
    }
}