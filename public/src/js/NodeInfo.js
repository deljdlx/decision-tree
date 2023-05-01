class NodeInfo {

  treeNode = null;
  container= null;

  captionInput = null;

  constructor(container) {

    this.container = container;

  }

  render() {
    const captionInputContainer = document.createElement('div');
    this.captionInput = document.createElement('textarea');
    this.captionInput.classList.add('node-info__caption');

    captionInputContainer.append(this.captionInput);
    this.container.append(captionInputContainer);
  }

  refresh() {
    this.captionInput.value = this.treeNode.getCaption();
  }

  getNode() {
    return this.treeNode;
  }

  setNode(node) {
    this.treeNode = node;
  }
}


