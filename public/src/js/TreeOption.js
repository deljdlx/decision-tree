class TreeOption {
  node = null;
  value = null;
  caption = null;

  // child store the child tree node
  child = null;

  data = {};

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

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
    return this;
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
      type: 'option',
      value: this.value,
      caption: this.caption,
      child: this.child ? this.child.toJSON() : null,
      data: this.getData(),
    };
  }

  static fromJSON(node, json) {
    const {
      value,
      caption,
      child,
      data,
    } = json;

    const option = new TreeOption(node, value, caption);
    option.setData(data);

    if (child) {
      const childNode = TreeNode.fromJSON(child);
      option.setChild(childNode);
    }
    return option;
  }
}