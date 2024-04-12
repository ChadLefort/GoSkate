import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex flex-grow items-center justify-center">
      <SignUp />
    </div>
  );
}
