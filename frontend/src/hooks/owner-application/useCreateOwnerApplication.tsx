import { createOwnerApplication } from '@/api/ownerApplication';
import useMutationWrapper from '../useMutationWrapper';
import type { OwnerApplicationFormOutput } from '@lankaStay/shared/schemes/user/ownerApplicationFormSchema';
export default function useCreateOwnerApplication() {
  const { data, isPending, mutate } = useMutationWrapper(
    ({
      applicationData,
      accessToken,
    }: {
      applicationData: OwnerApplicationFormOutput;
      accessToken: string;
    }) => createOwnerApplication(applicationData, accessToken),
    false,
  );
  return { data, isPending, mutate };
}
