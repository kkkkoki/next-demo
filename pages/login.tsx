import Link from 'next/link';
import React from 'react';

const Login = () => {
  return (
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
  );
};

export default Login;
