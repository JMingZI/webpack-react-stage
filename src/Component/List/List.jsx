import React from "react";
import Helmet from "react-helmet";
import Config from "../../Config/Config";
import Avatar from "Component/Avatar/Avatar";
import slideDirection from "Component/SlidePage";

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            noData: false,
            choosed: {},
            total: 0.00,
            checkNum: 0,
            allCheck: false
        };
        this.words = ["已结束的报销", "已处理的报销", "待支付的报销"];
        // 分页数据
        this.pageNum = 0;
        this.pageClickable = true;
    }
    componentWillMount(){
        localStorage.setItem("detailList", "[]");
        sessionStorage.removeItem("newBxData");
        
        Config.isAndr ? Config.native("menu", []) : setTimeout(function(){
            Config.native("menu", [])
        }, 500);
    }
    componentDidMount(){
        this.getList();
        // slideDirection.set();
        window.moveEndPage = ()=>{
            if (this.pageClickable ){
                Config.toast("加载中...");
                this.getList();
                this.pageClickable = false;
            }
        }
    }
    getList() {
        let url = ["queryMyApply", "queryMyApprove", "paying"];
        let data = {
            url: url[this.props.params.urlType],
            body: { approveStatus: 2, pageNum: this.pageNum, pageSize: Config.pageSize }
        };
        Config.ajax("post", data, "").then((res)=>{
            if (res.status == 200) {
                if (res.result.length == 0) {
                    // Config.toast(this.pageNum == 0 ? "抱歉，没有数据哦" : "没有更多了");
                    this.pageClickable = false;
                    (this.pageNum != 0) && this.setState({noData: true})
                } else {
                    // 把结果追加进去
                    this.state.list = this.state.list.concat(res.result);
                    this.setState({list: this.state.list});
                    // 当前分页加1
                    this.pageNum = res.pageNum + 1;
                    this.pageClickable = true;
                    // 当数据数量 小于 分页数量 时，不分页
                    if (res.result.length < Config.pageSize) {
                        this.pageClickable = false;
                    }
                }
            }
            else {
                Config.toast("请求失败，状态码："+res.status);
            }
        });
    }
    clickList(item) {
        // "/detail/:pageType/:applyId";
        location.href = "#detail/"+ this.props.params.urlType +"/" + item.applyId;
    }
    renderFromMe(item){
        let img = {
            "2": "tg.png",
            "9": "success.png",
            "4": "ch.png",
            "3": "jj.png"
        }, imgSrc;
        // 列表 显示的 状态
        if (this.props.params.urlType == 0) {
            // 我发起的
            imgSrc = item.approveStatus;
        } else {
            // 待我处理的
            if (item.approveStatus == 1 || item.approveStatus == 5 || item.approveStatus ==7) {
                // 未结束 显示我进行的操作
                imgSrc = item.currStatus;
            } else {
                // 已结束 显示 该条审批的状态
                imgSrc = item.approveStatus;
            }
        }
        
        return (
            <div className="item" key={item.applyId} onClick={this.clickList.bind(this, item)}>
                {
                    this.props.params.urlType == 0 ? (
                        <div className="avatar" style={{backgroundColor: "#ccc"}}>
                            {Config.expenseType[item.approveStatus][0]}
                        </div>
                    ) : <Avatar item={item}/>
                }
                <div className="desc">
                    <p className="type">{Config.bxType[JSON.parse(item.customJObj).type]}</p>
                    <p className="time">{Config.handleTime(item.gmtCreateDate)}</p>
                    <p className="title">{item.applyResean}</p>
                </div>
                <div className="money">
                    <span>报销金额：￥{JSON.parse(item.customJObj).amount}</span>
                </div>
                <img src={"../files/"+ img[imgSrc]} alt="" className="img-status"/>
            </div>
        );
    }
    renderPay(item){
        return (
            <div className="item" key={item.applyId} onClick={this.clickList.bind(this, item)}>
                <div className="select" onClick={this.checks.bind(this, item)}>
                    {this.state.choosed[item.applyId] ? <i className="iconfont icon-yuanquangou"/> : <i className="iconfont icon-yuanquankong"/>}
                </div>
                <div className="select-right">
                    <Avatar item={item}/>
                    <div className="desc">
                        <p className="type">{Config.bxType[JSON.parse(item.customJObj).type]}</p>
                        <p className="time">{Config.handleTime(item.gmtCreateDate)}</p>
                        <p className="title">{item.applyResean}</p>
                    </div>
                    <div className="money">
                        <span>报销金额：￥{JSON.parse(item.customJObj).amount}</span>
                    </div>
                </div>
            </div>
        );
    }
    checks(item, e){
        e.stopPropagation();
        this.state.choosed[item.applyId] = this.state.choosed[item.applyId] ? false : true;
        
        if (this.state.choosed[item.applyId]) {
            this.state.checkNum += 1;
        } else {
            this.state.checkNum -= 1;
        }
        
        this.state.total = 0;
        // 判断是否 已全选 或 未全选
        let flag = true;
        this.state.list.map((i)=>{
            if (this.state.choosed[i.applyId]) {
                this.state.total += Number(JSON.parse(i.customJObj).amount);
            } else flag = false;
        });
        this.state.allCheck = flag;
        
        this.setState({
            total: this.state.total.toFixed(2),
            checkNum: this.state.checkNum,
            choosed: this.state.choosed,
            allCheck: this.state.allCheck
        });
    }
    checkAll(){
        this.state.total = 0;
        this.state.list.map((i)=>{
            if (this.state.allCheck == false) {
                this.state.choosed[i.applyId] = true;
                this.state.total += Number(JSON.parse(i.customJObj).amount);
            } else {
                this.state.choosed[i.applyId] = false;
            }
        });
        let checkNum = this.state.allCheck ? 0 : this.state.list.length;
        
        this.state.allCheck = this.state.allCheck ? false : true;
        this.setState({
            total: this.state.total.toFixed(2),
            checkNum: checkNum,
            choosed: this.state.choosed,
            allCheck: this.state.allCheck
        });
    }
    handlePay(){
        let arr = [];
        for (let id in this.state.choosed) {
            this.state.choosed[id] && arr.push(id);
        }
        if (arr.length == 0) Config.toast("请选择需要打款的报销");
        else {
            Config.ajax("post", {
                url: "pay",
                body: {
                    applyIdJArr: JSON.stringify(arr)
                }
            }).then((res)=>{
                if(res.status == 200) {
                    location.reload();
                } else {
                    Config.toast("操作失败，状态码："+res.status);
                }
            });
        }
    }
    render(){
        return (
            <div className="second-page">
                <Helmet title={this.words[this.props.params.urlType]}/>
                <div className={this.props.params.urlType == 2 ? "list wait-pay" : "list"} onTouchStart={slideDirection.outTouchstart.bind(this)} onTouchEnd={slideDirection.outTouchend.bind(this)}>
                    <div className="list-body">
                    {
                        this.state.list.map((item)=>{
                            return this.props.params.urlType == 2 ? this.renderPay(item) : this.renderFromMe(item);
                        })
                    }
                    {
                        this.state.list.length == 0 ? (
                            <div className="empty">
                                <img src="../files/empty-bx-cy.png" alt=""/>
                                没有{this.words[this.props.params.urlType]}
                            </div>
                        ) : undefined
                    }
                    </div>
                    <div className={this.state.noData ? "no-data" : "no-data hide"}>没有更多了</div>
                </div>
                {
                    this.props.params.urlType == 2 ? (
                        <div className="footer-options">
                            <div className="all" onClick={this.checkAll.bind(this)}>{this.state.allCheck ? <i className="iconfont icon-yuanquangou"/> : <i className="iconfont icon-yuanquankong"/>} 全选</div>
                            <span>共计：<span className="color-red">￥{this.state.total}</span></span>
                            <a href="javascript:;" className="handle-pay" onClick={this.handlePay.bind(this)}>已打款 ({this.state.checkNum})</a>
                        </div>
                    ) : undefined
                }
            </div>
        )
    }
}