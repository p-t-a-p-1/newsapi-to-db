'use strict'
// 同期処理用モジュール
const async = require('async')
// models内のDB設定読み込み
const db = require('./models/index')
// Categoriesテーブル
const Categories = db.Categories
// Postsテーブル
const Posts = db.Posts

const postfunc = require('./posts')

/**
 * TODO NEWS API から 記事取得しDBに保存
 */
// カテゴリー一覧
// const categorySlugArr = [
//   'general',
//   'business',
//   'entertainment',
//   'health',
//   'science',
//   'sports',
//   'technology',
// ]

const categorySlugArr = ['business']

/**
 * 上記のカテゴリごとの記事を取得しDBに登録
 */
// postfunc.addPosts(categorySlugArr)

postfunc.deletePosts()
