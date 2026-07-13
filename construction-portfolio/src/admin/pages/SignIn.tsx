import { SignIn, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function AdminSignIn() {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/admin/company" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8">DremCons. Admin</h1>
        <SignIn
          routing="path"
          path="/admin/sign-in"
          signUpUrl="/admin/sign-in"
          fallbackRedirectUrl="/admin/company"
          appearance={{
            variables: {
              colorPrimary: "#eab308",
              colorBackground: "#0f172a",
              colorText: "#ffffff",
              colorInputBackground: "#1e293b",
              colorInputText: "#ffffff",
            },
            elements: {
              card: "shadow-2xl rounded-2xl",
            },
          }}
        />
      </div>
    </div>
  );
}
