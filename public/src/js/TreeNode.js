class TreeNode {

  // option is the attribute which store the "parent option"
  option = null;

  options = {};
  caption = '';
  data = {};

  renderer = null;
  changeCallback = null;

  constructor(caption, option = null, changeCallback = null) {
    this.caption = caption;
    this.option = option;
    this.changeCallback = changeCallback;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  setChangeCallback(changeCallback) {
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
    const key = Object.values(this.options).length + 1 ;
    this.options[key] = treeValue;

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

  refresh() {
    if(this.getRenderer() !== null) {
      this.getRenderer().refresh();
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
      type: 'node',
      data: this.getData(),
    };
  }

  loadData(data) {
    this.caption = data.caption;
    this.options = [];
    this.data = data ? data : {};

    for (const key in data.options) {
      const options = data.options;
      const treeValue = TreeOption.fromJSON(this, options[key]);
      this.createOption(treeValue.value, treeValue.caption).setChild(treeValue.child);
    }

    this.refresh();
  }

  static fromJSON(json) {
    const {
      caption,
      options,
      data,
    } = json;

    const treeNode = new TreeNode(caption);
    treeNode.setData(data ? data : {});

    for (const key in options) {
      const treeValue = TreeOption.fromJSON(treeNode, options[key]);
      treeNode.createOption(treeValue.value, treeValue.caption).setChild(treeValue.child);
    }

    return treeNode;
  }
}

