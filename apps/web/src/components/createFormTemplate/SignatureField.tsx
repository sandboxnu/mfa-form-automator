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
  Text,
} from '@chakra-ui/react';
import {
  CompletedIcon,
  EditIcon,
  DeleteIcon,
  DraggerIcon,
} from '@web/static/icons';
import { TempSignatureField } from './types';

/**
 * @param field - Signature field object
 * @param handleChange - Function to handle changes to the signature field
 * @param handleDelete - Function to handle deletion of the signature field
 */
export const SignatureField = ({
  field,
  handleChange,
  handleDelete,
}: {
  field: TempSignatureField;
  handleChange: (newSignatureField: TempSignatureField) => void;
  handleDelete: (id: string) => void;
}) => {
  const SignatureFieldEditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();

    return isEditing ? (
      <Flex justifyContent="center">
        <ButtonGroup justifyContent="center" size="sm" spacing="0">
          <IconButton
            aria-label="Submit"
            icon={<CompletedIcon />}
            isDisabled={field.value === ''}
            onSubmit={() => handleChange(field)}
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
          <IconButton
            aria-label="Delete Signature Field"
            size="sm"
            background="transparent"
            icon={<DeleteIcon />}
            onClick={() => handleDelete(field.id)}
          />
        </ButtonGroup>
      </Flex>
    );
  };

  return (
    <>
      {field.value === '' ? (
        <Text
          fontFamily="Hanken Grotesk"
          fontSize="12px"
          fontWeight="400"
          color="red"
          pl="5px"
        >
          Please specify a title
        </Text>
      ) : (
        <></>
      )}
      <HStack w="100%">
        <DraggerIcon />
        <Editable
          fontFamily="Hanken Grotesk"
          defaultValue={field.value}
          fontSize="16px"
          fontWeight="400"
          isPreviewFocusable={false}
          as={Flex}
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          startWithEditView={field.value === ''}
        >
          <Box w="100%" pr="5px">
            <EditablePreview />
            <Input
              as={EditableInput}
              value={field.value}
              onChange={(e) =>
                handleChange({ id: field.id, value: e.target.value })
              }
              w="100%"
            />
          </Box>
          <SignatureFieldEditableControls />
        </Editable>
      </HStack>
    </>
  );
};
