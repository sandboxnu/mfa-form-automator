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
  Spacer,
} from '@chakra-ui/react';
import { DraggerIcon, UploadForm } from '@web/static/icons';
import { Reorder } from 'framer-motion';
import { useState } from 'react';

const variants = {
  notDragging: {
    zIndex: 0,
    boxShadow: 'none',
    background: 'var(--chakra-colors-gray-100)',
  },
  dragging: {
    zIndex: 1,
    boxShadow: 'var(--chakra-shadows-lg)',
    background: '#4C658A',
  },
};

const SignatureField = ({
  field,
  i,
  handleChange,
  handleDelete,
}: {
  field: string;
  i: number;
  handleChange: (val: string, i: number) => void;
  handleDelete: (val: string) => void;
}) => {
  const [value, setValue] = useState(field);

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <Button onSubmit={() => handleChange(value, i)}>Submit</Button>
        <Button {...getCancelButtonProps()}>Cancel</Button>
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <ButtonGroup>
          <Button size="sm" {...getEditButtonProps()}>
            Edit
          </Button>
          <Button size="sm" onClick={() => handleDelete(field)}>
            Delete
          </Button>
        </ButtonGroup>
      </Flex>
    );
  }

  return (
    <HStack>
      <DraggerIcon />
      <Editable
        fontFamily="Hanken Grotesk"
        defaultValue={value}
        fontSize="16px"
        fontWeight="400"
        isPreviewFocusable={false}
      >
        <HStack w="100%">
          <EditablePreview />
          <Input
            as={EditableInput}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Spacer />
          <EditableControls />
        </HStack>
      </Editable>
    </HStack>
  );
};

export const CreateFormTemplate = () => {
  const [signatureFields, setSignatureFields] = useState([
    'Leadership Team Member',
    'Director',
    'Senior Director',
  ]);

  function deleteSignatureField(val: string) {
    const newSignatureFields = signatureFields.filter((item) => {
      return item !== val;
    });
    setSignatureFields(newSignatureFields);
  }

  const handleChange = (val: string, i: number) => {
    console.log('handleChange:', val, i);
    let tempSignatureFields = [...signatureFields];
    tempSignatureFields[i] = val;
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
            >
              {signatureFields.map((signatureField, i) => (
                <ListItem
                  key={signatureField}
                  as={Reorder.Item}
                  value={signatureField}
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
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};
