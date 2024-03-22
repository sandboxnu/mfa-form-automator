import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'Hanken Grotesk', sans-serif`,
    body: `'Hanken Grotesk', sans-serif`,
  },
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: 'gray.400',
      },
    },
    Button: {
      baseStyle: {
        fontWeight: '600',
        fontSize: '1.125rem',
        padding: '8px 24px 8px 24px',
        borderRadius: '0.50rem',
      },
      variants: {
        primary: {
          bg: '#4C658A',
          color: '#FFF',
        },
        secondary: {
          bg: '#F9FAFB',
          color: '#4C658A',
        },
      },
    },
  },
});

export default theme;
