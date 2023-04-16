class JSTreeRenderer {
  // Créer une fonction pour convertir les données en un format compréhensible par jsTree

  tree = null;
  treeNode = null;

  eventListeners = {};


  constructor(treeNode) {
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


  render(data, selector) {
    $(selector).jstree({
      plugins: ["dnd", "contextmenu", "state", "types", "wholerow", ],
      core: {
        data: [this.generateJSTreeData(data)],
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

    this.tree = $(selector).jstree(true);
  }

  onSelect(event, data) {
    this.fireEvent('select', data.node.data)
  }

  onMove(event, data) {
    this.fireEvent('move', this.exportToTreeNode());
  }

  onDelete(event, data) {
    this.fireEvent('delete', this.exportToTreeNode());
  }

  onRename(event, data) {
    this.fireEvent('rename', this.exportToTreeNode());
  }

  onPaste(event, data) {
    this.fireEvent('paste', this.exportToTreeNode());
  }


  onCreate(event, data) {
    const node = data.node;
    node.icon = false;
    // node.id = JSTreeRenderer.generateUUID();

    const parentNode = this.tree.get_node(data.parent);
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

    this.tree.edit(node);

    this.fireEvent('create', this.exportToTreeNode());
  }




  generateJSTreeData(treeNode, depth = 0) {
    const jstreeData = {
      id: treeNode.id,
      text: treeNode.caption,
      icon: false,
      type: 'node',
      data: treeNode.data,

      children: [],
      state: {
        opened: true
      },
      li_attr: {
        class: 'tree-node--' + treeNode.type
      },
    };


    let nthChild = 0;
    for (const key in treeNode.options) {
      const option = treeNode.options[key];
      const child = option.child !== null ? this.generateJSTreeData(option.child, depth + 1) : null;

      const jstreeOption = {
        id: option.id,
        text: option.caption,
        icon: false,
        type: 'option',
        data: option.data,
        children: child !== null ? [child] : [],
        state: {
          opened: true
        },
        li_attr: {
          class: 'tree-node--' + option.type
        },
      };
      jstreeData.children.push(jstreeOption);

      nthChild++;
    }
    return jstreeData;
  }


  loadData(data) {
    this.tree.settings.core.data = [this.generateJSTreeData(data)];
    this.tree.refresh();
  }


  exportData() {
    const data = this.tree.get_json()
    return data;
  }



  exportToTreeNode() {
    const jsTreeData = this.exportData();

    const rootNode = jsTreeData[0];
    const children = rootNode.children;
    const nodeOptions = {};

    children.forEach((optionData, index) => {
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
      value: optionData.data.value,
      child: null,
      data: optionData.data
    };

    if(optionData.children.length) {
      option.child = this.toTreeNode(optionData.children[0])
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


    if(descriptor.children.length) {
      descriptor.children.forEach((optionData, index) => {
        node.options.push(
          this.toTreeOption(optionData)
        );
      })
    }

    return node;
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

}
