import { Box, Button, Flex, Grid, Text, Skeleton } from '@chakra-ui/react';
import {
  LeftArrowIcon,
  PencilIcon,
  EditUnderlineIcon,
} from 'apps/web/src/static/icons';
import AssigneeMap from './AvatarMap';
import { useState } from 'react';
import { FormInstanceEntity } from '@web/client';
import { useRouter } from 'next/router';

const FormInstance = ({
  formInstance,
}: {
  formInstance: FormInstanceEntity;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <Box className="main">
      <Flex
        ml="50px"
        as="button"
        align="center"
        cursor="pointer"
        mt={10}
        data-group
        onClick={router.back}
      >
        <LeftArrowIcon
          boxSize={3}
          mr={2}
          fill="#4C658A"
          _groupHover={{ fill: 'var(--chakra-colors-gray-500)' }}
        />
        <Text
          color="#4C658A"
          _groupHover={{ color: 'var(--chakra-colors-gray-500)' }}
        >
          Back
        </Text>
      </Flex>
      <Flex align="center" pl={4} mt={4}>
        <Text
          color="#000"
          fontFamily="Hanken Grotesk"
          fontSize="27px"
          fontStyle="normal"
          fontWeight="800"
          lineHeight="normal"
          ml="30px"
          mt={4}
          mr={5}
        >
          {formInstance.name}
        </Text>
        <Button
          variant="link"
          onClick={() => {
            // handle edit action here
          }}
          color="black"
          fontWeight="normal"
          textAlign="left"
          _hover={{ textDecoration: 'none' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Flex flexDirection="column">
            <Flex>
              <PencilIcon mr={1} mt={6} />
              <Text
                color="#000"
                style={{ fontSize: '18px', textDecoration: 'none' }}
                mt={5}
              >
                Edit
              </Text>
            </Flex>
            {isHovered && (
              <EditUnderlineIcon
                stroke="black"
                width="52px"
                height="2"
                fill="none"
              />
            )}
          </Flex>
        </Button>
      </Flex>
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="20px"
        fontStyle="normal"
        fontWeight="700"
        lineHeight="normal"
        textAlign="left"
        my={4}
        ml="50px"
        mt={12}
      >
        Description
      </Text>
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="16px"
        fontStyle="normal"
        fontWeight="normal"
        lineHeight="normal"
        textAlign="left"
        ml="50px"
        maxW="450px"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et
        imperdiet enim. Ut enim justo, tincidunt ac enim ut, mollis pulvinar
        neque. Suspendisse id semper nunc.
      </Text>

      <Grid templateColumns="1fr 1fr" gap="100px" mt={20}>
        <Box>
          <Text
            color="#000"
            fontFamily="Hanken Grotesk"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="normal"
            ml="50px"
          >
            Form Preview
          </Text>
          <Skeleton
            ml="50px"
            mt={6}
            mb="100px"
            bg="#000"
            minWidth="436.353px"
            minHeight="566.219px"
          />
        </Box>

        <Box>
          <Text
            color="#000"
            fontFamily="Hanken Grotesk"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="normal"
          >
            Assignees
          </Text>
          <AssigneeMap
            assignees={formInstance.signatures.map((signature) => ({
              name: signature.userSignedBy
                ? signature.userSignedBy?.firstName +
                  signature.userSignedBy?.lastName
                : undefined,
              signed: signature.userSignedById ? true : false,
              title: signature.signerPosition.name,
            }))}
          />
        </Box>
      </Grid>
    </Box>
  );
};

export default FormInstance;
