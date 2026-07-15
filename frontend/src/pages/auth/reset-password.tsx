import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordNewPasswordSchema,
  type ResetPasswordNewPasswordType,
} from '@lankaStay/shared/schemes/user/resetPasswordSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldLabel, FieldError, Field } from '@/components/ui/field';
import { useSearchParams } from 'react-router-dom';
import useResetPassword from '@/hooks/auth/useResetPassword';
export default function ResetPassword() {
  const { register, formState, handleSubmit } =
    useForm<ResetPasswordNewPasswordType>({
      resolver: zodResolver(resetPasswordNewPasswordSchema),
    });
  const { isPending, mutate } = useResetPassword();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  return (
    <div className="max-w-[600px] mx-auto flex-1 flex flex-col justify-center">
      <h1 className="text-center text-4xl">reset password</h1>
      <form
        noValidate
        className="py-10 px-2.5"
        onSubmit={handleSubmit((passwords: ResetPasswordNewPasswordType) => {
          const { password } = passwords;
          mutate({ password, token });
        })}
      >
        <Field
          className="py-2.5"
          aria-invalid={formState.errors.password ? 'true' : 'false'}
        >
          <FieldLabel
            htmlFor="password"
            className="text-2xl capitalize font-normal"
          >
            password
          </FieldLabel>
          <Input
            id="password"
            type="password"
            sz="lg"
            placeholder="password"
            aria-invalid={formState.errors.password ? 'true' : 'false'}
            {...register('password')}
          />
          {formState.errors.password && (
            <FieldError>{formState.errors.password.message}</FieldError>
          )}
        </Field>
        <Field
          className="py-2.5"
          aria-invalid={formState.errors.confirmPassword ? 'true' : 'false'}
        >
          <FieldLabel
            htmlFor="confirmPassword"
            className="text-2xl capitalize font-normal"
          >
            confirm password
          </FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            sz="lg"
            placeholder="confirm password"
            aria-invalid={formState.errors.confirmPassword ? 'true' : 'false'}
            {...register('confirmPassword')}
          />
          {formState.errors.confirmPassword && (
            <FieldError>{formState.errors.confirmPassword.message}</FieldError>
          )}
        </Field>
        <Button
          type="submit"
          className="w-full mt-5"
          size="lg"
          disabled={isPending}
          loading={isPending}
        >
          submit
        </Button>
      </form>
    </div>
  );
}
