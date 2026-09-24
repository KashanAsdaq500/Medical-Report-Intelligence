import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <SignIn />
    </main>
  );
}
