import { Box, NumberInput, NumberInputField, Text } from '@chakra-ui/react';

import { useAppSelector } from 'hooks/useRedux';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import DurationBlock, { ListDurationProps } from 'components/DurationBlock';
import { BLOCK_TIME } from 'utils/constants';
import { useEffect, useState } from 'react';
import { AccountSwapFieldProps } from '..';
import AccountSwapReceive from '../AccountSwapReceive';

interface SwapMyProps {
  setValue: UseFormSetValue<AccountSwapFieldProps>;
  watch: UseFormWatch<AccountSwapFieldProps>;
  control: Control<AccountSwapFieldProps, any>;
}

export default ({ control, setValue, watch }: SwapMyProps) => {
  const { account } = useAppSelector(state => state.injected.polkadot);
  const { duration: duration_watch, price, my_self } = watch();

  const ListDuration: ListDurationProps[] = [
    {
      text: '1 Minutes',
      time: 60 / BLOCK_TIME,
    },
    {
      text: '5 Minutes',
      time: 300 / BLOCK_TIME,
    },
    {
      text: '1 Hours',
      time: 3600 / BLOCK_TIME,
    },
    {
      text: '1 Day',
      time: (86400 * 1) / BLOCK_TIME,
    },
    {
      text: '1 Week',
      time: (86400 * 7) / BLOCK_TIME,
    },
    {
      text: '2 Weeks',
      time: (86400 * 14) / BLOCK_TIME,
    },
    {
      text: '1 Month',
      time: (86400 * 30) / BLOCK_TIME,
    },
  ];

  const [duration, setDuration] = useState(ListDuration[0]);

  useEffect(() => {
    setValue(`duration`, duration);
  }, [duration]);

  useEffect(() => {
    if (!duration_watch) {
      setValue(`duration`, duration);
    }
  }, [duration_watch]);

  return (
    <>
      {account?.address && account.name && (
        <Box
          sx={{
            '> div': {
              padding: 4,
              borderBottom: '0.0625rem solid',
              borderColor: 'shader.a.300',
            },
          }}
        >
          <Box>
            <Text fontWeight="medium" color="shader.a.1000">
              My NFTs
            </Text>
          </Box>

          <Box>
            <Box
              mb={2}
              onClick={event => {
                event.stopPropagation();
              }}
            >
              <Text
                color="shader.a.1000"
                fontSize="sm"
                fontWeight="medium"
                mb={1}
              >
                Price&nbsp;
                <Text
                  as="span"
                  fontSize="xs"
                  fontWeight="normal"
                  color="shader.a.600"
                >
                  (Optional)
                </Text>
              </Text>

              <NumberInput
                min={0}
                onChange={event => setValue('price', event)}
                value={price ? price : ''}
              >
                <NumberInputField
                  placeholder="Ex: 0"
                  borderRadius="lg"
                  border="0.0625rem solid"
                  borderColor="shader.a.300"
                  bg="shader.a.100"
                  fontSize="sm"
                  fontWeight="medium"
                  color="shader.a.900"
                  _placeholder={{ color: 'shader.a.600', fontWeight: 'normal' }}
                />
              </NumberInput>
            </Box>

            <DurationBlock
              duration={duration}
              setCurrentDuration={setDuration}
              listDuration={ListDuration}
              sx={{
                sx: {
                  p: {
                    color: 'shader.a.1000',
                    fontSize: 'sm',
                    fontWeight: 'medium',
                    mb: 1,
                  },
                  svg: { color: 'primary.a.500' },
                },
              }}
            />
          </Box>

          <AccountSwapReceive
            control={control}
            data={my_self}
            setValue={setValue}
            value="my_self"
          />
        </Box>
      )}
    </>
  );
};
