/**
 * 記事の取得 & 削除関数のモジュール
 */
const moment = require('moment')
// NEWSAPIの利用
const NewsAPI = require('newsapi')
const NEWS_API_KEY = process.env.NEWS_API_KEY
const newsapi = new NewsAPI(NEWS_API_KEY)
// models内のDB設定読み込み
const db = require('./models/index')
// Categoriesテーブル
const Categories = db.Categories
// Postsテーブル
const Posts = db.Posts
// Commentsテーブル
const Comments = db.Comments

/**
 * NEWSAPIを用いて、カテゴリごとに記事の取得を行いDBに保存
 * @param {array} categorySlugArr
 */
function addPosts(categorySlugArr) {
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
            pageSize: '5',
          })
          .then((news) => {
            news['articles'].forEach((item) => {
              console.log(item)
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
}

/**
 * 日付経ってる & コメントが10未満 の記事は削除
 */
function deletePosts() {
  /**
   * TODO sequelizeで日付判定（where）
   * 対象記事のコメント数取得→10未満かどうか
   * Commentsテーブルの関連する全てのコメント削除→Postsテーブルの該当記事削除
   */
  Posts.findAll({
    where: Posts.sequelize.where(
      Posts.sequelize.fn(
        'DATE_FORMAT',
        Posts.sequelize.col('createdAt'),
        '%Y%m'
      ),
      moment().format('YYYYMM')
    ),
    limit: 1,
  })
    .then((post) => {
      console.info(post)
    })
    .then(() => {
      // DBとの接続終了
      db.sequelize.close()
    })
    .catch((error) => {
      console.log('ERROR処理')
      console.error(error)
    })
  // Comments.findAll({
  //   limit: 3,
  // })
  //   .then((comment) => {
  //     console.log(comment.postId)
  //   })
  //   .catch((error) => {
  //     console.log('ERROR処理')
  //     console.error(error)
  //   })
}

module.exports = {
  addPosts,
  deletePosts,
}
