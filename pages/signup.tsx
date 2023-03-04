import Button from '@/components/button';
import EmailRegisterForm from '@/components/email-register-form';
import PasswordForm from '@/components/password-form';
import ResetPassword from '@/components/reset-password';
import { useAuth } from '@/context/auth';
import { auth } from '@/firebase/client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

const Signup = () => {
  const { fbUser } = useAuth();
  const router = useRouter();
  const view =
    (router.query.view as
      | 'reset-password'
      | 'register'
      | 'login'
      | 'set-password') || 'register';

  return (
    <div>
      <h1>CreateAccount</h1>
      {fbUser && (
        <p>
          {fbUser.email} でログイン中です。
          <Button onClick={() => signOut(auth)}>ログアウト</Button>
        </p>
      )}

      {view === 'register' && <EmailRegisterForm />}
      {view === 'set-password' && <PasswordForm />}
      {view === 'reset-password' && <ResetPassword />}
    </div>
  );
};

export default Signup;
