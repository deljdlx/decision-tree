class JSTreeRenderer {
  // Créer une fonction pour convertir les données en un format compréhensible par jsTree

  jsTree = null;
  treeNode = null;

  container;

  eventListeners = {};


  constructor(treeNode, selector) {
    this.container = document.querySelector(selector);
    this.treeNode = treeNode;
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


  render() {
    $(this.container).jstree({
      plugins: ["dnd", "contextmenu", "state", "types", "wholerow", ],
      core: {
        data: [this.generateJSTreeData(this.treeNode)],
        "check_callback": true,
        "animation" : 0,
      },

      types : {
        root: {
          valid_children: ["option"],
        },
        node : {
          valid_children: ["default", "option",],
        },
        option : {
          valid_children: ["default", "node"],
        }
      },

    }).on('rename_node.jstree', (e, data) => {
      this.onRename(event, data);
    }).on('create_node.jstree', (e, data) => {
      this.onCreate(event, data);
    }).on('delete_node.jstree', (e, data) => {
      this.onDelete(event, data);
    }).on('paste.jstree', (e, data) => {
      this.onPaste(event, data);
    }).on('move_node.jstree', (e, data) => {
      this.onMove(event, data);
    }).on('select_node.jstree', (e, data) => {
      this.onSelect(event, data);
    })
    ;

    this.jsTree = $(this.container).jstree(true);
  }


  onRename(event, eventData) {
    const node = this.treeNode.getNodeById(eventData.node.id);
    node.caption = eventData.text;
    this.fireEvent('rename', node);
  }

  onDelete(event, eventData) {
    const node = this.treeNode.getNodeById(eventData.node.id);
    node.remove();
    this.fireEvent('delete', node);
  }

  onCreate(event, eventData) {
    const node = eventData.node;
    node.icon = false;
    const parentNode = this.jsTree.get_node(eventData.parent);

    if(parentNode.type === 'node') {
      node.li_attr =  {
        class: 'tree-node--option'
      };
      node.data = {}
    }
    else {
      node.type = 'node';
      node.data = {};
      node.li_attr =  {
        class: 'tree-node--node'
      };
    }

    const newNodeId = TreeAbstractNode.generateUUID();
    eventData.instance.set_id(eventData.node, newNodeId);


    const treeNode = this.treeNode.getNodeById(parentNode.id);

    let newNode = null;
    if(treeNode.getType() === 'node') {
      eventData.instance.set_text(eventData.node, 'New option');
      newNode = treeNode.createOption('New option', newNodeId);
    }
    else {
      eventData.instance.set_text(eventData.node, 'New question');
      newNode = new TreeNode('New question');
      newNode.setId(newNodeId);
      treeNode.setChild(newNode);
    }

    this.jsTree.edit(node);

    this.fireEvent('create', newNode);
  }


  onMove(event, eventData) {

    /*
    const node = this.treeNode.getNodeById(eventData.node.id);
    const previousParent = this.treeNode.getNodeById(eventData.old_parent);
    const newParent =  this.treeNode.getNodeById(eventData.parent);

    if(node.getType() === 'option') {
      newParent.addOption(node);
      node.node  = newParent;
      previousParent.removeOption(node);
    }
    else {
      previousParent.setChild(null);
      newParent.setChild(node);
    }
    */

    this.fireEvent('move', this.exportToTreeNode());
    // console.log(JSON.stringify(this.exportToTreeNode()));
    // this.fireEvent('move', node);
  }


  onSelect(event, eventData) {
    const node = this.treeNode.getNodeById(eventData.node.id);
    this.fireEvent('select', node);
  }

  onPaste(event, eventData) {
    this.fireEvent('paste', this.exportToTreeNode());
    const newNodeId = TreeAbstractNode.generateUUID();
    eventData.instance.set_id(eventData.node, newNodeId);
  }

  getNodeById(nodeId) {
    const node = this.jsTree.get_node(nodeId);
    if(node.type === 'option') {
      return this.toTreeOption(node);
    }

    return this.toTreeNode(node);
  }

  selectNodeById(nodeId, clear = true) {
    if(clear) {
      this.jsTree.deselect_all();
    }

    this.jsTree.select_node(nodeId);

    return this.jsTree.get_node(nodeId);

  }

  generateJSTreeData(treeNode) {

    const jstreeData = {
      id: treeNode.getId(),
      text: treeNode.getCaption(),
      icon: false,
      type: 'node',
      data: treeNode.data ?? {},
      children: [],
      state: {
        opened: true
      },
      li_attr: {
        class: 'tree-node--' + treeNode.getType()
      },
    };

    for (const key in treeNode.options) {
      const option = treeNode.options[key];
      const child = option.child !== null ? this.generateJSTreeData(option.child) : null;

      const jstreeOption = {
        id: option.id,
        text: option.caption,
        icon: false,
        type: 'option',
        data: option.data ?? {},
        children: child !== null ? [child] : [],
        state: {
          opened: true
        },
        li_attr: {
          class: 'tree-node--' + option.getType()
        },
      };
      jstreeData.children.push(jstreeOption);
    }
    return jstreeData;
  }


  refresh() {
    // console.log('%cJSTreeRenderer.js :: 191 =============================', 'color: #f00; font-size: 1rem');
    // console.log(this.treeNode);
    // this.loadData(this.treeNode.toJSON());
    // this.render();
    this.jsTree.settings.core.data = [this.generateJSTreeData(this.treeNode)];
    this.jsTree.refresh();
  }


  loadData(data) {
    console.log('%cJSTreeRenderer.js :: 232 =============================', 'color: #f00; font-size: 1rem');
    console.log(this.generateJSTreeData(data));
    this.jsTree.settings.core.data = [this.generateJSTreeData(data)];
    this.jsTree.refresh();
  }


  exportData() {
    const data = this.jsTree.get_json()
    return data;
  }

  exportToTreeNode() {
    const jsTreeData = this.exportData();

    const rootNode = jsTreeData[0];
    const children = rootNode.children;
    const nodeOptions = {};

    children.forEach((optionData, index) => {
      console.log('%cJSTreeRenderer.js :: 261 =============================', 'color: #f00; font-size: 1rem');
      console.log(optionData);
      nodeOptions[optionData.id] = this.toTreeOption(optionData);
    });

    const rootNodeData = {
      id: rootNode.id,
      caption: rootNode.text,
      options: nodeOptions,
      type: 'node',
      data: rootNode.data.data,
    };

    return rootNodeData;
  }

  toTreeOption(optionData) {
    const option = {
      id: optionData.id,
      caption: optionData.text,
      type: 'option',
      data: optionData.data,
      child: null,
      data: optionData.data
    };

    if(optionData.children?.length) {
      const nodeId = optionData.children[0];
      const nodeData = this.jsTree.get_node(nodeId);
      option.child = this.toTreeNode(nodeData);
    }

    return option;
  }

  toTreeNode(descriptor) {
    const node = {
      id: descriptor.id,
      caption: descriptor.text,
      type: 'node',
      options: [],
      data: descriptor.data,
    };

    if(descriptor.children?.length) {
      descriptor.children.forEach((optionId) => {
        const optionData = this.jsTree.get_node(optionId);
        node.options.push(
          this.toTreeOption(optionData)
        );
      })
    }

    return node;
  }
}
