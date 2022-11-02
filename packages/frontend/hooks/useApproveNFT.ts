import { useContractWrite, usePrepareContractWrite,  } from "wagmi";
import { abi }  from "./abi/ERC721";
import { BigNumber } from 'ethers'

export const useApproveNFT = (address: any, tokenId: any) => {
  const {config}  = usePrepareContractWrite({
    address: "0x9801cc0d4a49181523afb811ae1d5036170fe445",
    chainId: 5,
    abi: abi,
    functionName: "approve",
    args: [address, tokenId],
  });
  return useContractWrite(config)
};
