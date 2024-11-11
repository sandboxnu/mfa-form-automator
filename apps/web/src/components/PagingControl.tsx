import { Button } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

export default function PagingControl({totalPages, pageNum, setPageNum}: {
  totalPages: number,
  pageNum: number,
  setPageNum: Dispatch<SetStateAction<number>> 
}) {
  const styles= {
    container: {
      marginTop: 8,
      marginBottom: 8,
    },
    inlineFlex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    pageInfo: {
      padding: 8,
      color: "blue",
      fontSize: 14,
    }
  }
  return (
    <div style={styles.container}>
      <div style={styles.inlineFlex}>
        <Button
          title={"<"}
          onClick={() => setPageNum(pageNum - 1)}
          disabled={pageNum-1===-1}
        />
        <div style={styles.pageInfo}>
          Page: {pageNum + 1}/{totalPages}
        </div>
        <Button
          title={">"}
          onClick={() => setPageNum(pageNum + 1)}
          disabled={pageNum+1>totalPages-1}
        />
      </div>
    </div>
  );
}
