import { over } from 'lodash-es';
import moment from 'moment'

function debounce(fn,wait){
  var timer = null;
  return function(args){
      console.log(args)
      if(timer !== null){
          clearTimeout(timer);
      }
      timer = setTimeout(fn(args),wait);
  }
}

const delimiter = '|'

function getAvailRoutes(routes, perms) {
    if(routes && routes.length) {
        return routes.filter(item => {
            let avail = perms.indexOf(item.path) > -1;
            if(avail) {
                //skip
            } else if(item.children && item.children.length) {
                item.children = getAvailRoutes(item.children,perms);
                if (item.children && item.children.length) {
                  //存在不隐藏的子菜单，则保留父菜单
                  for(let child of item.children) {
                      if(child.meta && !child.meta.hideInMenu) {
                        avail = true
                        break
                      }
                  }
                }
            }
            return avail;
        })
    }
    return [];
}

function isContainsAny(list, ...targetArr) {
    for(const item of targetArr) {
        if(list.indexOf(item) > -1) {
            return true
        }
    }
    return false
}

function getGreeting(username) {
    var currentTime = new Date();
    var currentHour = currentTime.getHours();
  
    if (currentHour >= 5 && currentHour < 12) {
    return "早上好，"+username+"，今天也要加油鸭～";
    } else if (currentHour >= 12 && currentHour < 14) {
      return "中午好，小憩一下吧";
    } else if (currentHour >= 14 && currentHour < 18) {
      return "下午好，"+username;
    } else if (currentHour >= 18 && currentHour < 22) {
      return "晚上好，"+username;
    } else {
      return "夜深了，早点休息哦～";
    }
}

function getDictLabel(value, options) {
    if (!value) {
      return ''
    }
    if (!options || options.length == 0) {
      return value
    }
    //去掉首尾的所有|
    value = value.replace(/^\|+|\|+$/g, "");
    for (const element of options) {
      if (element.itemValue == value) {
          return element.itemLabel
      }
    }
    return ''
}

function getDictLabels(values, options) {
  if(!values) {
    return ''
  }
  var valueArr = []
  // \(：匹配左括号字符 (
  // ([^)]+)：这是一个捕获组，用来匹配括号内的内容。[^)]表示除了右括号字符)之外的任意字符，+表示匹配前面的模式一次或多次。
  // \)：匹配右括号字符)
  // /g：这是一个标志，表示全局匹配，即在整个字符串中查找所有满足模式的匹配项
  var regex = /\(([^)]+)\)/g;
  var match;
  while ((match = regex.exec(values)) !== null) {
    valueArr.push(match[0]);
  }
  // 匹配括号内的数据并替换为特殊标记
  values = values.replace(regex, delimiter);
  // 按照竖线进行切割得到最终的数组
  var array = values.split(delimiter);
  // 去除数组中的空元素
  array = array.filter(function (el) {
    return el.trim() !== "";
  });
  valueArr = valueArr.concat(array);

  let labels = []
  for (const item of valueArr) {
    let label = getDictLabel(item,options)
    labels.push(label)
  }
  return labels.join("，")
}

function getDictLabelsUsingExclude(values, options) {
  if(!values) {
    return ''
  }
  if (values.indexOf('|') > -1) {
    let valueArr = values.split('|')
    let availValueArr = []
    for (let value of valueArr) {
      if(value) {
        availValueArr.push(value)
      }
    }
    let labels = []
    if (availValueArr.length <= options.length / 2) {
      for(const item of availValueArr) {
        let label = getDictLabel(item,options)
        labels.push(label)
      }
      return labels.join("，") + '优先'
    } else {
      for(const option of options) {
        if (availValueArr.indexOf(option.itemValue) == -1) {
          labels.push(option.itemLabel)
        }
      }
      return labels.join("，") + '无缘'
    }
  }
}

const wrapperWithDelimiter = arr => {
  if (arr && arr.length > 0) {
      return delimiter + arr.join(delimiter) + delimiter
  }
  return null
}

const splitWithDelimiter = values => {
  if(!values) {
    return []
  }
  var valueArr = []
  // \(：匹配左括号字符 (
  // ([^)]+)：这是一个捕获组，用来匹配括号内的内容。[^)]表示除了右括号字符)之外的任意字符，+表示匹配前面的模式一次或多次。
  // \)：匹配右括号字符)
  // /g：这是一个标志，表示全局匹配，即在整个字符串中查找所有满足模式的匹配项
  var regex = /\(([^)]+)\)/g;
  var match;
  var matches = [];
  while ((match = regex.exec(values)) !== null) {
    valueArr.push(match[0]);
  }
  // 匹配括号内的数据并替换为特殊标记
  values = values.replace(regex, delimiter);
  // 按照竖线进行切割得到最终的数组
  var array = values.split(delimiter);
  // 去除数组中的空元素
  array = array.filter(function (el) {
    return el.trim() !== "";
  });
  valueArr = valueArr.concat(array);
  return valueArr
}

// 生成GUID
function newGuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}

//获取文件后缀名
const getFileExtension = (file) => {
  if (file) {
    // 通过正则表达式提取文件后缀名
    const regex = /(?:\.([^.]+))?$/
    const result = regex.exec(file.name)
    return result?.[1] || null
  }
  return null // 处理输入为 null 的情况
}

const getFilenameFromUrl = url => {
  const urlObj = new URL(url); // 确保URL是完整的
  return urlObj.pathname.split('/').pop(); // 分割路径并获取最后一个部分，通常是文件名
}


export {
    newGuid,
    getFileExtension,
    getFilenameFromUrl,
    getAvailRoutes,
    isContainsAny,
    getGreeting,
    getDictLabel,
    getDictLabels,
    getDictLabelsUsingExclude,
    debounce,
    wrapperWithDelimiter,
    splitWithDelimiter,
}