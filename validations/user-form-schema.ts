import { z } from 'zod';

// lengths
const NAME_MIN_LENGTH = 1;
const NAME_MAX_LENGTH = 50;
const EMAIL_MAX_LENGTH = 256;
const birthDateRegex = new RegExp(
  /^[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/
);
export const userFormSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, '必須入力です')
    .max(NAME_MAX_LENGTH, `${NAME_MAX_LENGTH}文字以内で入力してください`),
  email: z
    .string()
    .max(EMAIL_MAX_LENGTH)
    .email('メールアドレスの形式が正しくありません'),
  avatarUrl: z.string().url('正しい形式の画像を選択してください'),
  birthday: z
    .string()
    .min(1, '必須入力です')
    .transform((val) => {
      if (birthDateRegex.test(val)) {
        return val;
      }

      const formatBirthday = (value: string, index: 4 | 7): string => {
        return value.slice(0, index) + '/' + value.slice(index);
      };
      let newDateNum = formatBirthday(val, 4);
      newDateNum = formatBirthday(newDateNum, 7);

      return newDateNum;
    })
    .refine(
      (val) => {
        console.log(birthDateRegex.test(val), val);
        return birthDateRegex.test(val);
      },
      {
        message: '生年月日が正しく入力されていません',
      }
    ),
  gender: z.enum(['female', 'male', 'other'], {
    errorMap: (_issue, _ctx) => ({ message: '性別を選択してください' }),
  }),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;
