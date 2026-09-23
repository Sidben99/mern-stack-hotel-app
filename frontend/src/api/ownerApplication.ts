import { type OwnerApplicationFormOutput } from '@lankaStay/shared/schemes/user/ownerApplicationFormSchema';
import fetchWrapper from './fetchWrapper';
import type { UserResponseType } from '@lankaStay/shared/schemes/user/userResponseSchema';
export function createOwnerApplication(
  application: OwnerApplicationFormOutput,
  accessToken: string,
) {
  const formData = new FormData();
  const applicationData = {
    ...application,
    dateOfBirth: new Date(application.dateOfBirth).toISOString(),
  };
  for (const [key, value] of Object.entries(applicationData)) {
    formData.append(key, value);
  }

  return fetchWrapper<{ user: UserResponseType }>(
    'http://localhost:5000/api/user/owner-application',
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}
