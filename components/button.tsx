import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from '@/styles/components/_button.module.scss';

const Button = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
}) => {
  return (
    <button className={styles.primary_btn} {...props}>
      {children}
    </button>
  );
};

export default Button;
