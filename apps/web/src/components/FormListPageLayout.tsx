import { Box } from '@chakra-ui/react';

export const FormListPageLayout = ({ children }: { children: any }) => {
  return (
    <Box marginX={'40px'} marginTop={'36px'} height={'100%'}>
      {children}
    </Box>
  );
};
