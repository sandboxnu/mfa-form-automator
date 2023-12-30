import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import {
  DownloadFormIcon,
  DropdownDownArrow,
  DropdownUpArrow,
  HistoryIcon,
  PreviewFormIcon,
} from '@web/static/icons';
import { DataTable } from './DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { SignatureEntity } from '@web/client';

export const FormInstanceHistory = ({
  signatures,
}: {
  signatures: SignatureEntity[];
}) => {
  type FormHistoryEntry = {
    editor: string;
    date: string;
    preview: string;
    download: string;
  };

  signatures
    .filter((signature) => signature.signed === true)
    .map((signature) => {
      return {
        editor:
          signature.userSignedBy?.firstName +
          ' ' +
          signature.userSignedBy?.lastName,
        date: '01/01/2023',
        preview: 'link goes here',
        download: 'link goes here',
      };
    });
  const data: FormHistoryEntry[] = signatures
    .filter((signature) => signature.signed === true)
    .map((signature) => {
      return {
        editor:
          signature.userSignedBy?.firstName +
          ' ' +
          signature.userSignedBy?.lastName,
        date: '01/01/2023',
        preview: 'link goes here',
        download: 'link goes here',
      };
    });
  const columnHelper = createColumnHelper<FormHistoryEntry>();
  const columns = [
    columnHelper.accessor('editor', {
      cell: (info) => info.getValue(),
      header: 'Editor',
    }),
    columnHelper.accessor('date', {
      cell: (info) => info.getValue(),
      header: 'Date',
    }),
    columnHelper.accessor('preview', {
      header: '',
      cell: ({ cell }) => (
        <button onClick={() => console.log(cell.getValue())}>
          <Flex align="center" gap="9px">
            <PreviewFormIcon minH="19px" />
            <Text color="#4C658A" fontWeight="600">
              Preview
            </Text>
          </Flex>
        </button>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('download', {
      header: '',
      cell: ({ cell }) => (
        <button onClick={() => console.log(cell.getValue())}>
          <Flex align="center" gap="9px">
            <DownloadFormIcon minH="21px" />
            <Text color="#4C658A" fontWeight="600">
              Download
            </Text>
          </Flex>
        </button>
      ),
      enableSorting: false,
    }),
  ];

  const [showTable, setShowTable] = useState<boolean>(false);

  return (
    <>
      <Box background="#F8F8F8">
        <button
          onClick={() => setShowTable(!showTable)}
          style={{ minWidth: '100%' }}
        >
          <Flex pl="20px" pt="20px" pb="20px" align="center" maxW="100%">
            <HistoryIcon minW="20px" minH="20px" />
            <Text
              pl="12px"
              fontWeight="600"
              fontFamily={'Hanken Grotesk'}
              fontSize={'19px'}
            >
              Form History
            </Text>
            <Spacer />
            <Box pr="23px" pb="3px">
              {showTable ? (
                <DropdownDownArrow minW="14px" minH="14px" />
              ) : (
                <DropdownUpArrow minW="14px" minH="14px" />
              )}
            </Box>
          </Flex>
        </button>
        {showTable && <DataTable columns={columns} data={data} />}
      </Box>
    </>
  );
};
