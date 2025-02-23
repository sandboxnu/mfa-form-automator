import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { SideCreateForm } from './SideCreateForm.tsx';
import { FormTemplateButtons } from './FormTemplateButtons.tsx';

/**
 * The layout for a page in the create form template onboarding flow.  Used in pages.
 * @param pageNumber the step in the process (e.g. upload is 1).  Used in side nav bar
 * @param subheading the instruction under "Create Form Template"
 * @param boxContent the JSX elements inside of the flexbile white box
 * @param deleteFunction the function to be called when the delete button is pressed on this page
 * @param submitLink the link to be pushed when the submit button is active and pressed
 * @param backLink the link to be pushed when the back button is active and pressed
 * @param disabled the boolean to determine whether the submit functionality is disabled (may be toggled by other pages)
 * @param review if this is review page true, effects the buttons
 * @returns the formatted content of a form template creation page.
 */
export const FormTemplateLayout = ({
  pageNumber,
  subheading,
  boxContent,
  deleteFunction,
  submitLink,
  backLink,
  disabled,
  review,
}: {
  pageNumber: number;
  subheading: string;
  boxContent: React.ReactNode;
  deleteFunction: Function;
  submitLink: string;
  backLink: string;
  disabled: boolean;
  review?: boolean;
}) => {
  return (
    <>
      <Box display="flex" flexDirection="column" flex="1" margin="36px">
        <Flex>
          <SideCreateForm curStep={pageNumber} />
        </Flex>

        <Heading
          color="#2A2B2D"
          fontSize="30px"
          fontWeight={700}
          lineHeight="38px"
        >
          Create form template
        </Heading>
        <Text
          color="#4B4C4F"
          fontSize="19px"
          fontWeight={500}
          lineHeight="26px"
        >
          {subheading}
        </Text>

        <Flex
          marginTop="20px"
          padding="36px 24px"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap="20px"
          borderRadius="12px"
          border="1px solid #E5E5E5"
          height="auto"
          backgroundColor="#FFF"
          flex="1"
        >
          {boxContent}
        </Flex>
        <Flex justifyContent="space-between" marginTop="20px">
          <FormTemplateButtons
            deleteFunction={deleteFunction}
            submitLink={submitLink}
            backLink={backLink}
            disabled={disabled}
            review={review}
          />
        </Flex>
      </Box>
    </>
  );
};
