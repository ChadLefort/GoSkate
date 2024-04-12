import { UserProfile } from '@clerk/nextjs';

export default function UserProfilePage() {
  return (
    <div className="flex flex-grow items-center justify-center">
      <UserProfile path="/user-profile" routing="path" />
    </div>
  );
}
