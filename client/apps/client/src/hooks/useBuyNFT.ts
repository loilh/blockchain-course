import { ethers } from 'ethers';
import { useMutation } from '@tanstack/react-query';
import { CONTRACT_ADDRESSES } from '../constants/env';
import { usePublicClient, useWalletClient } from 'wagmi';
import { MarketPlace__factory } from '../../../../library/typechain/src/factories/contracts';

export const useBuyNFT = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient()

  return useMutation({
    mutationFn: async ({
      contractAddress,
      tokenId,
      price,
    }: {
      contractAddress: string;
      tokenId: number;
      price: string;
    }) => {
      if (!walletClient || !publicClient) throw new Error('No wallet connected');
      const contract = MarketPlace__factory.connect(
        CONTRACT_ADDRESSES.MARKETPLACE_ADDRESS as `0x${string}`
      );
      const tx = await walletClient.sendTransaction({
        to: CONTRACT_ADDRESSES.MARKETPLACE_ADDRESS as `0x${string}`,
        data: contract.interface.encodeFunctionData('buy', [
          contractAddress,
          tokenId,
        ]) as `0x${string}`,
        value: ethers.parseEther(price) as unknown as bigint,
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      console.log('🚀 ~ mutationFn: ~ receipt:', receipt);

      return tx;
    },
  });
};
