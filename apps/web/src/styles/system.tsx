import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineTextStyles,
  defineTokens,
  SystemStyleObject,
} from '@chakra-ui/react';

const tokens = defineTokens({
  colors: {
    primary: { value: '#4C658A' },
    secondary: { value: '#F9FAFB' },
    '--focus-color': { value: '{colors.gray.400}' },
  },

  fonts: {
    heading: { value: "'Hanken Grotesk', sans-serif" },
    body: { value: "'Hanken Grotesk', sans-serif" },
  },
  fontWeights: {
    semibold: { value: '600' },
  },
  fontSizes: {
    xl: { value: '1.125rem' },
  },
  radii: {
    md: { value: '0.5rem' },
  },
});

const buttonPrimaryVariant: SystemStyleObject = {
  color: 'white',
  bg: 'primary',
};

const buttonSecondaryVariant: SystemStyleObject = {
  color: 'primary',
  bg: 'secondary',
};

const config = defineConfig({
  theme: {
    tokens,
    recipes: {
      Input: {
        base: {
          _focusVisible: {
            borderColor: 'var(--focus-color)',
            boxShadow: '0 0 0 1px var(--focus-color)',
          },
        },
      },
      Button: {
        base: {
          fontWeight: 'semibold',
          fontSize: 'xl',
          padding: '8px 24px',
          borderRadius: 'md',
        },
        variants: {
          primary: {
            buttonPrimaryVariant,
          },
          secondary: {
            buttonSecondaryVariant,
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
