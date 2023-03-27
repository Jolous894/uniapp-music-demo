<template>
	<view class="detail">
		<view class="fixbg" :style="'background-image:url('+songDetail.al.picUrl +')'"></view>
		<musichead :homeIcon="true" :title="songDetail.name" ></musichead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true" >
				<view class="detail-play">
					<image :src="songDetail.al.picUrl"  :class="{'detail-play-run':isPlayRotate}" mode=""></image>
					<!-- <text class="iconfont icon-zanting icon-bofang"></text> -->
					<text class="iconfont " :class="iconPlay" @tap="handlePlayStatus"></text>
					<view></view>
				</view>
				
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{ transform : 'translateY(' +  - (lyricIndex - 1) * 82  + 'rpx)' }">
						<view class="detail-lyric-item" :class="{active:index==lyricIndex}" v-for="(item,index) in songLyric" :key="index">{{item.lyric}}</view>
						<!-- <view class="detail-lyric-item active">测试</view>
						<view class="detail-lyric-item">测试</view>
						<view class="detail-lyric-item">测试</view>
						<view class="detail-lyric-item">测试</view> -->
					</view>
				</view>
				
				<view class="detail-like">
					<view class="detail-like-head">
						喜欢这首歌的人也听
					</view>
					
					
					<view class="detail-like-item" v-for="(item,index) in songSimi" :key="item.id" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						
						<view class="detail-like-song">
							<view class="">{{item.name}}</view>
							
							<view class="">
								<image v-if="item.privilege.maxbr==999000" src="../../static/sq.png" mode=""></image>
								<image v-if="item.privilege.flag>60 && item.privilege.flag<70" src="../../static/dujia.png" mode=""></image>
								{{item.artists[0].name}}-{{item.name}}
							</view>
						</view>
						
						<text class="iconfont icon-bofang"></text>
					</view>
					
					
				</view>
				
				<!-- 评论 -->
				<view class="detail-comment">
					<view class="detail-comment-head">
						精彩评论
					</view>
					
					<view class="detail-comment-item" v-for="(comment,index) in songComment" :key="comment.commentId">
						<view class="detail-comment-img">
							<image :src="comment.user.avatarUrl" mode=""></image>
						</view>
						
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view class="">
										{{comment.user.nickname}}
									</view>
									<view class="">
										{{comment.time | time}}
									</view>
								</view>
								
								<view class="detail-comment-like">
									{{comment.likedCount | count}}<image src="../../static/good.png" mode=""></image>
								</view>
							</view>
							
							<view class="detail-comment-text">
								{{comment.content}}
							</view>
							
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '@/components/musichead/musichead.vue'
	import {songUrl,songLyric,songComment,songSimi,songDetail} from "@/until/api.js"
	export default {
		data() {
			return {
				isLoading:true,
				timer:{},
				isPlayRotate:true,
				iconPlay:'icon-zanting',
				bgAudioManager:null,
				songUrl:{},
				songLyric:"",
				lyricIndex:0,
				songComment:[],
				songSimi:[],
				songDetail:{
					name:'',
					al:{
						picUrl:''
					},
				},
			}
		},
		filters:{
			count:function(value) {
				if( value>= 10000 && value < 100000000 ){
						value /= 10000; 
						return value.toFixed(1) + '万';
					}
					else if(value >= 100000000){
						value /= 100000000;
						return value.toFixed(1) + '亿';
					}
					else{
						return value;
					}
			},
			time:function(value){
				var date = new Date(value);
				return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
			}
		},
		methods: {
			handleToSimi(songId){
				this.getMusic(songId)
			},
			listenLyricIndex(){
				clearInterval(this.timer) 
				this.timer = setInterval(()=>{
				for(var i = 0;i < this.songLyric.length;i++){
				if(this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length-1].time) {
					this.lyricIndex = this.songLyric.length-1
					break;
				}
				if(this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i+1].time){
					this.lyricIndex = i
				}
				}
				console.log(this.lyricIndex);	
				},500)
			},
			handlePlayStatus(){
				if(this.isPlayRotate) {
					this.bgAudioManager.pause()
				}
				else {
					this.bgAudioManager.play()
				}
			},
			formatTimeToSec(time){
				var arr = time.split(':');
				return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
				},
			async getMusic(songId) {
				this.$store.commit("NEXT_ID",songId)
				uni.showLoading({
					title: '加载中'
				});
				this.isLoading = true
				let detail = await songDetail(songId)
				if (detail.statusCode == 200) {
					this.songDetail = detail.data.songs[0]
				}
				// console.log(this.songDetail);
				
				let simi = await songSimi(songId)
				if (simi.statusCode == 200) {
					this.songSimi = simi.data.songs
				}
				// console.log(this.songSimi);
				
				let comment = await songComment(songId)
				if(comment.statusCode == 200 ){
					this.songComment = comment.data.comments
				}
				// console.log(this.songComment);
				
				let songlyric = await songLyric(songId)
				let lyric =songlyric.data.lrc.lyric
				let result = [];
				let re = /\[([^\]]+)\]([^[]+)/g;
				lyric.replace(re,($0,$1,$2)=>{
					result.push({ time : this.formatTimeToSec($1) , lyric : $2 });
				});
				this.songLyric = result;
				// console.log(this.songLyric);
				
				let url = await songUrl(songId)
				if(url.statusCode == 200) {
					this.songUrl = url.data.data[0]
					
					// #ifdef MP-WEIXIN
					this.bgAudioManager = uni.getBackgroundAudioManager()
					this.bgAudioManager.title = this.songDetail.name
					this.bgAudioManager.src = this.songUrl.url || ''
					this.listenLyricIndex()
					// #endif
					
					 // #ifdef H5
					if(!this.bgAudioManager){
						this.bgAudioManager=uni.createInnerAudioContext();
					}
					this.bgAudioManager.src = this.songUrl.url || ''
					this.iconPlay = "icon-bofang"
					this.isPlayRotate = false
					// #endif
					
					console.log(this.bgAudioManager);
					this.bgAudioManager.onPlay(()=>{
						this.iconPlay = "icon-zanting"
						this.isPlayRotate = true
						this.listenLyricIndex()
					})
					this.bgAudioManager.onPause(()=>{
						this.iconPlay = "icon-bofang"
						this.isPlayRotate = false	
						clearInterval(this.timer) 
						
					})
					this.bgAudioManager.onEnded(()=>{
						this.getMusic(this.$store.state.nextId)
					})
					uni.hideLoading()
					this.isLoading = false
					// console.log(this.songUrl); 
				}
				
			},
		},
		onLoad(option){
			this.getMusic(option.songId)
		},
		onUnload() {
			clearInterval(this.timer) 
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		},
		
		// onHide(){
		// 	console.log('执行了onHide');
		// 	clearInterval(this.timer)
		// 	this.bgAudioManager.destroy()
		// }
	}
