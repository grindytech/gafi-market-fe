import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { isNull } from '@polkadot/util';
import NumberInputMaxLength from 'components/NumberInput/NumberInputMaxLength';
import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';
import { useForm } from 'react-hook-form';
import { sumGAFI } from 'utils/utils';

interface MintNowProps {
  pool_id: number;
  price: string;
}

interface MintNowFieldProps {
  amount: number;
}

export default ({ price, pool_id }: MintNowProps) => {
  const { account } = useAppSelector(state => state.injected.polkadot);
  const { api } = useAppSelector(state => state.substrate);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { control, handleSubmit, reset, watch } = useForm<MintNowFieldProps>();
  const { mutation, isLoading } = useSignAndSend({
    key: [`mint/${pool_id}`],
    address: account?.address as string,
    onSuccess() {
      onSuccess();
    },
  });

  const onSuccess = () => {
    onClose();
    reset();
  };

  return (
    <>
      <Button variant="primary" padding={6} borderRadius="3xl" onClick={onOpen}>
        Mint now
      </Button>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onSuccess}
          closeOnOverlayClick={!isLoading}
        >
          <ModalOverlay />

          <ModalContent
            as="form"
            onSubmit={handleSubmit(({ amount }) => {
              if (api && account?.address) {
                mutation(
                  api.tx.game.requestMint(
                    pool_id,
                    account.address,
                    sumGAFI(price, amount, true)
                  )
                );
              }
            })}
          >
            <ModalBody>
              <NumberInputMaxLength
                formState={{
                  control,
                  value: 'amount',
                  isInvalid: isNull(watch().amount),
                  isRequired: true,
                  max: 10,
                  min: 1,
                }}
                heading="Amount"
                sx={{
                  flexDirection: 'column',
                  gap: 3,
                }}
              />
            </ModalBody>

            <ModalFooter gap={3}>
              <Button variant="cancel" onClick={onClose} isDisabled={isLoading}>
                Close
              </Button>

              <Button
                variant="primary"
                type="submit"
                isLoading={isLoading}
                _hover={isLoading ? {} : undefined}
              >
                Sign & Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
