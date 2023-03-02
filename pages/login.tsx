import { auth } from '@/firebase/client';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

type FormValue = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>();

  const submit = ({ email, password }: FormValue) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('ログインしました');
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            return alert('不正なメールアドレスです');
          case 'auth/user-disabled':
            return alert('無効なユーザーです');
          case 'auth/user-not-found':
            return alert('該当のユーザーが存在しません');
          case 'auth/wrong-password':
            return alert('パスワードが間違っています');
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <h2>ログイン</h2>

        <div>
          <label>
            <p>メールアドレス</p>
            <input
              required
              type="email"
              autoComplete="email"
              {...register('email', {
                required: '必須入力です',
              })}
            />
          </label>
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>
            <p>パスワード</p>
            <input
              required
              type="password"
              autoComplete="current-password"
              {...register('password', {
                required: '必須入力です',
              })}
            />
          </label>
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button>ログイン</button>
      </form>

      <div>
        <p>
          パスワードを忘れた方は
          <Link
            href={{
              pathname: 'signup',
              query: {
                view: 'reset-password',
              },
            }}
            replace
            shallow
          >
            パスワードを再設定
          </Link>
        </p>
        <p>
          まだアカウントをお持ちでない方は
          <Link href="signup">アカウント登録</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
