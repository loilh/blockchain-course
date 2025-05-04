import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ListedNFT as ListedNFTType, useListNFT } from '../../hooks/useNFT';
import { BuyNFTModal } from '../ui/BuyNFTModal';
import { NFTCard } from '../ui/NFTCard';
import { Spinner } from './spinner';
import { useBuyNFT } from '../../hooks/useBuyNFT';

export const ListedNFT = () => {
  const { address } = useAccount();
  const { data, isLoading, isError, fetchNextPage, hasNextPage } = useListNFT();
  const [selectedNFT, setSelectedNFT] = useState<ListedNFTType | null>(null);

  const buyNFT = useBuyNFT();

  const handleBuyNFT = async (
    contractAddress: string,
    tokenId: number,
    price: string
  ) => {
    try {
      const txHash = await buyNFT.mutateAsync({
        contractAddress,
        tokenId,
        price,
      });
      console.log('TX hash:', txHash);
      setSelectedNFT(null);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available NFTs {isLoading && <Spinner />}
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {data?.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.map((item) => (
                <NFTCard
                  key={`${item.id}`}
                  tokenId={item.tokenId}
                  name={item.name}
                  nftAddress={item.contractAddress}
                  seller={item.seller}
                  actionLabel={
                    item.seller === address
                      ? 'Cancel'
                      : `${ethers.formatEther(item.price || '0')} ETH`
                  }
                  onAction={() => setSelectedNFT(item)}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>
      {selectedNFT && (
        <BuyNFTModal
          isOpen={!!selectedNFT}
          onClose={() => setSelectedNFT(null)}
          onConfirm={() =>
            handleBuyNFT(
              selectedNFT.contractAddress,
              Number(selectedNFT.tokenId),
              ethers.formatEther(selectedNFT.price)
            )
          }
          tokenId={selectedNFT.tokenId}
          price={BigInt(selectedNFT.price)}
          seller={selectedNFT.seller}
        />
      )}
    </>
  );
};
