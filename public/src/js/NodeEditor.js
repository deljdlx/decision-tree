class NodeEditor {

  editor;
  selector;

  constructor(selector) {
    this.selector = selector;
    this.initialize();
  }

  initialize() {


    // Initialiser l'éditeur
    this.editor = ace.edit(this.selector);
    this.editor.setTheme("ace/theme/monokai");
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

  setValue(json) {
    this.editor.setValue(js_beautify(json));

  }
}
