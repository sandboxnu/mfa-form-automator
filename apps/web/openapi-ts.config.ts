export default {
  input: 'http://localhost:8080/api-json',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './src/client',
  },
  plugins: [
    '@hey-api/client-fetch',
    '@tanstack/react-query',
    '@hey-api/schemas',
    {
      enums: 'typescript',
      exportInlineEnums: true,
      name: '@hey-api/typescript',
    },
  ],
};
