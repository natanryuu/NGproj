var server_url, sdk_url, heatmap_url;
var currentDomain = window.location.hostname;
  if (currentDomain === 'm.sinopac.com' || currentDomain === 'mma.sinopac.com') {
    // 正式
    server_url = 'https://dmp.sinopac.com/DMP_SA/API/';
    sdk_url = 'https://dmp.sinopac.com/DMP_SA/SDK/Scripts/sensorsdata.min.securejs';
    heatmap_url = 'https://dmp.sinopac.com/DMP_SA/SDK/Scripts/heatmap.min.securejs';
  } else if (currentDomain === '10.11.42.235') {
    // UAT
    server_url = 'http://10.11.22.217/DMP_SA/API/';
    sdk_url = 'http://10.11.22.217/DMP_SA/SDK/Scripts/sensorsdata.min.securejs';
    heatmap_url = 'http://10.11.22.217/DMP_SA/SDK/Scripts/heatmap.min.securejs';
  } else {
    // SIT
    server_url = 'http://10.11.22.217/DMP_SA_SIT/API/';
    sdk_url = 'http://10.11.22.217/DMP_SA_SIT/SDK/Scripts/sensorsdata.min.securejs';
    heatmap_url = 'http://10.11.22.217/DMP_SA_SIT/SDK/Scripts/heatmap.min.securejs';
  }
(function (para) {
  var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
  w['sensorsDataAnalytic201505'] = n;
  w[n] = w[n] || function (a) { return function () { (w[n]._q = w[n]._q || []).push([a, arguments]); } };
  var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'clearAllRegister', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister'];
  for (var i = 0; i < ifs.length; i++) {
    w[n][ifs[i]] = w[n].call(null, ifs[i]);
  }
  if (!w[n]._t) {
    x = d.createElement(s), y = d.getElementsByTagName(s)[0];
    x.async = 1;
    x.src = p;
    w[n].para = para;
    y.parentNode.insertBefore(x, y);
  }
})({
  name: 'sensors',
  server_url: server_url,
  sdk_url: sdk_url,
  heatmap_url: heatmap_url,
  send_type: 'beacon',
  use_client_time: true,
  heatmap: {
    //是否開啟點擊圖，默認 default 表示開啟，自動采集 $WebClick 事件，可以設置 'not_collect' 表示關閉
    clickmap: 'default',
    //是否開啟觸達註意力圖，默認 default 表示開啟，自動采集 $WebStay 事件，可以設置 'not_collect' 表示關閉
    scroll_notice_map: 'default',
    collect_tags: {
      div: {
        max_level: 3 //默認是1，即只支持葉子 div。可配置範圍是 [1, 2, 3],非该範圍配置值，會被當作 1 處理。
      },
    }
  },
  //設置 true 後會在網頁控制臺打 logger，會顯示發送的數據,設置 false 表示不顯示。默認 true
  show_log: true,
  //默認值 false，表示是否開啟單頁面自動采集 $pageview 功能，SDK 會在 url 改變之後自動采集web頁面瀏覽事件 $pageview
  is_track_single_page: false,
  //打通 App-H5
  app_js_bridge: true,
  use_app_track: true,
  is_secure_cookie: true
});

// 新增函數判斷是否在Sinopac App内
function isSinopacApp() {
  const ua = navigator.userAgent;
  return ua.indexOf('Sinopac mobilebanking') > -1;
}

// 新增函數判斷是否在Dawho App内
function isDawhoApp() {
  return navigator.userAgent.indexOf("Sinopac DAWHO") > -1;
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

var sPlatform = '';
if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
  sPlatform = 'iOS';
} else if (/(Android)/i.test(navigator.userAgent)) {
  sPlatform = 'Android';
} else {
  sPlatform = 'PC';
}

// 根據設備類型和環境確定 product 的值
var sProduct = 'MMA';
if (isMobileDevice()) {
  if (isSinopacApp()) {
    sProduct = '行動銀行APP';
  } else if (isDawhoApp()) {
    sProduct = '大戶APP';
  } else {
    sProduct = '行動銀行mweb';
  }
}

sensors.registerPage({
  is_login: false,
  platform: sPlatform,
  product: sProduct // 使用新的邏輯確定 product 值
});


//跨域打通，若Host為'sinopac.com'，part_url請填'dacard.tw','dawho.tw'，以此類推
sensors.quick('useModulePlugin', 'SiteLinker',
  {
    linker: [
      { part_url: 'dacard.tw', after_hash: false },
      { part_url: 'dawho.tw', after_hash: false }
    ]
  }
);

sensors.quick('autoTrack');
