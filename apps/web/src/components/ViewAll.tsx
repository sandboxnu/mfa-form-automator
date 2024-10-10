import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { RightArrowIcon } from 'apps/web/src/static/icons';

/**
 * @param title - the title of the form list
 * @param link - link to page for category
 * @returns a link that takes you to a category page (e.g. pending)
 */
export const ViewAll = ({ title, link }: { title: string; link: string }) => {
  return (
    <>
      <Link href={link}>
        <Flex alignItems="center">
          <Text fontWeight="500" fontSize="15px" color="#1367EA">
            See all {title}
          </Text>
          <RightArrowIcon width="10px" height="10px" marginLeft="4px" />
        </Flex>
      </Link>
    </>
  );
};
