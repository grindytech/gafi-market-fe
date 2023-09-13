import { cloundinary_link } from 'axios/cloudinary_axios';
import CardBox from 'components/CardBox';
import RatioPicture from 'components/RatioPicture';
import SwiperThumbs from 'layouts/SwiperThumbs';
import SwiperThumbsButton from 'layouts/SwiperThumbs/SwiperThumbsButton';
import React, { PropsWithChildren } from 'react';
import { SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { MetaNFTFieldProps } from 'hooks/useMetaNFT';

interface BundleLayoutModelSwiper extends PropsWithChildren {
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
}: BundleLayoutModelSwiper) => {
  return (
    <CardBox
      variant="baseStyle"
      padding={0}
      position={{ base: 'relative', lg: 'sticky' }}
      top={24}
      overflow="hidden"
      height="fit-content"
      role="group"
    >
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
                  src={
                    currentMetaNFT?.avatar
                      ? cloundinary_link(currentMetaNFT.avatar)
                      : null
                  }
                  sx={{ ratio: { base: 16 / 9, lg: 1 / 1 } }}
                />
              </SwiperSlide>
            );
          })
        )}
      </SwiperThumbs>

      {children}
    </CardBox>
  );
};
