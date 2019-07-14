import { isArray, uniq, indexOf, remove, cloneDeep } from "lodash";

/** 将三级树型结构转为表格数据源 */
export function transform(data) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].children.length; j++) {
      const item = {
        menu_1_name: data[i].name,
        menu_1_id: data[i].id,
        menu_1_status: 0,
        menu_2_name: data[i].children[j].name,
        menu_2_id: data[i].children[j].id,
        menu_2_status: 0,
        node: data[i].children[j].children.map(item => ({
          id: item.id,
          name: item.name,
          status: 0
        })),
        rowSpan: j === 0 ? data[i].children.length : 0
      };
      result.push(item);
    }
  }
  return result;
}

/** 获取勾选节点id */
export function getCheckedNodeId(data) {
  const checkedNodeId = [];
  if (isArray(data) === false || data.length === 0) {
    return checkedNodeId;
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i].menu_1_status === 1) {
      checkedNodeId.push(data[i].menu_1_id);
    }
    if (data[i].menu_2_status === 1) {
      checkedNodeId.push(data[i].menu_2_id);
    }
    for (let j = 0; j < data[i].node.length; j++) {
      if (data[i].node[j].status === 1) {
        checkedNodeId.push(data[i].node[j].id);
      }
    }
  }

  return uniq(checkedNodeId);
}

/** 回显节点勾选 */
export function setNodeStatus(data, checkedNodeId) {
  const checkedId = cloneDeep(checkedNodeId);
  const cloneData = cloneDeep(data);

  for (let i = 0; i < cloneData.length; i++) {
    if (indexOf(checkedId, cloneData[i].menu_1_id) !== -1) {
      cloneData[i].menu_1_status = 1;
      // 占多行
      for (let k = 1; k < cloneData[i].rowSpan; k++) {
        cloneData[i + k].menu_1_status = 1;
      }
      remove(checkedId, item => item === cloneData[i].menu_1_id);
    }
    if (indexOf(checkedId, cloneData[i].menu_2_id) !== -1) {
      cloneData[i].menu_2_status = 1;
      remove(checkedId, item => item === cloneData[i].menu_2_id);
    }
    for (let j = 0; j < cloneData[i].node.length; j++) {
      if (indexOf(checkedId, cloneData[i].node[j].id) !== -1) {
        cloneData[i].node[j].status = 1;
        remove(checkedId, item => item === cloneData[i].node[j].id);
      }
    }
  }

  return cloneData;
}