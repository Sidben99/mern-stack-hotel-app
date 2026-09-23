import { CircleAlert } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function RejectedStatusCard({
  rejectionNote,
}: {
  rejectionNote: string | undefined;
}) {
  const rejectionNoteText = rejectionNote ?? 'No rejection note provided';
  return (
    <Card className="max-w-3xl text-center flex flex-col align-center w-full m-auto">
      <CardHeader>
        <Badge
          variant={'default'}
          className="rounded-full bg-red-200 text-red-900 [&>svg]:size-10 size-12 m-auto"
        >
          <CircleAlert></CircleAlert>
        </Badge>
        <CardTitle className="text-4xl">
          <h1>Application has been rejected</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Card className="bg-foreground/5 text-start">
          <CardHeader>
            <CardTitle>
              <div className="flex gap-2.5 items-center">
                <CircleAlert></CircleAlert>
                <h2 className="text-xl ">Reason for Rejection</h2>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-lg my-2.5">issue detected :</p>
            <p> {rejectionNoteText} </p>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-center gap-2.5">
        <Link to="/owner-application/apply">
          <Button>retry application</Button>
        </Link>
        <Link to="/support">
          <Button variant={'outline'}>contact support</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
