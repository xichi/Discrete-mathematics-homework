<template>
     <view>
    <view class="inputBox">
      <el-input
        class="inputBox-item"
        v-model="n"
        placeholder="请输入一个正整数n"
        @keyup.enter.native="mainCal"
        clearable
      ></el-input>
    </view>
    <view class="outputBox">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>输出结果</span>
          <i class="el-icon-cherry" style="float: right; padding: 3px 0;"
            ></i
          >
        </div>
      </el-card>
    </view>
  </view> 
</template>

<script>
export default{
  data(){
    return{
      graph: [[]],
      n: 0,
      m: 0,
      ans: [],
      count: 0,
      visted: [],
      begin: []
    }
  },
  methods: {
    init: function(){
      for(let i = 0; i < this.n; i++){
        this.graph[i] = new Array();
        for(let j = 0; j < this.n; j++){
          this.graph[i][j] = 0;
        }
      }
      let flag = false;  //标记是否生成图
      for(let i = 0; i < this.n; i++){
        for(let j = i + 1; j < this.n; j++){
          this.graph[i][j] = 0 + Math.random() % 2; //随机生成无向图
        }
      }
      for(let i = 0; i < this.n; i++)
        for(let j = 0; j < this.n; j++)
          if(this.graph[i][j])
          {
              flag = true;    //最少有一条边
              this.m++;            //记录边的条数
              this.graph[j][i] = 1;  //无向图的定义
              this.begin = i;         //有一条边则其任意一个端点设为起点
          }
      while(!flag)
        this.$options.methods.init.bind(this)();
    },
    DFS: function(x){
      this.visted[x] = true;
      for(let i = 0; i < this.n; i++)
        if(!this.visted[i] && this.graph[x][i])
          this.$options.methods.DFS.bind(this)(i);;
    },
    mainCal: function(){
      this.$options.methods.init.bind(this)();
    }
  }
}
</script>

<style lang="less">

</style>