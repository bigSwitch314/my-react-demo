import React from 'react'
import { DragSource, DropTarget } from 'react-dnd';

let dragingIndex = -1;
let dragingClassName = '';

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver && dragingClassName === className) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }
    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    dragingClassName = props.className;
    return {
      index: props.index,
      className: props.className,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const dragClassName = monitor.getItem().className;

    const hoverIndex = props.index;
    const hoverClassName = props.className;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex || dragClassName !== hoverClassName) {
      return;
    }

    const isChildrenDragable = hoverClassName === 'ant-table-row ant-table-row-level-1'

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex, isChildrenDragable);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

export default DragableBodyRow