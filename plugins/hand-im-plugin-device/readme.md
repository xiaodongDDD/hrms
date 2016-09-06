
#HandIMPlugin.getChatList(successCallback, errorCallback, options)
	

##参数options是一个json串，其中的键有userId，RCToken，access_token，token_url

	userId 要聊天的用户id
	RCToken 融云的token
	access_token 我们服务器上的access_token
	token_url 我们服务器获取token的url


#HandIMPlugin.toChatAct(successCallback, errorCallback, options)

##参数options是一个json串，其中的键有friendId，friendName，friendIcon

	此处参数不解释


#HandIMPlugin.createDiscussion(successCallback, errorCallback, options)

	参数options是一个json串，此处可不传



#HandIMPlugin.openDiscussion(successCallback, errorCallback, options)


##参数options是一个json串，其中键为targetId

	targetId 讨论组的id