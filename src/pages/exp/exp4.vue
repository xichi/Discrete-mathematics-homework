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
          <i class="el-icon-cherry" style="float: right; padding: 3px 0;"></i>
        </div>
        <div>
          <p>The generated undirected graph is:</p>
          <tr v-for="(items,index) in graph" :key="index">
            <td v-for="(item,jndex) in items" :key="jndex">
              {{item}}
            </td>
          </tr>
        </div>
        <div>
          {{output}}
        </div>
      </el-card>
    </view>
  </view>
</template>

<script>
export default{
  data(){
    return{
      graph: [[]],   //用二维数组存图
      n: '',          //节点数
      m: 0,          //边数
      ans: [],       //欧拉路的路径
      count: 0,      //路径数
      visted: [],    //标记点是否被访问
      begin: [],     //判是否为连通图，搜索的起点
      s: {           //定点的栈结构
        top: 0,
        node: []
      },
      output: ''
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
          this.graph[i][j] = Math.floor(Math.random()*2);  //随机生成无向图
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
      while(!flag){
        this.$options.methods.init.bind(this)();
      }
      this.graph.reverse().reverse();      //确保view视图更新
    },
    DFS: function(x){
      this.visted[x] = true;
      for(let i = 0; i < this.n; i++)
        if(!this.visted[i] && this.graph[x][i])
          this.$options.methods.DFS.bind(this)(i);;
    },
    judge: function(){
      this.$options.methods.DFS.bind(this)(this.begin);
      for(let i = 0; i < this.n; i++)
        if(!this.visted[i])
            return false;
      return true;
    },
    DFSGraph: function(x){     //深度优先搜索
    this.s.top++;
    this.s.node[this.s.top] = x;
    for(let i = 0; i < this.n; i++)
    {
      if(this.graph[i][x] > 0)
      {
        this.graph[i][x] = 0;  //删除该边
        this.graph[x][i] = 0; 
        this.$options.methods.DFSGraph.bind(this)(i);
        break;
      }
    }
    },
    fleury: function(x, s){
      let flag;
      s.top = 0; 
      s.node[s.top] = x;  //起点入栈
      while(s.top >= 0)
      {
        flag = 0;
        for(let i = 0; i < this.n; i++)
        {
          if(this.graph[s.node[s.top]][i] > 0)
          {
            flag = 1;
            break;
          }
        }
        if(flag == 0)  //如果没有可扩展的点，则记录下该点并将其出栈
        {
          this.ans[this.count ++] = s.node[s.top] + 1;
          s.top --;
        }
        else  //如果有，则将其出栈并继续搜索
        {
          s.top --;
          this.$options.methods.DFSGraph.bind(this)(this.s.node[this.s.top + 1]);
        }
      }
    },
    clear: function(){
      this.graph.length = 0;
      this.m = 0;
      this.ans = [];
      this.count = 0;
      this.visted = [];
      this.begin = [];
      this.s.top = 0;
      this.s.node = [];
    },
    mainCal: function(){
      let num = 0, start = 0, degree;  //奇度顶点个数, 欧拉路的起点, 每个顶点的度
      this.$options.methods.clear.bind(this)();   
      this.$options.methods.init.bind(this)();
      if(!this.$options.methods.judge.bind(this)())
      {
        this.output = "Non-connected graph";
        return;
      }
      //如果存在奇度顶点，则从奇度顶点出发，否则从0出发
      for(let i = 0; i < this.n; i++)
      {
        degree = 0;
        for(let j = 0; j < this.n; j++)
          degree += this.graph[i][j];
        if(degree % 2)
        {
          start = i;
          num++;
        }
      }
  //无向图具有一条欧拉路，当且仅当G是连通的，且有0个或2个奇数度结点
      if(num == 0 || num == 2)
      {
        this.$options.methods.fleury.bind(this)(start, this.s);
        //欧拉路径的头和尾相等，则说明欧拉路是回路
        if(this.ans[0] == this.ans[this.count - 1])
          this.output = "This graph is Euler Graph, its Euler Loop is: \n";
        else
          this.output = "This graph is Half-Euler Graph, its Euler Path is: \n";
        for(let i = 0; i < this.count; i++)
          this.output += this.ans[i];
      }
      else
        this.output = "This graph is Non-Euler Graph or Half-Euler Graph.";
      return 0;
    }
  }
}
</script>

<style lang="less">
.inputBox {
  text-align: center;
  padding: 10upx 0;
  .inputBox-item {
    width: 80%;
  }
}
.outputBox {
  display: flex;
  justify-content: center;
  align-items: center;
  .box-card {
    width: 80%;
  }
}
</style>
