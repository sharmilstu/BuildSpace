import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Code2 } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const { user, loading, signIn, signUp, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isForgot) {
      const { error } = await resetPassword(email.trim());
      if (error) toast.error(error.message);
      else toast.success("Check your email for a reset link.");
      setSubmitting(false);
      return;
    }

    if (isLogin) {
      const { error } = await signIn(email.trim(), password);
      if (error) toast.error(error.message);
    } else {
      if (!name.trim() || !username.trim()) {
        toast.error("Name and username are required.");
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email.trim(), password, {
        name: name.trim(),
        username: username.trim(),
      });
      if (error) toast.error(error.message);
      else toast.success("Account created! Check your email to confirm.");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">
            {isForgot ? "Reset Password" : isLogin ? "Welcome back" : "Create account"}
          </CardTitle>
          <CardDescription>
            {isForgot
              ? "Enter your email to receive a reset link."
              : isLogin
              ? "Sign in to BuildSpace"
              : "Join the BuildSpace community"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgot && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="auth-name">Name</Label>
                  <Input id="auth-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="auth-username">Username</Label>
                  <Input id="auth-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jane_dev" />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="auth-email">Email</Label>
              <Input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            {!isForgot && (
              <div className="space-y-1.5">
                <Label htmlFor="auth-password">Password</Label>
                <Input id="auth-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting
                ? "Please wait..."
                : isForgot
                ? "Send Reset Link"
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 space-y-2 text-center text-sm">
            {!isForgot && (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsForgot(true)}
              >
                Forgot password?
              </button>
            )}
            <div>
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => { setIsLogin(!isLogin); setIsForgot(false); }}
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
            {isForgot && (
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setIsForgot(false)}
              >
                Back to Sign In
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
