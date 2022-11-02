import { useContractWrite, usePrepareContractWrite } from "wagmi";
import abi from "./abi/ERC721.json";

export const useApproveNFT = (address: string, tokenId: number) => {
  const config: any = usePrepareContractWrite({
    address: "0x9801cc0d4a49181523afb811ae1d5036170fe445",
    abi: abi,
    functionName: "approve",
    args: [address, tokenId],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config.config);
};
