import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import useRegister from '@/hooks/auth/useRegister';
import {
  registerSchema,
  type RegisterType,
} from '../../../../shared/schemes/user/registerSchema.ts';
import background from '../../assets/image 5.png';
import { useUserStore } from '@/store/userStore.ts';

export default function Register() {
  const { register, formState, handleSubmit } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });
  const { mutateAsync, isPending } = useRegister();
  const setAuthState = useUserStore((state) => state.setAuthState);
  const navigate = useNavigate();
  return (
    <div className="form-container grid grid-cols-1 md:grid-cols-2 flex-1">
      <div
        className="bg-no-repeat bg-cover bg-center hidden md:block "
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="py-5 max-w-2xs mx-auto flex flex-col justify-center">
        <h1 className="text-center text-4xl">Create Account</h1>
        <form
          className="py-10 px-2.5 "
          onSubmit={handleSubmit(async (submitedUser) => {
            const response = await mutateAsync(submitedUser);
            setAuthState(response.data);
            navigate('/');
          })}
        >
          <Field
            className="py-2.5"
            aria-invalid={formState.errors.firstName ? 'true' : 'false'}
          >
            <FieldLabel
              htmlFor="firstname"
              className="text-2xl capitalize font-normal"
            >
              First Name
            </FieldLabel>
            <Input
              id="firstname"
              type="text"
              placeholder="enter you first name"
              sz="lg"
              aria-invalid={formState.errors.firstName ? 'true' : 'false'}
              {...register('firstName')}
            />
            {formState.errors.firstName && (
              <FieldError>{formState.errors.firstName.message}</FieldError>
            )}
          </Field>
          <Field
            className="py-2.5"
            aria-invalid={formState.errors.lastName ? 'true' : 'false'}
          >
            <FieldLabel
              htmlFor="lastname"
              className="text-2xl capitalize font-normal"
            >
              Last Name
            </FieldLabel>
            <Input
              id="lastname"
              type="text"
              sz="lg"
              placeholder="enter you last name"
              aria-invalid={formState.errors.lastName ? 'true' : 'false'}
              {...register('lastName')}
            />
            {formState.errors.lastName && (
              <FieldError>{formState.errors.lastName.message}</FieldError>
            )}
          </Field>
          <Field
            className="py-2.5"
            aria-invalid={formState.errors.email ? 'true' : 'false'}
          >
            <FieldLabel
              htmlFor="email"
              className="text-2xl capitalize font-normal"
            >
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              sz="lg"
              placeholder="name@gmail.com"
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
              htmlFor="passowrd"
              className="text-2xl capitalize font-normal"
            >
              Password
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="+6 characters"
              sz="lg"
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
              htmlFor="confirmPassowrd"
              className="text-2xl capitalize font-normal"
            >
              Confirm Passowrd
            </FieldLabel>
            <Input
              id="confirmPassowrd"
              type="password"
              sz="lg"
              placeholder="+6 characters"
              aria-invalid={formState.errors.confirmPassword ? 'true' : 'false'}
              {...register('confirmPassword')}
            />
            {formState.errors.confirmPassword && (
              <FieldError>
                {formState.errors.confirmPassword.message}
              </FieldError>
            )}
          </Field>
          <Button
            type="submit"
            className="w-full mt-5"
            size="lg"
            disabled={isPending}
          >
            submit
            {isPending && <Spinner className="ml-2" />}
          </Button>
          <Link
            className="capitalize block text-center text-2xl mt-5 underline"
            to="/auth/login"
          >
            login
          </Link>
        </form>
      </div>
    </div>
  );
}
