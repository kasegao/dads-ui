# @kasegao/dads-ui

[デジタル庁デザインシステム](https://design.digital.go.jp/dads/)（DADS）の非公式なReact実装です。スタイルにPanda CSS、一部のコンポーネントにArk UIを使っています。

デジタル庁が作成・公開しているものではありません。

## インストール

```sh
pnpm add @kasegao/dads-ui
```

React 19以上が必要です。

## 使い方

Panda CSSを使わないアプリでは、スタイルシートを読み込んでからコンポーネントを使います。

```tsx
import '@kasegao/dads-ui/styles.css';
import { Button } from '@kasegao/dads-ui';

<Button variant='solid-fill' size='lg'>
  送信
</Button>;
```

Panda CSSを使うアプリでは、スタイルシートを読み込む代わりに、`panda.config.ts`で`designSystem`を指定します。

```ts
export default defineConfig({
  designSystem: '@kasegao/dads-ui',
  include: ['./src/**/*.{ts,tsx}'],
});
```

## 開発

```sh
pnpm install
pnpm storybook
```

## ライセンス

[MIT](./LICENSE)

デジタル庁が公開している次のコードを加工して作成しました。いずれもMITライセンスです。

- [design-system-example-components-react](https://github.com/digital-go-jp/design-system-example-components-react)
- [design-system-example-components-html](https://github.com/digital-go-jp/design-system-example-components-html)
- [design-tokens](https://github.com/digital-go-jp/design-tokens)

一部のアイコンはGoogleの[Material Symbols](https://github.com/google/material-design-icons)に由来し、[Apache License 2.0](./LICENSES/Apache-2.0.txt)が適用されます。
