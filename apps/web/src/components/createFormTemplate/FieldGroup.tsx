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
import { TempFieldGroup } from './types';

/**
 * @param fieldGroup - the field group
 * @param handleChange - function to handle changes to the field group
 * @param handleDelete - function to handle deletion of the field group
 * @returns a field group
 */
export const FieldGroup = ({
  fieldGroup,
  handleChange,
  handleDelete,
}: {
  fieldGroup: TempFieldGroup;
  handleChange: (newFieldGroup: TempFieldGroup) => void;
  handleDelete: (id: string) => void;
}) => {
  const FieldGroupEditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();

    return isEditing ? (
      <Flex justifyContent="center">
        <ButtonGroup justifyContent="center" size="sm" spacing="0">
          <IconButton
            aria-label="Submit"
            icon={<CompletedIcon />}
            isDisabled={fieldGroup.value === ''}
            onSubmit={() => handleChange(fieldGroup)}
          >
            Submit
          </IconButton>
        </ButtonGroup>
      </Flex>
    ) : (
      <Flex justifyContent="center" alignItems="center">
        <ButtonGroup spacing="0">
          <IconButton
            aria-label="Edit Field Group"
            size="sm"
            background="transparent"
            icon={<EditIcon />}
            {...getEditButtonProps()}
          />
          <IconButton
            aria-label="Delete Field Group"
            size="sm"
            background="transparent"
            icon={<DeleteIcon />}
            onClick={() => handleDelete(fieldGroup.id)}
          />
        </ButtonGroup>
      </Flex>
    );
  };

  return (
    <>
      {fieldGroup.value === '' ? (
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
          defaultValue={fieldGroup.value}
          fontSize="16px"
          fontWeight="400"
          isPreviewFocusable={false}
          as={Flex}
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          startWithEditView={fieldGroup.value === ''}
        >
          <Box w="100%" pr="5px">
            <EditablePreview />
            <Input
              as={EditableInput}
              value={fieldGroup.value}
              onChange={(e) =>
                handleChange({ id: fieldGroup.id, value: e.target.value })
              }
              w="100%"
            />
          </Box>
          <FieldGroupEditableControls />
        </Editable>
      </HStack>
    </>
  );
};
