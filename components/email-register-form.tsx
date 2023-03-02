import { auth } from '@/firebase/client';
import { User } from '@/types/user';
import { ActionCodeSettings, sendSignInLinkToEmail } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import validator from 'validator';

type FormValue = {
  email: string;
};

const EmailRegisterForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValue>({
    mode: 'onChange',
  });

  const submit = ({ email }: Pick<User, 'email'>) => {
    const actionSettings: ActionCodeSettings = {
      url: window.origin + '/signup?view=set-password',
      handleCodeInApp: true,
    };
    sendSignInLinkToEmail(auth, email, actionSettings).then(() => {
      alert('認証メールを送信しました。メールのリンクをクリックしてください。');
      window.localStorage.setItem('emailForSignIn', email);
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <h1>アカウント作成</h1>

      <label>
        <p>メールアドレス</p>
        <input
          required
          type="email"
          autoComplete="email"
          {...register('email', {
            required: '必須入力です',
            validate: (value) => validator.isEmail(value) || '不正な形式です',
          })}
        />
      </label>
      {errors.email && <p>{errors.email.message}</p>}

      <button disabled={!isValid}>アカウント作成</button>

      <p>
        アカウントをお持ちの方は
        <Link href="login">ログイン</Link>
      </p>
    </form>
  );
};

export default EmailRegisterForm;
