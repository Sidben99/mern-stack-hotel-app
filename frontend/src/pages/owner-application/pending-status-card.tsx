import { Clock1, CircleX } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import InfoRow from './info-row';
import type { OwnerInfoResponseType } from '@lankaStay/shared/schemes/user/userResponseSchema';

type ApplicationField = {
  key: keyof OwnerInfoResponseType;
  label: string;
};
const applicationFields: readonly ApplicationField[] = [
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'nationalNumber', label: 'National number' },
  { key: 'dateOfBirth', label: 'Date of birth' },
  { key: 'address', label: 'Address' },
];

function formatFieldValue(
  value: OwnerInfoResponseType[keyof OwnerInfoResponseType],
) {
  if (value instanceof Date) {
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(
      value,
    );
  }
  return String(value);
}

export default function PendingStatusCard({
  ownerInfoFromResponse,
}: {
  ownerInfoFromResponse: OwnerInfoResponseType;
}) {
  return (
    <Card className="max-w-3xl text-center flex flex-col align-center w-full m-auto">
      <CardHeader>
        <Badge
          variant={'default'}
          className="rounded-full bg-blue-200 text-blue-900 [&>svg]:size-10 size-12 m-auto"
        >
          <Clock1></Clock1>
        </Badge>
        <CardTitle className="text-4xl">Application Pending Review</CardTitle>
        <CardDescription>
          {' '}
          your application is pending at this moment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto mb-4 max-w-sm overflow-hidden rounded-xl border bg-card">
          <img
            src={ownerInfoFromResponse.cardImgInfo.img_url}
            alt="national card"
            className="w-full object-cover"
          />
        </div>
        <dl className="mx-auto divide-y rounded-xl border bg-card px-6">
          {applicationFields.map(({ key, label }) => (
            <InfoRow
              key={key}
              label={label}
              value={formatFieldValue(ownerInfoFromResponse[key])}
            />
          ))}
        </dl>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant={'outline'}
          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          {' '}
          <CircleX size={16}></CircleX>cancel application
        </Button>
      </CardFooter>
    </Card>
  );
}
