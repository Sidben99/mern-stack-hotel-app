import { type OwnerApplicationFormOutput } from '@lankaStay/shared/schemes/user/ownerApplicationFormSchema';
import fetchWithAuthWrapper from './fetchWithAuthWrapper';
import type { UserResponseType } from '@lankaStay/shared/schemes/user/userResponseSchema';
export function createOwnerApplication(
  application: OwnerApplicationFormOutput,
) {
  const formData = new FormData();
  const applicationData = {
    ...application,
    dateOfBirth: new Date(application.dateOfBirth).toISOString(),
  };
  for (const [key, value] of Object.entries(applicationData)) {
    formData.append(key, value);
  }

  return fetchWithAuthWrapper<{ user: UserResponseType }>(
    'http://localhost:5000/api/user/owner-application',
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    },
  );
}
export function cancelOwnerApplication() {
  return fetchWithAuthWrapper<{ user: UserResponseType }>(
    'http://localhost:5000/api/user/owner-application/cancel',
    {
      method: 'POST',
      credentials: 'include',
    },
  );
}
