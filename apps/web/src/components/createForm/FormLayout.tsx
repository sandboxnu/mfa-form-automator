import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { SideCreateForm } from './SideCreateForm';
import { FormButtons } from './FormButtons';
import { FormInteractionType } from './types';

/**
 * The layout for a page in the create form template onboarding flow.  Used in pages.
 * @param pageNumber the step in the process (e.g. upload is 1).  Used in side nav bar
 * @param subheading the instruction under the heading
 * @param boxContent the JSX elements inside of the flexbile white box
 * @param submitLink the link to be pushed when the submit button is active and pressed
 * @param backLink the link to be pushed when the back button is active and pressed
 * @param disabled the boolean to determine whether the submit functionality is disabled (may be toggled by other pages)
 * @param review if this is review page true, effects the buttons
 * @returns the formatted content of a form template creation page.
 */

export const FormLayout = ({
  type,
  pageNumber,
  heading,
  subheading,
  boxContent,
  submitLink,
  backLink,
  disabled,
  review,
}: {
  type: FormInteractionType;
  pageNumber: number;
  heading: string;
  subheading: string;
  boxContent: React.ReactNode;
  submitLink: string;
  backLink: string;
  disabled: boolean;
  review?: boolean;
}) => {
  return (
    <Box height="100vh" marginTop="36px">
      <Flex position="absolute" margin="0px" zIndex={5000}>
        <SideCreateForm curStep={pageNumber} interactionType={type} />
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
        alignItems={
          type === FormInteractionType.CreateFormInstance && pageNumber === 1
            ? 'auto'
            : 'center'
        }
        gap="20px"
        borderRadius="12px"
        border={
          type === FormInteractionType.CreateFormInstance && pageNumber === 1
            ? 'transparent'
            : '1px solid #E5E5E5'
        }
        height="auto"
        margin="16px 36px 16px 36px"
        backgroundColor={
          type === FormInteractionType.CreateFormInstance && pageNumber === 1
            ? 'transparent'
            : '#FFF'
        }
        alignContent={'center'}
      >
        {boxContent}
      </Flex>
      <FormButtons
        type={type}
        heading={
          type === FormInteractionType.CreateFormTemplate
            ? 'Create form template'
            : type === FormInteractionType.CreateFormInstance
            ? 'Create form instance'
            : type === FormInteractionType.EditFormTemplate
            ? 'Edit form template'
            : type === FormInteractionType.EditFormInstance
            ? 'Edit form instance'
            : 'Submit form'
        }
        submitLink={submitLink}
        backLink={backLink}
        disabled={disabled}
        review={review}
      />
    </Box>
  );
};
