import { HStack, Flex, Text } from '@chakra-ui/react';
import { FormCard } from './FormCard.tsx';
import { FormInstanceEntity } from '@web/client/types.gen.ts';
import React from 'react';
import { FormImageCard } from './FormImageCard.tsx';
import { ViewAll } from './ViewAll.tsx';

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
}: {
  title: string;
  color: string;
  link: string;
  formInstances: FormInstanceEntity[];
}) => {
  let displayFormInstances: FormInstanceEntity[] = formInstances.slice(
    0,
    Math.min(4, formInstances.length),
  );

  return (
    <>
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Text color="#32353B" fontSize="24px" fontWeight="500">
            {title == 'To-do'
              ? `You have ${formInstances.length} ${
                  formInstances.length == 1 ? 'form' : 'forms'
                } waiting for you.`
              : title}
          </Text>

          {title != 'To-do' && (
            <Flex
              marginLeft="13px"
              backgroundColor={color}
              height="18px"
              width="32px"
              borderRadius="12"
              justifyItems="center"
              alignItems="center"
            >
              <Text fontSize="14px" fontWeight="700" color="#756160">
                {formInstances.length}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex>
          <ViewAll title={title} link={link} />
        </Flex>
      </Flex>
      <Flex
        marginTop="20px"
        flexDirection="row"
        width="100%"
        justifyContent={'space-between'}
      >
        {displayFormInstances.map(
          (formInstance: FormInstanceEntity, index: number) => {
            return title == 'To-do' ? (
              <FormImageCard
                key={index}
                formInstance={formInstance}
                link={'/form-instances/' + formInstance.id}
              />
            ) : (
              <FormCard
                key={index}
                formName={formInstance.name}
                signatures={formInstance.signatures}
                link={'/form-instances/' + formInstance.id}
              />
            );
          },
        )}
      </Flex>
    </>
  );
};
