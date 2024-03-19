import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex flex-grow justify-center items-center">
      <SignIn />
    </div>
  );
}
