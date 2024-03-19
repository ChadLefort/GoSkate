import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex flex-grow justify-center items-center">
      <SignUp />
    </div>
  );
}
