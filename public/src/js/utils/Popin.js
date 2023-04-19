class Popin {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.posX = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth - width) / 2;
    this.posY = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - height) / 2;
    this.element = document.createElement('div');
    this.element.style.position = 'fixed';
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.style.left = this.posX + 'px';
    this.element.style.top = this.posY + 'px';
    this.element.style.backgroundColor = '#fff'; // Add white background for the popin
    this.element.style.border = '1px solid #000'; // Add border for the popin

    // Add close button to the popin
    this.closeButton = document.createElement('button');
    this.closeButton.innerHTML = '<i class="bi bi-x-circle"></i>';
    this.closeButton.style.position = 'absolute';
    this.closeButton.style.top = '10px';
    this.closeButton.style.right = '10px';
    this.closeButton.style.border = 'none';
    this.closeButton.style.backgroundColor = 'transparent';
    this.closeButton.style.cursor = 'pointer';

    this.closeButton.addEventListener('click', () => {
      this.close();
    });
    this.element.appendChild(this.closeButton);

    const draggable = new Draggable(this.element);
  }

  // Method to set content for the popin
  setContent(content) {
    let contentDiv = document.createElement('div');
    contentDiv.innerHTML = content;
    this.element.insertBefore(contentDiv, this.closeButton);
  }

  // Method to display the popin on the page
  show() {
    document.body.appendChild(this.element);
  }

  // Method to close the popin
  close() {
    document.body.removeChild(this.element);
  }
}