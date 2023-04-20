class ResizableDiv {


  direction;

  constructor(containerSelector, direction="right") {

    this.direction = direction;

    this.container = document.querySelector(containerSelector);
    this.container.classList.add('resizable-container');

    this.resizer = document.createElement('div');
    this.resizer.classList.add('resizer');

    if(direction === 'right') {
      this.container.appendChild(this.resizer);
      this.container.classList.add('direction-right');
    }
    else {
      this.container.appendChild(this.resizer);
      this.container.classList.add('direction-left');
    }

    this.isResizing = false;
    this.startX = 0;
    this.startY = 0;
    // Add mouse down event listener to the resizer
    this.resizer.addEventListener('mousedown', e => {
      e.preventDefault();
      this.isResizing = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    });
    // Add mouse move event listener to the document
    document.addEventListener('mousemove', e => {
      this.handleMouseMove(e);
    });
    // Add mouse up event listener to the document
    document.addEventListener('mouseup', () => {
      this.isResizing = false;
    });
  }

  handleMouseMove(e) {
    if (this.isResizing) {

      let width;
      if(this.direction === 'right') {
        width = this.container.offsetWidth + e.clientX - this.startX;
      }
      else {
        width = this.container.offsetWidth + (this.startX - e.clientX);
      }


      const height = this.container.offsetHeight + e.clientY - this.startY;
      this.container.style.width = `${width}px`;

      // this.container.style.height = `${height}px`;

      this.startX = e.clientX;
      this.startY = e.clientY;
    }
  }
}