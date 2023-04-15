class EchartRenderer {

  chart = null;


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
      const child = option.child;


      const children = [];
      if (child !== null) {
        children.push(this.transformData(child));
      }

      result.children.push({
        name: this.formatCaption('◼️' + option.caption),
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

  render(container, tree) {
    setTimeout(() => {

      const data = tree.toJSON();
      const treeData = this.transformData(data);

      // Créer un conteneur pour le graphique

      if (this.chart) {
        this.chart.clear();
      } else {
        this.chart = echarts.init(container);
      }



      // Initialiser le graphique ECharts

      // Configurer les options du graphique
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

    }, 100);
  }

}