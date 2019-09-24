<template>
	<view class="content">
		<view :animation="animationList">
			<li v-for="item in list" :key="item.id" class="exp" @click="clickFn(item.url)">{{item.title}}<text>{{item.content}}</text></li>
		</view>
		<view :animation="animationMore">
		    <li class="more"><text>And more...</text></li>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{title:'实验1',url:'pages/exp/exp1',content:'利用真值表求主析取范式和主合取范式的实现'},
					{title:'实验2',url:'pages/exp/exp2',content:'集合上二元关系性质判定的实现'},
					{title:'实验3',url:'pages/exp/exp3',content:'偏序关系中盖住关系的求取及格论中有补格的判定'},
					{title:'实验4',url:'pages/exp/exp4',content:'图的随机生成及欧拉（回）路的确定'},
				],
				animationList: {},
				animationMore: {},
			}
		},
		onLoad(){              //是不是加上沙雕动画，首页就不会那么丑了呢（笑
		    /* list动画 */
				var animation1 = uni.createAnimation({
					duration: 500,
					timingFunction: 'ease',
				})
				this.animationList = animation1

				animation1.scale(1.5,1.5).rotate(45).step()
				this.animationList = animation1.export()

				setTimeout(function() {
				animation1.translate(30).step()
				animation1.scale(1,1).rotate(0).step()
				animation1.translate(0).step()
				this.animationList = animation1.export()
				}.bind(this), 800)
			/* andMore动画 */
			   var animation2 = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease',
				})
				this.animationMore = animation2

				animation2.opacity(0).step()
				animation2.translateY(50).step()
				this.animationMore = animation2.export()

				setTimeout(function() {
				animation2.opacity(1).step()
				animation2.translateY(0).step()
				this.animationMore = animation2.export()
				}.bind(this), 2000)
		},
		methods: {
            clickFn:function(url){
                this.$router.push(url);
		    }
		}
	}
</script>

<style lang="less" scoped>
.content{
	margin-top:20upx;
	.exp{
	   margin:0 auto;
	   width:95%;
	   font-size:45upx;
	   line-height:200upx;
	   list-style:none;
	   background-color:#f1f1f1;
	   box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	   border-radius:50upx;
	   color:#105e62;
	   margin-bottom:20upx;
	   padding-left:20upx;
	   &:hover{
       box-shadow:  0 2px 4px rgba(0, 0, 0, .23), 0 0 6px rgba(0, 0, 0, .23);
	   }
	   text{
		   font-size:25upx;
		   color:#428377; 
		   padding-left:30upx;
	   }
	}
	.more{
	   list-style:none;
	   text-align:center;
	}
}
   
</style>
