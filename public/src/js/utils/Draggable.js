class Draggable {

  startX = 0;
  startY = 0;
  element = null;

  dragStarted = false;

  constructor(selector) {
    if(typeof(selector) === 'string') {
      this.element = document.querySelector(selector);
    }
    else {
      this.element = selector;
    }

    this.element.classList.add('draggable')

    this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseDown(e) {
    let offsetX = this.element.offsetLeft;
    let offsetY = this.element.offsetTop;
    this.startX = e.clientX - offsetX;
    this.startY = e.clientY - offsetY;

    this.dragStarted = true;
  }

  // Fonction appelée lors du mouvement de la souris
  onMouseMove(e) {
    if(!this.dragStarted) {
      return;
    }

    const newPosX = e.clientX - this.startX;
    const newPosY = e.clientY - this.startY;

    this.element.style.left = newPosX + 'px';
    this.element.style.top = newPosY + 'px';
  }

  // Fonction appelée lors du relâchement du clic de la souris
  onMouseUp() {
    this.dragStarted = false;
  }
}