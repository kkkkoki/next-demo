import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useAuth } from '@/context/auth';
import Button from '@/components/button';
import EmailPasswordLogin from '@/components/email-password-login-form';
import EmailRegisterForm from '@/components/email-register-form';
import PasswordForm from '@/components/password-form';
import ResetPassword from '@/components/reset-password';

const Login = () => {
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
      {fbUser && (
        <p>
          {fbUser.email} でログイン中です。
          <Button onClick={() => signOut(auth)}>ログアウト</Button>
        </p>
      )}

      {view === 'register' && <EmailRegisterForm />}
      {view === 'set-password' && <PasswordForm />}
      {view === 'reset-password' && <ResetPassword />}
      {view === 'login' && <EmailPasswordLogin />}
    </div>
  );
};

export default Login;
