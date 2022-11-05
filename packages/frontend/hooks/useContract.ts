import { useContractWrite, usePrepareContractWrite, useContractReads } from "wagmi";
import { BigNumber } from "ethers";
import { abi as erc20Abi } from "../abi/ERC20";
import { abi as WebmaTokenAbi } from "../abi/WebmaToken";
import { abi as webmaSwapAbi } from "../abi/WebmaSwap";

export const useApproveERC20 = (address: any, amount: any) => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_ERC20_ADDRESS,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    abi: erc20Abi,
    functionName: "approve",
    args: [address, amount],
  });
  return useContractWrite(config);
};

export const useApproveWebmaToken = (address: any, tokenId: any) => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_WEBMA_TOKEN_ADDRESS,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    abi: WebmaTokenAbi,
    functionName: "approve",
    args: [address, tokenId],
  });
  return useContractWrite(config);
};

export const useOpen = (tokenId: any, erc20: any, price: any) => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_WEBMA_SWAP_ADDRESS,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    abi: webmaSwapAbi,
    functionName: "open",
    args: [tokenId, erc20, price],
  });
  return useContractWrite(config);
};

export const useClose = (tokenId: any) => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_WEBMA_SWAP_ADDRESS,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    abi: webmaSwapAbi,
    functionName: "close",
    args: [tokenId],
  });
  return useContractWrite(config);
};

export const useFulfill = (tokenId: any) => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_WEBMA_SWAP_ADDRESS,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    abi: webmaSwapAbi,
    functionName: "fulfill",
    args: [tokenId],
  });
  return useContractWrite(config);
};

export const useGetLastTokenId = () => {
  return useContractReads({
    contracts: [
      {
        address: process.env.NEXT_PUBLIC_WEBMA_TOKEN_ADDRESS,
        abi: WebmaTokenAbi,
        functionName: "getLastTokenId",
      },
    ],
  });
};

export const useGetSwap = (tokenId: number) => {
  return useContractReads({
    contracts: [
      {
        address: process.env.NEXT_PUBLIC_WEBMA_SWAP_ADDRESS,
        abi: webmaSwapAbi,
        functionName: "getSwap",
        args: [BigNumber.from(tokenId)],
      },
    ],
  });
};