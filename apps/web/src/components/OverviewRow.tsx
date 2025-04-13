import { Flex, Text, Box, useBreakpointValue } from '@chakra-ui/react';
import { FormCard } from './FormCard.tsx';
import { FormInstanceEntity } from '@web/client/types.gen.ts';
import React, { useState, useEffect, useRef } from 'react';
import { FormImageCard } from './FormImageCard';
import { ViewAll } from './ViewAll';
import { SignFormInstancePreview } from './SignFormInstancePreview';

/**
 * @param title - the title of the overview row
 * @param color - the color of the overview row
 * @param link - the link of the overview row
 * @param formInstances - an array of form instances
 * @returns a row for the overview page with dynamically sized cards based on container width
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isOpen, setIsOpen] = useState(false);
  const [curForm, setCurForm] = useState<FormInstanceEntity>();

  // Calculate how many cards can fit in the container
  useEffect(() => {
    const calculateVisibleCards = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 272; // Width of each card
        const cardGap = 20; // Gap between cards
        const possibleCards = Math.floor(
          (containerWidth + cardGap) / (cardWidth + cardGap),
        );
        setVisibleCards(Math.min(possibleCards, formInstances.length));
      }
    };

    // Initial calculation
    calculateVisibleCards();

    // Recalculate on window resize
    const handleResize = () => {
      calculateVisibleCards();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [formInstances.length]);

  // Get only the cards that can fit in the container
  const displayFormInstances = formInstances.slice(0, visibleCards);

  function handleModalOpen(formInstance: FormInstanceEntity) {
    setCurForm(formInstance);
    setIsOpen(true);
  }

  return (
    <>
      <Flex justifyContent="space-between" mb="16px">
        <Flex alignItems="center">
          <Text color="#32353B" fontSize="24px" fontWeight="500">
            {title === 'To-do'
              ? `You have ${formInstances.length} ${
                  formInstances.length === 1 ? 'form' : 'forms'
                } waiting for you.`
              : title}
          </Text>

          {title !== 'To-do' && (
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
          )}
        </Flex>
        <Flex>
          <ViewAll title={title} link={link} />
        </Flex>
      </Flex>
      <Box ref={containerRef} width="100%" overflow="hidden">
        <Flex gap="20px" overflowX="hidden">
          {displayFormInstances.map(
            (formInstance: FormInstanceEntity, index: number) => (
              <Box key={index} flexShrink={0}>
                {title === 'To-do' ? (
                  <FormImageCard
                    onClick={() => handleModalOpen(formInstance)}
                    formInstance={formInstance}
                  />
                ) : (
                  <FormCard
                    onClick={() => handleModalOpen(formInstance)}
                    formName={formInstance.name}
                    assignedGroups={formInstance.assignedGroups}
                    link={'/sign-form/' + formInstance.id}
                  />
                )}
              </Box>
            ),
          )}
        </Flex>
      </Box>
      <SignFormInstancePreview
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        formInstance={curForm}
      />
    </>
  );
};
