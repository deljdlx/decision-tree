class TreeNode extends TreeAbstractNode{

  options = {};

  nodesById = {};

  renderer = null;

  eventListeners = {};

  constructor(caption, parent = null) {

    super(caption);

    this.caption = caption;
    this.setParent(parent);
    this.data = new TreeNodeData();
  }

  getType() {
    return 'node';
  }

  getNodeById(nodeId) {
    if(typeof(this.nodesById[nodeId]) === 'undefined') {
      throw new Error('Can nit find node by id : ' + nodeId);
    }
    return this.nodesById[nodeId];
  }

  remove() {
    if (this.parent !== null) {
      this.parent.setChild(null);
    }
  }

  getOption(name) {
    return this.options[name];
  }

  getOptions() {
    return this.options;
  }

  createOption(caption, id = null) {
    const option = new TreeOption(this, caption);

    if(id === null) {
      id = TreeAbstractNode.generateUUID();
    }
    option.setId(id);

    this.addOption(option);

    return option;
  }

  addOption(option) {
    this.options[option.getId()] = option;
    this.nodesById[option.getId()] = option;

    option.setParent(this);


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

  }

  fireUpdateEvent() {
    this.fireEvent('updated', this);
  }


  loadData(descriptor) {
    this.setCaption(descriptor.caption);
    this.setId(descriptor.id);

    this.setData(new TreeNodeData(descriptor.data));

    this.nodesById[this.id] = this;

    for(let id in this.options) {
      delete this.options[id];
    }

    for (const id in descriptor.options) {
      const options = descriptor.options;
      const option = TreeOption.fromJSON(this, options[id]);
      this.addOption(option).setChild(option.child);
    }

    this.fireEvent('loaded', this.toJSON());
  }


  toJSON() {
    const options = {};
    for (const key in this.options) {
      const option = this.options[key];
      options[key] = option.toJSON();
    }

    return {
      id: this.getId(),
      caption: this.getCaption(),
      type: 'node',
      data: this.getData().toJSON(),
      options: options,
    };
  }

  static fromJSON(json, parentOption = null) {
    const {
      caption,
      id,
      options,
      data,
    } = json;

    const treeNode = new TreeNode(caption);

    if(data) {
      for(let key in data) {
        treeNode.getData().set(key, data[key]);
      }
    }
    // treeNode.setData(data ? data : {});
    if(parentOption) {
      treeNode.setParent(parentOption);
    }

    if(id) {
      treeNode.setId(id);
    }
    else {
      treeNode.setId(TreeAbstractNode.generateUUID());
    }

    for (const key in options) {
      const option = TreeOption.fromJSON(treeNode, options[key]);
      treeNode.addOption(option);
      option.setChild(option.child);
    }

    return treeNode;
  }
}

