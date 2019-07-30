
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
