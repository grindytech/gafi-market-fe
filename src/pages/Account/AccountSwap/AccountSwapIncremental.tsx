import {
  Flex,
  FlexProps,
  Icon,
  IconButton,
  IconButtonProps,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

import AddIcon from 'public/assets/line/add.svg';
import Minusicon from 'public/assets/line/minus.svg';
import { Control, Controller } from 'react-hook-form';

interface AccountSwapIncrementalProps {
  control: Control<any, any>;
  value: string;
  sx?: FlexProps;
}
export default ({ control, value, sx }: AccountSwapIncrementalProps) => {
  const GroupButton = (props: IconButtonProps) => (
    <IconButton
      className={props['aria-label']}
      variant="unstyled"
      borderRadius="2xl"
      border="0.0625rem solid"
      borderColor="shader.a.300"
      padding={1}
      {...props}
    />
  );

  return (
    <Flex alignItems="center" gap={3} {...sx}>
      <Controller
        control={control}
        name={value}
        render={({ field }) => (
          <>
            <GroupButton
              aria-label="add-icon"
              icon={<Icon as={AddIcon} width={4} height={4} />}
              onClick={() => field.onChange(++field.value)}
            />

            <NumberInput
              min={1}
              name={field.name}
              value={field.value}
              onChange={event =>
                event.length ? field.onChange(event) : field.onChange(1)
              }
            >
              <NumberInputField fontWeight="medium" color="shader.a.900" />
            </NumberInput>

            <GroupButton
              aria-label="minus-icon"
              icon={<Icon as={Minusicon} width={4} height={4} />}
              onClick={() => field.onChange(--field.value)}
            />
          </>
        )}
      />
    </Flex>
  );
};
