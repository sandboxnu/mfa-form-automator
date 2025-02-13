import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { ReactJSXElement } from 'node_modules/@emotion/react/dist/declarations/types/jsx-namespace';
import { SideCreateForm } from './SideCreateForm';
import { FormButtons } from './FormButtons';

export const CreateFormLayout = ({
  isFormTemplate,
  pageNumber,
  heading,
  subheading,
  boxContent,
  deleteFunction,
  submitLink,
  backLink,
  disabled,
  review,
}: {
  isFormTemplate: boolean;
  pageNumber: number;
  heading: string;
  subheading: string;
  boxContent: ReactJSXElement;
  deleteFunction: Function;
  submitLink: string;
  backLink: string;
  disabled: boolean;
  review?: boolean;
}) => {
  return (
    <Box height="100vh" marginTop="36px">
      <Flex position="absolute" margin="0px" zIndex={5000}>
        <SideCreateForm curStep={pageNumber} isFormTemplate={isFormTemplate} />
      </Flex>

      <Heading
        color="#2A2B2D"
        fontSize="30px"
        fontWeight={700}
        lineHeight="38px"
        marginLeft="36px"
      >
        {heading}
      </Heading>
      <Text
        color="#4B4C4F"
        fontSize="19px"
        fontWeight={500}
        lineHeight="26px"
        pl="36px"
      >
        {subheading}
      </Text>
      <Flex
        /* outer white box */
        padding="36px 24px 36px 24px"
        flexDirection="column"
        justifyContent={'center'}
        alignItems="center"
        gap="20px"
        borderRadius="12px"
        border="1px solid #E5E5E5"
        height="auto"
        margin="16px 36px 16px 36px"
        backgroundColor="#FFF"
        alignContent={'center'}
      >
        {boxContent}
      </Flex>
      {isFormTemplate ? (
        <FormButtons
          isFormTemplate={true}
          heading='Create Form Template'
          deleteFunction={deleteFunction}
          submitLink={submitLink}
          backLink={backLink}
          disabled={disabled}
          review={review}
        />
      ) : (
        <FormButtons
          isFormTemplate={false}
          heading='Create Form Instance'
          deleteFunction={deleteFunction}
          submitLink={submitLink}
          backLink={backLink}
          disabled={disabled}
          review={review}
        />
      )}
    </Box>
  );
};
