import { Grid, Box, Flex, Text, Button, HStack } from '@chakra-ui/react';
import { PDFDocument } from '../PDFDocument';
import router from 'next/router';
import { FormTemplateEntity } from '@web/client';
import { useQuery } from '@tanstack/react-query';
import { formTemplatesControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen';
import FormLoading from '../FormLoading';
import { memo, useMemo, useState } from 'react';

// Memoized template item component
const TemplateItem = memo(
  ({
    template,
    selectedFormTemplate,
    handleSelectTemplate,
  }: {
    template: FormTemplateEntity;
    selectedFormTemplate: FormTemplateEntity | null;
    handleSelectTemplate: (template: FormTemplateEntity) => void;
  }) => {
    return (
      <Flex
        flexDirection="column"
        onClick={() => handleSelectTemplate(template)}
        cursor="pointer"
        width="200px"
        marginBottom="16px"
        box-sizing="borderBox"
      >
        <Box
          overflow="hidden"
          height="250px"
          borderRadius="4px"
          border="1px solid #D4D4D4"
          boxShadow={
            template.id === selectedFormTemplate?.id
              ? '0px 0px 4px 0px #1367EA'
              : 'none'
          }
          _hover={{ boxShadow: '0px 0px 4px 0px #1367EA' }}
        >
          <PDFDocument formLink={template.formDocLink} />
        </Box>
        <Flex
          display="flex"
          width="200px"
          marginTop="8px"
          fontSize="15px"
          fontWeight="500"
          flexWrap={'wrap'}
        >
          {template.name}
        </Flex>
      </Flex>
    );
  },
);
TemplateItem.displayName = 'TemplateItem';

const CreateTemplateButton = memo(() => (
  <Flex key="create-template" flexDirection="column" cursor="pointer">
    <Button
      overflow="hidden"
      height="250px"
      width="200px"
      borderRadius="4px"
      border="1px solid #D4D4D4"
      padding="8px"
      backgroundColor="white"
      _hover={{ boxShadow: '0px 0px 4px 0px #1367EA' }}
      onClick={() => {
        router.push('/create-template/upload');
      }}
    >
      <Text fontSize="60px" fontWeight="50" color="black">
        +
      </Text>
    </Button>
    <Text
      flex="center"
      justifyContent="center"
      fontSize="15px"
      fontWeight="500"
      marginTop="8px"
    >
      Create Form Template
    </Text>
  </Flex>
));
CreateTemplateButton.displayName = 'CreateTemplateButton';

// Pagination component
const Pagination = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    // Calculate the range of page numbers to display (show up to 5 pages)
    const getPageNumbers = () => {
      const pageNumbers = [];
      let startPage = Math.max(0, currentPage - 2);
      const endPage = Math.min(startPage + 4, totalPages - 1);

      // Adjust startPage if we're near the end
      if (endPage - startPage < 4) {
        startPage = Math.max(0, endPage - 4);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      return pageNumbers;
    };

    return (
      <Flex
        direction="column"
        w="100%"
        alignItems="center"
        mt={6}
        mb={4}
        flexDir={'row-reverse'}
      >
        {/* Pagination controls */}
        <HStack gap={1} background="white" borderRadius="8px" p="8px">
          <Button
            size="md"
            width="36px"
            height="36px"
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
            bg={currentPage === 0 ? '#9E9E9E' : '#9E9E9E'}
            background="white"
            _hover={{ bg: currentPage === 0 ? '#1058C7' : '#DCDCDC' }}
            borderRadius="6px"
            color="black"
          >
            &lt;&lt;
          </Button>
          <Button
            size="md"
            width="36px"
            height="36px"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            bg={currentPage === 0 ? '#9E9E9E' : '#9E9E9E'}
            background="white"
            _hover={{ bg: currentPage === 0 ? '#1058C7' : '#DCDCDC' }}
            borderRadius="6px"
            color="black"
          >
            &lt;
          </Button>

          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              size="md"
              width="36px"
              height="36px"
              onClick={() => onPageChange(pageNum)}
              bg={currentPage === pageNum ? '#5770FF' : '#212121'}
              background={currentPage === pageNum ? '#1367EA' : 'white'}
              _hover={{ bg: currentPage === pageNum ? '#1058C7' : '#DCDCDC' }}
              borderRadius="6px"
              color={currentPage === pageNum ? 'white' : 'black'}
            >
              {pageNum + 1}
            </Button>
          ))}

          <Button
            size="md"
            width="36px"
            height="36px"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            bg={currentPage === totalPages - 1 ? '#9E9E9E' : '#212121'}
            background="white"
            _hover={{
              bg: currentPage === totalPages - 1 ? '#1058C7' : '#DCDCDC',
            }}
            borderRadius="6px"
            color="black"
          >
            &gt;
          </Button>
          <Button
            size="md"
            width="36px"
            height="36px"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            bg={currentPage === totalPages - 1 ? '#9E9E9E' : '#212121'}
            background="white"
            _hover={{
              bg: currentPage === totalPages - 1 ? '#1058C7' : '#DCDCDC',
            }}
            borderRadius="6px"
            color="black"
          >
            &gt;&gt;
          </Button>
        </HStack>
      </Flex>
    );
  },
);
Pagination.displayName = 'Pagination';

type TemplateSelectGridProps = {
  allowCreate: boolean;
  handleSelectTemplate: (template: FormTemplateEntity) => void;
  selectedFormTemplate: FormTemplateEntity | null;
  formTemplates?: FormTemplateEntity[];
};

export const TemplateSelectGrid = memo(
  ({
    allowCreate,
    handleSelectTemplate,
    selectedFormTemplate,
    formTemplates: passedFormTemplates,
  }: TemplateSelectGridProps) => {
    // State for pagination
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8; // Server returns 8 items per page

    // Query for templates when no templates are passed in
    const { data: queryData, isLoading } = useQuery({
      ...formTemplatesControllerFindAllOptions({
        query: { cursor: currentPage },
      }),
      enabled: !passedFormTemplates,
    });

    // Calculate total number of pages
    const totalItems =
      passedFormTemplates?.length ??
      (queryData?.length === itemsPerPage
        ? (currentPage + 2) * itemsPerPage
        : (currentPage + 1) * itemsPerPage);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Handle page change
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
    };

    // If we have passed form templates, use those instead of the queried results
    const displayTemplates = useMemo(() => {
      if (passedFormTemplates) {
        // If we have passed templates, we'll paginate them client-side
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        return passedFormTemplates.slice(start, end);
      }

      return queryData || [];
    }, [passedFormTemplates, queryData, currentPage, itemsPerPage]);

    // Only show loading state if we're loading the initial data and no templates are passed
    if (isLoading && !passedFormTemplates) {
      return <FormLoading />;
    }

    return (
      <>
        <Grid
          id="frame"
          templateColumns={'repeat(auto-fill, minmax(200px, 1fr))'}
          gap="16px"
          justifyContent="space-between"
          justifyItems={'stretch'}
        >
          {displayTemplates.map((template) => (
            <TemplateItem
              key={template.id}
              template={template}
              selectedFormTemplate={selectedFormTemplate}
              handleSelectTemplate={handleSelectTemplate}
            />
          ))}

          {allowCreate && <CreateTemplateButton />}
        </Grid>

        {/* Only show pagination when there are multiple pages */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </>
    );
  },
);
TemplateSelectGrid.displayName = 'TemplateSelectGrid';
