import { useContractWrite, usePrepareContractWrite,  } from "wagmi";
import { abi }  from "./abi/ERC20";

export const useApproveERC20 = (address: any, amount: any) => {
  const {config}  = usePrepareContractWrite({
    address: "0x2f4b987fcd58d1256815c6852c0bfa6d66924f85",
    chainId: 5,
    abi: abi,
    functionName: "approve",
    args: [address, amount],
  });
  return useContractWrite(config)
};
