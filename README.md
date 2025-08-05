# ポートフォリオ用ランディングページ

モダンで美しいデザインのポートフォリオ用ランディングページです。レスポンシブデザイン、アニメーション、インタラクティブな機能を備えています。

## 特徴

- 🎨 **モダンなデザイン**: グラデーションと美しいカラーパレット
- 📱 **レスポンシブ対応**: スマートフォン、タブレット、デスクトップに対応
- ⚡ **高速パフォーマンス**: 最適化されたCSSとJavaScript
- 🎭 **スムーズアニメーション**: スクロール時のアニメーション効果
- 📝 **お問い合わせフォーム**: バリデーション機能付き
- 🎯 **SEO対応**: 適切なHTML構造とメタタグ

## セクション構成

1. **ヒーローセクション**: インパクトのある導入部分
2. **私について**: 自己紹介と統計情報
3. **スキル**: 技術スキルの可視化
4. **プロジェクト**: 作品紹介
5. **お問い合わせ**: 連絡フォーム

## ファイル構成

```
LP/
├── index.html      # メインHTMLファイル
├── style.css       # スタイルシート
├── script.js       # JavaScript機能
└── README.md       # このファイル
```

## セットアップ

1. ファイルをダウンロードまたはクローン
2. `index.html`をブラウザで開く
3. 必要に応じてコンテンツをカスタマイズ

## カスタマイズ方法

### 個人情報の変更

`index.html`内の以下の部分を編集してください：

- 開発者名: `.profile-card h3`内
- メールアドレス: `.contact-method`内
- 電話番号: `.contact-method`内
- GitHubリンク: `.contact-method`内

### スキルの変更

`index.html`内の`.skill-item`セクションを編集：

```html
<div class="skill-item">
    <span>スキル名</span>
    <div class="skill-bar">
        <div class="skill-fill" style="width: 85%"></div>
    </div>
</div>
```

### プロジェクトの追加

`index.html`内の`.project-card`セクションをコピーして編集：

```html
<div class="project-card">
    <div class="project-image">
        <i class="fas fa-icon-name"></i>
    </div>
    <div class="project-content">
        <h3>プロジェクト名</h3>
        <p>プロジェクトの説明</p>
        <div class="project-tags">
            <span>技術1</span>
            <span>技術2</span>
        </div>
    </div>
</div>
```

### 色の変更

`style.css`内の以下の変数を編集：

```css
/* メインカラー */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* アクセントカラー */
background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%);
```

## 使用技術

- **HTML5**: セマンティックなマークアップ
- **CSS3**: Flexbox、Grid、アニメーション
- **JavaScript (ES6+)**: インタラクティブ機能
- **Font Awesome**: アイコン
- **Google Fonts**: Noto Sans JP

## ブラウザ対応

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## サポート

質問や問題がある場合は、お気軽にお問い合わせください。

---

**注意**: このテンプレートは教育目的で作成されています。商用利用の際は、適切なライセンスを確認してください。 