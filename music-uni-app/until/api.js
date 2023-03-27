import {baseUrl} from "@/until/apiconfig.js"
export function topList (){
	return new Promise((reslove,reject)=>{
		uni.request({
			url:`${baseUrl}/toplist/detail`,
			method:"GET",
			success(res) {
				let result = res.data.list
				result.length = 4
				reslove(result)
			}
		})
	})
}

export function playList (id){
	return uni.request({
			url:`${baseUrl}/playlist/detail?id=${id}`,
			method:"GET",
			
		})
}



//  /song/detail?ids=347230  歌曲详情
export function songDetail (songId){
	return uni.request({
			url:`${baseUrl}/song/detail?ids=${songId}`,
			method:"GET",
			
		})
}
// /simi/song?id=347230  获取相似歌曲接口
export function songSimi (songId){
	return uni.request({
			url:`${baseUrl}/simi/song?id=${songId}`,
			method:"GET",
			
		})
}
// /comment/music?id=186016&limit=1  获取歌曲评论
export function songComment (songId){
	return uni.request({
			url:`${baseUrl}/comment/music?id=${songId}`,
			method:"GET",
			
		})
}
// /lyric?id=33894312  歌词
export function songLyric (songId){
	return uni.request({
			url:`${baseUrl}/lyric?id=${songId}`,
			method:"GET",
		})
}
// /song/url?id=33894312  获取音乐
export function songUrl (songId){
	return uni.request({
			url:`${baseUrl}/song/url?id=${songId}`,
			method:"GET",
		})
}
// /search/hot/detail 热搜列表
export function searchHotDetail (){
	return uni.request({
			url:`${baseUrl}/search/hot/detail`,
			method:"GET",
		})
}

// /search?keywords=海阔天空  搜索
export function searchList (keywords){
	return uni.request({
			url:`${baseUrl}/search?keywords=${keywords}`,
			method:"GET",
		})
}
//  /search/suggest?keywords=海阔天空&type=mobile 搜索建议
export function searchSuggest (keywords){
	return uni.request({
			url:`${baseUrl}/search/suggest?keywords=${keywords}&type=mobile`,
			method:"GET",
		})
}