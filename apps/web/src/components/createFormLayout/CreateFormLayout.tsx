import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { ReactJSXElement } from 'node_modules/@emotion/react/dist/declarations/types/jsx-namespace';
import { SideCreateForm } from './SideCreateForm';
import { CreateFormButtons } from './CreateFormButtons';

/**
 * The layout for a page in the create form template onboarding flow.  Used in pages.
 * @param pageNumber the step in the process (e.g. upload is 1).  Used in side nav bar
 * @param subheading the instruction under "Create Form Template"
 * @param boxContent the JSX elements inside of the flexbile white box
 * @param deleteFunction the function to be called when the delete button is pressed on this page
 * @param submitLink the link to be pushed when the submit button is active and pressed
 * @param backLink the link to be pushed when the back button is active and pressed
 * @param disabled the boolean to determine whether the submit functionality is disabled (may be toggled by other pages)
 * @returns the formatted content of a form template creation page.
 */
export const CreateFormLayout = ({
  pageNumber,
  subheading,
  deleteFunction,
  submitLink,
  backLink,
  disabled,
  children,
}: {
  pageNumber: number;
  subheading: string;
  deleteFunction: Function;
  submitLink: string;
  backLink: string;
  disabled: boolean;
  children: ReactJSXElement;
}) => {
  return (
    <Box height="100vh" marginTop="36px">
      <Flex position="absolute" margin="0px" zIndex={5000}>
        <SideCreateForm curStep={pageNumber} />
      </Flex>

      <Heading
        color="#2A2B2D"
        fontSize="30px"
        fontWeight={700}
        lineHeight="38px"
        marginLeft="36px"
      >
        Create form template
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
        {children}
      </Flex>
      <CreateFormButtons
        deleteFunction={deleteFunction}
        submitLink={submitLink}
        backLink={backLink}
        disabled={disabled}
      />
    </Box>
  );
};
