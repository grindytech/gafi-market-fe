export const GAFI_WALLET_STORAGE_KEY = 'GAFI_extension_connected';
export const GAFI_WALLET_ACCOUNT_KEY = 'GAFI_WALLET_ACCOUNT';
export const WISHLIST_STORAGE_KEY = 'WISHLIST_STORAGE_KEY';

export const CHROME_EXT_URL =
  'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';
export const FIREFOX_ADDON_URL =
  'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/';

export const chainDecimal = 10;

export const BLOCK_TIME = 6;

export const unitGAFI = (fee: string | number) =>
  `${fee}${'0'.repeat(chainDecimal)}`; // -1 mean 1 + N-chainDecimal
