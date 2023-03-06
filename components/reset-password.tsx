import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Button from './button';
import { auth } from '@/firebase/client';

type FormValue = {
  email: string;
};

const ResetPassword = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValue>({
    mode: 'onChange',
  });

  const submit = async ({ email }: FormValue): Promise<void> => {
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        alert(
          '再設定用のメールを送信しました。メールのリンクをクリックしてください。'
        );
        router.push('/login');
      })
      .catch(() => alert('該当するアカウントは存在しません。'));
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <div>
          <h1>パスワード再設定</h1>
          <p>パスワード再設定メールを送る</p>

          <label>
            <p>メールアドレス</p>
            <input
              required
              type="email"
              autoComplete="email"
              {...register('email', {
                required: '必須入力です',
                validate: (value) =>
                  validator.isEmail(value) || '不正な形式です',
              })}
            />
          </label>
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <Button disabled={!isValid}>送信</Button>
      </form>

      <div>
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
        <Link
          className="default-link"
          href={{
            query: {
              view: 'login',
            },
          }}
          replace
          shallow
        >
          ログイン
        </Link>
      </div>
    </>
  );
};

export default ResetPassword;
