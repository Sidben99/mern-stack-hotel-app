import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  loginSchema,
  type LoginType,
} from '../../../../shared/schemes/user/loginSchema.ts';
import background from '../../assets/image 5.png';
import useLogin from '@/hooks/auth/useLogin';
import { useUserStore } from '@/store/userStore';
export default function Login() {
  const { isPending, mutate } = useLogin();
  const { register, formState, handleSubmit } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });
  const setAuthState = useUserStore((state) => state.setAuthState);
  const navigate = useNavigate();
  return (
    <div className="form-container grid grid-cols-1 md:grid-cols-2 flex-1">
      <div
        className="bg-no-repeat bg-cover bg-center hidden md:block "
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="py-5 max-w-96 mx-auto flex flex-col justify-center">
        <h1 className="text-center text-4xl">Login Account</h1>
        <form
          className="py-10 px-2.5 "
          onSubmit={handleSubmit((credentials) => {
            mutate(credentials, {
              onSuccess(response) {
                setAuthState(response.data);
                navigate('/', { replace: true });
              },
            });
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
          <Field
            className="py-2.5"
            aria-invalid={formState.errors.password ? 'true' : 'false'}
          >
            <FieldLabel
              htmlFor="password"
              className="text-2xl capitalize font-normal"
            >
              Password
            </FieldLabel>
            <Input
              id="password"
              type="password"
              sz="lg"
              placeholder="+6 characters"
              aria-invalid={formState.errors.password ? 'true' : 'false'}
              {...register('password')}
            />
            {formState.errors.password && (
              <FieldError>{formState.errors.password.message}</FieldError>
            )}
          </Field>
          <Button
            type="submit"
            onClick={() => console.log('clicked')}
            className="w-full mt-5"
            size="lg"
            disabled={isPending}
            loading={isPending}
          >
            submit
          </Button>
        </form>
        <Link to="/auth/forget-password" className="text-center underline">
          forgot your password ?
        </Link>
        <Link
          className="capitalize block text-center text-2xl mt-5 underline"
          to="/auth/register"
        >
          create account
        </Link>
      </div>
    </div>
  );
}
