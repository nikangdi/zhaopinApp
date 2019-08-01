
export function getRedirectPath({type, avatar}){
	// 根据用户信息 返回跳转地址
	// user.type /boss /genius
	// user.avatar /bossinfo /geniusinfo 
	let url = (type==='boss')?'/boss': '/genius'
	if (!avatar) { //根据是否有avatar来判定是否有录入详细信息，没有则跳转到bossinfo等 相应的页面填写详细信息
		url += 'info'
    }else{
		url = '/user'+url
	}
    // console.log(url)
	return url
}



//过滤并解决问题
//问题是当我从当前 聊天页面 转到其他的 聊天页面的时候  ，其他页面展示仍是之前的信息
//合成chatid 来去查找当前聊天的记录 
//原本 从后动态查出来的  msg是  所有的from 或 to为自己的  信息，但每条信息chatid可用于区分聊天的两个用户，进行过滤
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export function getChatId( userId,targetId){
	return [userId,targetId].sort().join("_")
}