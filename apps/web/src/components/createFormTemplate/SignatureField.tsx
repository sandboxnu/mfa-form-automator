import {
  Flex,
  ButtonGroup,
  IconButton,
  HStack,
  Editable,
  Input,
  Box,
  Text,
  useEditable,
} from '@chakra-ui/react';
import {
  CompletedIcon,
  EditIcon,
  DeleteIcon,
  DraggerIcon,
} from '@web/static/icons';
import { TempSignatureField } from './types';

/**
 * @param field - the signature field
 * @param handleChange - function to handle changes to the signature field
 * @param handleDelete - function to handle deletion of the signature field
 * @returns a signature field
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
  const editable = useEditable({
    defaultValue: field.value,
    onValueChange: (value) => {
      handleChange({ id: field.id, value: value.value });
    },
    onValueCommit: (value) => {
      handleChange({ id: field.id, value: value.value });
    },
    onValueRevert: (value) => {
      handleChange({ id: field.id, value: value.value });
    },
  });

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
        <Editable.RootProvider
          value={editable}
          fontFamily="Hanken Grotesk"
          defaultValue={field.value}
          fontSize="16px"
          fontWeight="400"
          // TODO: do we need this? not sure what the equivalent is when migrating from chakra v2 to v3
          // isPreviewFocusable={false}
          as={Flex}
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          pr="5px"
        >
          <Editable.Preview />
          <Editable.Input w="100%" />
          <Editable.Control>
            <Editable.EditTrigger asChild>
              <IconButton
                aria-label="Edit Signature Field"
                size="sm"
                background="transparent"
              >
                <EditIcon />
              </IconButton>
            </Editable.EditTrigger>
            {editable.editing && (
              <IconButton
                aria-label="Delete Signature Field"
                size="sm"
                background="transparent"
                onClick={() => handleDelete(field.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
            <Editable.SubmitTrigger asChild>
              <IconButton
                aria-label="Submit"
                borderRadius="full"
                disabled={field.value === ''}
                onClick={() => handleChange(field)}
              >
                <CompletedIcon />
              </IconButton>
            </Editable.SubmitTrigger>
          </Editable.Control>
        </Editable.RootProvider>
      </HStack>
    </>
  );
};
