import TopBar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";

export default function SellNFT () {
    const [formParams, updateFormParams] = useState({ name: '', description: '', pricePerShare: '',totalShares: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();


    // async function OnChangeFile(e) {
    //     var file = e.target.files[0];
    //     //check for file extension
    //     try {
    //         //upload the file to IPFS
    //         // disableButton();
    //         updateMessage("Uploading image.. please dont click anything!")
    //         const response = await uploadFileToIPFS(file);
    //         if(response.success === true) {
    //             // enableButton();
    //             updateMessage("")
    //             console.log("Uploaded image to Pinata: ", response.pinataURL)
    //             setFileURL(response.pinataURL);
    //         }
    //     }
    //     catch(e) {
    //         console.log("Error during file upload", e);
    //     }
    // }

    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
          //upload the file to IPFS
          const response = await uploadFileToIPFS(file);
          if (response.success === true) {
            console.log("Uploaded image to Pinata: ", response.pinataURL);
            setFileURL(response.pinataURL);
          }
        } catch (e) {
          console.log("Error during file upload", e);
        }
      }
    

    async function uploadMetadataToIPFS() {
        const { name, description, pricePerShare, totalShares } = formParams;

        if (!name || !description || !pricePerShare || !totalShares || !fileURL) return;
        const nftJSON = {
            name, description, pricePerShare, totalShares, image: fileURL,
        };
        try {
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                console.log("Uploaded metadata to Pinata");
                console.log(response);
                return response.pinataURL;
            }
        } catch (error) {
            alert(error);
        }
    }


    // async function listNFT(e) {
    //     e.preventDefault();
    //     try {
    //         // const metedataURL = await uploadMetadataToIPFS();
    //         await uploadMetadataToIPFS();
    //         const metedataURL = fileURL;
    //         const provider = new ethers.providers.Web3Provider(window.ethereum);
    //         await provider.send('eth_requestAccounts', []);
    //         const signer = provider.getSigner();
            
    //         updateMessage("Please Wait");

    //         let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
    //         // let pricePS = ethers.utils.parseUnits(formParams.pricePerShare, 'ether');
    //         let pricePS = formParams.pricePerShare;
    //         // pricePS = pricePS.toString();
    //         const x = parseInt(pricePS);
    //         console.log(typeof(x));
    //         // let listPrice = await contract.getListPrice();
    //         // let listPrice = formParams.pricePerShare;
    //         // console.log(1);
    //         // const noOfShares = await contract.getTotalShares(metedataURL);
    //         let noOfShares = formParams.totalShares;
    //         // console.log(2);
    //         // listPrice = listPrice.toString();
    //         // noOfShares = noOfShares.toString();
    //         console.log(metedataURL);
    //         console.log(x);
    //         console.log(noOfShares);
    //         let transaction = await contract.createFractionalToken(metedataURL, x, noOfShares);

    //         await transaction.wait();

    //         alert("Succesfully uploaded your NFT");
    //         updateMessage("");
    //         updateFormParams({ name: '', description: '', pricePerShare: '', totalShares: '' });
    //         window.location.replace("/");
    //     } catch (error) {
    //         alert(error); 
    //     }
    // }

    
    async function listNFT(e) {
        e.preventDefault();
    
        //Upload data to IPFS
        try {
            // const metadataURL = await uploadMetadataToIPFS();
            // console.log(metadataURL);
            await uploadMetadataToIPFS();
          //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
          const signer = provider.getSigner();
          updateMessage("Please wait.. uploading (upto 5 mins)");
    
          //Pull the deployed contract instance
          let contract = new ethers.Contract(
            Marketplace.address,
            Marketplace.abi,
            signer
          );
    
          //massage the params to be sent to the create NFT request
          const price = ethers.utils.parseUnits(formParams.pricePerShare, "ether");
          const noOfShares = ethers.utils.parseUnits(formParams.totalShares, "ether");
        //   let listingPrice = await contract.getListPrice();
        //   listingPrice = listingPrice.toString();
    
          //actually create the NFT
          let transaction = await contract.createFractionalToken(fileURL, price, noOfShares);
          await transaction.wait();
    
          alert("Successfully listed your NFT!");
          updateMessage("");
          updateFormParams({ name: "", description: "", pricePerShare: "",totalShares:"" });
          window.location.replace("/");
        } catch (e) {
          alert("Upload error" + e);
        }
      }
    


    return (
        <div className="">
        <TopBar></TopBar>
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
            <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
            <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT to the marketplace</h3>
                <div className="mb-4">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                </div>
                <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Axie Infinity Collection" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                </div>
                <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price Per Share (in ETH)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.001 ETH" step="0.01" value={formParams.pricePerShare} onChange={e => updateFormParams({...formParams, pricePerShare: e.target.value})}></input>
                </div>
                <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Total Shares </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 1" step="0.01" value={formParams.totalShares} onChange={e => updateFormParams({...formParams, totalShares: e.target.value})}></input>
                </div>
                <div>
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image (&lt;500 KB)</label>
                    <input type={"file"} onChange={OnChangeFile}></input>
                </div>
                <br></br>
                <div className="text-red-500 text-center">{message}</div>
                <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg" id="list-button">
                    List NFT
                </button>
            </form>
        </div>
        </div>
    )
}