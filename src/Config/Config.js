import qwest from 'qwest';
import cookie from 'react-cookie';
import "./bridge.js";

var Config = {
    online: location.href.indexOf("com")>-1,
    debug: location.href.indexOf("debug")>-1,
    isAndr: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1,
    pageSize: 10,
    appType: (function() {
        if (location.href.indexOf("jituancaiyun")>-1) { return "cy"; }
        else if (location.href.indexOf("imasheng")>-1) { return "ms"; }
        else if (location.href.indexOf("uban")>-1) { return "uban"; }
        else if (location.href.indexOf("xiaowobangong")>-1) { return "xiaowo"; }
        else return "cy";
    }()),
    app: function () {
        let info = {};
        let data = {
          "cy": {
              allName: "集团彩云",
              name: "彩云",
              logo: "https://video.statics.cdn.jituancaiyun.com/images/appLogo/jtcy/logo-s.png",
              slogan: "集团彩云，让工作沟通变得更便捷",
              uri: "jituancaiyun",
              color: "#de6262"
          },
          "ms": {
              allName: "麻绳",
              name: "麻绳",
              logo: "https://video.statics.cdn.jituancaiyun.com/images/appLogo/ms/logo-s.png",
              slogan: "轻轻一扯，条理清晰",
              uri: "imasheng",
              color: "#4e90cd"
          },
          "uban": {
              allName: "优办",
              name: "优办",
              logo: "https://video.statics.cdn.jituancaiyun.com/images/appLogo/uban/logo-s.png",
              slogan: "工作可以更优秀",
              uri: "uban360",
              color: "#fa565a"
          },
          "xiaowo": {
              allName: "小沃办公",
              name: "小沃",
              logo: "https://video.statics.cdn.jituancaiyun.com/images/appLogo/xiaowo/logo-s.png",
              slogan: "精彩在沃，办公可以更高效",
              uri: "xiaowobangong",
              color: "#0470b8"
          }
        };
        info = data[this.appType];
        info.online = this.online;
        return info;
    },
    getTime: function () {
        var time = new Date(), y = time.getFullYear(), m = time.getMonth() + 1
            , r = time.getDate(), s = time.getHours(), f = time.getMinutes()
            , a = time.getMinutes();
        m = m > 9 ? m : "0" + m;
        r = r > 9 ? r : "0" + r;
        s = s > 9 ? s : "0" + s;
        f = f > 9 ? f : "0" + f;
        a = a > 9 ? a : "0" + a;
        return "" + y + m + r + s + f + a;
    },
    uri: (function () {
        let domain = "/approve/";
        let url = {
            "queryMyApply": "apply/queryMyApply",
            "queryMyApprove": 'approve/queryMyApprove',
            "upload": "approve/uploadImage",
            "save": "apply/save",
            "submit": "apply/submit",
            "queryApplyDetail": "apply/queryApplyDetail",
            "lastSelected": "extraknower/lastSelected",
            "zhrList": "extraknower/list",
            "getFlowByType": "flow/getFlowByType",
            "updateApprove": "approve/updateApprove",
            "retract": "apply/retractApply",
            "pay": "baoXiao/pay/beSure",
            "paying": "baoXiao/list/paying",
            "payingNum": "baoXiao/counts/paying",
            "softly": "approve/del/softly",
            "pwdOfPrint": "baoXiao/pwdOfPrint"
        };
        for (let i in url) {
            url[i] = domain + url[i];
        }
        return url;
    }()),
    url: function (str) {
        return this.uri[str];
    },
    ajax: function (type, data, options) {
        options = options || {};
        data.body = data.body || {};
        data.url = this.url(data.url);
        
        if (this.debug) {
            cookie.save('token', "2078c9d289ff1830aa7f97a996a4c4e9");
            cookie.save('userId', 269840);
            cookie.save('orgId', 57171554250);
            cookie.save('username', "杨明");
            cookie.save('orgType', 1);
            localStorage.setItem("deptName", "测试");
            localStorage.setItem("orgName", "杭州讯盟科技");
        }
        data.body.ts = +new Date();
        data.body.token = cookie.load('token');
        data.body.uid = cookie.load('userId');
        data.body.orgId = this.getLocationSearch().orgId || cookie.load('orgId') || localStorage.getItem('orgId');
        data.body.specificType = 4;
        data.body.deptName = localStorage.getItem("deptName") || "";
        
        return qwest[type](data.url, data.body, options)
        .then(function(xhr, response) {
            return response;
        }).catch(function(e, xhr, response) {
            return [e, xhr, response];
        });
    },
    toast: function(msg, time) {
        !this.debug ? Config.native("toast", {time: time||3, msg: msg}) : console.log(msg);
    },
    getLocationSearch: function () {
        var search = location.search;
        var searchObj = {};
        var key = "";
        
        if (search) {
            var paramArr = search.split("&");
            for (var i=0; i<paramArr.length; i++) {
                key = paramArr[i].split("=")[0];
                key = key.replace(/\?/g, '');
                searchObj[key] = paramArr[i].split("=")[1];
            }
            return searchObj;
        } else return {};
    },
    native: function(method, data) {
        data = data || {};
        let orgId = this.getLocationSearch().orgId || cookie.load("orgId") || localStorage.getItem('orgId');
        let orgName = localStorage.getItem('orgName');
        var t = null;
        switch (method) {
            case 'getorglist': {
                if (this.debug) {
                    return {
                        then: function (a) {
                            let data = {
                                "code": 200,
                                "msg": "成功",
                                "data": [{
                                    "orgId": 57171554250,
                                    "orgName": "讯盟测试57171554250"
                                }, {
                                    "orgId": 81088,
                                    "orgName": "杭州讯盟科技81088"
                                }]
                            };
                            a(data);
                        }
                    }
                }
                // alert("拉取企业列表");
                window.setOrgCookie = function(data) {
                    data = JSON.parse(decodeURI(data));
                    let result = {
                        code: 200,
                        data: data
                    };
                    t && t.call(null, result)
                };
                if (!this.isAndr) {
                    window.getOrgIOS && window.getOrgIOS();
                } else {
                    try{
                        window.Native_Bridge_uban.onJsCall('setOrgCookie', 'getOrginfo');
                    } catch(e){ alert(e); }
                }
                return {
                    then: function(f) {
                        t = f;
                    }
                };
            }
            case 'selectPictures': {
                if (this.debug) {
                    return {
                        then: function (a) {
                            a({code: 200, data: ["iVBORw0KGgoAAAANSUhEUgAAAFYAAABWCAYAAABVVmH3AAAAAXNSR0IArs4c6QAAAh1JREFUeAHt3bFKQmEYxvFjhbQIQQ1tglsgdCfdQpfX3rUIbYI0NDWEg+HU+4THEpIsv//2/+DN46HzDD8ey+0ddD+fSd2e1oxrRjXDGs+XwLoulzWLmlnNvGbnDHbedd1lvb+rCajncIEAP9a89o+c9hf1Gsz7mqtv97w8TOCifu225rnmLY/0sGlqUM9z0/MvgbN66qbmqWZ1sonIx1/UDcYRLzGMZRfY/KPyb2o02pxYTgKb//6etgLTwNrWtqhJGwc231M9bQVGgfXLf1vUpA0D6wEEhAVQEymssJAAFGtjhYUEoFgbKywkAMXaWGEhASjWxgoLCUCxNlZYSACKtbHCQgJQrI0VFhKAYm2ssJAAFGtjhYUEoFgbKywkAMXaWGEhASjWxgoLCUCxNlZYSACKtbHCQgJQrI0VFhKAYm2ssJAAFGtjhYUEoFgbKywkAMXaWGEhASjWxgoLCUCxNlZYSACKtbHCQgJQrI0VFhKAYm2ssJAAFGtjhYUEoFgbKywkAMXaWGEhASjWxgoLCUCxNlZYSACKtbHCQgJQrI0VFhKAYm0sCJuFNJ62Aus0Nlt+PG0FloHNZh9PW4FFYLOPytNWYBbYLPmyte1gYzkPbE6WfL1/XvnjGIEYxnK7z2tV11nylX1U2Uvl+btAUB9qXvJovygt19mcliVf1zXZqOY5XCAf/y1qHhvseXZS911GuQenbv+6jPIDmLQrtKG1Vm8AAAAASUVORK5CYII="]});
                        }
                    }
                }
                window.AndroidUploadImage = function(data) {
                    data = JSON.parse(decodeURI(data));
                    let result = {
                        code: 200,
                        data: data
                    };
                    t && t.call(null, result)
                };
                if (!this.isAndr) {
                    window.selectPictureIOS && window.selectPictureIOS(data.count, data.sum);
                } else {
                    window.Native_Bridge_uban.onJsCall('AndroidUploadImage', 'selectPicture', data.count + "&" + data.sum);
                }
                return {
                    then: function(f) {
                        t = f;
                    }
                };
            }
            case "setTime":
            {
                window.setTime = function(data) {
                    //data = JSON.parse(data);
                    let result = {
                        code: 200,
                        data: data
                    };
                    try {
                        t && t.call(null, result)
                    } catch (ex) {
                        alert(ex)
                    }
                };
                if (!this.isAndr) {
                    try{
                        selectTimeIOS();
                    }catch(e){
                        return {
                            then: function (a) {
                                a ({data: "2016-08-20 11:35"});
                            }
                        };
                    }
                } else {
                    window.Native_Bridge_uban.onJsCall('setTime', 'getTime');
                }
                return {
                    then: function(f) {
                        t = f;
                    }
                };
            }
            case 'selectPeopleIOS':
            {
                if (this.debug) {
                    return {
                        then: function (a) {
                            a({data: [{uid: 289481, name:"徐新"}, {uid: 269840, name:"杨明"}]});
                        }
                    }
                }
                try {
                    window.AndroidChoosePeople = function(data) {
                        data = JSON.parse(data);
                        let result = {
                            code: 200,
                            data: data
                        };
                        t && t.call(null, result)
                    };
                    if (!this.isAndr) {
                        window.selectPeopleIOS && window.selectPeopleIOS(data.count || "500", orgId, orgName);
                    } else {
                        window.Native_Bridge_uban.onJsCall('AndroidChoosePeople', 'selectPeople', (data.count || "500") + "&" + orgId + "&" + orgName);
                    }
                } catch (ex) {
                    alert(ex)
                }
                return {
                    then: function(f) {
                        t = f;
                    }
                };
            }
            case 'showImage':
            {
                if (!this.isAndr) {
                    window.viewPicturesIOS && window.viewPicturesIOS(data.position, JSON.stringify(data.picsArr));
                } else {
                    location.href = 'uban://start/showImage?position=' + data.position + '&urls=' + JSON.stringify(data.picsArr);
                }
                return {
                    then: function(f) {
                        t = f;
                    }
                };
            }
            case "fqsx":
            {
                alert(data.url);
                if (!this.isAndr) {
                    newEventIOS(data.uid, data.uname, data.content, encodeURIComponent(data.url), "approve");
                } else {
                    window.location.href = 'uban://start/createNote?uid=' + data.uid
                        + "&uname=" + data.uname
                        + "&mobile=" + data.mobile
                        + "&content=" + data.content
                        + "&action=" + encodeURIComponent(data.url)
                        + "&type=approve";
                }
                return {
                    then: function(f) {
                        t = f;
                    }
                };
            }
            default:
            {
                if (this.debug) {
                    if (method == "selectdate")
                        return {
                            then: function (a) {
                                a ({data: "2016-08-20 11:35"});
                            }
                        };
                    else if (method == "picker")
                        return {
                            then: function (a) {
                                a ({data: {text: "测试", value: "这是测试"}});
                            }
                        };
                    else if (method == "confirm")
                        return {
                            then: function (a) {
                                a ({data: "ok"});
                            }
                        };
                    else if (method == "openurl")
                        location.href = data.url;
                }
                setTimeout(function(){
                    window.JSBridge.requestHybrid({
                        method: method,
                        data: data,
                        callback: function(result) {
                            t && t(result)
                        }
                    });
                }, 0);
                return {
                    then: function(f) {
                        t = f;
                    }
                };
            }
        }
    },
    isOverVersion: function (appVersionArr) {
        // 测试5.5.0及之后的版本, 判断是否相等或以上 appVersionArr: [[5,5,0], [5,5,0], [1,1,0], [1,4,0]] 0优办 1彩云 2小沃 3麻绳
        let appVersion = cookie.load('appversion');
        if(appVersion){
            let a = appVersion.split('_')[1].split('.');  //a客户端版本号分割数组
            let t = appVersionArr[cookie.load('orgType')];  //t目标版本
            
            if(a[0] > t[0]){
                return true;
            }else if(a[0] < t[0]){
                return false;
            }else{
                if(a[1] > t[1]){
                    return true;
                }else if(a[1] < t[1]){
                    return false;
                }else{
                    return a[2] >= t[2];
                }
            }
        }else{
            return false;
        }
    },
    compareTime: function(start, end) {
        if (start == "" || end == "") return true;
        var s = start.replace(/-/g, "/"), e = end.replace(/-/g, "/"),
            sd = new Date(s), ed = new Date(e);
        return ed.getTime() - sd.getTime();
    },
    handleTime: function(time) {
        var time2;
        if (time) {
            time2 = time.split(":");
            if (time2.length >= 2) {
                return time2[0].replace(/-/g, "/") + ":" + time2[1];
            } else return time;
        } else return "";
    },
    substrs: function (str, len) {
        if (str.length <= len) return len;
        else return str.substr(0, len) + "...";
    },
    applyTypeColor: ['#F17474', '#70A1D9', '#72C474', '#4DC1B4', '#EEBB6A', '#72C474', '#70A1D9', '#4DC1B4'],
    bxType: ["日常报销", "差旅报销"],
    expenseType: [["发起申请", "#ccc"], ["审核中", "#64BE65"], ["通过", "#ccc"], ["拒绝", "#ccc"], ["已撤回", "#ccc"], ["未审批", "#ccc"], ["已转交", "#ccc"], ["待打款", "#EEBB6A"], ["待提交", "#ccc"], ["已打款", "#ccc"]],
    bxDetailType: ["交通", "住宿", "通讯", "采购", "餐饮", "其它", "补助", "办公", "市场", "招聘", "长途"]
};
Config.isVersion = Config.isOverVersion([[5,5,0], [5,5,0], [1,1,0], [1,4,0]]);
Config.modalImgUrl = location.origin + (Config.online ? "approve/expense" : '/expense') + "/files/cy-bx-tc.png";
module.exports = Config;