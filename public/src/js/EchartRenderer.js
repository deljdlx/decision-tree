class EchartRenderer {

  chart = null;
  container = null;
  tree = null;

  eventListeners = {

  };

  constructor(container, tree) {

    this.tree = tree;

    this.container = container;

    if (this.chart) {
      this.chart.clear();
    } else {
      this.chart = echarts.init(this.container);
    }

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

          animationDurationUpdate: 0
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