</script>

<style scoped>
.detail-comment {
	margin: 0 30rpx;
}
.detail-comment-head {
	font-size: 36rpx;
	color: white;
	margin: 50rpx 0;
}
.detail-comment-item {
	margin-bottom: 28rpx;
	display: flex;
}
.detail-comment-img {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 18rpx;
}
.detail-comment-img image{
	width: 100%;
	height: 100%;
}
.detail-comment-content {
	flex: 1;
	color: #cbcacf;
}
.detail-comment-title {
	display: flex;
	justify-content: space-between;
}
.detail-comment-name {
	
}
.detail-comment-name view:nth-child(1) {
	font-size: 26rpx;
}
.detail-comment-name view:nth-child(2) {
	font-size: 20rpx;
	
}
.detail-comment-like {
	font-size: 28rpx;
}
.detail-comment-like image{
	width: 28rpx;
	height: 28rpx;
}
.detail-comment-text {
	font-size: 28rpx;
	line-height: 40rpx;
	color: white;
	margin-top: 20rpx;
	border-bottom: 1px #e0e0e0 solid;
	padding-bottom: 30rpx;
} 


.detail-like {
	margin: 0 30rpx;
}
.detail-like-head {
	font-size: 36rpx;
	color: white;
	margin: 50rpx 0;
}
.detail-like-item {
	display: flex;
	align-items: center;
	margin-bottom: 28rpx;
}
.detail-like-img {
	width: 82rpx;
	height: 82rpx;
	border-radius: 20rpx;
	overflow: hidden;
	margin-right: 20rpx;
}
.detail-like-img image{
	width: 100%;
	height: 100%;
}
.detail-like-song {
	flex: 1;
	color: #c6c2bf;
}
.detail-like-song view:nth-child(1){
	font-size: 28rpx; 
	color: white;
	margin-bottom: 12rpx;
} 
.detail-like-song view:nth-child(2){
	font-size: 22rpx; 
} 
.detail-like-song image{
	width: 26rpx;
	height: 20rpx;
	margin-right:  10rpx;
} 
.detail-like-item text{
	font-size: 50rpx;
	color: #c6c2bf;
}

.detail-lyric {
	font-size: 32rpx;
	line-height: 82rpx;
	height: 246rpx;
	text-align: center;
	overflow: hidden;
	color: #6f6e73;
}
.detail-lyric-wrap {
	transition: .5s;
}
.detail-lyric-item {
	height: 82rpx;
}
.active {
	color: white;
}
.detail-play {
	width: 580rpx;
	height: 580rpx;
	background-image: url(~@/static/disc.png);
	background-size: cover;
	margin: 214rpx auto 0 auto;
	position: relative;
}
.detail-play image {
	animation: 10s linear move infinite;
	animation-play-state: paused;
	width: 370rpx;
	height: 370rpx;
	border-radius: 50%;
	position: absolute;
	margin: auto;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
.detail-play .detail-play-run {
	animation-play-state: running;
}
@keyframes move {
	from{
		transform:rotate(0deg);
	}
	to{
		transform:rotate(360deg);
	}
}

.detail-play text {
	font-size: 100rpx;
	color: white;
	position: absolute;
	margin: auto;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100rpx;
	height: 100rpx;
}
.detail-play view {
	z-index: 99;
	width: 230rpx;
	height: 360rpx;
	background-image: url(~@/static/needle.png);
	position: absolute;
	background-size:cover;
	top: -200rpx;
	left: 230rpx;
	right: 0;
	bottom: 0;
}
</style>
