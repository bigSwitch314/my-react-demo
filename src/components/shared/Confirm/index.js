import { Modal } from 'antd'

const normaObj = {
  width: 300,
  height: 160,
  content: '',
  onCancel() {
  },
}

export const confirm = (object) => Modal.confirm({
  ...normaObj,
  onOk() {},
  ...object,
})

export const warning = (object) => Modal.warning({
  ...normaObj,
  okText: '确认',
  ...object,
})

export const error = (object) => Modal.error({
  ...normaObj,
  ...object,
})

export const deleteBatchConfirm = (arr, cb) => {
  if (!arr || arr.length === 0) {
    warning({
      title: '请至少选中一条记录！',
    })
    return
  }

  confirm({
    title: '确认删除选中记录吗？',
    onOk: (...args) => cb(...args),
  })
}

export const deleteConfirm = (cb) => {
  confirm({
    title: '确认删除这条记录吗？',
    onOk: (...args) => cb(...args),
  })
}

export function removeArr(arr1, arr2) {
  if (!arr1) return []
  if (!arr2) return arr1
  if (!Array.isArray(arr2)) arr2 = [arr2]
  const list = arr1.filter(item => arr2.indexOf(item) === -1)
  if (list.length === arr1.length) return arr1
  return list
}

// /** 删除弹框 */
// showConfirm = (id) => {
//   confirm({
//     title: '确认删除这条记录吗？',
//     width: 300,
//     onOk: () => this.deleteData(id),
//     onCancel() {
//     },
//   })
// }
