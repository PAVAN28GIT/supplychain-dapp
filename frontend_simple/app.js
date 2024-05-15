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
        const contractAddress = "0x5bd1CfF70267A91A4bba5D4AcC6eD7A0906D634d"; // Replace with your actual contract address
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

async function getProductStatus() {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x5bd1CfF70267A91A4bba5D4AcC6eD7A0906D634d"; // Replace with your actual contract address
    const contractABI = await fetchContractABI();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const productId = document.getElementById("statusProductId").value;

    try {
        const productStatus = await contract.getStatus(productId);
        document.getElementById("productStatus").innerText = "Status: " + productStatus;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function getProductInfo() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x5bd1CfF70267A91A4bba5D4AcC6eD7A0906D634d"; // Replace with your actual contract address
    const contractABI = await fetchContractABI();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const productId = document.getElementById("infoProductId").value;

    try {
        const productInfo = await contract.getInfo(productId);
        document.getElementById("productInfo").innerText = JSON.stringify(productInfo);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function getTotalProducts() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x5bd1CfF70267A91A4bba5D4AcC6eD7A0906D634d"; // Replace with your actual contract address
    const contractABI = await fetchContractABI();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
        const totalProducts = await contract.getTotalProducts();
        alert("Total number of products: " + totalProducts);
    } catch (error) {
        console.error("Error:", error);
    }
}

document.getElementById("getTotalProductsBtn").addEventListener("click", getTotalProducts);


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
