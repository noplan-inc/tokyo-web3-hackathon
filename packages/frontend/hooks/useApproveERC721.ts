import { useContractWrite, usePrepareContractWrite,  } from "wagmi";
import { abi }  from "./abi/ERC721";

export const useApproveERC721 = (address: any, tokenId: any) => {
  const {config}  = usePrepareContractWrite({
    address: "0x9801cc0d4a49181523afb811ae1d5036170fe445",
    chainId: 5,
    abi: abi,
    functionName: "approve",
    args: [address, tokenId],
  });
  return useContractWrite(config)
};
