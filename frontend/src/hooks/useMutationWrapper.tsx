import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiResponse } from '@lankaStay/shared/utils/ApiResponse';
import ApiError from '@lankaStay/shared/utils/ApiError';
export default function useMutationWrapper<A = unknown, T = null>(
  mutationFunction: (args: A) => Promise<ApiResponse<T>>,
  showSuccessToast = true,
) {
  const {
    data: response,
    isPending,
    mutate,
    mutateAsync,
    isSuccess,
  } = useMutation<ApiResponse<T>, ApiError, A>({
    mutationFn: mutationFunction,
    onError: (error) => {
      if (error.details) {
        toast.error(
          <div>
            <p>{error.message}</p>
            <ul className="list-disc pl-4 mt-1">
              {Object.entries(error.details).map(([field, msg]) => (
                <li key={field}>
                  {field}: {msg}
                </li>
              ))}
            </ul>
          </div>,
        );
      } else {
        toast.error(error.message);
      }
    },
    onSuccess: (response) => {
      if (showSuccessToast) return toast.success(response.message);
    },
  });
  return {
    data: response && 'data' in response ? response.data : null,
    isPending,
    mutate,
    mutateAsync,
    isSuccess,
  };
}
