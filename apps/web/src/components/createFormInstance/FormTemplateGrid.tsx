import { Grid, Box, Flex, Text, Button } from '@chakra-ui/react';
import { PDFDocument } from '../PDFDocument';
import router from 'next/router';
import { FormTemplateEntity } from '@web/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { formTemplatesControllerFindAllInfiniteOptions } from '@web/client/@tanstack/react-query.gen';
import FormLoading from '../FormLoading';
import { memo, useMemo } from 'react';

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

// Memoized LoadMoreButton component
const LoadMoreButton = memo(
  ({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }: {
    fetchNextPage: () => void;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
  }) => (
    <Flex justifyContent="center" marginTop="16px">
      <Button
        w={'164px'}
        h="36px"
        borderRadius="6px"
        alignContent={'center'}
        background={'#1367EA'}
        _hover={{
          background: 'auto',
        }}
        marginLeft="12px"
        marginRight="36px"
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </Button>
    </Flex>
  ),
);

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
    // Only use the infinite query if no formTemplates are passed
    const {
      data: infiniteFormTemplates,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
    } = useInfiniteQuery({
      ...formTemplatesControllerFindAllInfiniteOptions(),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (typeof lastPageParam !== 'number') {
          return undefined;
        }
        if (lastPage.length === 0) {
          return undefined;
        }
        return lastPageParam + 1;
      },
      enabled: !passedFormTemplates, // Only enable if no formTemplates are passed
    });

    // If we have passed form templates, use those instead of the infinite query results
    const displayTemplates = useMemo(() => {
      if (passedFormTemplates) {
        return passedFormTemplates;
      }

      if (!infiniteFormTemplates) return [];

      // Flatten the pages array from infinite query
      return infiniteFormTemplates.pages.flatMap((page) => page);
    }, [passedFormTemplates, infiniteFormTemplates]);

    // Only show loading state if we're using infinite query AND we're fetching the initial data
    if (isFetching && !passedFormTemplates && !infiniteFormTemplates) {
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

        {/* Only show load more button when using infinite query */}
        {!passedFormTemplates && hasNextPage && (
          <LoadMoreButton
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </>
    );
  },
);
