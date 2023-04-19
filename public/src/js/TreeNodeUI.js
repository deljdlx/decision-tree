class TreeNodeUI {
  container = null;

  constructor(treeNode) {
    this.treeNode = treeNode;
    treeNode.setRenderer(this);
    this.container = document.createElement('div');
    this.container.classList.add('node')
  }

  refresh() {
    this.container.innerHTML = '';
    this.render();
    return this;
  }

  render() {

    const header = document.createElement('header');
    header.classList.add('node-header');

    const captionContainer = document.createElement('div');

    const trash = document.createElement('span');
    trash.innerText = '🗑️';
    trash.classList.add('node-trash')
    captionContainer.append(trash);
    trash.addEventListener('click', () => {
      this.remove()
    });

    const captionEl = document.createElement('span');
    captionEl.classList.add('node-caption')
    captionEl.innerText = this.treeNode.caption;
    captionContainer.append(captionEl)

    header.append(captionContainer);


    const form = new AddOptionForm(this.treeNode);
    header.append(form.render());

    this.container.appendChild(header);

    Object.values(this.treeNode.options).forEach((option) => {
      const optionRenderer = new TreeOptionUI(option);
      this.container.append(optionRenderer.render());
    });

    return this.container;
  }

  remove() {
    this.treeNode.remove();
    this.container.remove();
  }
}
