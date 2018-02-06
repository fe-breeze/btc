//load nav&foot
var url = "http://etc.apool.cc:83/miners";
var coin = GetQueryString("coin");
var coin = 'eth';
var address = GetQueryString("address");
var address = '0x444814ed8d70a6fa5581a5fa2932e7984211e63e';
var datenow = new Date();
var nowSecond = datenow.getHours() * 3600 + datenow.getMinutes() * 60 + datenow.getSeconds();
var now = Date.parse(new Date()) / 1000;
$.getJSON(url, { coin: coin, miner: address }, function(date) {
  if (date.Result === null) {
    return null
  }
  $(".ibox-title h5").text(address);
  var tempSpeed = Average(date.Result.History.Speed);
  $("#minerSpeed").text(GetCoinSpeed(coin, tempSpeed.now) + " / " + GetCoinSpeed(coin, tempSpeed.avg));
  var tempB = date.Result.Balance;
  $("#minerBalance").text(tempB.Pay.toFixed(3) + " / " + tempB.Paid.toFixed(3) + " " + coin.toUpperCase());
  var todayGet = tempB.Locked / nowSecond * 24 * 3600;
  if (nowSecond < 600) {
    todayGet = 0;
  }
  $("#minerLocked").text(tempB.Locked.toFixed(3) + " / " + todayGet.toFixed(3) + " " + coin.toUpperCase());

  //add pc miners
  var online = 0;
  var offline = 0;
  $.each(date.Result.Miners, function(name, fd) {
    var $tr = $("<tr></tr>");
    var $td = $("<td></td>");
    $tr.append($td.clone().text(name).attr("data-sort-value", name));
    if (now - fd.LastShare > 518) {
      var newDate = new Date();
      newDate.setTime(fd.LastShare * 1000);
      $tr.append($td.clone().text(newDate.Format("MM-dd hh:mm:ss")).attr("data-sort-value", +newDate));
      $("#minerDropTable").append($tr);
      offline++;
    } else {
      $tr.append($td.clone().text(GetCoinSpeed(coin, fd.Speed)).attr("data-sort-value", fd.Speed));
      $tr.append('<td><a href="http://' + coin + '.apool.cc/miner/' + address + '.' + name + '">详情</a></td>');
      $("#minerOnlineTable").append($tr);
      online++;
    }
  });
  $("#minerLen").text(online + " / " + offline + " 台");
  //add paylog HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\SecurityHealthService
  if (date.Result.Paylog != null) {
    date.Result.Paylog.reverse();
  }
  $.each(date.Result.Paylog, function(i, fd) {
    var $tr = $("<tr></tr>");
    var $td = $("<td></td>");
    var newDate = new Date();
    newDate.setTime(fd.Time * 1000);
    $tr.append($td.clone().text(newDate.Format("MM-dd hh:mm:ss")).attr("data-sort-value", fd.Time));
    $tr.append($td.clone().text(fd.Value.toFixed(4)));
    var state = '<a target="view_window" href="' + GetBlockExplorerUrl(coin) + fd.Hash + '">' + fd.State + '</a>';
    $tr.append($td.append(state));
    $("#minerPaylogTable").append($tr);
  });

  //add chart
  var myChart = echarts.init(document.getElementById('main'));
  var myChart1 = echarts.init(document.getElementById('main1'));
  var history = date.Result.History;
  var gains = date.Result.Gains
  var chartDate = [],
    chartDate1 = [];

  var temp = {};
  temp.name = "总算力";
  temp.type = "line";
  temp.data = history.Speed;
  temp.smooth = true;
  temp.itemStyle = {
    normal: {
      lineStyle: {
        color: "#006633"
      },
    }
  };
  chartDate.push(temp);
  var temp = {};
  temp.name = "余额";
  temp.type = "line";
  temp.itemStyle = {
    normal: {
      lineStyle: {
        color: "#cc6600",
        width: 1
      },
      areaStyle: {
        color: "#cccc66",
        type: 'default'
      }
    }
  };
  temp.data = history.Balance;
  temp.yAxisIndex = 1;
  temp.smooth = true;
  chartDate.push(temp);
  var Time = [],
    Diff = [],
    Price = []
  $.each(gains, function(i, e) {
    Time.push(new Date(e.Time * 1000).getFullYear() + '-' + new Date(e.Time * 1000).Format("MM-dd hh:mm:ss"))
    Diff.push(e.Diff)
    Price.push(e.Price)
  })
  console.log(Diff)
  var temp = {};
  temp.name = "价格";
  temp.type = "line";
  temp.data = Price;
  temp.smooth = true;
  temp.itemStyle = {
    normal: {
      lineStyle: {
        color: "#006633"
      },
    }
  };
  chartDate1.push(temp);
  var temp = {};
  temp.name = "难度";
  temp.type = "line";
  temp.itemStyle = {
    normal: {
      lineStyle: {
        color: "#cc6600",
        width: 1
      },
      areaStyle: {
        color: "#cccc66",
        type: 'default'
      }
    }
  };
  temp.data = Diff;
  temp.yAxisIndex = 1;
  temp.smooth = true;
  chartDate1.push(temp);

  var option = {
    title: {
      text: '状态统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#999'
        }
      }
    },
    grid: {
      bottom: 60,
      right: 0,
      left: 40,
      top: 60
    },
    legend: {
      data: ['余额', '总算力'],
      bottom: 0
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    xAxis: [{
      type: 'category',
      data: history.Time,
      axisPointer: {
        type: 'shadow'
      }
    }],
    yAxis: [{
        type: 'value',
        name: '余额',
        scale: true,
        axisLabel: {
          formatter: '{value}'
        },
        splitNumber: 8,
        min: function(value) {
          var v = value.min * 0.5;
          if (v < 0) {
            v = 0;
          }
          return v.toFixed(1);
        },
        max: function(value) {
          return (value.max * 1.1).toFixed(1);
        }
      },
      {
        show: false,
        type: 'value',
        name: '总算力',
        axisLabel: {
          formatter: '{value}'
        },
        splitNumber: 8,
        max: function(value) {
          return value.max * 4;
        }
      }
    ],
    series: chartDate
  };
  var option1 = {
    title: {
      text: '状态统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#999'
        }
      }
    },
    grid: {
      bottom: 60,
      right: 0,
      left: 40,
      top: 60
    },
    legend: {
      data: ['难度', '价格'],
      bottom: 0
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    xAxis: [{
      type: 'category',
      data: Time,
      axisPointer: {
        type: 'shadow'
      }
    }],
    yAxis: [{
        type: 'value',
        name: '难度',
        scale: true,
        axisLabel: {
          formatter: '{value}'
        },
        splitNumber: 8,
        min: function(value) {
          var v = value.min * 0.5;
          if (v < 0) {
            v = 0;
          }
          return v.toFixed(1);
        },
        max: function(value) {
          return (value.max * 1.1).toFixed(1);
        }
      },
      {
        show: false,
        type: 'value',
        name: '价格',
        axisLabel: {
          formatter: '{value}'
        },
        splitNumber: 8,
        max: function(value) {
          return value.max * 4;
        }
      }
    ],
    series: chartDate1
  };
  myChart.setOption(option);
  myChart1.setOption(option1);
  $("#minerDropTable").tablesort();
  $("#minerOnlineTable").tablesort();
  $("#minerPaylogTable").tablesort();
});

