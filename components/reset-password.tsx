import { auth } from '@/firebase/client';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Button from './button';

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

  const submit = ({ email }: FormValue) => {
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
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <div>
          <h2>パスワード再設定</h2>
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
    </div>
  );
};

export default ResetPassword;
