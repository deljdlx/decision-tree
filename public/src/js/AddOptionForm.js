class AddOptionForm {
  form = null;
  constructor(treeNode) {
    this.treeNode = treeNode;
  }

  render() {
    this.form = document.createElement('form');
    this.form.addEventListener('submit', this.onSubmit.bind(this));


    const input = document.createElement('input');
    input.setAttribute('placeholder', 'Add option');
    input.type = 'text';
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
    const optionName = input.value;

    if (optionName.trim() === '') {
      alert('Please enter a valid option name.');
      return;
    }

    this.treeNode.createOption(optionName, optionName);
    input.value = '';

    this.treeNode.getRenderer().refresh();
  }
}
