class JSTreeRenderer {
  // Créer une fonction pour convertir les données en un format compréhensible par jsTree

  tree = null;
  treeNode = null;

  constructor(treeNode) {
    this.treeNode = treeNode;
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
    console.log('%cJSTreeRenderer.js :: 53 =============================', 'color: #f00; font-size: 1rem');
    console.log(data);
  }

  onMove(event, data) {
    this.treeNode.loadData(
      this.exportToTreeNode()
    );
  }

  onDelete(event, data) {
    this.treeNode.loadData(
      this.exportToTreeNode()
    );
  }

  onPaste(event, data) {
    this.treeNode.loadData(
      this.exportToTreeNode()
    );
  }

  onCreate(event, data) {
    const node = data.node;
    node.icon = false;

    const parentNode = this.tree.get_node(data.parent);
    if(parentNode.data.type === 'node') {
      node.li_attr =  {
        class: 'tree-node--option'
      };
      node.data = {
        type: 'option',
        value: null,
      }
    }
    else {
      node.type = 'node';
      node.data = {
        type: 'node',
        value: null,
      };
      node.li_attr =  {
        class: 'tree-node--node'
      };
    }

    this.tree.edit(node);

    this.treeNode.loadData(
      this.exportToTreeNode()
    );

    this.treeNode.refresh();
  }

  onRename(event, data) {
    this.treeNode.loadData(
      this.exportToTreeNode()
    );
    this.treeNode.refresh();
  }



  generateJSTreeData(data, depth = 0) {
    const jstreeData = {
      text: data.caption,
      icon: false,
      type: 'node',
      data: {
        value: null,
        type: 'node',
        data: data.data ? data.data : {},
      },
      // id: 'depth[' + depth + ']',
      children: [],
      state: {
        opened: true
      },
      li_attr: {
        class: 'tree-node--' + data.type
      },
    };


    let nthChild = 0;
    for (const key in data.options) {
      const option = data.options[key];
      const id = 'depth[' + depth + '][' + nthChild + ']=' + option.value;
      const child = option.child !== null ? this.generateJSTreeData(option.child, depth + 1) : null;
      const jstreeOption = {
        // id: id,
        text: option.caption,
        icon: false,
        type: 'option',
        data: {
          value: option.value,
          type: 'option',
          data: data.data ? data.data : {},
        },
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
    const data = this.exportData();

    const rootNode = data[0];
    const children = rootNode.children;
    const nodeOptions = {};

    children.forEach((optionData, index) => {
      nodeOptions[index] = this.toTreeOption(optionData);
    });

    const rootNodeData = {
      caption: rootNode.text,
      options: nodeOptions,
      type: 'node',
      data: rootNode.data,
    };

    return rootNodeData;
  }

  toTreeOption(optionData) {
    const option = {
      caption: optionData.text,
      type: 'option',
      value: optionData.data.value,
      child: null,
    };

    if(optionData.children.length) {
      option.child = this.toTreeNode(optionData.children[0])
    }

    return option;
  }

  toTreeNode(nodeData) {
    const node = {
      caption: nodeData.text,
      type: 'node',
      options: [],
      data: nodeData ? nodeData : {},
    };


    if(nodeData.children.length) {
      nodeData.children.forEach((optionData, index) => {
        node.options.push(
          this.toTreeOption(optionData)
        );
      })
    }

    return node;
  }

}
