<template>
	<view class="content">
		<li v-for="item in list" :key="item.id" class="exp">{{item.title}}<text>{{item.content}}</text></li>
		<li class="more"><text>And more...</text></li>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{title:'实验1',content:'利用真值表求主析取范式和主合取范式的实现'},
					{title:'实验2',content:'集合上二元关系性质判定的实现'},
					{title:'实验3',content:'偏序关系中盖住关系的求取及格论中有补格的判定'},
					{title:'实验4',content:'图的随机生成及欧拉（回）路的确定'},
				]
			}
		},
		onLoad() {

		},
		methods: {

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
	   box-shadow: 0 0 3upx 0upx #b9b8b8 ;
	   border-radius:50upx;
	   color:#105e62;
	   margin-bottom:20upx;
	   padding-left:20upx;
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
