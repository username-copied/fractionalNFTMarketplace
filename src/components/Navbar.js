import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Logo from "../assets/Logo.jpeg";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
// import { Button } from "@material-tailwind/react";

function TopBar() {
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");
  const [navbar, setNavbar] = useState(false);
  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x5") {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname);
      });
  }

  useEffect(() => {
    let val = window.ethereum.isConnected();
    if (val) {
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname);
    });
  });

  return (
    <div className="">
      <nav className="w-screen">
        <div className="flex justify-around items-center h-24 max-w-[1240px] mx-auto px-4 w-[100vw] p-4 m-4 rounded-lg md:bg-[#000300] text-white">
          <Link to="/">
            <div className="flex justify-center items-center">
              <img
                className="h-16 rounded-2xl shadow-2xl"
                src={Logo}
                alt="Logo"
              />
              <span className="bg-gradient-to-r from-green-400 to-blue-500 p-4">
                AnimeSpace
              </span>
            </div>
          </Link>
          <ul className="hidden md:flex justify-items-center items-center justify-around ">
            <>
              <li className="p-4">
                <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  font-bold py-2 px-4 rounded text-sm mt-1">
                  <Link to="/">Marketplace</Link>
                </button>
              </li>
            </>
            <>
              <li className="p-4">
                <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  font-bold py-2 px-4 rounded text-sm mt-1">
                  <Link to="/sellNFT">List My NFT</Link>
                </button>
              </li>
            </>
            <>
              <li className="">
                <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  font-bold py-2 px-4 rounded text-sm mt-1">
                  <Link to="/profile">Profile</Link>
                </button>
              </li>
            </>
            <li className="p-4">
              <button
                className="enableEthereumButton bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  font-bold py-2 px-4 rounded text-sm mt-1"
                onClick={connectWebsite}
              >
                {connected ? "Connected" : "Connect Wallet"}
              </button>
            </li>
          </ul>
          <div
            onClick={handleNav}
            className="block md:hidden bg-[#2196f3] rounded-xl mr-2 p-4"
          >
            {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
          </div>
          <ul
            className={
              nav
                ? "fixed left-0 top-0 w-[75%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
                : "ease-in-out duration-500 fixed left-[-100%]"
            }
          >
            <Link to="/">
              <img
                className="h-16 rounded-2xl shadow-2xl"
                src={Logo}
                alt="Logo"
              />
            </Link>
            <li className="p-4 border-b border-gray-600">
              <Link to="/">Marketplace</Link>{" "}
            </li>
            <li className="p-4 border-b border-gray-600">
              <Link to="/sellNFT">List My NFT</Link>
            </li>
            <li className="p-4 border-b border-gray-600">
              <Link to="/profile">Profile</Link>
            </li>
            <li className="p-4">
              <button
                className="enableEthereumButton bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded text-sm mt-1"
                onClick={connectWebsite}
              >
                {connected ? "Connected" : "Connect Wallet"}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default TopBar;