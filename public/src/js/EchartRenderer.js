class EchartRenderer {

  chart = null;



  transformData(node) {
    const result = {
      name: node.caption,
      children: []
    };

    for (const key in node.options) {
      const option = node.options[key];
      const child = option.child;


      const children = [];
      if (child !== null) {
        children.push(this.transformData(child));
      }

      result.children.push({
        name: option.caption,
        children: children,
      });

    }
    return result;
  }

  render(container, tree) {
    setTimeout(() => {

      const data = tree.toJSON();
      const treeData = this.transformData(data);

      console.log(treeData)

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
          initialTreeDepth: 10,

          data: [treeData],

          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',

          symbol: 'emptyCircle',

          orient: 'vertical',

          expandAndCollapse: true,

          label: {
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