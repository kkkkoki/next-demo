import { auth } from '@/firebase/client';
import { useAuth } from '@/context/auth';
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Button from './button';

type FormValue = {
  password: string;
};

const PasswordForm = () => {
  const { fbUser } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValue>({
    mode: 'onChange',
  });

  const submit = ({ password }: FormValue) => {
    if (fbUser) {
      updatePassword(fbUser, password)
        .then(() => {
          router.push({
            query: {
              id: router.query.id,
              view: 'login',
            },
          });
          alert('パスワードの設定が完了しました。');
        })
        .catch((error) => {
          console.log(error);
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
    <form onSubmit={handleSubmit(submit)}>
      <h2>パスワード設定</h2>

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

      <Button disabled={!isValid}>パスワード設定</Button>

      <p>
        アカウントをお持ちの方は
        <Link
          className="default-link"
          replace
          shallow
          href={{
            query: {
              id: router.query.id,
              view: 'login',
            },
          }}
        >
          ログイン
        </Link>
      </p>
    </form>
  );
};

export default PasswordForm;
