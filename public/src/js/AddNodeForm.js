class AddNodeForm {
  form = null;
  option = null;

  constructor(option) {
    this.option = option;
    this.form = document.createElement('form');
    this.form.classList.add('option-form');
    this.form.addEventListener('submit', this.onSubmit.bind(this));
  }

  render() {
    const input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('placeHolder', 'Set child question');
    this.form.appendChild(input);

    const button = document.createElement('button');
    button.type = 'submit';
    button.innerText = 'Add';
    this.form.appendChild(button);

    return this.form;
  }

  onSubmit(event) {
    event.preventDefault();

    const input = event.target.querySelector('input');
    const nodeName = input.value;

    if (nodeName.trim() === '') {
      alert('Please enter a valid node name.');
      return;
    }

    const node = new TreeNode(nodeName);
    this.option.setChild(node);
    input.value = '';

    this.option.getRenderer().refresh();
  }
}
