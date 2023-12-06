import { Box, Button, Flex, Grid, Text, Skeleton } from '@chakra-ui/react';
import {
  LeftArrowIcon,
  PencilIcon,
  EditUnderlineIcon,
} from 'apps/web/src/static/icons';
import AssigneeMap from './AvatarMap';
import { useState } from 'react';
import { FormInstanceEntity, FormInstancesService } from '@web/client';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';

const FormInstance = ({
  formInstance,
}: {
  formInstance: FormInstanceEntity;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const signFormInstanceMutation = useMutation({
    mutationFn: async ({
      formInstanceId,
      signatureId,
    }: {
      formInstanceId: string;
      signatureId: string;
    }) => {
      return FormInstancesService.formInstancesControllerSignFormInstance(
        formInstanceId,
        signatureId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['api', 'form-instances'],
      });
    },
  });

  const completeFormInstanceMutation = useMutation({
    mutationFn:
      FormInstancesService.formInstancesControllerCompleteFormInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['api', 'form-instances'],
      });
    },
  });

  const _nextSignature = formInstance.signatures
    .sort((a, b) => a.order - b.order)
    .find((v) => v.userSignedById == null);
  const _userCanSign = _nextSignature?.signerPositionId == user?.positionId;

  const _handleFormSign = () => {
    if (_nextSignature == null || !_userCanSign) return;
    signFormInstanceMutation.mutate({
      formInstanceId: formInstance.id,
      signatureId: _nextSignature?.id!,
    });
  };
  const _handleFormApprove = () => {
    if (formInstance.markedCompleted) return;
    completeFormInstanceMutation.mutate(formInstance.id);
  };

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

        <Box
          display="flex"
          flexDirection={'column'}
          justifyContent={'flex-start'}
          maxWidth="370px"
        >
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
                  ' ' +
                  signature.userSignedBy?.lastName
                : undefined,
              signed: signature.userSignedById ? true : false,
              title: signature.signerPosition.name,
            }))}
          />
          {_userCanSign && (
            <Button
              onClick={_handleFormSign}
              background={formInstance.markedCompleted ? '#e2e8f0' : '#4C658A'}
              color="#FFF"
            >
              Sign Form
            </Button>
          )}
          {formInstance.completed && (
            <Box display="flex" justifyContent={'flex-end'}>
              <Button
                borderRadius="8px"
                width="111px"
                height="40px"
                background={
                  formInstance.markedCompleted ? '#e2e8f0' : '#4C658A'
                }
                cursor={
                  formInstance.markedCompleted ? 'not-allowed' : 'pointer'
                }
                _active={{ background: '#e2e8f0' }}
                isLoading={completeFormInstanceMutation.isPending}
                color="#FFF"
                onClick={_handleFormApprove}
              >
                Approve
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default FormInstance;
