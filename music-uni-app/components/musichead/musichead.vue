<template>
	<view class="music-head">
		<text class="music-icon" v-if="homeIcon">
			<text class="iconfont icon-shangyiye" style="padding: 0 10px;" @tap="handleToBack"></text>
			<text style="color: #fff;" >|</text>
			<text class="iconfont icon-shouye" style="padding: 0 10px;" @tap="handleToHome"></text>
		</text>
		<text class="music-title">{{title}}</text>
	</view>
</template>

<script>
	export default {
		name:"musichead",
		data() {
			return {
				
			};
		},
		props:["homeIcon","title"],
		methods:{
			handleToBack(){
				uni.navigateBack({
					url:"/pages/index/index"
				})
			},
			handleToHome(){
				uni.navigateTo({
					url:"/pages/index/index"
				})
			},
		}
	}
</script>

<style scoped>
.icon-shangyiye, .icon-shouye{
	width: 40rpx;
	height: 40rpx;
}
.music-head {
	width: 100%;
	height: 40px;
	margin-top: 20px;
	position: relative;
	display: flex;
	align-items: center;
	
}
.music-head text {
	font-size: 20px;
	color: #fff;
}
.music-icon {
	position: absolute;
	left: 10px;
	background-color:rgba(0,0,0,0.4);
	border-radius: 20px;
}
.music-head .music-title {
	position: absolute;	
	right: 50%;
	transform: translateX(50%);
	color: black;
}

</style>