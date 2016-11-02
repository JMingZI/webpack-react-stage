import React from "react";
import Helmet from "react-helmet";
import Config from "../../Config/Config";

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectType: 0,
            occurTime: "",
            showUpload: true,
            imgList: [],
            bxMoney: "",
            bxDesc: ""
        };
        this.imgList = []; // 用于提交的参数
        this.isCreateAgain = false; // 标记 是否再记一笔
    }
    componentWillMount(){
        var curr;
        if (this.props.params.id) {
            let data = JSON.parse(localStorage.getItem("detailList"));
            data.map((item)=>{
                if (item.id == this.props.params.id) {
                    curr = item;
                }
            });
        
            this.imgList = curr.photoJArr;
            let imgs = curr.photoJArr.map((item)=>{
                return {data: item, uploaded: true};
            });
        
            this.setState({
                bxDesc: curr.remark,
                bxMoney: curr.money,
                occurTime: curr.bxTime,
                selectType: curr.type,
                imgList: imgs,
                showUpload: (curr.photoJArr.length < 4)
            });
        }
    }
    componentDidMount(){
        Config.isAndr ? Config.native("menu", []) : setTimeout(function(){
            Config.native("menu", [])
        }, 500);
    }
    setLocal(type){
        let data = localStorage.getItem("detailList");
        let total = JSON.parse(data);
        let newData = {
            id: +new Date(),
            type: this.state.selectType,
            money: this.state.bxMoney,
            bxTime: this.state.occurTime,
            remark: this.state.bxDesc,
            photoJArr: this.imgList
        };
        // type=1 再记一笔
        if (this.props.params.id) {
            if (this.isCreateAgain == false) {
                total.map((item)=>{
                    if (item.id == this.props.params.id) {
                        item.type = newData.type;
                        item.money = newData.money;
                        item.bxTime = newData.bxTime;
                        item.remark = newData.remark;
                        item.photoJArr = newData.photoJArr;
                    }
                });
            } else {
                total.push(newData);
            }
            // 点击再记一笔以后 都是新增数据
            if (type == 1) { this.isCreateAgain = true; }
        } else {
            total.push(newData);
        }
        localStorage.setItem("detailList", JSON.stringify(total));
    }
    reset(){
        this.imgList = [];
        this.setState({
            selectType: 0,
            occurTime: "",
            showUpload: true,
            imgList: [],
            bxMoney: "",
            bxDesc: ""
        });
    }
    validate(){
        if (this.state.bxMoney == "") {
            Config.toast("请输入金额");
            return false;
        }
        if (this.state.occurTime == "") {
            Config.toast("请选择发生时间");
            return false;
        }
        // 检查图片是否上传完成
        let flag = true;
        this.state.imgList.map((item)=>{
             if (item.uploaded == false) flag = false;
        });
        if (flag == false) {
            Config.toast("图片未上传完成！");
            return false;
        }
        
        return true;
    }
    redirect(type){
        if (!this.validate()) { return false; }
        
        this.setLocal(type);
        if (type == 1) { this.reset(); }
        else history.go(-1);
    }
    select(index){
        this.setState({selectType: index});
    }
    change(type, e) {
        let val = e.target.value;
        switch(type) {
            case "bxMoney": {
                if (!/^[0-9]+(\.)?([0-9]{1,2})?$/.test(val) && val != "") {
                    
                } else {
                    this.state.bxMoney = val;
                }
                this.setState({bxMoney: this.state.bxMoney});
            }break;
            case "bxDesc": {
                this.setState({bxDesc: val.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")});
            }break;
        }
    }
    selectTime() {
        Config.native("selectdate", {format: "yyyy-MM-dd"}).then((res)=>{
            this.setState({occurTime: res.data});
        });
    }
    selectPictrues(){
        if(!this.state.showUpload){
            Config.toast("最多只能选择4张哦！");
            return false;
        }
        Config.native('selectPictures',{count:this.state.imgList.length, sum:4}).then((res)=>{
            if(res.code == 200){
                let data = res.data.map((item)=>{
                    return {data:"data:image/png;base64,"+item, uploaded:false};
                });
                data = this.state.imgList.concat(data).slice(0,4);
                this.setState({imgList: data});
                if(data.length>=4){
                    this.setState({showUpload:false});
                }
                this.upload(data);
            }
        });
    }
    del(index){
        this.state.imgList.splice(index,1);
        this.setState({imgList:this.state.imgList,showUpload:true});
        this.imgList.splice(index,1);
    }
    upload(imgList) {
        let _this = this;
        imgList.map((item, index) => {
            if (!item.uploaded && !item.uploading) {
                let param = {
                    flag: index.toString(),
                    Base64Stream: item.data.substr(21)
                };
                item.uploading=true;
                Config.ajax('post', {
                    url: 'upload',
                    body: param
                }).then((res) => {
                    if (res.code == 200 || res.status==200) {
                        let data = res.result;
                        let i = data.flag;
                        let arr = _this.state.imgList.map((item,index)=>{
                            if(index == i){
                                item.uploaded=true;
                            }
                            return item;
                        });
                        _this.setState({imgList: arr});
                        _this.imgList.push(data.photo_url);
                    } else {
                        Config.native("toast", {msg: '错误码：' + data.status});
                    }
                });
            }
        })
    }
    render(){
        return (
            <div className="second-page">
                <Helmet title="添加报销明细"/>
                
                <div className="row">
                    {
                        Config.bxDetailType.map((item, index)=> {
                            return <span key={index} className={this.state.selectType == index ? "muti-choose choosed" : "muti-choose"} onClick={this.select.bind(this, index)}>{item}</span>
                        })
                    }
                </div>
                
                <div className="row">
                    <span className="title">金额 (元)</span>
                    <input type="text" placeholder="请输入(必填)" value={this.state.bxMoney} onChange={this.change.bind(this, "bxMoney")}/>
                </div>
                
                <div className="row" onClick={this.selectTime.bind(this)}>
                    <span className="sort">发生时间</span>
                    <span className={this.state.occurTime ? "right color-black" : "right"}>{this.state.occurTime ? this.state.occurTime : "请选择(必填)"} <i className='iconfont icon-xiayibu'/></span>
                </div>
                
                <div className="row">
                    <textarea className="desc" placeholder="请输入费用说明" maxLength="40" onChange={this.change.bind(this, "bxDesc")} value={this.state.bxDesc}/>
                    
                    <div className="photos">
                        <span className="inner-title">
                            <span className="note">最多可添加4张图片</span>
                        </span>
                        {
                            this.state.imgList.map((item,index)=>{
                                return (
                                    <div key={index} className="img-item">
                                        {!item.uploaded
                                            ?<span className="uploading">上传中...</span>
                                            :<i onClick={this.del.bind(this,item,index)} className="del iconfont icon-103"/>
                                        }
                                        <img src={item.data} width="100%" height="100%"/>
                                    </div>
                                )
                            })
                        }
                        <div className="img-item add-img" onClick={this.selectPictrues.bind(this)}><i className="iconfont icon-qiandaotianjiazhaopian"/></div>
                    </div>
                </div>
                
                <div className="footer-btn">
                    <a href="javascript:;" className="again" onClick={this.redirect.bind(this, 1)}>再记一笔</a>
                    <a href="javascript:;" onClick={this.redirect.bind(this, "")} className="close">完成</a>
                </div>
            </div>
        )
    }
}