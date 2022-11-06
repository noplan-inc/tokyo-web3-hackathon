import { useContractWrite, usePrepareContractWrite, useContractReads } from "wagmi";
import { BigNumber } from "ethers";
import { abi as erc20Abi } from "../abi/ERC20";
import { abi as WebmaTokenAbi } from "../abi/WebmaToken";
import { abi as webmaSwapAbi } from "../abi/WebmaSwap";
import { useEffect, useState, } from 'react'

export const useApproveERC20 = (ownerAddress: any, erc20Address: any, amount: any) => {
  const { config } = usePrepareContractWrite({
    address: erc20Address,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    abi: erc20Abi,
    functionName: "approve",
    args: [ownerAddress, amount],
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

export const useOpen = (tokenId: any, erc20: any, price: any, enabled: any) => {
  const debouncedTokenId = useDebounce(tokenId, 500)
  const debouncedErc20 = useDebounce(erc20, 500)
  const debouncedPrice = useDebounce(price, 500)
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_WEBMA_SWAP_ADDRESS,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    abi: webmaSwapAbi,
    functionName: "open",
    args: [debouncedTokenId, debouncedErc20, debouncedPrice],
    enabled: enabled
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

export const useFulfill = (tokenId: any, enabled: any) => {
  const debouncedTokenId = useDebounce(tokenId, 500)
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_WEBMA_SWAP_ADDRESS,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    abi: webmaSwapAbi,
    functionName: "fulfill",
    args: [debouncedTokenId],
    enabled: enabled
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

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
