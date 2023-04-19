class TreeNodeData
{
  data = {};

  constuctor(data = {}) {
    this.data = data;
  }

  set(key, value) {
    this.data[key] = value;
    return value;
  }

  toJSON() {
    return this.data;
  }

  static fromJSON(data) {
    const instance = new TreeNodeData();
    for(let key in data) {
      instance.set(key, data);
    }

    return instance;
  }
}

