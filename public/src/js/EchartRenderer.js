class EchartRenderer {

  chart = null;
  container = null;
  tree = null;

  currentNode = null;

  newNodePopin;
  newNodeForm;
  newNodeNameInput;

  eventListeners = {

  };

  constructor(container, tree) {

    this.tree = tree;
    this.container = container;

    this.initializeNewNodePopin();


    if (this.chart) {
      this.chart.clear();
    } else {
      this.chart = echarts.init(this.container);
    }

    this.chart.on('contextmenu', (params) => {

      const event = params.event.event;
      event.preventDefault();

      if(params.componentType === 'series') {
        this.currentNode = this.tree.getNodeById(params.data.id);

        if(this.currentNode.getType() === 'option') {
          if(this.currentNode.getChildNode()) {
            return false;
          }
        }

        this.showNewNodePopin(event.clientX, event.clientY);
      }
      // params.event.preventDefault();
      // return false;
    });

    this.chart.on('click', (params) => {

      if(params.componentType === 'series') {
        const clikedNode = this.tree.getNodeById(params.data.id);
        this.fireEvent('click', clikedNode);
      }

      /*
      console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
      myChart.dispatchAction({
        type: 'dataZoom',
        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
        endValue:
          dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
      });
      */
    });
  }

  initializeNewNodePopin() {
    this.newNodePopin = new Popin(
      500,
      300,
    );
    // newNodePopin.setContent('Popin content');
    this.newNodeForm = document.createElement('form');
    this.newNodeForm.innerHTML = `
      <div>
        <h2>Create new node</h2>
        <label>New node name <input name="new-node-name"/>
        <button>Créer</button>
      </div>
    `;

    this.newNodeNameInput = this.newNodeForm.querySelector('input[name="new-node-name"]');

    this.newNodeForm.addEventListener('submit', (event) => {
      this.handleNewNode(event);
    })

    this.newNodePopin.getContentNode().append(this.newNodeForm);
  }

  showNewNodePopin(x = null, y = null) {
    if(x !== null || y !== y) {
      this.newNodePopin.setPosition(x, y);
    }

    this.newNodeNameInput.value = '';
    this.newNodePopin.show();
  }

  handleNewNode(event) {
    event.preventDefault();
    const caption = this.newNodeNameInput.value;
    this.newNodeNameInput.value = '';
    this.newNodePopin.hide();

    if(this.currentNode.getType() === 'option') {
      const newNode = this.currentNode.createChild(caption);
      this.fireEvent('new-node', {
        parent: this.currentNode,
        newNode: newNode,
        newNodeType: 'node',
      });
    }
    else {
      const option = this.currentNode.createOption(caption);
      this.fireEvent('new-node', {
        parent: this.currentNode,
        newNode: option,
        newNodeType: 'option',
      });
    }
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

  formatCaption(caption, number = 3) {
    const words = caption.split(' ');
    let newStr = '';
    for (let i = 0; i < words.length; i++) {
      if (i > 0 && i % number === 0) {
        newStr += '\n';
      }
      newStr += words[i] + ' ';
    }
    return newStr;
  }


  transformData(node) {


    const caption = this.formatCaption('📦' + node.caption);

    const result = {
      name: caption,
      id: node.id,
      data: node.data,
      children: [],
      label: {
        color: '#fff',
        backgroundColor: '#555',
        padding: 5,
        borderColor: '#9AA8E8',
        borderWidth: 3,
        borderRadius: 5,
      }
    };

    for (const key in node.options) {
      const option = node.options[key];

      const child = option.getChildNode();

      const children = [];
      if (child !== null) {
        children.push(this.transformData(child));
      }

      result.children.push({
        name: this.formatCaption('🍃' + option.caption),
        id: option.id,
        data: option.data,
        children: children,
        label: {
          color: '#000',
          backgroundColor: '#eee',
          padding: 5,
          borderColor: '#9AA8E8',
          borderWidth: 1,
          borderRadius: 5,
        }
      });
    }

    return result;
  }


  refresh() {
    this.render();
  }


  render() {
    setTimeout(() => {

      this.chart.clear();

      const treeData = this.transformData(this.tree);

      const option = {
        series: [{
          type: 'tree',
          initialTreeDepth: 30,

          data: [treeData],

          lineStyle: {
            color: '#000',
            curveness: 0.3,
            width: 5,
          },

          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',

          symbol: 'emptyCircle',
          orient: 'vertical',

          expandAndCollapse: false,

          label: {
            color: '#a00',
            position: 'top',
            rotate: 0,
            verticalAlign: 'middle',
            align: 'middle',
            fontSize: 14
          },

          leaves: {
            label: {
              position: 'bottom',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'middle'
            }
          },

          animationDurationUpdate: 0,


        }]
      };

      this.chart.setOption(option);

      this.initDraggable();

    }, 100);
  }

  initDraggable() {
    setTimeout(() => {
      const draggable = new Draggable('#graph canvas');
    }, 100);
  }

}