import AvatarImg from './avatarImg';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { UserResponseType } from '@lankaStay/shared/schemes/user/userResponseSchema';
export default function Profile({
  user,
  isOpen,
}: {
  user: UserResponseType;
  isOpen: boolean;
}) {
  return (
    <div className=" flex justify-center items-center gap-2.5">
      <AvatarImg src={user.avatar} alt="avatar"></AvatarImg>
      <span className="text-sm">{user.username}</span>
      {isOpen ? (
        <ChevronUp width={20} height={20}></ChevronUp>
      ) : (
        <ChevronDown width={20} height={20}></ChevronDown>
      )}
    </div>
  );
}
