import React from 'react'


//加了高阶组件后  使用的都是  高阶组件传过来的state与方法
//注意元组件优化时   将this.state改为this.props.state
// this.handleChange改为this.props.handleChange

export default function ChangeForm(Comp){
    return class WrapperComp extends React.Component{
        constructor(props){
            super(props);
            this.state={};
        }
        handleChange = (key,val) => {
            // console.log(key,val)
			this.setState({
				[key]:val
			})
        }
        render(){
            return<Comp handleChange={this.handleChange} state={this.state} {...this.props}></Comp>
        }
    }
}