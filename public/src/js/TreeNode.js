class TreeNode {

  option = null;
  options = {};
  caption = '';
  renderer = null;
  changeCallback = null;

  constructor(caption, option = null, changeCallback = null) {
    this.caption = caption;
    this.option = option;
    this.changeCallback = changeCallback;
  }

  update() {
    if (this.changeCallback) {
      this.changeCallback(this);
    }

    if (this.option) {

      this.option.node.update();
    }
  }

  remove() {
    if (this.option !== null) {
      this.option.setChild(null);
    }

    this.update();
  }

  /**
   * @param {TreeOption} option
   * @returns {TreeNode}
   */
  setOption(option) {
    this.option = option;
    return this;
  }

  setRenderer(renderer) {
    this.renderer = renderer;
    return this;
  }

  getRenderer() {
    return this.renderer;
  }

  getOption(name) {
    return this.options[name];
  }

  createOption(value, caption) {
    const treeValue = new TreeOption(this, value, caption);
    this.options[value] = treeValue;

    this.update();

    return treeValue;
  }

  removeOption(optionToDelete) {
    for (const key in this.options) {
      const option = this.options[key];

      if (option === optionToDelete) {
        delete this.options[key];
        this.getRenderer().refresh();

        this.update();

        return;
      }
    }
  }

  toJSON() {
    const options = {};
    for (const key in this.options) {
      const option = this.options[key];
      options[key] = option.toJSON();
    }

    return {
      caption: this.caption,
      options: options,
    };
  }

  static fromJSON(json) {
    const {
      caption,
      options
    } = json;
    const treeNode = new TreeNode(caption);
    for (const key in options) {
      const treeValue = TreeOption.fromJSON(treeNode, options[key]);
      treeNode.createOption(treeValue.value, treeValue.caption).setChild(treeValue.child);
    }
    return treeNode;
  }
}