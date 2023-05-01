class WysiwygEditor
{

  container;
  treeNode;

  updateTrigger;

  editor;

  constructor(treeNode, selector) {
    this.container = document.querySelector(selector);
    this.treeNode = treeNode;

    // this.editor = $(this.container).summernote();

    this.updateTrigger = document.querySelector('#wysiwyg-update');
    this.updateTrigger.addEventListener('click', () => {

      // console.log('%cWysiwygEditor.js :: 15 =============================', 'color: #f00; font-size: 1rem');
      // console.log(this.getValue());
      // console.log('%cWysiwygEditor.js :: 22 =============================', 'color: #f00; font-size: 1rem');
      // console.log(this.treeNode);

      this.treeNode.getData().set('content', this.getValue());
      this.treeNode.getRoot().fireUpdateEvent();
    });
  }

  reset() {
    $(this.container).summernote('destroy');
  }

  getValue() {
    return $(this.container).summernote('code');
  }

  setNode(node) {
    this.treeNode = node;
    return node;
  }

  render() {
    this.container.innerHTML = this.treeNode.getData().get('content');
    $(this.container).summernote({
      height: 400,
    });
  }

  refresh() {
    this.reset();
    this.render();
  }


}
