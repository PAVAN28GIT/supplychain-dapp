// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Tracking {
    enum PackageStatus {
        AtCreator,
        Picked,
        Delivered
    }

    struct Product {
        string rawMaterial;
        string farmerName;
        string location;
        uint quantity;
        uint costPerKg;
        address manufacturer;
        address shipper;
        address supplier;
        PackageStatus status;
    }

    mapping(uint => Product) public products;
    uint public totalProducts;

    event ShipmentUpdate(
        uint indexed productId,
        address indexed sender,
        address indexed reciver,
        uint status
    );

    // Constructor to set the owner
    constructor() {
        totalProducts = 0;
    }

    function addProduct(
        string memory rawMaterial,
        string memory farmerName,
        string memory location,
        uint quantity,
        uint costPerKg,
        address manufacturer,
        address shipper,
        address supplier
    ) public {
        totalProducts++;
        products[totalProducts] = Product(
            rawMaterial,
            farmerName,
            location,
            quantity,
            costPerKg,
            manufacturer,
            shipper,
            supplier,
            PackageStatus.AtCreator
        );
    }

    function getInfo(
        uint productId
    )
        public
        view
        returns (
            string memory rawMaterial,
            string memory farmerName,
            string memory location,
            uint quantity,
            uint costPerKg,
            address manufacturer,
            address shipper,
            address supplier
        )
    {
        Product memory product = products[productId];
        return (
            product.rawMaterial,
            product.farmerName,
            product.location,
            product.quantity,
            product.costPerKg,
            product.manufacturer,
            product.shipper,
            product.supplier
        );
    }

    function getStatus(uint productId) public view returns (uint) {
        return uint(products[productId].status);
    }

    function getRawMaterials(
        uint productId
    ) public view returns (string memory) {
        return products[productId].rawMaterial;
    }

    function getTotalProducts() public view returns (uint) {
        return totalProducts;
    }

    function pickPackage(uint productId, address shpr) public {
        require(
            products[productId].status == PackageStatus.AtCreator,
            "Package must be at Supplier."
        );
        require(
            shpr == products[productId].shipper,
            "Invalid shipper address."
        );

        products[productId].status = PackageStatus.Picked;
        emit ShipmentUpdate(
            productId,
            products[productId].manufacturer,
            shpr,
            1
        );
    }

    function receivedPackage(uint productId, address supl) public {
        require(
            products[productId].status == PackageStatus.Picked,
            "Product not picked up yet"
        );
        require(
            supl == products[productId].supplier,
            "Invalid Supplier address."
        );

        products[productId].status = PackageStatus.Delivered;
        emit ShipmentUpdate(productId, products[productId].shipper, supl, 2);
    }
}

// TockenModule#Tracking - 0x60C07037aef5E474A2D85fb080c51950722B361c
