import { useForm } from 'react-hook-form';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ownerApplicationFormSchema,
  type OwnerApplicationFormInput,
  type OwnerApplicationFormOutput,
} from '@lankaStay/shared/schemes/user/ownerApplicationFormSchema';
import background from '../../assets/image 5.png';
import type { OwnerApplicationContext } from './index';
import useCreateOwnerApplication from '@/hooks/owner-application/useCreateOwnerApplication';
export default function OwnerApplicationForm() {
  const { isPending, mutate } = useCreateOwnerApplication();
  const { authState, setAuthState } =
    useOutletContext<OwnerApplicationContext>();
  const { register, formState, handleSubmit } = useForm<
    OwnerApplicationFormInput,
    undefined,
    OwnerApplicationFormOutput
  >({
    resolver: zodResolver(ownerApplicationFormSchema),
  });
  const navigate = useNavigate();
  return (
    <div className="form-container grid grid-cols-1 md:grid-cols-2 flex-1">
      <div
        className="bg-no-repeat bg-cover bg-center hidden md:block "
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="py-5 max-w-96 mx-auto flex flex-col justify-center">
        <h1 className="text-center text-4xl">become an owner</h1>
        <form
          className="py-10 px-2.5 "
          noValidate
          onSubmit={handleSubmit((applicationData) => {
            mutate(
              { applicationData },
              {
                onSuccess(response) {
                  setAuthState({
                    accessToken: authState.accessToken,
                    user: response.data.user,
                  });
                  navigate('/owner-application', { replace: true });
                },
              },
            );
          })}
        >
          <div className="flex gap-2.5">
            <Field
              className="py-2.5"
              aria-invalid={formState.errors.firstName ? 'true' : 'false'}
            >
              <FieldLabel
                htmlFor="firstname"
                className="text-2xl capitalize font-normal"
              >
                first name
              </FieldLabel>
              <Input
                id="firstName"
                sz="lg"
                placeholder="First Name"
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
                htmlFor="lastName"
                className="text-2xl capitalize font-normal"
              >
                last name
              </FieldLabel>
              <Input
                id="lastName"
                sz="lg"
                placeholder="Last Name "
                aria-invalid={formState.errors.lastName ? 'true' : 'false'}
                {...register('lastName')}
              />
              {formState.errors.lastName && (
                <FieldError>{formState.errors.lastName.message}</FieldError>
              )}
            </Field>
          </div>
          <Field
            className="py-2.5"
            aria-invalid={formState.errors.dateOfBirth ? 'true' : 'false'}
          >
            <FieldLabel
              htmlFor="dateOfBirth"
              className="text-2xl capitalize font-normal"
            >
              Date of Birth
            </FieldLabel>
            <Input
              id="dateOfBirth"
              type="date"
              sz="lg"
              aria-invalid={formState.errors.dateOfBirth ? 'true' : 'false'}
              {...register('dateOfBirth')}
            />
            {formState.errors.dateOfBirth && (
              <FieldError>{formState.errors.dateOfBirth.message}</FieldError>
            )}
          </Field>
          <Field
            className="py-2.5"
            aria-invalid={formState.errors.nationalNumber ? 'true' : 'false'}
          >
            <FieldLabel
              htmlFor="nationalNumber"
              className="text-2xl capitalize font-normal"
            >
              National Number
            </FieldLabel>
            <Input
              id="nationalNumber"
              sz="lg"
              aria-invalid={formState.errors.nationalNumber ? 'true' : 'false'}
              {...register('nationalNumber')}
            />
            {formState.errors.nationalNumber && (
              <FieldError>{formState.errors.nationalNumber.message}</FieldError>
            )}
          </Field>
          <Field
            className="py-2.5"
            aria-invalid={formState.errors.cardImg ? 'true' : 'false'}
          >
            <FieldLabel
              htmlFor="cardImg"
              className="text-2xl capitalize font-normal"
            >
              National Card Upload
            </FieldLabel>
            <Input
              id="cardImg"
              type="file"
              sz="lg"
              aria-invalid={formState.errors.cardImg ? 'true' : 'false'}
              {...register('cardImg')}
            />
            {formState.errors.cardImg && (
              <FieldError>{formState.errors.cardImg.message}</FieldError>
            )}
          </Field>
          <Field
            className="py-2.5"
            aria-invalid={formState.errors.address ? 'true' : 'false'}
          >
            <FieldLabel
              htmlFor="cardImg"
              className="text-2xl capitalize font-normal"
            >
              Address
            </FieldLabel>
            <Textarea
              id="address"
              aria-invalid={formState.errors.address ? 'true' : 'false'}
              {...register('address')}
            />
            {formState.errors.address && (
              <FieldError>{formState.errors.address.message}</FieldError>
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
        <Link to="/" className="text-center underline">
          back to home
        </Link>
      </div>
    </div>
  );
}
