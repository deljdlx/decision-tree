class TreeOption {
  node = null;

  caption = null;
  id = null;

  // child store the child tree node
  child = null;

  data = {};

  renderer = null;
  _isSelected = false;

  changeCallback = null

  constructor(node, caption, child = null, changeCallback = null) {
    this.node = node;
    this.caption = caption;
    this.child = child;

    this.changeCallback = changeCallback;
  }

  getType() {
    return 'option';
  }

  getRoot() {
    return this.node.getRoot();
  }

  setId(id) {
    this.id = id;
    return this;
  }

  getId() {
    return this.id;
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



  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
    return this;
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
      this.getRoot().nodesById[node.getId()] = node;
    }

    return node;
  }

  getCaption() {
    return this.caption;
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
      data: this.getData(),
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
    option.setData(data);

    if(id) {
      option.setId(id);
    }
    else {
      option.setId(TreeOption.generateUUID());
    }


    if (child) {
      const childNode = TreeNode.fromJSON(child, option);
      option.setChild(childNode);
    }
    return option;
  }
}