<template>
	<view>
		<musichead :homeIcon="true" title="搜索" ></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				
					<!-- search -->
				<view class="search-search">
					<text class="iconfont icon-sousuo"></text>
					<input type="text" placeholder="请输入关键词" v-model="searchWord" @confirm="handleToWord(searchWord)" @input="handleToSuggest">
					<text class="iconfont icon-guanbi" v-show="searchType != 1" @tap="handleToclose"></text>
				</view>
				<block v-if="searchType==1">
					<!-- history -->
					<view class="search-history">
						<view class="search-history-head">
							<text>历史搜索</text>
							<text class="iconfont icon-shanchu" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :kye="index" @tap="handleToWord(item)">{{item}}</view>
						</view>
					</view>
					
					<!-- hot -->
					<view class="search-hot">
						<view class="search-hot-head">热搜榜</view>
						<view class="search-hot-item" v-for="(hot,index) in hots" :key="index" @tap="handleToWord(hot.searchWord) ">
							<view class="search-hot-top">{{index+1}}</view>
							<view class="search-hot-word">
								<view>
									{{hot.searchWord}} <image :src="hot.iconUrl" mode="aspectFill"></image>
								</view>
								<view>{{hot.content}}</view>
							</view>
							<text class="search-hot-count">{{hot.score}}</text>
						</view>
					</view>
				</block>
				
				<block v-else-if="searchType==2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchResultList" :key="item.id" @tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view >{{item.name}}</view>
								<view >{{item.artists[0].name}} - {{item.album.name}}</view>
							</view>
							<text class="iconfont icon-bofang"></text>
						</view>
					</view>
				</block>
				
				<block v-else-if="searchType==3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索"{{searchWord}}"</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" :key="index" @tap="getSearchList(item.keyword)">
							<text class="iconfont icon-sousuo"></text>{{item.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	import {searchHotDetail,searchList,searchSuggest} from "@/until/api.js"
	export default {
		data() {
			return {
				hots:[],
				searchWord:'',
				searchHistory:[],
				searchType:1,
				searchResultList:[],
				searchSuggest:[],
			}
		},
		methods: {
			async getSearchSuggest(keywords){
				this.searchWord = keywords
				let result = await searchSuggest(keywords)
				if(result.statusCode == 200) {
					this.searchSuggest = result.data.result.allMatch
				}
			},
			handleToSuggest(ev){
				let value = ev.detail.value
				if(!value) {
					this.searchType =1 
					return
				}
				this.searchType = 3
				this.getSearchSuggest(value)
				
			},
			handleToclose(){
				this.searchWord = ""
				this.searchType = 1
			},
			handleToDetail(songId){
				uni.navigateTo({
					url:`/pages/detail/detail?songId=${songId}`
				})
			},
			async getSearchList(searchWord){
				this.searchWord = searchWord
				this.searchType = 2
				let result = await searchList(searchWord)
				if(result.statusCode == 200) {
					this.searchResultList = result.data.result.songs
					uni.hideLoading()
				}
				
			},
			handleToClear(){
				uni.removeStorage({
					key: 'searchHistory',
					success: (res) =>{
						this.searchWord = ''
						this.searchHistory=[]
					}
				});
			},
			handleToWord(searchWord){
				uni.showLoading({
					title:"正在加载"
				})
				this.searchWord = searchWord
				this.searchHistory.unshift(searchWord)
				this.searchHistory = [...new Set(this.searchHistory)]
				if(this.searchHistory.length > 10) {
					this.searchHistory.length = 10
				}
				uni.setStorage({
					key:'searchHistory',
					data:this.searchHistory,
					success:()=>{
						this.getSearchList(searchWord)
					},
				})
			},
			handleToSearch(){
				
			},
			async searchHotDetail(){
				let result = await searchHotDetail()
				if(result.statusCode == 200) {
					this.hots = result.data.data
				}
			},
		},
		onLoad() {
			uni.getStorage({
				key:"searchHistory",
				success:(res)=>{
					this.searchHistory = res.data || []
				}
			})
			this.searchHotDetail()
		}
	}
</script>

<style>
.search-suggest {
	border-top: 2rpx #e4e4e4 solid;
	padding:30rpx ;
	font-size: 26rpx;
	
}
.search-suggest-head{
	margin-bottom: 74rpx;
	color: #4574a5;
}
.search-suggest-item{
	margin-bottom: 74rpx;
	color: #5d5d5d;
}
.search-suggest-item text {
	color: #bdbdbd; margin-right: 28rpx; 
	position: relative;
	top:2rpx;
}
.search-result {
	border-top: 2rpx #e4e4e4 solid;
	padding:30rpx ;
}
.search-result-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx; 
	padding-bottom: 30rpx;
	border-bottom: 2rpx #e4e4e4 solid;;
}
.search-result-word view:nth-child(1){
	font-size: 28rpx;
	color: #235790;
	margin-bottom: 12rpx;
}
.search-result-word view:nth-child(2){
	font-size: 22rpx;
	color: #898989;
}
.search-result-item text {
	font-size: 50rpx;
}
.search-hot{
	margin: 0 30rpx;
	font-size: 26rpx;
}
.search-hot-head{
	margin-bottom: 36rpx;
}
.search-hot-item{
	display: flex;
	align-items: center;
	margin-bottom: 58rpx;
}
.search-hot-top{
	color: #fb2222;
	width: 60rpx;
	margin-left: 8rpx;
}
.search-hot-word{
	flex: 1;
}
.search-hot-word view:nth-child(1){
	font-size: 30rpx;
	color: black;
}
.search-hot-word view:nth-child(2){
		font-size: 24rpx;
		color: #878787;
}
.search-hot-word image {
	width: 48rpx;
	height: 22rpx;
}
.search-hot-count{
	color: #878787;
}
.search-history{
	margin: 40rpx 30rpx;
	font-size: 26rpx;
}
.search-history-head{
	display: flex;
	justify-content: space-between;
	margin-bottom: 36rpx;
}
.search-history-list{
	display: flex;
	flex-wrap: wrap;
}
.search-history-list view{
	padding: 16rpx 28rpx;
	border-radius: 40rpx;
	margin-right: 30rpx;
	margin-bottom: 30rpx;
	background-color: #f7f7f7;
}

.search-search {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius:50rpx;
	}
	.search-search text {
		margin-left: 28rpx;
	}
	.search-search input {
		margin-left: 28rpx;
		flex: 1;
	}
</style>
