class TreeOption extends TreeAbstractNode {
  // child store the child tree node
  child = null;

  _isSelected = false;

  changeCallback = null

  constructor(node, caption, child = null, changeCallback = null) {

    super(caption);

    this.setParent(node);

    this.child = child;
    this.changeCallback = changeCallback;
  }

  getType() {
    return 'option';
  }

  getRoot() {
    return this.parent.getRoot();
  }

  remove() {
    this.parent.removeOption(this);

    if (this.changeCallback) {
      this.changeCallback(this);
    }
  }

  setChild(node) {
    if (node === null) {
      delete this.child;
    }

    this.child = node;

    if (node) {
      this.child.setParent(this);
      this.getRoot().nodesById[node.getId()] = node;
    }

    return node;
  }

  getChildNode() {
    return this.child ?? null;
  }

  toJSON() {
    return {
      type: 'option',
      id: this.id,
      caption: this.caption,
      child: this.child ? this.child.toJSON() : null,
      data: this.getData().toJSON(),
    };
  }


  static fromJSON(node, descriptor) {
    const {
      id,
      caption,
      child,
      data,
    } = descriptor;

    const option = new TreeOption(node, caption);
    option.setData(new TreeNodeData(data));

    if(id) {
      option.setId(id);
    }
    else {
      option.setId(TreeAbstractNode.generateUUID());
    }


    if (child) {
      const childNode = TreeNode.fromJSON(child, option);
      option.setChild(childNode);
    }
    return option;
  }
}