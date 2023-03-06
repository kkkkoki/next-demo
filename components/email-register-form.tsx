import Link from 'next/link';
import {
  ActionCodeSettings,
  fetchSignInMethodsForEmail,
  sendSignInLinkToEmail,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import { auth } from '@/firebase/client';
import { User } from '@/types/user';
import Button from '@/components/button';
import styles from '@/styles/components/email-register-form.module.scss';

type FormValue = {
  email: string;
  checked: boolean;
};

const EmailRegisterForm = () => {
  const termsUrl =
    'https://menherasenpai.notion.site/457df49475494671807673a0a3346451';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>({
    mode: 'onChange',
  });

  const submit = async ({
    email,
  }: Pick<User, 'email'>): Promise<void | null> => {
    const IsEmailExists = (await fetchSignInMethodsForEmail(auth, email))
      .length;
    if (IsEmailExists) {
      alert('既に登録されているメールアドレスです。');
      return null;
    }

    const actionSettings: ActionCodeSettings = {
      url: window.origin + '/login?view=set-password',
      handleCodeInApp: true,
    };
    return sendSignInLinkToEmail(auth, email, actionSettings).then(() => {
      alert('認証メールを送信しました。メールのリンクをクリックしてください。');
      window.localStorage.setItem('emailForSignIn', email);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <h1>新規登録</h1>

        <label>
          <p>メールアドレス</p>
          <input
            type="email"
            autoComplete="email"
            {...register('email', {
              required: '必須入力です',
              validate: (value) => validator.isEmail(value) || '不正な形式です',
            })}
          />
        </label>
        {errors.email && <p>{errors.email.message}</p>}

        <div className={styles.terms}>
          <input
            type="checkbox"
            id="terms"
            {...register('checked', {
              required: '次に進むには利用規約へ同意して下さい',
            })}
          />
          <label className={styles.terms__label} htmlFor="terms">
            <a
              className="default-link"
              href={termsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              利用規約
            </a>
            <span>に同意する</span>
          </label>
        </div>
        {errors.checked && <p>{errors.checked.message}</p>}

        <Button disabled={isSubmitting}>
          {isSubmitting ? '登録中...' : '登録する'}
        </Button>
      </form>

      <p>
        アカウントをお持ちの方は
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
      </p>
    </>
  );
};

export default EmailRegisterForm;
