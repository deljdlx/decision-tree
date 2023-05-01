class NodeEditor {

  editor;
  selector;
  treeNode;

  aceEditorTheme = 'ace/theme/monokai';

  eventListeners = {};

  constructor(selector) {
    this.selector = selector;
    this.initialize();
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

  getNode() {
    return this.treeNode;
  }

  setNode(treeNode) {
    this.treeNode = treeNode;
    this.refresh();
  }

  refresh() {
    this.setValue(JSON.stringify(this.treeNode.toJSON()));
  }



  initialize() {
    // Initialiser l'éditeur
    this.editor = ace.edit(this.selector);
    this.editor.setTheme(this.aceEditorTheme);
    this.editor.commands.addCommand({
      name: "beautify",
      bindKey: {
        win: "Ctrl-Shift-B",
        mac: "Command-Shift-B"
      },
      exec: function (editor) {
        var session = editor.getSession();
        session.setValue(js_beautify(session.getValue()));
      },
      readOnly: true
    });

    this.editor.getSession().setMode("ace/mode/json");
  }

  getValue() {
    return this.editor.getValue();
  }

  setValue(json) {
    this.editor.setValue("");
    // this.editor.destroy()
    // this.initialize();
    this.editor.setValue(js_beautify(json));

  }
}
