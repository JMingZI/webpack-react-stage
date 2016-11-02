import React from "react";
import cookie from 'react-cookie';
import Helmet from "react-helmet";
import Config from "../../Config/Config";
import Avatar from "../Avatar/Avatar";

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCharge: 0.00,
            isSetApproveUser: false,
            detail: [],
            bxType: {text: "日常报销", value: 0},
            authList: [],
            informList: [],
    
            applyResean: "",
            startTime: "",
            endTime: "",
    
            showDkrBox: false,
            dkrBoxList: [],
            chooseDkrMethod: "app"
        };
    
        this.applyId = "";
        this.over5_6 = Config.isOverVersion([[5,6,0], [5,6,0], [1,2,0], [1,5,0]]);
    }
    componentWillMount(){
        if (this.props.params.applyId) {
            // 判断 重新 申请 填充数据
            this.getDetail(this.props.params.applyId);
        } else {
            // 判断 localStorage 是否存有 报销明细 数据
            // 并根据金额 拉取审批人
            this.setBxDetail();
        }
    }
    getDetail(id) {
        Config.ajax("post", {
            url: "queryApplyDetail",
            body: { applyId: id }
        }).then((res)=>{
            if (res.status == 200) {
                this.applyId = res.result.applyId;
                // 还原值
                let data = res.result;
                let customJObj = JSON.parse(data.customJObj);
                
                // 报销明细 不存在 则还原
                if ( JSON.parse(localStorage.getItem("detailList")||'[]').length == 0) {
                    localStorage.setItem("detailList", JSON.stringify(customJObj.detailJArr));
                }
                let cashierJArr;
                if (this.props.params.isWaitSubmit) {
                    // 字段 放在 customJObj中
                    cashierJArr = customJObj.cashierJArr;
                } else {
                    // 重新申请 字段 放在 data 中
                    cashierJArr = data.cashierJArr.map((item)=>{
                        return {uid: item.uid, name: item.uname};
                    });
                }
                 
                this.setState({
                    bxType: {text: Config.bxType[customJObj.type], value: customJObj.type},
                    applyResean: data.applyResean,
                    totalCharge: customJObj.amount,
                    detail: customJObj.detailJArr,
                    startTime: customJObj.startTime,
                    endTime: customJObj.endTime,
                    authList: customJObj.flowStr || [],
                    informList: cashierJArr || []
                });
                // 判断 localStorage 是否存有 报销明细 数据
                // 并根据金额 拉取审批人
                this.setBxDetail();
            } else {
                Config.toast("查询详情失败，状态码："+ res.status);
            }
        });
    }
    setBxDetail(){
        let detail = localStorage.getItem("detailList") || "[]";
        let totalMoney = 0;
        JSON.parse(detail).map((item)=>{
            totalMoney += Number(item.money);
        });
        this.setState({
            detail: JSON.parse(detail),
            totalCharge: totalMoney.toFixed(2)
        });
        // return totalMoney;
        // 根据总金额 获取 设置的 审批人
        this.renderAdminSetFlow(totalMoney);
    }
    renderAdminSetFlow(amount){
        // 查看是否设置管理员
        Config.ajax("post", {
            url: "getFlowByType",
            body: {applyType:4, amount: Math.ceil(amount)}
        }).then((res)=>{
            if(res.status == 200){
                // 审批人
                let arr = (res.result.flowInfos||[]).map((item)=>{
                    return {name:item.uname, uid:item.uid};
                });
                var filterArr = [];
                if (res.result.isSet == 1) {
                    // 过滤掉自己
                     arr.map((item)=>{
                        if (item.uid != cookie.load("userId")) filterArr.push(item);
                     });
                    (filterArr.length > 0) && this.setState({authList: filterArr, isSetApproveUser: true});
                } else if (this.state.authList.length == 0) {
                    this.setState({authList: arr});
                }
                
                // 打款人
                let arr2 = (res.result.cashier||[]).map((item)=>{
                    return {name:item.uname,uid:item.uid, mobile: item.mobile, remark: item.remark};
                }), temp = [];
                let arr3 = (res.result.cashierFlowInfos||[]).map((item)=>{
                    return {name:item.uname,uid:item.uid, mobile: item.mobile, remark: item.remark};
                });
                if (this.state.informList.length == 0) {
                    // 如果打款人为空
                    if (arr2.length > 0) {
                        temp.push(arr2[0]);
                        // 弹窗选择 出纳人
                        this.setState({dkrBoxList: arr2, chooseDkrMethod: "mask", informList: temp});
                    } else {
                        // 没有设置的 就默认上次选的出纳人
                        this.setState({chooseDkrMethod: "app", informList: arr3});
                    }
                }
                
                // 检查其它字段是否有存储
                this.checkSession();
            } else {
                Config.toast('错误码：'+ data.status);
            }
        });
    }
    checkSession(){
        // 检查 session 是否存在
        // session 是用来 保存 报销明细 外的 其它选项
        let sessionData = sessionStorage.getItem("newBxData");
        if (sessionData) {
            sessionData = JSON.parse(sessionData);
            this.setState({
                bxType: sessionData.bxType,
                applyResean: sessionData.applyResean,
                authList: sessionData.authList,
                informList: sessionData.informList,
                startTime: sessionData.startTime,
                endTime: sessionData.endTime
            });
        }
    }
    componentDidMount(){
        // 设置 右上角 菜单
        let that = this;
        window.JSBridge._callback.save = function (){
            // 收起键盘
            Config.native("hidekeyboard", {});
    
            if (that.validate() == false) { return false; }
    
            Config.native("confirm", {title: "确认保存", msg: "仅保存并不提交"}).then((res)=>{
                if (res.data == "ok") {
                    that.submit(1);
                }
            });
        };
        Config.isAndr ? Config.native("menu", [{name:"保存", icon:"png", action: "native://calljs?callback=save"}]) : setTimeout(function(){
            Config.native("menu", [{name:"保存", icon:"png", action: "native://calljs?callback=save"}]);
        }, 500);
    }
    saveSession(){
        let data = {
            bxType: this.state.bxType,
            applyResean: this.state.applyResean,
            authList: this.state.authList,
            informList: this.state.informList,
            startTime: this.state.startTime,
            endTime: this.state.endTime
        };
        sessionStorage.setItem("newBxData", JSON.stringify(data));
    }
    del(index, e){
        e.stopPropagation();
        Config.native("confirm", {msg: "是否确定删除该条报销明细?"}).then((res)=>{
            if (res.data == "ok") {
                let data = JSON.parse(localStorage.getItem("detailList"));
                data.splice(index, 1);
                // this.setState({ detail: data });
                localStorage.setItem("detailList", JSON.stringify(data));
                this.setBxDetail();
            }
        });
    }
    validate(){
        if (this.state.bxType == "") {
            Config.toast("请选择报销类型！");
            return false;
        }
        if (this.state.bxType.value == 1) {
            if (this.state.startTime == "") {
                Config.toast("请选择开始时间");
                return false;
            }
            if (this.state.endTime == "") {
                Config.toast("请选择结束时间");
                return false;
            }
            // if ()
        }
        if (this.state.applyResean.trim() == "") {
            Config.toast("报销事由不能为空");
            return false;
        }
        let detail = localStorage.getItem("detailList") || "[]";
        if (JSON.parse(detail).length == 0) {
            Config.toast("请添加报销明细！");
            return false;
        }
        if (this.state.authList.length == 0) {
            Config.toast("请选择审批人");
            return false;
        }
        // if (this.state.informList.length == 0) {
        //     Config.toast("请选择出纳人");
        //     return false;
        // }
        return true;
    }
    beforeSubmit(){
        if (this.validate() == false) { return false; }
    
        Config.native("confirm", {title: "确认提交", msg: "提交后将给审批人发送通知"}).then((res)=>{
            if (res.data == "ok") {
                this.submit(0);
            }
        });
    }
    submit(type){
        let cashierJArr = this.state.informList.map((item)=>{
             return item.uid;
        });
        
        let data = {
            applyType: 4,
            applyResean: this.state.applyResean,
            cashierJArr: JSON.stringify(cashierJArr), // 出纳人
            flowStr: JSON.stringify(this.state.authList), //审批人,
            customStruct: {
                amount: this.state.totalCharge,
                type: this.state.bxType.value,
                flowStr: (type == 1 ? this.state.authList : []), // 保存时
                // cashierJArr: (type == 1 ? this.state.informList : []), // 保存时
                cashierJArr: this.state.informList, // 获取详细的时候拿
                detailJArr: JSON.parse(localStorage.getItem("detailList")),
                startTime: this.state.startTime, // 差旅报销 起始时间
                endTime: this.state.endTime
            }
        };
        data.customStruct = JSON.stringify(data.customStruct);
        // 待提交 applyId
        if (this.applyId && this.props.params.isWaitSubmit) { data.applyId = this.applyId; }
        
        let url = (type == 1 ? "save" : "submit");
        Config.ajax("post", {url: url, body: data}).then((res)=>{
            if (res.status == 200) {
                history.go(-1);
            } else {
                Config.toast("操作失败，状态码：" + res.status);
            }
        });
    }
    redirect(id, e){
        // 跳转之前 save 表单 到session
        this.saveSession();
        let url = "#/add" + (id ? ("/"+id) : "");
        location.href = url;
    }
    picker(){
        Config.native("picker", {title: "报销类型", list: [{text: "日常报销", value: 0}, {text: "差旅报销", value: 1}]}).then((res)=>{
            this.setState({bxType: res.data});
        });
    }
    change(e){
        this.setState({applyResean: e.target.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")});
    }
    delPeople(index, type){
        if (type == "authList") {
            if(!this.state.isSetApproveUser){
                this.state.authList.splice(index, 1);
                this.setState({authList: this.state.authList});
            }
        } else {
            this.state.informList.splice(index, 1);
            this.setState({informList: this.state.informList});
        }
    }
    getAddUserMethod(count){
        let method;
        let data = {};
        // 判断版本
        if (Config.isVersion) {
            data = {
                count: count,
                selectMeType: 1,
                excludedtype: 1,
                orgid: Config.getLocationSearch().orgId || cookie.load("orgId") || localStorage.getItem('orgId'),
                orgName: localStorage.getItem('orgName'),
                selected: []
            };
            method = "selectmembers"; }
        else { method = 'selectPeopleIOS'; }
        return {method: method, data: data};
    }
    addUser(){
        let data = this.getAddUserMethod(500);
        Config.native(data.method, data.data).then((res)=>{
            let data = res.data.map((item)=>{
                let ishave = false;
                for(let i=0; i<this.state.authList.length; i++){
                    if(item.uid == this.state.authList[i].uid){
                        ishave=true;
                    }
                }
                if(!ishave){
                    return item;
                }
            });
            let authList = this.state.authList.concat(data.filter(x => {return x}));
            this.setState({authList: authList});
        });
    }
    addUser2(){
        if (this.state.chooseDkrMethod == "mask") {
            // 弹窗选择
            this.setState({showDkrBox: true})
        } else {
            // 调用客户端
            // 5.6之前 是 多选
            let data = this.over5_6 ? this.getAddUserMethod(1) : this.getAddUserMethod(2);
            let temp = [];
            Config.native(data.method, data.data).then((res)=> {
                if (this.over5_6) {
                    this.setState({informList: res.data});
                } else {
                    temp.push(res.data[0]);
                    this.setState({informList: temp});
                }
            });
        }
    }
    selectTime(type) {
        var that = this;
        Config.native("selectdate", {format: "yyyy-MM-dd"}).then((res)=>{
            let start = (type == "startTime" ? res.data : that.state.startTime);
            let end = (type == "endTime" ? res.data : that.state.endTime);
            let days = Config.compareTime(start, end);
            if (days >= 0){
                type == "startTime" ? that.setState({startTime: res.data}) : that.setState({endTime: res.data});
            } else {
                Config.toast("结束时间必须大于开始时间！");
            }
        });
    }
    setInformList(item){
        this.setState({
            informList: [item],
            showDkrBox: false
        })
    }
    render(){
        return (
            <div className="second-page">
                <Helmet title="新建报销"/>
                
                <div className="row" onClick={this.picker.bind(this)}>
                    <span className="sort">报销类型</span>
                    <span className={this.state.bxType ? "right color-black" : "right"}>{this.state.bxType ? this.state.bxType.text : "请选择"} <i className="iconfont icon-xiayibu"/></span>
                </div>
                
                {
                    this.state.bxType.value == 1 ? (
                        <div className="blockRow">
                            <div className="row" onClick={this.selectTime.bind(this, "startTime")}>
                            <span className="sort">开始时间</span>
                            <span className={this.state.startTime ? "right color-black" : "right"}>{this.state.startTime ? this.state.startTime : "请选择(必填)"} <i className='iconfont icon-xiayibu'/></span>
                            </div>
                            <div className="row" onClick={this.selectTime.bind(this, "endTime")}>
                                <span className="sort">结束时间</span>
                                <span className={this.state.endTime ? "right color-black" : "right"}>{this.state.endTime ? this.state.endTime : "请选择(必填)"} <i className='iconfont icon-xiayibu'/></span>
                            </div>
                        </div>
                    ):undefined
                }
                
                <div className="row">
                    <textarea className="desc" placeholder="请输入报销事由(必填)" maxLength="40" onChange={this.change.bind(this)} value={this.state.applyResean}/>
                </div>
                
                <div className="row expense-row">
                    <span className="out-title">报销明细</span>
                    {
                        this.state.detail.map((item, index)=>{
                            return (
                                <div className="row detail-list" key={item.id} onClick={this.redirect.bind(this, item.id)}>
                                    <span className="del" onClick={this.del.bind(this, index)}><i className="iconfont">&#xe657;</i></span>
                                    <span className="title">{Config.bxDetailType[item.type]}</span>
                                    <span className="right">{Number(item.money).toFixed(2)} <i className="iconfont icon-xiayibu"/></span>
                                </div>
                            )
                        })
                    }
                    <div className="add-expense-row row" onClick={this.redirect.bind(this, "")}><i className="iconfont icon-113"/> 添加报销明细</div>
                </div>
                
                <div className="row">
                    <span className="inner-title">审批人 <span className="note">({this.state.isSetApproveUser ? "管理员已设置审批人" : "点击头像可删除"})</span></span>
                    {
                        this.state.authList.map((item,index)=>{
                            return (
                                <div className="span" key={index}>
                                    <div className="avatar-box" onClick={this.delPeople.bind(this,index, "authList")}>
                                        <Avatar key={item.uid} item={item}/>
                                        <div className="userName">{item.name}</div>
                                    </div>
                                    {index==this.state.authList.length-1?undefined:<i className="iconfont icon-shenpiliucheng"/>}
                                </div>
                            )
                        })
                    }
                    {this.state.isSetApproveUser ? undefined :<div className="avatar add-item" onClick={this.addUser.bind(this)}><i className="iconfont icon-113"/></div>}
                </div>
    
                <div className="row cnr">
                    <span className="inner-title">打款人 <span className="note">(审批流结束后将自动转给打款人)</span></span>
                    {
                        this.state.informList.map((item,index)=>{
                            return (
                                <div className="span" key={index}>
                                    <div className="avatar-box" onClick={this.delPeople.bind(this, index, "informList")}>
                                        <Avatar key={item.uid} item={item}/>
                                        <div className="userName">{item.name}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {this.state.informList.length == 0 ? <div className="avatar add-item" onClick={this.addUser2.bind(this)}><i className="iconfont icon-113"/></div> : undefined}
                </div>
                
                <div className="submit" onClick={this.beforeSubmit.bind(this)}>提交 (共计{this.state.totalCharge}元)</div>
                
                <div className={this.state.showDkrBox ? "dkr" : "dkr hide"}>
                    <p className="title">选择打款人</p>
                    {
                        this.state.dkrBoxList.map((item,index)=>{
                            return (
                                <div className="dkr-list" key={index} onClick={this.setInformList.bind(this, item)}>
                                    <Avatar key={item.uid} item={item}/>
                                    <span className="name">{item.name}</span>
                                    <span className="note">{item.remark ? ("("+ Config.substrs(item.remark, 14) +")") : ""}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}