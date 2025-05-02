import { Box } from '@chakra-ui/react';

export const ButtonSwitch = ({
  isToggleLeft,
  onClickLeft,
  onClickRight,
  activeColor,
  leftLabel,
  rightLabel,
}: {
  isToggleLeft: boolean;
  onClickLeft: () => void;
  onClickRight: () => void;
  activeColor: string;
  leftLabel: string;
  rightLabel: string;
}) => {
  const Button = ({
    label,
    side,
    isActive,
    onToggle,
  }: {
    label: string;
    side: 'left' | 'right';
    isActive: boolean;
    onToggle: () => void;
  }) => {
    return (
      <Box
        as="button"
        flex="1"
        borderWidth="1px"
        borderRadius={side === 'left' ? '4px 0 0 4px' : '0 4px 4px 0'}
        padding="6px 12px"
        fontWeight="500"
        fontSize="15px"
        borderColor={isActive ? activeColor : '#C0C0C0'}
        color={isActive ? activeColor : '#63646B'}
        onClick={onToggle}
        cursor={'pointer'}
      >
        {label}
      </Box>
    );
  };

  return (
    <Box display="inline-flex">
      <Button
        label={leftLabel}
        isActive={isToggleLeft}
        side="left"
        onToggle={onClickLeft}
      />
      <Button
        label={rightLabel}
        isActive={!isToggleLeft}
        side="right"
        onToggle={onClickRight}
      />
    </Box>
  );
};
