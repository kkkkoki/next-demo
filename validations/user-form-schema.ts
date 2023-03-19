import { z } from 'zod';

// lengths
const NAME_MIN_LENGTH = 1;
const NAME_MAX_LENGTH = 50;
const EMAIL_MAX_LENGTH = 256;

const GENDER_LIST = [
  {
    value: 'female',
    label: '男性',
  },
  {
    value: 'male',
    label: '女性',
  },
  {
    value: 'other',
    label: 'その他',
  },
];

export const userFormSchema = z.object({
  name: z
    .string({
      required_error: 'ユーザー名を入力してください',
      invalid_type_error: '名前は文字列で入力してください',
    })
    .min(NAME_MIN_LENGTH, `${NAME_MIN_LENGTH}文字以上で入力してください`)
    .max(NAME_MAX_LENGTH, `${NAME_MAX_LENGTH}文字以内で入力してください`),
  email: z
    .string({
      required_error: 'メールアドレスを入力してください',
    })
    .max(EMAIL_MAX_LENGTH)
    .email('メールアドレスの形式が正しくありません'),
  avatarUrl: z
    .string({
      required_error: 'アバター画像を選択してください',
      invalid_type_error: '正しい形式の画像を選択してください',
    })
    .url('正しい形式の画像を選択してください'),
  birthday: z
    .string()
    .transform((val) => {
      const formatBirthday = (value: string, index: 4 | 7): string => {
        return value.slice(0, index) + '/' + value.slice(index);
      };
      let newDateNum = formatBirthday(val, 4);
      newDateNum = formatBirthday(newDateNum, 7);
      return newDateNum;
    })
    .refine(
      (val) => {
        const birthDateRegex = new RegExp(
          /^[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/
        );
        return birthDateRegex.test(val);
      },
      {
        message: '生年月日が正しく入力されていません',
      }
    ),
  gender: z
    .string({ required_error: '性別を選択してください' })
    .refine((val) => GENDER_LIST.map((gender) => gender.value).includes(val), {
      message: '性別が正しく入力されていません',
    }),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;
