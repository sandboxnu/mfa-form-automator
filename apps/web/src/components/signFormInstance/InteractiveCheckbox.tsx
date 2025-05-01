import { TextFieldPosition } from '../createFormTemplate/types';
import { Checkbox } from '@chakra-ui/react';
import { useSignFormInstance } from '../../hooks/useSignFormInstance';

export default function InteractiveCheckbox({
  data,
  color,
  currentPosition,
  pageNum,
  id,
}: {
  data: boolean;
  color: string;
  currentPosition: TextFieldPosition;
  pageNum: number;
  id: string;
}) {
  const { updateField } = useSignFormInstance();

  return (
    <Checkbox.Root
      backgroundColor={color}
      position={'absolute'}
      blockSize={10}
      left={`${currentPosition.x}px`}
      top={`${currentPosition.y}px`}
      width={`10px`}
      height={`10px`}
      defaultChecked={data}
      onCheckedChange={(val) => updateField(pageNum, id, val.checked)}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator backgroundColor={color} color={'black'} />
      </Checkbox.Control>
    </Checkbox.Root>
    // </Box>
  );
}
