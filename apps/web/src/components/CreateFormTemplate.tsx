import {
  Box,
  Input,
  Text,
  Button,
  Grid,
  GridItem,
  List,
  ListItem,
  HStack,
  ButtonGroup,
  Flex,
  useEditableControls,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import {
  CompletedIcon,
  DeleteIcon,
  DraggerIcon,
  EditIcon,
  UploadForm,
} from '@web/static/icons';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';

const variants = {
  notDragging: {
    zIndex: 0,
    boxShadow: 'none',
    background: 'var(--chakra-colors-gray-100)',
  },
  dragging: {
    zIndex: 1,
    boxShadow: 'var(--chakra-shadows-lg)',
    background: '#C0CDDF',
  },
};

const SignatureField = ({
  field,
  i,
  handleChange,
  handleDelete,
}: {
  field: TempSignatureField;
  i: number;
  handleChange: (newSignatureField: TempSignatureField) => void;
  handleDelete: (id: number) => void;
}) => {
  const [value, setValue] = useState<TempSignatureField>(field);

  function EditableControls() {
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
            onSubmit={() => handleChange(value)}
          >
            Submit
          </IconButton>
          {/* <Button {...getCancelButtonProps()}>Cancel</Button> */}
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
  }

  return (
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
            onChange={(e) => setValue({ id: value.id, value: e.target.value })}
            w="100%"
          />
        </Box>
        <EditableControls />
      </Editable>
    </HStack>
  );
};

type TempSignatureField = {
  id: number;
  value: string;
};

export const CreateFormTemplate = () => {
  const [signatureFields, setSignatureFields] = useState<TempSignatureField[]>([
    { id: 0, value: 'Leadership Team Member' },
    { id: 1, value: 'Director' },
    { id: 2, value: 'Senior Director' },
  ]);

  function deleteSignatureField(id: number) {
    const newSignatureFields = signatureFields.filter((item) => {
      return item.id !== id;
    });
    setSignatureFields(newSignatureFields);
  }

  const handleChange = (newSignatureField: TempSignatureField) => {
    let tempSignatureFields = [...signatureFields];
    tempSignatureFields.filter(
      (value) => value.id === newSignatureField.id,
    )[0] = newSignatureField;
    setSignatureFields(tempSignatureFields);
  };

  return (
    <>
      <Box h="75vh" w="75vw">
        <Text
          fontFamily="Hanken Grotesk"
          fontWeight="800"
          fontSize="27px"
          pt="30px"
          pb="30px"
        >
          Create Form Template
        </Text>
        <Text
          fontFamily="Hanken Grotesk"
          fontWeight="700"
          fontSize="19px"
          pb="13px"
        >
          Form Name
        </Text>
        <Input
          placeholder="Form Name"
          fontFamily="Hanken Grotesk"
          fontSize="16px"
          fontWeight="400px"
          width="483px"
          height="40px"
        ></Input>
        <Text
          pt="40px"
          pb="8px"
          fontFamily="Hanken Grotesk"
          fontSize="19px"
          fontWeight="700"
        >
          Upload Form
        </Text>
        <Button
          width="160px"
          height="40px"
          borderRadius="8px"
          border="1px"
          background="white"
          borderColor="#4C658A"
        >
          <UploadForm color="#4C658A" width="24px" height="24px" />
          <Text
            fontFamily="Hanken Grotesk"
            fontSize="17px"
            fontWeight="700"
            color="#4C658A"
            pl="10px"
          >
            Upload Form
          </Text>
        </Button>
        <Grid templateColumns="repeat(2, 1fr)" gap={122} pt="30px">
          <GridItem w="100%">
            <Text
              fontFamily="Hanken Grotesk"
              fontSize="19px"
              fontWeight="700"
              pb="22px"
            >
              Form Preview
            </Text>
            <Box w="480px" h="680px" background="gray" />
          </GridItem>
          <GridItem w="100%">
            <Text fontFamily="Hanken Grotesk" fontSize="19px" fontWeight="700">
              Add Signature Fields
            </Text>
            <Text fontFamily="Hanken Grotesk" fontSize="18px" fontWeight="400">
              Enter the role titles of employees that will need to sign this
              form.
            </Text>
            <List
              as={Reorder.Group}
              spacing={2}
              axis="y"
              values={signatureFields}
              onReorder={setSignatureFields}
              pt="16px"
              pb="10px"
            >
              {signatureFields.map((signatureField, i) => (
                <ListItem
                  key={signatureField.id}
                  as={Reorder.Item}
                  value={signatureField.value}
                  p={2}
                  bg="gray.100"
                  rounded="xl"
                  dragTransition={{
                    bounceStiffness: 600,
                  }}
                  variants={variants}
                  initial="notDragging"
                  whileDrag="dragging"
                  position="relative"
                  minW="100%"
                >
                  <SignatureField
                    field={signatureField}
                    i={i}
                    handleChange={handleChange}
                    handleDelete={deleteSignatureField}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              padding="0"
              background="transparent"
              _hover={{ bg: 'transparent' }}
              _groupHover={{ color: 'yellow' }}
              onClick={() => {
                let currentSignatureFields = signatureFields.slice(0);
                currentSignatureFields.push({
                  id: signatureFields.length,
                  value: '',
                });
                setSignatureFields(currentSignatureFields);
              }}
            >
              <HStack>
                <AddIcon color="white" background="#4C658A" />
                <Text
                  fontFamily="Hanken Grotesk"
                  fontSize="16px"
                  fontWeight="400"
                  color="#4C658A"
                >
                  Add signature field
                </Text>
              </HStack>
            </Button>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};
