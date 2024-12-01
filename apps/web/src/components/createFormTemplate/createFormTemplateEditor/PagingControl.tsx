import { Box, Text, Button } from '@chakra-ui/react';
import {
  PageSwitcherArrowLeft,
  PageSwitcherArrowRight,
} from '@web/static/icons';
import { Dispatch, SetStateAction } from 'react';

export default function PagingControl({
  totalPages,
  pageNum,
  setPageNum,
}: {
  totalPages: number;
  pageNum: number;
  setPageNum: Dispatch<SetStateAction<number>>;
}) {
  const styles = {
    container: {
      marginTop: 8,
      marginBottom: 8,
    },
    inlineFlex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pageInfo: {
      padding: 8,
      color: 'blue',
      fontSize: 14,
    },
  };

  const changePage = (direction: number) => () => {
    if (pageNum > 0 || pageNum < totalPages) setPageNum(pageNum + direction);
  };

  return (
    <Box>
      <div style={styles.inlineFlex}>
        <Button
          onClick={changePage(-1)}
          variant={'unstyled'}
          isDisabled={pageNum == 0}
        >
          {PageSwitcherArrowLeft}
        </Button>
        <Text>
          {pageNum + 1} / {totalPages}
        </Text>
        <Button
          variant={'unstyled'}
          onClick={changePage(1)}
          isDisabled={pageNum == totalPages - 1}
        >
          {PageSwitcherArrowRight}
        </Button>
      </div>
    </Box>
  );
}
