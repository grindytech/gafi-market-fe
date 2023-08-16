import { ComponentStyleConfig, extendTheme } from '@chakra-ui/react';

export const backgrounds = {
  gradient: {
    linear: {
      2: 'linear-gradient(135deg, #99CFFF 0%, #2A7AD7 100%)',
      8: 'linear-gradient(135deg, #FE4C4D 0%, #F02355 100%)',
      9: 'linear-gradient(135deg, #B98DFE 0%, #5D3ADA 100%)',
    },
  },
};

export const colors = {
  primary: {
    a: {
      100: '#D4EEFD',
      200: '#AADAFB',
      500: '#2A7AD7',
      600: '#1E5EB8',
      700: '#15469A',
    },
  },
  shader: {
    a: {
      100: '#FAFAFA',
      200: '#F4F4F5',
      300: '#E4E4E7',
      400: '#D4D4D8',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
    },
  },
  second: {
    red: '#EF4444',
    orange: '#FF7B00',
    purple: '#8338EC',
  },
  ...backgrounds,
};

export const styles = {
  global: () => ({
    body: {
      bg: 'shader.a.100',
      overflowX: 'hidden',
    },
    '*': {
      scrollBehavior: 'smooth',

      '::-webkit-scrollbar-thumb': {
        bg: 'shader.a.400',
        borderRadius: '2rem',
      },
    },
    '::-webkit-scrollbar': {
      bg: 'transparent',
      width: 2,
      height: 2,
    },
  }),
};

export const fonts = {
  fonts: {
    heading: `'Inter Variable', sans-serif`,
    body: `'Inter Variable', sans-serif`,
  },
};

const CardBox: ComponentStyleConfig = {
  variants: {
    createGames: {
      bg: 'white',
      borderRadius: 'xl',
      border: '0.0625rem solid',
      borderColor: 'shader.a.300',
      padding: 4,
    },
    baseStyle: {
      width: 'full',
      color: 'shader.a.900',
      bg: 'white',
      borderRadius: 'xl',
      border: '0.0625rem solid',
      borderColor: 'shader.a.300',
      padding: 6,
    },
  },
};

const Button: ComponentStyleConfig = {
  variants: {
    primary: {
      px: 4,
      bg: 'primary.a.500',
      color: 'white',
      borderRadius: 'lg',
      _hover: {
        bg: 'primary.a.600',
      },
    },
    baseStyle: {
      px: 4,
      color: 'shader.a.900',
      borderRadius: 'lg',
      border: '0.063rem solid',
      borderColor: 'shader.a.400',
    },
    cancel: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'shader.a.900',
      border: '0.0625rem solid',
      borderColor: 'shader.a.400',
      borderRadius: 'lg',
      height: 10,
      px: 4,
    },
  },
};

export const Table: ComponentStyleConfig = {
  variants: {
    poolBlockchain: {
      tr: {
        _notLast: {
          borderBottom: '0.0625rem solid',
          borderColor: 'shader.a.300',
        },
      },
      td: {
        fontSize: 'md',
        fontWeight: 'medium',
        color: 'shader.a.900',

        _last: {
          textAlign: 'right',
        },
      },
      th: {
        textTransform: 'capitalize',
        bg: 'shader.a.200',
        borderBottom: '0.0625rem solid',
        borderColor: 'shader.a.300',
        fontSize: 'sm',
        fontWeight: 'normal',
        color: 'shader.a.700',

        _first: {
          borderTopLeftRadius: 'lg',
        },
        _last: {
          borderTopRightRadius: 'lg',
          textAlign: 'right',
        },
      },
    },
  },
};

const Heading: ComponentStyleConfig = {
  variants: {
    game: {
      fontSize: 'md',
      fontWeight: 'medium',
      color: 'shader.a.600',
    },
  },
};

export const Input: ComponentStyleConfig = {
  variants: {
    control: {
      field: {
        fontSize: 'md',
        fontWeight: 'normal',
        color: 'shader.a.900',
        border: '0.0625rem solid',
        borderColor: 'shader.a.400',
        borderRadius: 'lg',
        height: 'auto',
        px: 4,
        py: 2,

        _placeholder: {
          color: 'shader.a.400',
        },
        _focusVisible: {
          borderColor: 'blue.500',
          boxShadow: '0 0 0 0.0625rem var(--chakra-colors-blue-500)',
        },
        _invalid: {
          borderColor: 'red.500',
          boxShadow: '0 0 0 0.0625rem var(--chakra-colors-red-500)',
        },
      },
    },
    settingProfile: {
      field: {
        px: 4,
        py: 2,
        border: '0.063rem solid',
        borderColor: 'shader.a.300',
        background: 'shader.a.200',
        borderRadius: 'xl',
        height: '3rem',
        _placeholder: {
          color: 'shader.a.400',
        },
      },
    },
  },
};

export const Select: ComponentStyleConfig = {
  variants: {
    formFilter: {
      field: {
        color: 'shader.a.900',
        fontsize: 'sm',
        fontWeight: 'medium',
        borderRadius: 'lg',
        bg: 'white',
        border: '0.063rem solid',
        borderColor: 'shader.a.400',
        px: 4,
      },

      icon: {
        color: 'primary.a.500',
      },
    },
  },
};

export const FormControl: ComponentStyleConfig = {
  variants: {
    transfer: {
      label: {
        fontWeight: 'medium',
        fontSize: 'sm',
        color: 'shader.a.900',
      },
      input: {
        borderColor: 'shader.a.300',
        fontSize: 'sm',
        fontWeight: 'normal',
        color: 'shader.a.600',
        borderRadius: 'lg',
      },
    },
  },
};

export const Modal: ComponentStyleConfig = {
  baseStyle: {
    dialogContainer: {
      px: 4,
    },
  },
};

export const breakpoints = {
  sm: '30rem', // 480px
  '2sm': '36rem', // 576px
  md: '48rem', // 768px
  lg: '62rem', // 992px
  xl: '80rem', // 1280px
  '2xl': '96rem', // 1536px
  '3xl': '120rem', // 1920px
};

export const Container: ComponentStyleConfig = {
  baseStyle: {
    maxWidth: breakpoints['2xl'],
    px: {
      base: 4,
      '2sm': 8,
      lg: 12,
    },
  },
};

const theme = extendTheme({
  colors,
  styles,
  fonts,
  breakpoints,
  components: {
    Container,
    CardBox,
    Button,
    Select,
    Table,
    Heading,
    FormControl,
    Input,
    Modal,
  },
});

export default theme;
