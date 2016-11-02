import React from "react"
import Helmet from "react-helmet";
import Config from "../../Config/Config"
import Avatar from "../Avatar/Avatar"
import cookie from 'react-cookie';

export default class Detail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            detail: {},
            showPut: false,
            lastUser: {},   // 最后一位审批人
            sharePwd: ""
        };
        this.params = this.props.params;
        this.my = {}; // 我 审批人
    }
    componentWillMount(){
        localStorage.setItem("detailList", "[]");
        sessionStorage.removeItem("newBxData");
    
        // 请求详细
        Config.ajax("post", {
            url: "queryApplyDetail",
            body: {applyId: this.params.applyId}
        }).then((res)=>{
            if (res.status == 200) {
                this.setState({
                    detail: res.result,
                    lastUser: res.result.approveDetailVo[res.result.approveDetailVo.length-1]
                });
                // this.lastUserStatus = res.result.approveDetailVo[res.result.approveDetailVo.length-1].approveStatus;
            } else {
                Config.toast("请求详细失败，状态码："+res.status);
            }
        });
    }
    componentDidMount(){
        //我发起的 且 已结束的 报销 有删除 按钮
        let that = this;
        window.JSBridge._callback.delete = function (){
            Config.native("confirm", {title: "确认删除", msg: "确定删除该条报销吗？"}).then((res)=>{
                if (res.data == "ok") {
                    that.del();
                }
            });
        };
    }
    setDelButton(){
        console.log("初始化删除按钮");
        Config.isAndr ? Config.native("menu", [{name:"删除", icon:"png", action: "native://calljs?callback=delete"}]) : setTimeout(function(){
            Config.native("menu", [{name:"删除", icon:"png", action: "native://calljs?callback=delete"}]);
        }, 500);
    }
    del(){
        Config.ajax("post", {
            url: "softly",
            body: {applyId: this.params.applyId}
        }).then((res)=>{
            if (res.status == 200) {
                history.go(-1);
            } else {
                Config.toast("删除失败，状态码：" + res.status);
            }
        });
    }
    handlePay(){
        Config.ajax("post", {
            url: "pay",
            body: { applyIdJArr: JSON.stringify([this.state.detail.applyId]) }
        }).then((res)=>{
            if(res.status == 200 || res.status == 731 || res.status == 732) {
                location.reload();
            } else {
                Config.toast("操作失败，状态码："+res.status);
            }
        });
    }
    retractApply(){
        Config.ajax("post", {
            url: "retract",
            body: { applyId: this.state.detail.applyId }
        }).then((res)=>{
            if(res.status == 200 || res.status == 731 || res.status == 732) {
                location.reload();
            } else {
                Config.toast("操作失败，状态码："+res.status);
            }
        });
    }
    reCreate(){
        // Config.native("openurl", {
        //     url: location.origin + location.pathname + location.search + "#/create/" + this.state.detail.applyId,
        //     cookie: 1,
        //     noDefaultMenu: 1
        // });
        location.href = "#/create/" + this.state.detail.applyId;
    }
    put(){
        Config.ajax("post", {
            url: "pwdOfPrint",
            body: {
                applyId: this.state.detail.applyId
            }
        }).then((res)=>{
            if (res.status == 200) {
                this.setState({ showPut: true, sharePwd: res.result });
            } else {
                Config.toast("获取密码失败！");
            }
        });
    }
    cancel(){
        this.setState({ showPut: false });
    }
    share(type){
        let that = this;
        let data = {
            type: type,
            title: "电子报销单",
            desc: "分享到电脑进行打印报销电子单",
            link: location.origin + "/expense/electronic-invoice.html?applyId=" + this.state.detail.applyId
                + "&name=" + encodeURI(this.my.uname)
                + "&orgId=" + (Config.getLocationSearch().orgId || cookie.load('orgId') || localStorage.getItem('orgId'))
                + "&token=" + cookie.load("token")
                + "&ts=" + (+new Date())
                + "&uid=" + cookie.load("userId"),
            pic: ""
        };
        console.log(data);
        Config.native("outershare", data).then(()=>{
            that.cancel();
        });
    }
    renderShare(){
        return (
            <div className={this.state.showPut ? "mask" : "mask hide"}>
                <div className="share">
                    <p className="title">分享到电脑进行打印，密码：{this.state.sharePwd}</p>
                    <div className="sort sort-3">
                        <div className="cy" onClick={this.share.bind(this, 3)}>
                            <img src={require("../../files/self.png")}/>
                            <p>彩云</p>
                        </div>
                        <div className="qq" onClick={this.share.bind(this, 4)}>
                            <img src={require("../../files/qq.png")}/>
                            <p>qq</p>
                        </div>
                        <div className="wx" onClick={this.share.bind(this, 2)}>
                            <img src={require("../../files/wx.png")}/>
                            <p>微信</p>
                        </div>
                    </div>
                    <div className="cancel" onClick={this.cancel.bind(this)}>取消</div>
                </div>
            </div>
        )
    }
    fqsx(item){
        let orgId = Config.getLocationSearch().orgId || cookie.load("orgId") || localStorage.getItem('orgId');
        item.url = location.origin + location.pathname + location.search + "&orgId=" + orgId + location.hash;
        item.content = this.state.detail.uname + "请您审批他的报销申请";
        Config.native('fqsx', item);
    }
    renderButton(){
        let img = {
            "2": "tg.png",
            "9": "success.png",
            "4": "ch.png",
            "3": "jj.png"
        };
        let status = this.state.detail.approveStatus;
        let cashierJArr = this.state.detail.cashierJArr || [];
        let last = this.state.lastUser;
    
        // 定义 删除按钮
        if ((status && status != 1 && status != 7) || (status == 7 && cashierJArr.length == 0)) {
            this.setDelButton();
        }
        
        if (this.params.pageType == 0) {
            // 终审人 审批中 或 未审批
            if (last.approveStatus == 1 || last.approveStatus == 5) {
                // 撤回
                return (
                    <div className="footer-btn btn1">
                        <a href="javascript:;" onClick={this.retractApply.bind(this)}>撤回</a>
                    </div>
                )
            } else if (status == 3) {
                // 驳回
                return (
                    <div>
                        <div className="img-status">
                            {status?<img src={"../files/" + img[status]} width="100%" height="100%"/>:undefined}
                        </div>
                        <div className="footer-btn btn1">
                            <a href="javascript:;" className="color-red" onClick={this.reCreate.bind(this)}>重新申请</a>
                        </div>
                    </div>
                )
            } else if (status == 2 || status == 9 || (status == 7 && cashierJArr.length > 0)) {
                // 打印
                return (
                    <div>
                        <div className="img-status">
                            {status && status != 7 ?<img src={"../files/" + img[status]} width="100%" height="100%"/>:undefined}
                        </div>
                        <div className="footer-btn btn1">
                            <a href="javascript:;" onClick={this.put.bind(this)}>打印</a>
                        </div>
                    </div>
                )
            } else {
                // 没有打款人 通过审批
                if (status == 7 && cashierJArr.length == 0) status = 2;
                return (
                    <div className="img-status">
                        {status?<img src={"../files/" + img[status]} width="100%" height="100%"/>:undefined}
                    </div>
                );
            }
        } else {
            // 待我审批
            if (this.my.approveStatus == 1) { // 我正在审批中
                return (
                    <div className="footer-btn">
                        <a href="javascript:;" className="color-red"
                           onClick={this.updateApprove.bind(this, 3)}>驳回</a>
                        <a href="javascript:;" className="close color-green"
                           onClick={this.updateApprove.bind(this, 2)}>同意</a>
                    </div>
                )
            } else if (status == 7 && (cashierJArr.length > 0 && cashierJArr[0].uid == cookie.load("userId"))) {
                // 待我支付
                return (
                    <div className="footer-btn btn1">
                        <a href="javascript:;" className="color-green" onClick={this.handlePay.bind(this)}>已打款</a>
                    </div>
                )
            } else if (status == 2 || status == 3 || status == 4 || status == 9){
                // 已结束
                return (
                    <div className="img-status">
                        {status?<img src={"../files/" + img[status]} width="100%" height="100%"/>:undefined}
                    </div>
                )
            } else {
                return undefined;
            }
        }
    }
    updateApprove(status){
        var that = this,
            data = {
                id: that.state.detail.id,
                applyId: that.state.detail.applyId,
                approveStatus: status,
                isLast: (that.state.lastUser.uid == cookie.load("userId") ? 1 : 0),
                approveOrder: that.my.approveOrder,
                approveDesc: ""
            };
            
        if (status == 2 || status == 3) {
            Config.native("prompt", {
                title: (status == 2 ? "同意报销" : "驳回报销"),
                placeholder: (status == 2 ? "请填写同意理由（选填）" : "请填写驳回理由（选填）"),
                textLength: 20,
                msg: ""
            }).then((res)=>{
                
                data.approveDesc = res.data;
                that.update(data)
                
            });
        } else {
            that.update(data);
        }
    }
    update(data){
        Config.ajax("post", {
            url: "updateApprove",
            body: data
        }).then((res)=>{
            if (res.status == 200 || res.status == 731 || res.status == 732) {
                location.reload();
            } else {
                Config.toast("更改报销状态失败，状态码："+res.status);
            }
        })
    }
    viewSingleDetail(item) {
        sessionStorage.setItem("single", JSON.stringify(item));
        location.href = "#/bxListDetail";
    }
    render(){
        let avatar = {uid: this.state.detail.uid, name: this.state.detail.uname};
        let customJObj = this.state.detail ? this.state.detail.customJObj : {};
            customJObj = customJObj ? JSON.parse(customJObj) : customJObj;
        let icon = [["101", "#72C474"], ["105", "#EEBB6A"], ["102", "#72C474"], ["103", "#FA565A"], ["106", "#cecece"], ["104", "#cecece"], "shenpizhuanjiaoshenpiren"];
        let dkr_icon = [["104", "#cecece", "待打款"], ["105", "#EEBB6A", "打款中"], ["102", "#72C474", "已打款"]];
        var approveStatus = this.state.detail.approveStatus;
        return (
            <div className="detail-content">
                <Helmet title="报销详情"/>
                
                <div className="row top">
                    {avatar.uid ? <Avatar item={avatar}/> : undefined}
                    <div className="info">
                        <p className="title">{this.state.detail.uname}的报销</p>
                        <p className="deptname">{this.state.detail.deptName}</p>
                    </div>
                </div>
                
                <div className="row">
                    {customJObj? (
                        <div className="middle">
                            <div className="one">
                                <p className="title">{Config.bxType[customJObj.type]}</p>
                                <p className="desc">{this.state.detail.applyResean}</p>
                                <p className="bxMoney">报销金额：￥{Number(customJObj.amount).toFixed(2)}</p>
                                {
                                    customJObj.type == 1 ? (
                                        <div className="bxMoney">
                                            <p>开始时间：{Config.handleTime(customJObj.startTime)}</p>
                                            <p>结束时间：{Config.handleTime(customJObj.endTime)}</p>
                                        </div>
                                    ) : undefined
                                }
                                <p className="id">审批编号：{this.state.detail.applyId}</p>
                            </div>
                            
                            <div className="two">
                                <p className="title">报销明细</p>
                                {customJObj.detailJArr.map((item)=>{
                                    return (
                                        <div className="detail-list" key={item.id} onClick={this.viewSingleDetail.bind(this, item)}>
                                            <i className="iconfont icon-104"/>
                                            {Config.bxDetailType[item.type]}
                                            <span>{Number(item.money).toFixed(2)} <i className="iconfont icon-xiayibu"/></span>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            <div className="three">
                                <div className="line"></div>
                                {
                                    this.state.detail.approveDetailVo.map((item)=>{
                                        // 我的状态
                                        if (cookie.load("userId") == item.uid) {
                                            this.my = item;
                                        }
                                        return (
                                            <div className="process" key={item.id}>
                                                <span style={{color: icon[item.approveStatus][1]}}><i className={"iconfont icon-" + icon[item.approveStatus][0]}/> {Config.expenseType[item.approveStatus][0]}</span>
                                                <div className="infos">
                                                    <Avatar item={{uid: item.uid, name: item.uname}}/>
                                                    <div className="info">
                                                        <p className="name">{cookie.load("userId") == item.uid ? "我" : item.uname}</p>
                                                        <p className="time">{item.approveDate == "0000-00-00 00:00:00" ? undefined : Config.handleTime(item.approveDate)}</p>
                                                    </div>
                                                    {
                                                        item.approveDesc ? (
                                                            <div className="approveDesc">
                                                                {item.approveStatus == 3 ? "驳回理由" : "同意理由"}
                                                                <span>：{item.approveDesc}</span>
                                                            </div>
                                                        ) :undefined
                                                    }
                                                    {item.approveStatus==1 && this.params.pageType == 0 ?
                                                        <span className="fqsx" onClick={this.fqsx.bind(this, item)}>发事项</span>:undefined}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    // 处于 审核中、已同意、未审批、待打款、已打款的 显示 打款人
                                    (approveStatus == 1 || approveStatus == 2 || approveStatus == 5 || approveStatus == 7 || approveStatus == 9) &&
                                    this.state.detail.cashierJArr.map((item, index)=>{
                                        // 打款人显示
                                        return (
                                            <div className="process" key={index}>
                                                <span style={{color: dkr_icon[item.status][1]}}><i className={"iconfont icon-" + dkr_icon[item.status][0]}/> {dkr_icon[item.status][2]}</span>
                                                <div className="infos">
                                                    <Avatar item={{uid: item.uid, name: item.uname}}/>
                                                    <div className="info">
                                                        <p className="name">{cookie.load("userId") == item.uid ? "我" : item.uname}</p>
                                                        <p className="time">{item.status != 0 ? Config.handleTime(item.paidDate) : undefined}</p>
                                                    </div>
                                                    {this.state.detail.approveStatus == 7 && this.params.pageType == 0 ?
                                                        <span className="fqsx" onClick={this.fqsx.bind(this, item)}>发事项</span>:undefined}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ):undefined}
                </div>
                {this.renderButton()}
                {this.renderShare()}
            </div>
        )
    }
}