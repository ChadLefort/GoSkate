import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex flex-grow items-center justify-center">
      <SignIn />
    </div>
  );
}
