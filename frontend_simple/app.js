// 0x5bd1CfF70267A91A4bba5D4AcC6eD7A0906D634d
async function fetchContractABI() {
    const response = await fetch('TrackingABI.json');
    const data = await response.json();
    return data.abi; // Return only the ABI array
}

async function addProduct(rawMaterial, farmerName, location, quantity, costPerKg, manufacturer, shipper, supplier) {
    if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask to interact with this website.");
        return;
    }

    try {
        // Request permission to access user's MetaMask accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "0x60C07037aef5E474A2D85fb080c51950722B361c"; // Replace with your actual contract address
        const contractABI = await fetchContractABI();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Convert quantity and costPerKg to BigNumber
        quantity = ethers.BigNumber.from(quantity);
        costPerKg = ethers.BigNumber.from(costPerKg);

        // Perform transaction
        const tx = await contract.addProduct(rawMaterial, farmerName, location, quantity, costPerKg, manufacturer, shipper, supplier);
        await tx.wait(); // Wait for the transaction to be mined

        alert("Product added successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error adding product. See console for details.");
    }
}


document.getElementById("addProductForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const rawMaterial = document.getElementById("rawMaterial").value;
    const farmerName = document.getElementById("farmerName").value;
    const location = document.getElementById("location").value;
    const quantity = document.getElementById("quantity").value;
    const costPerKg = document.getElementById("costPerKg").value;
    const manufacturer = document.getElementById("manufacturer").value;
    const shipper = document.getElementById("shipper").value;
    const supplier = document.getElementById("supplier").value;
    addProduct(rawMaterial, farmerName, location, quantity, costPerKg, manufacturer, shipper, supplier);
});

const PackageStatus = {
    0: "AtCreator",
    1: "Picked",
    2: "Delivered"
};


async function getProductStatus() {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x60C07037aef5E474A2D85fb080c51950722B361c"; // Replace with your actual contract address
    const contractABI = await fetchContractABI();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const productId = document.getElementById("statusProductId").value;

    try {
        const productStatusValue = await contract.getStatus(productId);
        const productStatus = PackageStatus[productStatusValue]; // Convert integer to enum value
        document.getElementById("productStatus").innerText = "Status: " + productStatus;

    } catch (error) {
        console.error("Error:", error);
    }
}


async function getProductInfo() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x60C07037aef5E474A2D85fb080c51950722B361c"; // Replace with your actual contract address
    const contractABI = await fetchContractABI();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const productId = document.getElementById("infoProductId").value;

    try {
        const productInfo = await contract.getInfo(productId);
        const productStatusValue = await contract.getStatus(productId);
        const productStatus = PackageStatus[productStatusValue];
        const formattedProductInfo = `
            Raw Material: ${productInfo.rawMaterial} <br>
            Farmer Name: ${productInfo.farmerName} <br>
            Location: ${productInfo.location} <br>
            Quantity: ${productInfo.quantity} kg <br>
            Cost Per Kg: ${productInfo.costPerKg} <br>
            Manufacturer Address: ${productInfo.manufacturer} <br>
            Shipper Address: ${productInfo.shipper} <br>
            Supplier Address: ${productInfo.supplier} <br>
            Package Status: ${productStatus}
        `;
        document.getElementById("productInfo").innerHTML = formattedProductInfo;
    } catch (error) {
        console.error("Error:", error);
    }
}


async function pickPackage(productId, shipper) {
    if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask to interact with this website.");
        return;
    }

    try {
        // Request permission to access user's MetaMask accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "0x60C07037aef5E474A2D85fb080c51950722B361c"; // Replace with your actual contract address
        const contractABI = await fetchContractABI();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Perform transaction to pick package
        const tx = await contract.pickPackage(productId, shipper);
        await tx.wait(); // Wait for the transaction to be mined

        alert("Package picked successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error picking package. See console for details.");
    }
}

async function receivedPackage(productId, supplier) {
    if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask to interact with this website.");
        return;
    }

    try {
        // Request permission to access user's MetaMask accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "0x60C07037aef5E474A2D85fb080c51950722B361c"; // Replace with your actual contract address
        const contractABI = await fetchContractABI();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Perform transaction to mark package as received
        const tx = await contract.receivedPackage(productId, supplier);
        await tx.wait(); // Wait for the transaction to be mined

        alert("Package received successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error receiving package. See console for details.");
    }
}

document.getElementById("pickPackageBtn").addEventListener("click", function() {
    const productId = document.getElementById("pickProductId").value;
    const shipper = document.getElementById("pickShipper").value;
    pickPackage(productId, shipper);
});

document.getElementById("receivedPackageBtn").addEventListener("click", function() {
    const productId = document.getElementById("receivedProductId").value;
    const supplier = document.getElementById("receivedSupplier").value;
    receivedPackage(productId, supplier);
});

// this will not work rn because when smart contract was deployed u did not have event feature



// Function to update the table with product details
function updateProductTable(product) {
    const tableBody = document.getElementById("productTableBody");

    // Create a new row for the product
    const newRow = document.createElement("tr");

    // Add product details to the row
    newRow.innerHTML = `
        <td>${product.productId}</td>
        <td>${product.rawMaterial}</td>
        <td>${product.farmerName}</td>
        <td>${new Date(product.timestamp * 1000).toLocaleString()}</td>
        <td>${product.status}</td>
    `;

    // Append the row to the table body
    tableBody.appendChild(newRow);
}

// Event listener for the ProductAdded event
contract.on("ProductAdded", (productId, rawMaterial, farmerName, location, quantity, costPerKg, manufacturer, shipper, supplier, status, event) => {
    const product = {
        productId: productId.toNumber(),
        rawMaterial: rawMaterial,
        farmerName: farmerName,
        timestamp: event.blockTimestamp.toNumber(),
        status: status
    };

    // Update the table with the new product details
    updateProductTable(product);
});
