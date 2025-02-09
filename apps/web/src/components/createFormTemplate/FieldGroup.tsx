import {
  Flex,
  IconButton,
  HStack,
  Editable,
  Text,
  useEditable,
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
  const editable = useEditable({
    defaultValue: fieldGroup.value,
    onValueChange: (value) => {
      handleChange({ id: fieldGroup.id, value: value.value });
    },
    onValueCommit: (value) => {
      handleChange({ id: fieldGroup.id, value: value.value });
    },
    onValueRevert: (value) => {
      handleChange({ id: fieldGroup.id, value: value.value });
    },
  });

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
        <Editable.RootProvider
          value={editable}
          fontFamily="Hanken Grotesk"
          defaultValue={fieldGroup.value}
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
                <EditIcon boxSize="24px" />
              </IconButton>
            </Editable.EditTrigger>
            {editable.editing && (
              <IconButton
                aria-label="Delete Signature Field"
                size="sm"
                background="transparent"
                onClick={() => handleDelete(fieldGroup.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
            <Editable.SubmitTrigger asChild>
              <IconButton
                aria-label="Submit"
                borderRadius="full"
                disabled={fieldGroup.value === ''}
                onClick={() => handleChange(fieldGroup)}
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
