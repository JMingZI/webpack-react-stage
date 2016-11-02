import React from 'react';
import cookie from 'react-cookie';
import Helmet from "react-helmet";
import Config from "../Config/Config";
import Avatar from "../Component/Avatar/Avatar";
import slideDirection from "../Component/SlidePage";

export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currTab: 0,
            list: [],
            payingNum: 0,
            noData: false,
    
            currCorp: {},
            corpList: [],
            expand: false
        };
        
        // 分页数据
        this.pageNum = 0;
        this.pageClickable = true;
    }
    componentWillMount(){
        let isNoFirst = localStorage.getItem('isNoFirst');
        if(!isNoFirst){
            localStorage.setItem('isNoFirst', true);
            Config.native('modal',{
                title: "让报销更便捷",
                msg: "电子报销单线上流转\n报销的进度实时查看\n一键打印电子报销单",
                img: Config.modalImgUrl,
                link: "https://video.statics.cdn.jituancaiyun.com/FAQ/jtcy/expense.html"
            });
        }
        
        // 自定义菜单 IOS延迟500ms
        Config.isAndr ? Config.native("menu", []) : setTimeout(function(){
            Config.native("menu", [])
        }, 500);
        
        localStorage.setItem("detailList", "[]");
        sessionStorage.removeItem("newBxData");
    
        Config.native("getorglist").then((data)=> {
            data = data.data;
            let currCorp = [];
            let orgId = Config.getLocationSearch().orgId || cookie.load("orgId") || localStorage.getItem('orgId');
            if (orgId && orgId != "undefined") {
                data.forEach((item)=> {
                    if (orgId == item.orgId) {
                        currCorp = item;
                    }
                })
            } else {
                currCorp = data[0];
            }
    
            this.setState({currCorp:currCorp, corpList: data, expand:false});
            localStorage.setItem("orgId", currCorp.orgId);
            localStorage.setItem("orgName", currCorp.orgName);
            localStorage.setItem("deptName", currCorp.deptName);
        });
    }
    componentDidMount(){
        /**
         * @params TabUrlType 我的报销 和 带我处理 接口地址 {0, 1}
         * @params listType 审批中 和 已结束 {1, 2}
         */
        let type = sessionStorage.getItem("currType");
        this.select(type || 0);
    
        window.moveEndPage = ()=>{
            if (this.pageClickable ){
                Config.toast("加载中...");
                this.getList(this.state.currTab, 1);
                this.pageClickable = false;
            }
        }
    }
    clickList(item){
        // let url = location.origin + location.pathname;
        if (item.approveStatus == "8") {
            // 重新创建
            // "/create/:applyId/:isWaitSubmit"
            location.href = "#create/" + item.applyId + "/1";
        } else {
            // 查看详情
            // "/detail/:pageType/:applyId";
            location.href = "#detail/"+ this.state.currTab +"/" + item.applyId;
        }
    }
    getList(TabUrlType, listType) {
        let url = ["queryMyApply", "queryMyApprove"];
        let data = {
            url: url[TabUrlType],
            body: { approveStatus: listType, pageNum: this.pageNum, pageSize: Config.pageSize }
        };
        let that = this;
        Config.ajax("post", data).then((res)=>{
            if (res.status == 200) {
                if (res.result.length == 0) {
                    // Config.toast(this.pageNum == 0 ? "抱歉，没有数据哦" : "没有更多了");
                    this.pageClickable = false;
                    (this.pageNum != 0) && this.setState({noData: true})
                } else {
                    // 把结果追加进去
                    this.state.list = this.state.list.concat(res.result);
                    that.setState({list: this.state.list});
                    // 当前分页加1
                    this.pageNum = res.pageNum + 1;
                    this.pageClickable = true;
                    // 当数据数量 小于 分页数量 时，不分页
                    if (res.result.length < Config.pageSize) {
                        this.pageClickable = false;
                    }
                }
            } else {
                Config.toast("获取列表失败，状态码："+res.status);
            }
        });
    }
    select(type) {
        // 分页重置
        this.pageNum = 0;
        
        this.setState({currTab: type, list: [], noData: false});
        this.getList(type, 1);
        
        // 待我处理 请求 待支付 数量
        if (type == 1) {
            let that = this;
            Config.ajax("post", {url: "payingNum", body: {}}).then((res)=>{
                if (res.status == 200) {
                    that.setState({ payingNum: res.result });
                } else {
                    Config.toast("请求待支付数量失败，状态码："+ res.status);
                }
            })
        }
        
        sessionStorage.setItem("currType", type);
    }
    redirect(urlTab, listType){
        let url = location.origin + location.pathname;
        switch(listType) {
            case 3: {
                url = "#/create";
            }break;
            default:{
                url = "#/list/" + urlTab + "/" + listType;
            }
        }
        location.href = url;
    }
    updateApprove(item, status, e){
        e.stopPropagation();
        // 收起键盘
        Config.native("hidekeyboard", {});
        
        Config.native("prompt", {
            title: (status == 2 ? "同意报销" : "驳回报销"),
            placeholder: (status == 2 ? "请填写同意理由（选填）" : "请填写驳回理由（选填）"),
            textLength: 20,
            msg: ""
        }).then((res)=>{
            Config.ajax("post", {
                url: "updateApprove",
                body: {
                    applyId: item.applyId,
                    approveStatus: status,
                    approveDesc: res.data
                }
            }).then((res)=>{
                if (res.status == 200 || res.status == 731 || res.status == 732) {
                    // 跳转到 带我审批 已结束列表
                    location.href = "#/list/1/2";
                } else {
                    Config.toast("操作失败，状态码："+res.status);
                }
            });
        });
    }
    expandOrg(){
        this.setState({expand:!this.state.expand});
    }
    hideOrgList(){
        this.setState({expand:false})
    }
    selectOrg(item){
        this.setState({currCorp:item, expand:false});
        localStorage.setItem('orgId', item.orgId);
        localStorage.setItem('orgName', item.orgName);
        localStorage.setItem('deptName', item.deptName);
    
        let type = sessionStorage.getItem("currType");
        this.select(type || 0);
    }
    renderOrgList(){
        return (
            <div className="header">
                <div className="orgInfo">
                    {
                        this.state.corpList.length > 1 ?
                            (
                                <div className="focusorg" onClick={this.expandOrg.bind(this)}>
                                    {this.state.currCorp.orgName} <i className={this.state.expand?"triangle up":"triangle down"}/>
                                </div>
                            ) : <div className="focusorg">{this.state.currCorp.orgName}</div>
                    }
                    <div className={this.state.expand?"orgList":"orgList hide"}>
                        {
                            (this.state.corpList||[]).map((item, index)=>{
                                return (
                                    <div key={index} className={item.orgId==this.state.currCorp.orgId?"focusorg":""} onClick={this.selectOrg.bind(this,item)}>
                                        {item.orgName}
                                        {
                                            (()=>{
                                                let returnValue = null;
                                                (this.state.list||[]).forEach((org)=>{
                                                    if(org.orgId == item.orgId && org.count>0){
                                                        returnValue = <i>（{org.count}）</i>
                                                        return ;
                                                    }
                                                })
                                                return returnValue;
                                            })()
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {this.state.expand? <div className="mask" onClick={this.hideOrgList.bind(this)}></div>:null}
            </div>
        )
    }
    render(){
        return (
            <div className={Config.isVersion ? "container" : "container before-5_5"}>
                <Helmet title="报销"/>
                
                {Config.isVersion ? undefined : this.renderOrgList()}
                
                <div className="tab">
                    <a href="javascript:;" onClick={this.select.bind(this, 0)} className={this.state.currTab == 0 ? "active": ""}>我的报销</a>
                    <a href="javascript:;" onClick={this.select.bind(this, 1)} className={this.state.currTab == 1 ? "active": ""}>待我处理</a>
                </div>
                
                <div className="list" onTouchStart={slideDirection.outTouchstart.bind(this)} onTouchEnd={slideDirection.outTouchend.bind(this)}>
                    <div className="list-body">
                    {this.state.list.map((item)=>{
                        return (
                            <div className="item" key={item.applyId} onClick={this.clickList.bind(this, item)}>
                                {
                                    this.state.currTab == 1 ? <Avatar item={{uid: item.uid, name: item.uname}}/>:
                                    (
                                        <div className="avatar" style={{backgroundColor: Config.expenseType[item.approveStatus][1]}}>
                                            {Config.expenseType[item.approveStatus][0]}
                                        </div>
                                    )
                                }
                                <div className="desc">
                                    <p className="type">{this.state.currTab == 1 ? (item.uname+"的报销") : Config.bxType[JSON.parse(item.customJObj).type]}</p>
                                    <p className="time">{Config.handleTime(item.gmtCreateDate)}</p>
                                    <p className="title">{item.applyResean}</p>
                                </div>
                                <div className="money">
                                    <span>报销金额：￥{JSON.parse(item.customJObj).amount}</span>
                                </div>
                                {
                                    this.state.currTab == 1 ? (
                                        <div className="options">
                                            <a href="javascript:;" onClick={this.updateApprove.bind(this, item, 3)} className="reject">驳回</a>
                                            <a href="javascript:;" onClick={this.updateApprove.bind(this, item, 2)} className="agree">同意</a>
                                        </div>
                                    ) : undefined
                                }
                            </div>
                        )
                    })}
    
                    <div className={this.state.noData ? "no-data" : "no-data hide"}>没有更多了</div>
    
                    <div className="footer-tab item" onClick={this.redirect.bind(this, this.state.currTab, 2)}>{this.state.currTab == 0 ? "查看已结束的报销" : "查看已处理的报销"} <span><i className="iconfont icon-xiayibu" /></span></div>
                    {this.state.currTab == 1 ? <div className="footer-tab item" onClick={this.redirect.bind(this, 2, 1)}>待我支付的报销 <span>{this.state.payingNum} <i className="iconfont icon-xiayibu" /></span></div> : undefined}

                    </div>
                </div>
                <a href="javascript:;" className="new" onClick={this.redirect.bind(this, 0, 3)}><i className="iconfont">&#xe60f;</i> 我要报销</a>
            </div>
        )
    }
}