<template>
	<view class="list" v-show="!isLoading">
		<view class="fixbg" :style="'background-image:url('+playlist.coverImgUrl+')'"></view>
		<musichead :homeIcon="true" title="歌单" ></musichead>
		<scroll-view scroll-y="true" >
			<view class="contatiner" >
				<view class="list-head">
					<view class="list-head-img">
						<img :src="playlist.coverImgUrl" alt="">
						<text class="iconfont icon-bofang">{{playCount}}</text>
					</view>
					
					<view class="list-head-text">
						<view >
							{{playlist.name}}
						</view>
						<view>
							<img :src="playlist.creator.avatarUrl" alt="">
							<view class="text">
								{{playlist.creator.nickname}}
							</view>
						</view>
						<view >
							{{playlist.description}}
						</view>
					</view>
				</view>
			</view>
			 <button open-type="share" class="list-share">
				 <text class="iconfont icon-biaoqian"></text>分享给微信好友
			 </button>
			 <view class="list-music">
			 	<view class="list-music-head">
			 		<text class="iconfont icon-bofang"></text>
					<text>全部播放</text>
					<text>(共{{playlist.trackCount}}首)</text>
			 	</view>
				<view class="list-music-item" v-for="(track,index) in playlist.tracks" :key="track.id" @tap="handleToDetail(track.id)">
					<view  class="list-music-top">
						{{index + 1}}
					</view>
					<view class="list-music-song">
						<view>{{track.name}}</view>
						<view >
							<img v-if="privileges[index].flag>60&&privileges[index].flag<70" src="@/static/sq.png">
							<img v-if="privileges[index].maxbr==999000" src="@/static/dujia.png">
							{{ track.ar[0].name}}-{{track.name}}
						</view>
					</view>
					<text class="iconfont icon-bofang"></text>
				</view>
			 </view>
		</scroll-view>
	</view>
</template>

<script>
	import musichead from '@/components/musichead/musichead.vue'
	import {playList} from "@/until/api.js"
	export default {
		data() {
			return {
				isLoading:true,
				privileges:[],
				playlist:{
					playCount:'',
					tracks:[],
					description:{},
					name:{},
					trackCount:'',
					coverImgUrl:'',
					creator:{
						avatarUrl:{},
						nickname:'',
					},
				}
			}
		},
		computed:{
			playCount(){
				if( this.playlist.playCount >= 10000 && this.playlist.playCount < 100000000 ){
						this.playlist.playCount /= 10000; 
						return this.playlist.playCount.toFixed(1) + '万';
					}
					else if(this.playlist.playCount >= 100000000){
						this.playlist.playCount /= 100000000;
						return this.playlist.playCount.toFixed(1) + '亿';
					}
					else{
						return this.playlist.playCount;
					}
			}
		},
		methods: {
			handleToDetail(songId){
				uni.navigateTo({
					url:`/pages/detail/detail?songId=${songId}`
				})
			},
			async reqPlayList(id){
				let result = await playList(id)
				if(result.data.code==200){
					this.playlist=result.data.playlist
					this.privileges = result.data.privileges
					this.$store.commit("INIT_TOPLISTIDS",result.data.playlist.trackIds)
					this.isLoading = false
					uni.hideLoading()
				}
			}
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中'
			});
			this.reqPlayList(option.id)
		}
	}
</script>

<style scoped>
.list-music {
	width: 100%;
	background-color: #fff;
	border-radius: 40rpx;
	margin-top: 30rpx;
	padding: 40rpx 0;
	line-height: 30rpx;
}
.list-music-head{
}
.list-music-head text:nth-child(1){
	margin:0 20rpx;
	font-size: 50rpx;
}
.list-music-head text:nth-child(2){
		font-size: 30rpx;
		margin-right: 10rpx;
}
.list-music-head text:nth-child(3){
		font-size: 20rpx;
		color:#B7B7B7;
}
.list-music-item{
	display: flex;
	margin: 50rpx 30rpx;
	align-items: center;
}
.list-music-top{
	flex:1;
	color:#B7B7B7;
}
.list-music-song{
	flex:10;
	min-width:0; 
}
.list-music-item>text {
	flex:1;
	font-size:40rpx;
	color:#B7B7B7;
}
.list-music-song view:nth-child(1){
	margin-bottom: 10rpx;
	width: 70vw;
	white-space:nowrop;
	overflow:hidden;
	text-overflow:ellipsis;
	font-size: 30rpx;
	
}
.list-music-song view:nth-child(2){
	font-size: 20rpx;
	color:#B7B7B7;
	width: 70vw;
	white-space:nowrop;
	overflow:hidden;
	text-overflow: ellipsis;
}
.list-music-song img {
	width: 40rpx;
	height: 24rpx;
	margin-right: 5rpx;
	
}

.list-share {
	width: 330rpx;
	height: 74rpx;
	line-height: 74rpx;;
	border-radius: 88rpx;
	font-size: 28rpx;
	color: white;
	background-color:rgba(0,0,0,0.4);
	text-align: center;
}
.list-share text {
	margin-right: 16rpx;
}
.list-head{
	display: flex;
	margin: 30rpx;
}
.list-head-img{
	margin-right:40rpx  ;
	width: 264rpx;
	height: 264rpx;
	border-radius: 30rpx;
	overflow: hidden;
	position: relative;
	flex-shrink: 0;
}
.list-head-img img{
	width: 100%;
	height: 100%;
}
.list-head-img text{
	position: absolute;
	right: 10rpx;
	top: 10rpx;
	color: #fff;
}
.list-head-text{
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.list-head-text view:nth-child(1){	
	font-size: 40rpx;
}
.list-head-text view:nth-child(2){
	display: flex;	
	align-items: center;
}
.list-head-text img{
	width: 60rpx;
	height: 60rpx;
	margin-right: 20rpx;
	border-radius: 50%;
}
.list-head-text .text{
}
.list-head-text view:nth-child(3){
	font-size: 20rpx;
}
</style>
