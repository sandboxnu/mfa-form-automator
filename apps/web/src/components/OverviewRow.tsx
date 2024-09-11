import { HStack, Flex, Box, Text, Heading } from '@chakra-ui/react';
import { FormCard } from './FormCard';
import { RightArrowIcon } from 'apps/web/src/static/icons';
import Link from 'next/link';
import { FormInstanceEntity } from '@web/client';

/**
 * @param title - the title of the overview row
 * @param color - the color of the overview row
 * @param link - the link of the overview row
 * @param formInstances - an array of form instances
 * @param rowWidth - the width of the overview row
 * @returns a row for the overview page
 */
export const OverviewRow = ({
  title,
  color,
  link,
  formInstances,
  rowWidth,
}: {
  title: string;
  color: string;
  link: string;
  formInstances: FormInstanceEntity[];
  rowWidth: number;
}) => {
  let displayFormInstances: FormInstanceEntity[] = formInstances.slice(
    0,
    Math.min(4, formInstances.length),
  );
  return (
    <>
      <Box w={rowWidth}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Heading as="h2">{title}</Heading>
            <Flex
              marginLeft="13px"
              backgroundColor={color}
              height="18px"
              width="32px"
              borderRadius="12"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="14px" fontWeight="700" color="#756160">
                {formInstances.length}
              </Text>
            </Flex>
          </Flex>
          <Link href={link}>
            <Flex alignItems="center">
              <Text fontWeight="500" fontSize="16px" color="#4C658A">
                See all {title}
              </Text>
              <RightArrowIcon width="10px" height="10px" marginLeft="4px" />
            </Flex>
          </Link>
        </Flex>
        <HStack spacing="16px" marginTop="20px">
          {displayFormInstances.map(
            (formInstance: FormInstanceEntity, index: number) => {
              return (
                <FormCard
                  formName={formInstance.name}
                  signatures={formInstance.signatures}
                  key={index}
                  link={'/form-instances/' + formInstance.id}
                />
              );
            },
          )}
        </HStack>
      </Box>
    </>
  );
};
