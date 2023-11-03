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
  },
});

export default theme;
