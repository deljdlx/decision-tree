class Popin {
  constructor(width, height, x = null, y = null) {
    this.width = width;
    this.height = height;

    if(x === null) {
      x = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth - width) / 2;
    }
    if(y === null) {
      y = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - height) / 2;
    }

    this.posX = x;
    this.posY = y;

    this.element = document.createElement('div');
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.style.left = this.posX + 'px';
    this.element.style.top = this.posY + 'px';
    this.element.classList.add('popin');
    // Add close button to the popin
    this.closeButton = document.createElement('button');
    this.closeButton.innerHTML = '<i class="bi bi-x-circle"></i>';
    this.closeButton.style.position = 'absolute';
    this.closeButton.style.top = '10px';
    this.closeButton.style.right = '10px';
    this.closeButton.style.border = 'none';
    this.closeButton.style.backgroundColor = 'transparent';
    this.closeButton.style.cursor = 'pointer';

    this.contentDiv = document.createElement('div');
    this.contentDiv.classList.add('popin__content')
    this.element.append(this.contentDiv);

    this.closeButton.addEventListener('click', () => {
      this.hide();
    });

    this.element.appendChild(this.closeButton);
    document.body.appendChild(this.element);

    const draggable = new Draggable(this.element);
  }

  setPosition(x = null, y = null) {
    if(x === null) {
      x = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth - width) / 2;
    }
    if(y === null) {
      y = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - height) / 2;
    }

    this.posX = x;
    this.posY = y;

    this.element.style.left = this.posX + 'px';
    this.element.style.top = this.posY + 'px';
  }

  // Method to set content for the popin
  setContent(content) {
    this.contentDiv.innerHTML = content;
  }

  getContentNode() {
    return this.contentDiv;
  }

  // Method to display the popin on the page
  show() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
  }


  destroy() {
    document.body.removeChild(this.element);
  }
}