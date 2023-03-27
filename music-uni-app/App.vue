<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import url("iconfont/iconfont.css");
	.fixbg{ 
	 width:100%;
	 height: 100vh; 
	 position: fixed; 
	 background-size:cover;
	 background-position: center 0;
	filter:blur(20px);
	transform: scale(1.2);
	z-index: -1;
	/* background-image: url("static/logo.png"); */
	}

</style>
