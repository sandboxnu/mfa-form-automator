import { Button } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri';

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

  const viewLeft = () => {
    if (pageNum === 0) {
      setPageNum(totalPages - 1);
    } else {
      setPageNum(pageNum - 1);
    }
  };

  const viewRight = () => {
    if (pageNum === totalPages - 1) {
      setPageNum(0);
    } else {
      setPageNum(pageNum + 1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.inlineFlex}>
        <Button onClick={viewLeft} variant={'outline'}>
          <RiArrowLeftLine />
        </Button>
        <div style={styles.pageInfo}>
          Page: {pageNum + 1}/{totalPages}
        </div>
        <Button onClick={viewRight} variant={'outline'}>
          <RiArrowRightLine />
        </Button>
      </div>
    </div>
  );
}
