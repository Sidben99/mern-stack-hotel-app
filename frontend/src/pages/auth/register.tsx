import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import useRegister from '@/hooks/auth/useRegister';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import {
  registerSchema,
  type RegisterType,
} from '@lankaStay/shared/schemes/user/registerSchema.ts';
import { countriesEntries } from '@lankaStay/shared/consts/countries';
import background from '../../assets/image 5.png';
import { useUserStore } from '@/store/userStore.ts';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
export default function Register() {
  const { register, control, formState, handleSubmit } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });
  const { mutate, isPending } = useRegister();
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
          data-testid="register-form"
          noValidate
          className="py-10 px-2.5 "
          onSubmit={handleSubmit((submitedUser) => {
            mutate(submitedUser, {
              onSuccess(response) {
                setAuthState(response.data);
                navigate('/', { replace: true });
              },
            });
          })}
        >
          <Field
            className="py-2.5"
            aria-invalid={formState.errors.username ? 'true' : 'false'}
          >
            <FieldLabel
              htmlFor="username"
              className="text-2xl capitalize font-normal"
            >
              Username
            </FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="enter your username"
              sz="lg"
              aria-invalid={formState.errors.username ? 'true' : 'false'}
              {...register('username')}
            />
            {formState.errors.username && (
              <FieldError>{formState.errors.username.message}</FieldError>
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
          <Controller
            control={control}
            name="nationality"
            render={({ field, fieldState }) => (
              <Field
                className="py-2.5"
                aria-invalid={fieldState.invalid ? 'true' : 'false'}
              >
                <FieldLabel
                  htmlFor="nationality"
                  className="text-2xl capitalize font-normal"
                >
                  Nationality
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="nationality"
                    aria-invalid={fieldState.invalid ? 'true' : 'false'}
                  >
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {countriesEntries.map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <Field
                className="py-2.5"
                aria-invalid={fieldState.invalid ? 'true' : 'false'}
              >
                <FieldLabel
                  htmlFor="phoneNumber"

                  className="text-2xl capitalize font-normal"
                >
                  Phone Number
                </FieldLabel>
                <PhoneInput
                  id="phoneNumber"
                  onChange={field.onChange}
                  value={field.value}
                  inputComponent={Input}
                ></PhoneInput>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
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
              Confirm Password
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
            data-testid="login-link"
          >
            login
          </Link>
        </form>
      </div>
    </div>
  );
}
