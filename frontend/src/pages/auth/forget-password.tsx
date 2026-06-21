import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgetPasswordSchema } from '../../../../shared/schemes/user/forgetPasswordSchema';
import type { ForgetPassword } from '../../../../shared/schemes/user/forgetPasswordSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldLabel, FieldError, Field } from '@/components/ui/field';
import useForgetPassword from '@/hooks/auth/useForgetPassword';
export default function ForgetPassword() {
  const { register, formState, handleSubmit } = useForm<ForgetPassword>({
    resolver: zodResolver(forgetPasswordSchema),
  });
  const { isPending, mutate } = useForgetPassword();
  return (
    <div className="max-w-[600px] mx-auto flex-1 flex flex-col justify-center">
      <h1 className="text-center text-4xl">forget password</h1>
      <form
        className="py-10 px-2.5"
        onSubmit={handleSubmit((email: ForgetPassword) => {
          mutate(email);
        })}
      >
        <Field
          className="py-2.5"
          aria-invalid={formState.errors.email ? 'true' : 'false'}
        >
          <FieldLabel
            htmlFor="email"
            className="text-2xl capitalize font-normal"
          >
            email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            sz="lg"
            placeholder="Email"
            aria-invalid={formState.errors.email ? 'true' : 'false'}
            {...register('email')}
          />
          {formState.errors.email && (
            <FieldError>{formState.errors.email.message}</FieldError>
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
