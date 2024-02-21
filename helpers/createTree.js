let count = 0;
function createTree(arrItem, parentId = '') {
  let tree = [];
  arrItem.forEach((item) => {
    if (item.parent_id === parentId) {
      item.count = ++count;
      const children = createTree(arrItem, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  });
  return tree;
}

module.exports.tree = (arrItem) => {
  count = 0;
  const tree = createTree(arrItem, (parentId = ''));
  return tree;
};
