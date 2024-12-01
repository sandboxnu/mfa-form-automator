import { Text, Flex } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

/**
 * The contents of the white box for the page (step 2) that asks the user for the form's name and
 * optional description.  Includes the following components: name label, name input box, description label,
 * description input box, preview label, form preview.  Used in description.tsx page.
 * @param setName function to save the inputted name of the form
 * @param setDescription function to save the inputted description of the form
 * @param formLink link to form to preview
 */
export const NameAndDescriptionBox = ({
  name,
  setName,
  description,
  setDescription,
  formLink,
}: {
  name: string | null;
  setName: Dispatch<SetStateAction<string | null>>;
  description: string | null;
  setDescription: Dispatch<SetStateAction<string | null>>;
  formLink: string;
}) => {
  const textInputStyle = {
    padding: '8px 10px',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    borderRadius: '4px',
    border: '1px solid #E5E5E5',
    background: '#F5F7FA',
    outlineColor: 'transparent',
    borderColor: 'transparent',
  };

  return (
    <Flex
      flexDirection={'row'}
      gap={'40px'}
      alignContent={'justify'}
      alignSelf="stretch"
      width="100%"
    >
      <Flex
        flexDirection="column"
        gap="24px"
        width="480px"
        alignItems={'flex-start'}
      >
        <Flex gap="10px" flexDirection="column" width="480px">
          <Text>Name</Text>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            style={{ ...textInputStyle }}
            placeholder="Form Template Name"
            value={name!!}
          />
        </Flex>
        <Flex gap="10px" flexDirection="column" width="480px">
          <Text>Description (optional)</Text>

          <textarea
            onChange={(e) => setDescription(e.target.value)}
            style={{
              ...textInputStyle,
              height: '120px',
              resize: 'none',
            }}
            placeholder="For HR processing lorem ipsum dolor sit"
            value={description!!}
          />
        </Flex>
      </Flex>
      <Flex
        flexDirection={'column'}
        gap="8px"
        alignItems="flex-start"
        flex="1 0 0"
      >
        <Text
          color="#7C7F86"
          fontSize="14px"
          fontWeight="500px"
          lineHeight="21px"
        >
          Preview Only
        </Text>
        <embed
          src={formLink}
          type="application/pdf"
          width="400px"
          height="500px"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            border: '1px solid #E5E5E5',
            borderRadius: '8px',
            width: '100%',
          }}
        />
      </Flex>
    </Flex>
  );
};
