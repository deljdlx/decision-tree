class TreeOptionUI {
  option = null;
  container;

  constructor(option) {
    this.option = option;
    this.option.setRenderer(this);
    this.container = document.createElement('div');
    this.container.classList.add('option');
  }

  refresh() {
    this.container.innerHTML = '';
    this.render();
    return this;
  }

  render() {

    const header = document.createElement('header');
    header.classList.add('option-header');


    const captionContainer = document.createElement('div');

    const trash = document.createElement('span');
    trash.innerText = '🗑️';
    trash.classList.add('option-trash')
    captionContainer.append(trash);
    trash.addEventListener('click', () => {
      this.remove()
    });

    const caption = document.createElement('span');
    caption.classList.add('option-caption');
    caption.innerText = this.option.caption;
    captionContainer.append(caption);

    header.append(captionContainer);

    const nodeForm = new AddNodeForm(this.option);
    header.append(nodeForm.render());


    this.container.append(header);

    caption.addEventListener('click', () => {
      this.option.isSelected(true);
    });


    if (this.option.child !== null) {
      const childNodeUI = new TreeNodeUI(this.option.child);
      this.container.append(childNodeUI.render());
    }

    return this.container;
  }

  remove() {
    this.option.remove();
  }
}