import { Form } from "utils/types"
import { HStack, Flex, Box, Text } from "@chakra-ui/react"
import { FormCard } from "./FormCard"
import { RightArrowIcon } from "@/static/icons"
import Link from "next/link";

export const OverviewRow = ({ title, color, link, forms }: { title: string, color: string, link: string, forms: Form[]}) => {
  let displayForms: Form[] = forms.slice(0, Math.min(4, forms.length));
  let rowWidth: number = displayForms.length * 246
  return <>
    <Box width={rowWidth}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Text fontSize="22px" fontWeight="800">
            {title}
          </Text>
          <Flex marginLeft="13px" backgroundColor={color} height="18px" width="32px" borderRadius="12" justifyContent="center" alignItems="center">
            <Text fontSize="14px" fontWeight="700" color="#756160">{forms.length}</Text>
          </Flex>
        </Flex>
        <Link href={link}>
          <Flex alignItems="center">
            <Text fontWeight="500" fontSize="16px" color="#4C658A">
              See all {title} 
            </Text>
            <RightArrowIcon width="10px" height="10px" marginLeft="4px"/>
          </Flex>
        </Link>
      </Flex>
      <HStack spacing="16px" marginTop="20px">
        {displayForms.map((form: Form, index: number) => {
          return <FormCard formName={form.name} assignees={form.assignees} key={index} />
        })}
      </HStack>
    </Box>
  </>
}