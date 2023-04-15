class TreeOption {
  node = null;
  value = null;
  caption = null;
  child = null;
  renderer = null;
  _isSelected = false;

  changeCallback = null

  constructor(node, value, caption, child = null, changeCallback = null) {
    this.node = node;
    this.value = value;
    this.caption = caption;
    this.child = child;

    this.changeCallback = changeCallback;
  }

  update() {
    if (this.changeCallback) {
      this.changeCallback(this);
    }

    this.node.update();
  }

  remove() {
    this.node.removeOption(this);

    if (this.changeCallback) {
      this.changeCallback(this);
    }
  }

  setRenderer(renderer) {
    this.renderer = renderer;
    return this;
  }

  getRenderer() {
    return this.renderer;
  }

  setChild(node) {
    if (node === null) {
      delete this.child;
    }

    this.child = node;

    if (node) {
      this.child.setOption(this);
    }

    this.update();


    return node;
  }

  getCaption() {
    return this.caption;
  }

  getValue() {
    return this.value;
  }

  getChild() {
    return this.child;
  }

  isSelected(value = null) {
    if (value !== null) {
      this._isSelected = value;
    }

    return this._isSelected;
  }

  toJSON() {
    return {
      value: this.value,
      caption: this.caption,
      child: this.child ? this.child.toJSON() : null,
    };
  }

  static fromJSON(node, json) {
    const {
      value,
      caption,
      child,
    } = json;

    const treeValue = new TreeOption(node, value, caption);

    if (child) {
      const childNode = TreeNode.fromJSON(child);
      treeValue.setChild(childNode);
    }
    return treeValue;
  }
}