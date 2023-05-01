class TreeNodeData
{
  data = {
    content: "",
    extendedCaption: "",
  };

  constructor(data = {}) {
    this.data = data;
  }

  get(key, defaultValue = null) {
    if(typeof(this.data[key]) === 'undefined') {
      return defaultValue;
    }

    return this.data[key];
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

