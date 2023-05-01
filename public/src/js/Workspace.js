class Workspace
{
  tree = null;
  currentNode = null;

  jsTree = null;
  echart = null;
  wysiwygEditor = null;

  sourceEditor = null;
  nodeEditor = null;
  questionnaire = null;

  nodeInfo = null;

  selectors = {

    leftPanel: '#left-panel',
    rightPanel: '#right-panel',
    mainPanel: '#main-panel',

    treeJs: '#jstree-container',
    sourceEditor: "source-editor",
    questionnaire: '#questionnaire',
    wysiwygEditor: '#wysiwyg',
    nodeInfo : '#node-info-container',
  };

  leftPanel;
  mainPanel;
  rightPanel;

  constructor() {

    this.initializeWorkspace();
    this.initializeLayout();

    this.initializeTree();
    this.initializeEchart();
    this.initializeJsTree();

    this.initializeSourceEditor();
    this.initializeNodeEditor();

    this.initializeQuestionnaire();
    this.initializeWysiwygEditor();

    this.initializeNodeInfo();
  }

  selectNode(node) {
    this.nodeEditor.setNode(node);
    this.nodeEditor.refresh();

    this.wysiwygEditor.setNode(node);
    this.wysiwygEditor.refresh();

    this.nodeInfo.setNode(node);
    this.nodeInfo.refresh();
  }

  initializeLayout() {
    new ResizableDiv(this.selectors.leftPanel);
    new ResizableDiv(this.selectors.rightPanel, "left");
    new TabPanel(this.selectors.mainPanel);
  }

  initializeNodeInfo() {
    this.nodeInfo = new NodeInfo(
      document.querySelector(this.selectors.nodeInfo)
    );
    this.nodeInfo.render();
  }

  initializeWysiwygEditor() {
    this.wysiwygEditor = new WysiwygEditor(this.tree, this.selectors.wysiwygEditor);
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
      this.selectNode(node);
    });

    this.jsTree.addEventListener('rename', data => {
        this.updateTree(false);
    });

    this.jsTree.addEventListener('create', data => {
        this.updateTree(false);
    });

    this.jsTree.addEventListener('delete', data => {
        this.updateTree(false);
    });
    this.jsTree.addEventListener('move', data => {
      console.log('%cWorkspace.js :: 77 =============================', 'color: #f00; font-size: 1rem');
      console.log(data);
      this.tree.loadData(data);
      this.updateTree(false);
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
        this.selectNode(
          this.tree.getNodeById(nodeId)
        );
    });

    this.echart.addEventListener('new-node', node => {
      this.updateTree();
    });
  }

  initializeTree() {
    this.tree = new TreeNode();

    this.tree.addEventListener('loaded', (data) => {
        this.updateTree();
    });

    this.tree.addEventListener('updated', (data) => {
      this.updateTree();
  });
  }

  updateTree(updateJsTree = true) {
    this.echart.refresh();
    this.sourceEditor.refresh();
    this.nodeEditor.refresh();
    this.questionnaire.refresh();

    if(updateJsTree) {
      this.jsTree.refresh();
    }
  }

  loadByURL(url) {
    fetch(url).then((response) => response.json())
    .then(data => {


        this.tree.loadData(data);



        this.sourceEditor.refresh();
        this.jsTree.refresh();
        this.echart.render();

        this.wysiwygEditor.setNode(this.tree);
        this.wysiwygEditor.render();


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
