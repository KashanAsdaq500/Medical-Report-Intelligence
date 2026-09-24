import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <SignUp />
    </main>
  );
}
