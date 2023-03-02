import EmailRegisterForm from '@/components/email-register-form';
import PasswordForm from '@/components/password-form';
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
        <p className="p-3 rounded-lg mb-4 bg-black/20 text-sm">
          {fbUser.email} でログイン中です。
          <button className="text-pink-500" onClick={() => signOut(auth)}>
            ログアウト
          </button>
        </p>
      )}

      {view === 'register' && <EmailRegisterForm />}
      {view === 'set-password' && <PasswordForm />}
      {view === 'reset-password' && <p>reset-password</p>}
    </div>
  );
};

export default Signup;
