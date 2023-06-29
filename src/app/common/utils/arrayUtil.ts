export class ArrayUtil {
 
  static groupBy(array, key) {
    return array.reduce((hash, obj) => {
      if(obj[key] === undefined) return hash; 
      return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
    }, {});
  }

  static groupByToMap(array, key) {
    return array.reduce((pm, obj) => {
      if(obj[key] === undefined) return pm; 
      let pobjArr = pm.get(obj[key]);
      if (!pobjArr)
        return pm.set(obj[key], [obj]);
      else 
        return pm.set(obj[key], [...pobjArr, obj]);
    }, new Map<string, any>());
  }
}