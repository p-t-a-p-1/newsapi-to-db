'use strict'
// 同期処理用モジュール
const async = require('async')
// models内のDB設定読み込み
const db = require('./models/index')
// Categoriesテーブル
const Categories = db.Categories
// Postsテーブル
const Posts = db.Posts
// NEWSAPIの利用
const NewsAPI = require('newsapi')
const NEWS_API_KEY = process.env.NEWS_API_KEY
const newsapi = new NewsAPI(NEWS_API_KEY)

/**
 * TODO NEWS API から 記事取得しDBに保存
 */
// カテゴリー一覧
const categorySlugArr = [
  'general',
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology',
]

// NEWSAPIを用いてカテゴリごとに記事の取得
categorySlugArr.forEach((categorySlug) => {
  console.log(categorySlug)
  // Categoriesテーブル
  Categories.findOne({
    where: {
      slug: categorySlug,
    },
  })
    .then((category) => {
      // newsAPIでカテゴリの記事取得
      newsapi.v2
        .topHeadlines({
          category: category.slug,
          country: 'jp',
          pageSize: '1',
        })
        .then((news) => {
          news['articles'].forEach((item) => {
            // ニュース単体をPostsテーブルにレコード追加
            Posts.create({
              categoryId: category.id,
              title: item.title,
              content: item.description,
              thumbImg: item.urlToImage,
              pv: 0,
              author: item.source.name,
              originUrl: item.url,
            }).then(() => {
              // DBとの接続終了
              db.sequelize.close()
            })
          })
        })
    })
    .catch((error) => {
      console.log('ERROR処理')
      console.error(error)
    })
})
