"use client";

import { useEffect, useState } from "react";
import MyNFTAbi from "../../hardhat/artifacts/contracts/MyNFT.sol/MyNFT.json";
import { ethers } from "ethers";

const nftAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // 替换成部署出来的地址

export default function NFTList() {
  const [nfts, setNfts] = useState<number[]>([]);
  const [account, setAccount] = useState<string>("");

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) return alert("请先安装 MetaMask");
    const [acc] = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(acc);
  };

  // 获取 NFT 列表
  const fetchNFTs = async () => {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(nftAddress, MyNFTAbi.abi, provider);
    const total = await contract.nextTokenId();
    setNfts(Array.from({ length: total.toNumber() }, (_, i) => i));
  };

  // 铸造 NFT
  const mintNFT = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(nftAddress, MyNFTAbi.abi, signer);
    const tx = await contract.mint(account);
    await tx.wait();
    fetchNFTs();
  };

  // 转移 NFT
  const transferNFT = async (tokenId: number, to: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(nftAddress, MyNFTAbi.abi, signer);
    const tx = await contract["safeTransferFrom(address,address,uint256)"](account, to, tokenId);
    await tx.wait();
    fetchNFTs();
  };

  useEffect(() => {
    if (account) fetchNFTs();
  }, [account]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex gap-4 mb-6">
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          {account ? `已连接: ${account.slice(0, 6)}...` : "连接钱包"}
        </button>
        <button onClick={mintNFT} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
          铸造 NFT
        </button>
      </div>

      <h3 className="text-xl font-bold mb-4">我的 NFT 收藏</h3>
      <div className="grid grid-cols-2 gap-4">
        {nfts.map(id => (
          <div key={id} className="border p-4 rounded-lg shadow">
            <div className="text-lg font-semibold">NFT #{id}</div>
            <div className="mt-2 text-sm text-gray-500">拥有者: {account.slice(0, 6)}...</div>
            <button
              className="mt-3 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => {
                const to = prompt("请输入接收地址:");
                if (to) transferNFT(id, to);
              }}
            >
              转移
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
