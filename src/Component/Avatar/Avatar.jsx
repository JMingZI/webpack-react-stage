import React from "react"
import Config from "../../Config/Config"

export default class Avatar extends React.Component {
    constructor(props){
        super(props);
        this.state={error:false, color: "red"};
        this.imgUrl = "http://filesystem.api."+ Config.app().uri + (Config.online ? ".com" : ".net") +"/sfs/avatar?uid=";
    }
    errorImg(item){
        let avatarColors = ['#f17474','#7ac47a','#efbc6b','#75a4d7','#45b2e3'];
        let color = avatarColors[item.uid % 5];
        this.setState({color:color, error:true});
    }
    render(){
        return (
            <div className="avatar">
			{!this.state.error
                ?
                <img className="avatar" onError={this.errorImg.bind(this, this.props.item)} src={this.imgUrl + this.props.item.uid}/>
                :
                <div className="avatar" style={{backgroundColor:this.state.color}}>{(this.props.item.name||this.props.item.uname||"").slice(-2)}</div>
			}
          </div>
        );
    }
}