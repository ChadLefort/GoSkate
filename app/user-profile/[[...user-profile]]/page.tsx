import { UserProfile } from '@clerk/nextjs';

export default function UserProfilePage() {
  return (
    <div className="flex flex-grow justify-center items-center">
      <UserProfile path="/user-profile" routing="path" />
    </div>
  );
}