function GetBlockExplorerUrl(s) {
  switch (s) {
    case "eth":
      return "https://etherscan.io/tx/";
    case "etc":
      return "http://gastracker.io/tx/";
    case "zec":
      return "http://zcl.apool.cc/miner/";
    case "sc":
  }
  return "todo";
}

function GetCoinSpeed(coin, speed) {
  var result;
  speed = parseFloat(speed);
  if (coin === "etc" || coin === "eth") {
    if (speed < 1) {
      result = (speed * 1000).toFixed(1) + " M/s";
    } else if (speed > 1) {
      result = speed.toFixed(3) + " G/s";
    }
  } else if (coin === "zec" || coin === "zcl") {
    if (speed < 10) {
      result = (speed * 1000).toFixed(1) + " Sol/s";
    } else {
      result = speed.toFixed(3) + " Ks/s";
    }
  } else if (coin === "sc") {
    if (speed > 999) {
      result = (speed / 1000).toFixed(1) + " G/s";
    } else {
      result = (speed / 1000).toFixed(0) + " M/s";
    }
  }
  return result;
}
//get query
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r !== null) return unescape(r[2]);
  return null;
}

function Average(arr) {
  if (arr.length === 0) {
    return { avg: 0, now: 0 };
  }
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  var avg = (total / arr.length).toFixed(2);
  var now = arr[arr.length - 1].toFixed(2);
  return { avg: avg, now: now };
}
Date.prototype.Format = function(fmt) { //author: meizz
  var o = {
    "Y+": this.getFullYear(),
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}