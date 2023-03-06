import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Button from './button';
import { auth } from '@/firebase/client';
import { useAuth } from '@/context/auth';

type FormValue = {
  password: string;
};

const PasswordForm = () => {
  const { fbUser } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValue>({
    mode: 'onChange',
  });

  const submit = async ({ password }: FormValue): Promise<void> => {
    if (fbUser) {
      return updatePassword(fbUser, password)
        .then(() => {
          router.push({
            query: {
              view: 'login',
            },
          });
          alert('パスワードの設定が完了しました。');
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('メールアドレスを入力してください');
        return;
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <h1>パスワード設定</h1>

        <label>
          <p>パスワード</p>
          <input
            required
            type="password"
            autoComplete="new-password"
            {...register('password', {
              required: '必須入力です',
              validate: (value) =>
                validator.isStrongPassword(value) || '脆弱なパスワードです',
            })}
          />
          <p>大文字小文字の半角英数字と数字記号を含む8文字以上</p>
          {errors.password && <p>{errors.password.message}</p>}
        </label>

        <Button disabled={isSubmitting}>パスワード設定</Button>
      </form>

      <p>
        アカウントをお持ちの方は
        <Link
          className="default-link"
          replace
          shallow
          href={{
            query: {
              view: 'login',
            },
          }}
        >
          ログイン
        </Link>
      </p>
    </>
  );
};

export default PasswordForm;
