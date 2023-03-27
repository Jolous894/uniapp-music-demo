<template>
	<view >
		<musichead :homeIcon="false" title="云音乐" ></musichead>
		<view class="container">
			<scroll-view scroll-y="true" >
				<!-- search -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-sousuo"></text>
					<input type="text" placeholder="请输入关键词">
				</view>
				 <view class="skeleton" v-if="loading">
				        <m-for-skeleton
				        :avatarSize="200"
				        :row="3"
				        :loading="loading"
						:titleStyle="{}"
				        :isarc="'square'"
				        v-for="(item,key) in 10"
				        :key="key">
				        <view>asdas</view>
				        </m-for-skeleton>
				        <button type="primary" @click="hide" size="mini">隐藏</button>
				    </view>
				<!-- floor -->
				<view class="index-list" v-else>
					<view class="index-list-item" v-for="top in topList" :key="top.id" @tap="handleToList(top.id)">
						<view class="index-list-img">
							<img :src="top.coverImgUrl" alt="">
							<text>{{top.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<text v-for="(track,index) in top.tracks">{{index+1}}.{{track.first}}-{{track.second}}</text>
						</view>
					</view>
				</view>
			
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	import musichead from '@/components/musichead/musichead.vue'
	import {topList} from '@/until/api.js'
	export default {
		data() {
			return {
				title: 'Hello',
				topList:[],
				loading:true,
			}
		},
		components:{
			musichead,
			mForSkeleton,
		},
		methods: {
			handleToSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			async reqtopList() {
				let result = await topList()
				this.topList = result
				this.loading =false
			},
			handleToList(id){
				uni.navigateTo({
					url:`/pages/list/list?id=${id}`
				})
			}
			
		},
		onLoad() {
			this.reqtopList()
		},
	}
</script>
	
<style scoped>
	
	.index-list-text text {
		display: inline-block;
		white-space: nowrap; 
		width: 400rpx; 
		height: 50rpx;
		min-width:0;
		overflow: hidden;
		text-overflow:ellipsis;
	}
	.index-list-text {
		
	/* 	display: flex;
		flex-direction: column; */
		font-size: 24rpx;
		line-height: 66rpx;
		margin-left: 30rpx ;
	}
	.index-list {
		margin: 0 34rpx;
	}
	.index-list-item {
		display: flex;
		margin-bottom: 34rpx;
	}
	.index-list-item .index-list-img {
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 30rpx;
		position: relative;
		width: 212rpx;
		height: 212rpx;
	}
	 .index-list-img img {
		 width: 100%;
		 height: 100%;
	 }
	 .index-list-img text {
		 position: absolute;
		 bottom: 16rpx;
		 left: 12rpx;
		 color: #f7f7f7;
		 font-size: 20rpx;
		
	 }
	.container  {
		width: 100%;
		height: calc(100vh - 60px);
		overflow: hidden;
	}
	.container scroll-view {
		height: 100%;
	}
	.index-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius:50rpx;
	}
	.index-search text {
		margin-left: 28rpx;
	}
	.index-search input {
		margin-left: 28rpx;
	}

</style>
