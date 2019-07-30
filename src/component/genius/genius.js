import React from 'react'
import UserCard from '../usercard/usercard'
import { connect } from 'react-redux'
import {getUserList} from '../../redux/chatuser.redux'

@connect(
    state=>state.chatuser,
    {getUserList}
)
class Genius extends React.Component{
    
    componentDidMount(){
        this.props.getUserList('boss')
    }
    render(){
		return (
            // userlist 来自 chatuser store
		 <UserCard userlist={this.props.userlist}></UserCard>
        )
    }
}
export default Genius;