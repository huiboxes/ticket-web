const SessionStorage = {
  get: function (key: string) {
    const v = sessionStorage.getItem(key);
    if (v && typeof(v) !== "undefined" && v !== "undefined") {
      try {
        return JSON.parse(v);
      } catch (e) {
        return v;
      }
    }
  },
  set: function (key: string, data: any) {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // 静默失败
    }
  },
  remove: function (key: string) {
    sessionStorage.removeItem(key);
  },
  clearAll: function () {
    sessionStorage.clear();
  }
};

export default SessionStorage;