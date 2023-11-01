import {
  useEditableControls,
  Flex,
  ButtonGroup,
  IconButton,
  HStack,
  Editable,
  EditablePreview,
  Input,
  EditableInput,
  Box,
} from '@chakra-ui/react';
import { CompletedIcon, EditIcon, DraggerIcon } from '@web/static/icons';
import { useState } from 'react';

export const FormTemplateTitle = ({
  title,
  handleChange,
}: {
  title: string;
  handleChange: (newTitle: string) => void;
}) => {
  const [innerTitle, setInnerTitle] = useState<string>(title);

  const FormTemplateTitleEditableControls = () => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <Flex justifyContent="center">
        <ButtonGroup justifyContent="center" size="sm" spacing="0">
          <IconButton
            aria-label="Submit"
            icon={<CompletedIcon />}
            onSubmit={() => handleChange(innerTitle)}
          >
            Submit
          </IconButton>
        </ButtonGroup>
      </Flex>
    ) : (
      <Flex justifyContent="center" alignItems="center">
        <ButtonGroup spacing="0">
          <IconButton
            aria-label="Edit Signature Field"
            size="sm"
            background="transparent"
            icon={<EditIcon />}
            {...getEditButtonProps()}
          />
        </ButtonGroup>
      </Flex>
    );
  };

  return (
    <Editable
      fontFamily="Hanken Grotesk"
      defaultValue={title}
      fontSize="16px"
      fontWeight="400"
      isPreviewFocusable={false}
      as={Flex}
      alignItems="center"
    >
      <Box pr="5px">
        <EditablePreview
          fontFamily="Hanken Grotesk"
          fontWeight="800"
          fontSize="24px"
        />
        <Input
          as={EditableInput}
          value={title}
          onChange={(e) => setInnerTitle(e.target.value)}
          placeholder="Form Name"
          fontFamily="Hanken Grotesk"
          fontSize="16px"
          fontWeight="400px"
          width="483px"
          height="40px"
        />
      </Box>
      <FormTemplateTitleEditableControls />
    </Editable>
  );
};
