import { Button, Flex, Text, Box, Center } from '@chakra-ui/react';
import { useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { FormTemplateEntity, Scope, SortBy } from '@web/client';
import {
  formTemplatesControllerFindAllInfiniteOptions,
  formTemplatesControllerFindAllInfiniteQueryKey,
  formTemplatesControllerFindAllQueryKey,
  formTemplatesControllerUpdateMutation,
} from '@web/client/@tanstack/react-query.gen';
import { SearchAndSort } from '@web/components/SearchAndSort';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import isAuth from '@web/components/isAuth';
import {
  CloseIcon,
  DeleteIcon,
  EditIcon,
  SeparatorIcon,
} from '@web/static/icons';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { queryClient } from './_app';
import { distance } from 'fastest-levenshtein';
import { DeleteConfirmModal } from '@web/components/DeleteConfirmModal';
import { useRouterContext } from '@web/context/RouterProvider';

/**
 * @returns A page for admins and contributors to see all templates and the templates they have created.
 */
function TemplateDirectory() {
  const router = useRouter();
  const loadMoreTriggerRef = useRef(null);

  const [formTemplate, setFormTemplate] = useState<FormTemplateEntity | null>(
    null,
  );
  // isOpen for the 'are you sure you want to delete' modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortBy>(SortBy.CREATED_AT_DESC);
  const [sortedFormTemplates, setSortedFormTemplates] = useState<
    FormTemplateEntity[]
  >([]);
  const { isRouteChanging } = useRouterContext();

  const {
    data: infiniteFormTemplates,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...formTemplatesControllerFindAllInfiniteOptions({
      query: {
        sortBy: sortOption,
      },
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (typeof lastPageParam !== 'number') {
        return undefined;
      }
      if (lastPage.formTemplates.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const formTemplates = useMemo(() => {
    if (!infiniteFormTemplates) return [];
    return infiniteFormTemplates.pages.flatMap((page) => page.formTemplates);
  }, [infiniteFormTemplates]);

  useEffect(() => {
    if (!formTemplates) return;
    setSortedFormTemplates(
      formTemplates
        .map((template) => ({
          ...template,
          levenshteinDistance: distance(
            searchQuery.toLowerCase().slice(0, 10),
            template.name.toLowerCase().slice(0, 10),
          ),
        }))
        .sort((a, b) => a.levenshteinDistance - b.levenshteinDistance),
    );
  }, [searchQuery, formTemplates]);

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTrigger = loadMoreTriggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const disableFormTemplateMutation = useMutation({
    ...formTemplatesControllerUpdateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllInfiniteQueryKey(),
      });
    },
  });

  /**
   * Marks the form template as "disabled" so it will appear as deleted to
   * users.  This action will not affect existing form instances.  This
   * action cannot be undone from the site, but the template will remain
   * in the database.
   */
  const submitRemove = async () => {
    setIsLoading(true);
    if (!formTemplate) {
      return;
    }

    await disableFormTemplateMutation
      .mutateAsync({
        body: {
          disabled: true,
        },
        path: {
          id: formTemplate.id,
        },
      })
      .catch((e) => {
        throw e;
      });

    setIsOpen(false);
    setFormTemplate(null);
    setIsLoading(false);
  };

  /**
   * Called on selection of editing a form template.  Prefills useCreateFormTemplate
   * data and navigates to create template flow in edit mode.
   */
  function navigateToFormTemplateEditMode() {
    if (!formTemplate) {
      return;
    }
    router.push('/form-template/' + formTemplate.id + '/edit/description');
  }

  const hasTemplates = formTemplates.length > 0;
  const hasFilteredTemplates = sortedFormTemplates.length > 0;

  return (
    <>
      <Flex
        height="100%"
        marginTop="36px"
        marginX={'40px'}
        gap="32px"
        flexDirection={'column'}
      >
        <Text fontSize="30px" fontWeight="700" lineHeight="38px">
          Templates
        </Text>
        {formTemplate ? (
          <Flex
            padding="4px 0px 4px 8px"
            justifyContent={'space-between'}
            alignItems={'center'}
            borderRadius="2px"
            background="#EAEEF1"
          >
            <Flex padding="0px 8px" alignItems="center" gap="8px">
              <CloseIcon
                width="16px"
                height="16px"
                onClick={() => {
                  setFormTemplate(null);
                }}
                cursor="pointer"
              />
              <Flex
                as="button"
                height="38px"
                padding="8px 16px"
                justifyContent={'center'}
                alignItems="center"
                gap="8px"
                onClick={navigateToFormTemplateEditMode}
                cursor={'pointer'}
              >
                <EditIcon mb="4px" />
                <Text color="var(--Gray, #515151)">Edit Form</Text>
              </Flex>
              <SeparatorIcon width="2px" height="22px" />
              <Flex
                height="38px"
                padding="8px 16px"
                justifyContent={'center'}
                alignItems="center"
                gap="8px"
                onClick={() => {
                  setIsOpen(true);
                }}
                cursor={'pointer'}
              >
                <DeleteIcon mt="6px" ml="4px" color="var(--Gray, #515151)" />
                <Text color="var(--Gray, #515151)">Delete</Text>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Flex
            flexDirection="row"
            height="46px"
            justifyContent="space-between"
            alignItems={'center'}
            alignSelf={'stretch'}
          >
            <Flex gap="8px">
              <Button
                borderRadius="28px"
                background={'var(--Blue, #1367EA)'}
                padding="4px 12px"
                display={'inline-flex'}
                height="28px"
                _hover={{
                  bgColor: 'var(--Blue, #1367EA)',
                }}
              >
                <Text color="#FFF" fontSize={'17px'} fontWeight={'500'}>
                  All Templates
                </Text>
              </Button>
            </Flex>
            {formTemplates ? (
              <SearchAndSort
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setSortOption={setSortOption}
                placeholder="Search forms"
              />
            ) : (
              <></>
            )}
          </Flex>
        )}

        {hasTemplates ? (
          hasFilteredTemplates ? (
            <TemplateSelectGrid
              formTemplates={sortedFormTemplates}
              allowCreate={false}
              handleSelectTemplate={(template: FormTemplateEntity) =>
                setFormTemplate(template)
              }
              selectedFormTemplate={formTemplate}
            />
          ) : (
            <Center
              borderWidth="1px"
              borderRadius="8px"
              py="80px"
              backgroundColor="white"
            >
              <Text fontSize="16px" color="#5E5E5E">
                No templates match your search
              </Text>
            </Center>
          )
        ) : (
          <Center
            borderWidth="1px"
            borderRadius="8px"
            py="80px"
            backgroundColor="white"
          >
            <Text fontSize="16px" color="#5E5E5E">
              No form templates available
            </Text>
          </Center>
        )}

        {/* Infinite scroll loading trigger */}
        {hasNextPage && (
          <Box ref={loadMoreTriggerRef} height="20px" textAlign="center" my={4}>
            {isFetchingNextPage ? 'Loading...' : ''}
          </Box>
        )}

        <Flex
          padding="20px"
          justifyContent="space-between"
          alignItems="center"
          height="76px"
          alignSelf={'stretch'}
          backgroundColor="#FFF"
          borderColor="1px solid #E5E5E5"
          borderRadius={'8px'}
          marginBottom={'10px'}
        >
          <Text fontSize="19px">
            Not seeing the form template you&apos;re looking for?
          </Text>
          <Button
            borderRadius="6px"
            border="1px solid #1367EA"
            background="#FFF"
            padding="7px"
            loading={isRouteChanging}
            variant="outline"
          >
            <Text
              fontFamily="Hanken Grotesk"
              color="#1367EA"
              fontSize="17px"
              fontWeight={'500px'}
              lineHeight={'20px'}
              onClick={() => {
                router.push('form-template/create/upload');
              }}
            >
              Create Form Template
            </Text>
          </Button>
        </Flex>
      </Flex>
      <DeleteConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={submitRemove}
        deleteObjectType="Template"
        deleteObjectName={formTemplate?.name ?? ''}
        isLoading={isLoading}
      />
    </>
  );
}

export default isAuth(TemplateDirectory, [Scope.ADMIN]);
