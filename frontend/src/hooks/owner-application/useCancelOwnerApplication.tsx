import { cancelOwnerApplication } from '@/api/ownerApplication';
import useMutationWrapper from '../useMutationWrapper';
import type { UserResponseType } from '@lankaStay/shared/schemes/user/userResponseSchema';
export default function useCancelOwnerApplication() {
  const { isPending, mutate } = useMutationWrapper<
    void,
    {
      user: UserResponseType;
    }
  >(() => cancelOwnerApplication());
  return { isPending, mutate };
}
