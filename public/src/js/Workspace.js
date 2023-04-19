class Workspace
{
  jsTree = null;
  tree = null;
  echart = null;

  sourceEditor = null;
  nodeEditor = null;
  questionnaire = null;

  selectors = {
    treeJs: '#jstree-container',
    sourceEditor: "source-editor",
    questionnaire: '#questionnaire',
  };

  constructor() {

    this.initializeWorkspace();

    this.initializeTree();
    this.initializeEchart();
    this.initializeJsTree();

    this.initializeSourceEditor();
    this.initializeNodeEditor();

    this.initializeQuestionnaire();
  }

  initializeQuestionnaire() {
    this.questionnaire = new QuestionnaireRenderer(this.tree, this.selectors.questionnaire);
  }

  initializeWorkspace() {
    ace.config.setModuleUrl(
        'ace/mode/json',
        'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/mode-json.js'
    );
    // Activation de la beautification de code
    ace.require("ace/ext/beautify");
  }

  initializeNodeEditor() {
    // ===========================
    this.nodeEditor = new NodeEditor("node-editor");
    this.nodeEditor.setNode(this.tree);
    document.querySelector('#node-editor-update').addEventListener('click', event => {

        console.log('%cindex.html :: 191 =============================', 'color: #f00; font-size: 1rem');
        console.log(this.nodeEditor.getValue());
        console.log(this.nodeEditor.getNode())

        // jsTreeRenderer.updateNodeData();
    });
  }

  initializeSourceEditor() {
    this.sourceEditor = new NodeEditor(this.selectors.sourceEditor);
    this.sourceEditor.setNode(this.tree);
  }

  initializeJsTree() {
    this.jsTree = new JSTreeRenderer(this.tree, this.selectors.treeJs);

    this.jsTree.addEventListener('select', node => {
        console.log('%cWorkspace.js :: 67 =============================', 'color: #f00; font-size: 1rem');
        console.log(node);
        this.nodeEditor.setNode(node);
        this.nodeEditor.refresh();
    });

    this.jsTree.addEventListener('rename', data => {
        this.updateTree();
    });

    this.jsTree.addEventListener('create', data => {
        this.updateTree();
    });

    this.jsTree.addEventListener('delete', data => {
        this.updateTree();
    });
    this.jsTree.addEventListener('move', data => {
      console.log('%cWorkspace.js :: 77 =============================', 'color: #f00; font-size: 1rem');
      console.log(data);
      this.tree.loadData(data);
      this.updateTree();
    });

    this.jsTree.addEventListener('paste', data => {
        this.tree.loadData(data);
        // this.updateTree(data);
    });

    this.jsTree.render();
  }

  initializeEchart() {
    const echartContainer = document.getElementById('graph');
    this.echart = new EchartRenderer(echartContainer, this.tree);
    this.echart.addEventListener('click', data => {
        const nodeId = data.id;
        this.jsTree.selectNodeById(nodeId);
    });
  }

  initializeTree() {
    this.tree = new TreeNode();

    this.tree.addEventListener('loaded', (data) => {
        this.updateTree(data);
    });
  }

  updateTree() {
    this.echart.refresh();
    this.sourceEditor.refresh();
    this.nodeEditor.refresh();
    this.questionnaire.refresh();
  }

  loadByURL(url) {
    fetch(url).then((response) => response.json())
    .then(data => {


        this.tree.loadData(data);


        // const treeData = tree.toJSON()
        this.sourceEditor.refresh();
        this.jsTree.refresh();
        this.echart.render();

        /*
        const questionnaire = new Questionnaire(treeData, document.querySelector('#questionnaire'));
        questionnaire.render();
        */


        /*
        setTimeout(() => {
            // Récupération de l'élément HTML à exporter
            const element = document.body;

            // Utilisation de html2canvas pour prendre une capture d'écran de l'élément
            html2canvas(element).then(canvas => {
                // Conversion de la capture d'écran en une image PNG
                const image = canvas.toDataURL('image/png');

                // Téléchargement de l'image
                const link = document.createElement('a');
                link.download = 'capture.png';
                link.href = image;
                link.click();
            });
        }, 500);
        */
    });
  }
}
