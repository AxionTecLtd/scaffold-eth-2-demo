import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  // 获取部署账户
  const { deployer } = await getNamedAccounts();

  // 部署 MyNFT 合约，只传 initialOwner 一个参数
  const myNFT = await deploy("MyNFT", {
    from: deployer,
    args: [deployer], // <--- initialOwner
    log: true,
  });

  console.log("✅ MyNFT deployed at:", myNFT.address);
};

export default func;
func.tags = ["MyNFT"];
