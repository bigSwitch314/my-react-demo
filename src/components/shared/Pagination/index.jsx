import React from 'react'
import { Pagination } from 'antd'
import './index.less'

function showTotal(total) {
  return `共${total}条`
}

export default props => (
  <div className="pagination-container">
    <Pagination
      size="small"
      showSizeChanger
      showQuickJumper
      showTotal={showTotal}
      defaultPageSize={5}
      pageSizeOptions={['5', '10', '15', '20', '100']}
      {...props}
    />
  </div>
)
