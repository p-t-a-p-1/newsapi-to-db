'use strict'

// models内のDB設定読み込み
const db = require('./models/index')
// Postsテーブル
const Posts = db.Posts

/**
 * TODO NEWS API から 記事取得しDBに保存
 */

// Postsテーブルに追加（テスト）
Posts.create({
  categoryId: 1,
  title: 'apiテスト',
  content: 'apiテストapiテストapiテスト',
  thumbImg: 'https://placehold.jp/150x150.png',
  pv: 0,
  author: 'ralsnet',
  originUrl: 'https://www.google.com'
}).then(() => {
  // DBとの接続終了
  db.sequelize.close()
})
