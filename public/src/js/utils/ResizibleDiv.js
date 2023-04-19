class ResizableDiv {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.container.classList.add('resizable-container');

    this.resizer = document.createElement('div');
    this.resizer.className = 'resizer';
    this.container.appendChild(this.resizer);
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
      if (this.isResizing) {
        const width = this.container.offsetWidth + e.clientX - this.startX;
        const height = this.container.offsetHeight + e.clientY - this.startY;
        this.container.style.width = `${width}px`;

        // this.container.style.height = `${height}px`;

        this.startX = e.clientX;
        this.startY = e.clientY;
      }
    });
    // Add mouse up event listener to the document
    document.addEventListener('mouseup', () => {
      this.isResizing = false;
    });
  }
}