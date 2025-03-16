import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Hanken Grotesk', sans-serif` },
        body: { value: `'Hanken Grotesk', sans-serif` },
      },
    },
  },
});
