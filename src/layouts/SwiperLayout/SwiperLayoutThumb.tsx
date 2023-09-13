import RatioPicture from 'components/RatioPicture';
import SwiperThumbs from 'layouts/SwiperThumbs';
import SwiperThumbsButton from 'layouts/SwiperThumbs/SwiperThumbsButton';
import React, { PropsWithChildren } from 'react';
import { SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { MetaNFTFieldProps } from 'hooks/useMetaNFT';
import DetailPreviewNFT from 'layouts/Detail/DetailPreviewNFT';

interface SwiperLayoutThumbProps extends PropsWithChildren {
  swiperRef: React.MutableRefObject<SwiperType | undefined>;
  thumbs: SwiperType | null;
  metaNFT: MetaNFTFieldProps[] | undefined;
  bundleOf: { collection_id: number; nft_id: number }[];
}

export default ({
  swiperRef,
  thumbs,
  bundleOf,
  metaNFT,
  children,
}: SwiperLayoutThumbProps) => {
  return (
    <DetailPreviewNFT>
      <SwiperThumbs swiperRef={swiperRef} thumbs={thumbs as SwiperType}>
        <SwiperThumbsButton swiperRef={swiperRef} />

        {React.Children.toArray(
          bundleOf.map(({ collection_id, nft_id }) => {
            const currentMetaNFT = metaNFT?.find(
              data =>
                data?.collection_id === collection_id && data?.nft_id === nft_id
            );

            return (
              <SwiperSlide>
                <RatioPicture
                  src={currentMetaNFT?.image || null}
                  sx={{ ratio: { base: 16 / 9, lg: 1 / 1 } }}
                />
              </SwiperSlide>
            );
          })
        )}
      </SwiperThumbs>

      {children}
    </DetailPreviewNFT>
  );
};
