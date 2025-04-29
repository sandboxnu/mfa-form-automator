import { Button, Flex, Input } from '@chakra-ui/react';
import { RxCross2 } from 'react-icons/rx';

export const NewPositionCard = ({
  positionName,
  setPositionName,
  onCancel,
  onSave,
  isLoading,
}: {
  positionName: string;
  setPositionName: (name: string) => void;
  onCancel: () => void;
  onSave: () => void;
  isLoading: boolean;
}) => {
  return (
    <Flex
      borderRadius="5px"
      bg="#FFF"
      boxShadow="0px 3px 4px 0px rgba(0, 0, 0, 0.05)"
      padding="13px 16px"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      gapX="30px"
    >
      <Input
        value={positionName}
        onChange={(e) => setPositionName(e.target.value)}
        fontSize="16px"
        width="100%"
        autoFocus
        padding="0px 8px"
        placeholder="Enter position name"
      />
      <Flex alignItems="center" gap="12px">
        <Button onClick={onCancel} variant="outline" border="1px solid #1367EA">
          <RxCross2 color="#1367EA" />
        </Button>
        <Button
          onClick={onSave}
          loading={isLoading}
          padding="4px 20px"
          borderRadius="6px"
          border="1px solid #1367EA"
          backgroundColor="#1367EA"
          color="#FFF"
          fontWeight="700"
          lineHeight="20px"
        >
          Create
        </Button>
      </Flex>
    </Flex>
  );
};
