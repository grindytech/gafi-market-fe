import { UseFormSetValue } from 'react-hook-form';
import { AccountWishlistFieldProps } from '.';
import { ItemBalanceOfProps } from 'hooks/useItemBalanceOf';
import BundleLayoutMenu from 'layouts/BundleLayout/BundleLayoutMenu';

import SelectIcon from 'public/assets/line/select.svg';
import TrashIcon from 'public/assets/line/trash.svg';
import { WISHLIST_STORAGE_KEY } from 'utils/constants';

interface AccountWishlistMenuProps {
  setValue: UseFormSetValue<AccountWishlistFieldProps>;
  index: number;
  meta: ItemBalanceOfProps;
  getWishlist: ItemBalanceOfProps[];
  refetch: () => void;
}

export default ({
  setValue,
  index,
  meta,
  getWishlist,
  refetch,
}: AccountWishlistMenuProps) => {
  const ListMenu = [
    {
      icon: SelectIcon,
      heading: 'Select',
      onClick: () => setValue(`product.${index}`, meta),
    },
    {
      icon: TrashIcon,
      heading: 'Remove',
      onClick: () => {
        getWishlist.splice(index, 1);

        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(getWishlist));

        refetch();
      },
    },
  ];

  return <BundleLayoutMenu menu={ListMenu} />;
};