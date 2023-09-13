import { cloundinary_link } from 'axios/cloudinary_axios';
import CardBox from 'components/CardBox';
import RatioPicture from 'components/RatioPicture';
import { MetaNFTFieldProps } from 'hooks/useMetaNFT';
import { PropsWithChildren } from 'react';

interface BundleLayoutModelProps extends PropsWithChildren {
  metaNFT: MetaNFTFieldProps[] | undefined;
  bundleOf: { collection_id: number; nft_id: number };
}

export default ({ bundleOf, metaNFT, children }: BundleLayoutModelProps) => {
  const currentMetaNFT = metaNFT?.find(
    data =>
      data?.collection_id === bundleOf.collection_id &&
      data?.nft_id === bundleOf.nft_id
  );

  return (
    <CardBox
      variant="baseStyle"
      padding={0}
      position={{ lg: 'sticky' }}
      top={24}
      overflow="hidden"
      height="fit-content"
      role="group"
    >
      <RatioPicture
        src={
          currentMetaNFT?.avatar
            ? cloundinary_link(currentMetaNFT.avatar)
            : null
        }
        sx={{ ratio: { base: 16 / 9, lg: 1 / 1 } }}
      />

      {children}
    </CardBox>
  );
};
