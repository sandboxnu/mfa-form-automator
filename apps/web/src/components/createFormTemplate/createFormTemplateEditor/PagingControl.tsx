import { Box, Text, Button } from '@chakra-ui/react';
import {
  PageSwitcherArrowLeft,
  PageSwitcherArrowRight,
} from '@web/static/icons.tsx';
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
          disabled={pageNum == 0}
          marginRight="5px"
          cursor="pointer"
          unstyled
        >
          {PageSwitcherArrowLeft}
        </Button>
        <Text>
          {pageNum + 1} / {totalPages}
        </Text>
        <Button
          onClick={changePage(1)}
          disabled={pageNum == totalPages - 1}
          marginLeft="5px"
          cursor="pointer"
          unstyled
        >
          {PageSwitcherArrowRight}
        </Button>
      </div>
    </Box>
  );
}
