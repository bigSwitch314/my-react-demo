import React from 'react'
import { connect } from 'react-redux'
import { getArticleList } from '../../../modules/article'


@connect(
  state => ({
    articleList: state.article.articleList,
    loading: state.loading['user/getArticleList'],
  }),
  { getArticleList }
)

class TransshipmentArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.articleList !== state.articleList) {
      return { articleList: props.articleList }
    }

    return null
  }

  // 获取用户列表
  getArticleList = () => {
    const { currentPage, pageSize } = this.state
    this.props.getArticleList({
      current: currentPage,
      size: pageSize,
    })
  }

  componentDidMount() {
    this.getArticleList()
    console.log(this.props)
  }

  render() {
    console.log(this.props)
    return (
      <div>
        转载文章
        <div onClick={this.getArticleList}>添加</div>
      </div>

    )
  }
}

export default TransshipmentArticle
