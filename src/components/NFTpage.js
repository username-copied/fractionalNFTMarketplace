import TopBar from "./Navbar";
// import axie from "../tile.jpeg";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";

export default function NFTPage(props) {
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");

  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    console.log(tokenURI);
    const listedToken = await contract.getTokenData(tokenId);
    console.log(listedToken);
    let meta = await axios.get(tokenURI);

    console.log(meta);
    console.log(meta.data);
    console.log(typeof(meta.data));
    meta = meta.data;

    let item = {
      pricePerShare: listedToken.pricePerShare,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: listedToken.URI,
      name: meta.name,
      description: meta.description,
      totalShares: listedToken.totalShares,
      availableShares: listedToken.availableShares,
    };

    console.log(item.tokenId);
    updateData(item);
    console.log(typeof(item));
    item = JSON.stringify(item);
    item = JSON.parse(item);
    console.log(item);
    updateDataFetched(true);
    console.log("121212");
    updateCurrAddress(addr);
  }

  async function buyNFT(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(data.pricePerShare, "ether");
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.executeFractionalPurchase(tokenId, {
        value: salePrice,
      },1);
      await transaction.wait();

      alert("You successfully bought the NFT!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  const location = useLocation();
  const path = location.pathname.split("/")[2];
  if (path) {
    getNFTData(path);
  }
  

  return (
    <div style={{ "min-height": "100vh" }}>
      <TopBar />
      <div className="flex flex-col md:flex-row justify-center items-center justify-items-center ml-20 mt-20">
        <img src={data.image} alt="" className="w-2/5" />
        <div className="text-xl ml-20 md:mx-auto space-y-8 text-[#9d34b6] shadow-2xl rounded-lg border-2 p-5">
          <div>Name: Board Ape Yatch{data.name}</div>
          <div>Description: Board Ape Yatch #1{data.description}</div>
          <div>
            Price Per Share: <span className="">{parseInt(data.pricePerShare?._hex)/Math.pow(10,18) + " ETH"}</span>
          </div>
          <div>Total Numver of Shares: {parseInt(data.totalShares?._hex)/Math.pow(10,18)}</div>
          <div>Available Shares: {parseInt(data.availableShares?._hex)/Math.pow(10,18)}</div>
          <div>
            Owner: <span className="text-sm">0xa7d116C06FD1b56454B7D5e73a43E701B7E921d1{data.owner}</span>
          </div>
          <div>
            Seller: <span className="text-sm">0xa7d116C06FD1b56454B7D5e73a43E701B7E921d1{data.seller}</span>
          </div>
          <div>
            {/* {currAddress == data.owner || currAddress == data.seller ? (
              <div className="text-emerald-700">
                You are the owner of this NFT
              </div>
            ) : (
              <button
                className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-[#9d34b6] font-bold py-2 px-4 rounded text-sm"
                onClick={() => buyNFT(path)}
              >
                Buy this NFT
              </button>
            )}

            <div className="text-green text-center mt-3">{message}</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}