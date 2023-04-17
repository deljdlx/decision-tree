class TreeNode {

  // option is the attribute which store the "parent option"
  option = null;
  options = {};
  caption = '';
  id = null;
  data = {};

  nodesById = {};

  renderer = null;

  eventListeners = {};

  constructor(caption, option = null) {
    this.caption = caption;
    this.option = option;
  }

  getType() {
    return 'node';
  }

  isRoot() {
    if(this.option) {
      return false;
    }

    return true;
  }

  getRoot() {
    if(this.option) {
      return this.option.getRoot();
    }

    return this;
  }

  addEventListener(eventName, callback) {
    if(typeof(this.eventListeners[eventName]) === 'undefined') {
      this.eventListeners[eventName] = [];
    }

    this.eventListeners[eventName].push(callback);
  }

  fireEvent(eventName, data) {
    if(typeof(this.eventListeners[eventName]) !== 'undefined') {
      this.eventListeners[eventName].forEach(listener => {
        listener(data);
      });
    }
  }

  getNodeById(nodeId) {
    console.log('%cTreeNode.js :: 54 =============================', 'color: #0f0; font-size: 1rem');
    console.log(nodeId);
    return this.nodesById[nodeId];
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  getData() {
    return this.data ?? {};
  }

  setData(data) {
    this.data = data;
    return this;
  }


  remove() {
    if (this.option !== null) {
      this.option.setChild(null);
    }
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

  createOption(caption, id = null) {
    const option = new TreeOption(this, caption);
    if(id) {
      option.setId(id);
    }
    this.addOption(option);

    return option;
  }

  addOption(option) {
    this.options[option.getId()] = option;
    this.nodesById[option.getId()] = option;


    this.getRoot().nodesById[option.getId()] = option;

    return option;
  }

  removeOption(option) {
    delete this.options[option.getId()];
    return this;
  }


  removeOption(optionToDelete) {
    for (const key in this.options) {
      const option = this.options[key];

      if (option === optionToDelete) {
        delete this.options[key];
        return;
      }
    }
  }

  refresh() {
    if(this.getRenderer() !== null) {
      this.getRenderer().refresh();
    }
  }

  static generateUUID() {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //ajoute la performance si disponible pour une plus grande unicité
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  toJSON() {
    const options = {};
    for (const key in this.options) {
      const option = this.options[key];
      options[key] = option.toJSON();
    }

    return {
      id: this.id,
      caption: this.caption,
      options: options,
      type: 'node',
      data: this.getData(),
    };
  }

  loadData(descriptor) {
    this.caption = descriptor.caption;
    this.id = descriptor.id;
    this.data = descriptor.data;

    this.nodesById[this.id] = this;

    Object.values(this.options).forEach((option, index) => {
      delete this.options[index];
    })

    for (const key in descriptor.options) {
      const options = descriptor.options;
      const option = TreeOption.fromJSON(this, options[key]);
      this.addOption(option).setChild(option.child);
    }

    this.fireEvent('loaded', this.toJSON());
  }

  static fromJSON(json, parentOption = null) {
    const {
      caption,
      id,
      options,
      data,
    } = json;

    const treeNode = new TreeNode(caption);
    treeNode.setData(data ? data : {});
    if(parentOption) {
      treeNode.setOption(parentOption);
    }

    if(id) {
      treeNode.setId(id);
    }
    else {
      treeNode.setId(TreeNode.generateUUID());
    }

    for (const key in options) {
      const option = TreeOption.fromJSON(treeNode, options[key]);
      treeNode.addOption(option);
      option.setChild(option.child);
    }

    return treeNode;
  }
}

