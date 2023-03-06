import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { auth } from '@/firebase/client';
import Button from '@/components/button';

type FormValue = {
  email: string;
  password: string;
};

const EmailPasswordLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>();

  const submit = ({ email, password }: FormValue): Promise<void> => {
    return signInWithEmailAndPassword(auth, email, password)
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
            return alert('該当するユーザーが存在しません');
          case 'auth/wrong-password':
            return alert('パスワードが間違っています');
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <h1>ログイン</h1>

        <div>
          <label>
            <p>メールアドレス</p>
            <input
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
              type="password"
              autoComplete="current-password"
              {...register('password', {
                required: '必須入力です',
              })}
            />
          </label>
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <Button disabled={isSubmitting}>
          {isSubmitting ? 'ログイン中' : 'ログイン'}
        </Button>
      </form>

      <div>
        <p>
          パスワードを忘れた方は
          <Link
            className="default-link"
            href={{
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
          <Link
            className="default-link"
            href={{
              query: {
                view: 'register',
              },
            }}
            replace
            shallow
          >
            アカウント登録
          </Link>
        </p>
      </div>
    </>
  );
};

export default EmailPasswordLoginForm;
