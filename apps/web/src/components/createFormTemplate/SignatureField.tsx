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
import { useState } from 'react';
import { TempSignatureField } from './types';

export const SignatureField = ({
  field,
  handleChange,
  handleDelete,
}: {
  field: TempSignatureField;
  handleChange: (newSignatureField: TempSignatureField) => void;
  handleDelete: (id: string) => void;
}) => {
  const [value, setValue] = useState<TempSignatureField>(field);

  const SignatureFieldEditableControls = () => {
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
            isDisabled={value.value === ''}
            onSubmit={() => handleChange(value)}
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
            onClick={() => handleDelete(value.id)}
          />
        </ButtonGroup>
      </Flex>
    );
  };

  return (
    <>
      {value.value === '' ? (
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
          defaultValue={value.value}
          fontSize="16px"
          fontWeight="400"
          isPreviewFocusable={false}
          as={Flex}
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          startWithEditView={value.value === ''}
        >
          <Box w="100%" pr="5px">
            <EditablePreview />
            <Input
              as={EditableInput}
              value={value.value}
              onChange={(e) =>
                setValue({ id: value.id, value: e.target.value })
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
