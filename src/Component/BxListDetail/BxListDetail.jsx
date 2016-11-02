import React from "react"
import Helmet from "react-helmet";
import Config from "../../Config/Config"
import Avatar from "../Avatar/Avatar"
import cookie from 'react-cookie';

export default class Detail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            detail: {}
        };
    }
    componentWillMount(){
        let detail = JSON.parse(sessionStorage.getItem("single"));
        this.setState({detail: detail});
        console.log(detail);
    }
    showImg(index){
        Config.native('showImage', {
            position: index,
            picsArr: this.state.detail.photoJArr
        });
    }
    render(){
        return (
            <div className="detail-content">
                <Helmet title="报销明细"/>
                
                <div className="row">
                    <div className="single">
                        <p className="title">{Config.bxDetailType[this.state.detail.type]}</p>
                        <p className="titme">{Config.handleTime(this.state.detail.bxTime)}</p>
                        <p className="money">￥{this.state.detail.money ? Number(this.state.detail.money).toFixed(2) : undefined}</p>
                    </div>
                    <p className="single-desc">{this.state.detail.remark || ""}</p>
                    {
                        (this.state.detail.photoJArr || []).map((item, index)=>{
                            return (
                                <img className="single-img" onClick={this.showImg.bind(this, index)} key={index} src={item +"?imageView2/1/w/80/h/80"} alt=""/>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}