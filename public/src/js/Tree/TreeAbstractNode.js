class TreeAbstractNode {
  parent = null;
  id = null;
  data = null;
  caption = '';

  eventListeners = {};

  constructor(caption) {
    this.caption = caption;
    this.data = new TreeNodeData();
  }

  setParent(parent) {
    this.parent = parent;
    return parent;
  }

  getParent() {
    return this.parent;
  }

  setCaption(caption) {
    this.caption = caption;
    return this;
  }

  getCaption() {
    return this.caption;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  addEventListener(eventName, callback) {
    if(typeof(this.eventListeners[eventName]) === 'undefined') {
      this.eventListeners[eventName] = [];
    }

    this.eventListeners[eventName].push(callback);
  }

  fireEvent(eventName, data) {
    if(typeof(this.eventListeners[eventName]) !== 'undefined') {
      this.eventListeners[eventName].forEach(listener => {
        listener(data);
      });
    }
  }

  static generateUUID() {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //ajoute la performance si disponible pour une plus grande unicité
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

}
