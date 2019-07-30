/**
 * 选择头像组件
 */

import React from 'react'
import {Grid, List} from 'antd-mobile'
import PropTypes from 'prop-types'


export default class AvatarSelector extends React.Component{

    static propTypes = {
        selectAvatar:PropTypes.func.isRequired
    }
       constructor(props){
           super(props)
           this.state={
               text:'',//所选投降的imagename
               icon:''//已选头像的 url
           }
       }
       render(){
           /**
            * 遍历生成图片数组
            */
          
           const avatarList ='boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'
               .split(',')
               .map(val=>{
                   return{
                       icon:require(`../img/${val}.png`),
                       text:val
                   }
           })
           const gridHeader = this.state.icon
               ? (<div>
                       <span>已选择头像</span>
                       <img style={{width:20}} src={this.state.icon} alt=""/>
                   </div>)
               : '请选择头像';
               //在list头部展示已经选择的头像
               
           return(<div>
               <List renderHeader={()=>gridHeader} > 
                   <Grid
                       data={avatarList}
                       columnNum={5} 
                       onClick={elm=>{
                           this.setState(elm);
                           this.props.selectAvatar(elm.text) //向父组件传递已选择的头像
                       }}
                   />					
               </List>

           </div>)
       }
}
