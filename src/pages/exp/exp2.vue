<template>
  <view>
     <!-- 进度框 -->
    <view style="height:500px; float:left; width:25%; margin-left:20upx; padding-top:20upx;">
      <el-steps direction="vertical" :active="active" style=""> 
        <el-step title="步骤 1" icon="el-icon-lollipop"></el-step>
        <el-step title="步骤 2" description="两种输入方式都可以哦" icon="el-icon-cherry"></el-step>
        <el-step title="步骤 3" description="我们是冠军(^o^)/~" icon="el-icon-trophy-1"></el-step>
      </el-steps>
    </view>
    <!-- 操作界面 -->
    <view class="operation">
      <el-card class="box-card">
        集合元素个数是:<el-input v-model="element" placeholder="" clearable prefix-icon="el-icon-edit" @keyup.enter.native="secondStepOperation"></el-input>
      </el-card>
      <transition name="el-zoom-in-top">
      <el-card class="box-card transition-box" v-show="secondStep">
         <el-tabs tab-position="top">
            <el-tab-pane label="直接输入">
              该集合的关系是:<el-input v-model="relation"  clearable prefix-icon="el-icon-edit"  @keyup.enter.native="thirdStepOperation"></el-input>
            </el-tab-pane>
            <el-tab-pane label="矩阵图">
                <table class="relationMatrix">
                  <tbody>
                    <tr v-for="(i,index) in relationMatrix" :key="index">
                      <td  v-for="(item,jndex) in i" :key="jndex" @click="relationMatrixChange(item,index,jndex)">
                        {{item}}
                        <!-- <input type='text' placeholder="0"/> -->
                      </td>
                    </tr>
                  </tbody>
                </table>
            </el-tab-pane>
        </el-tabs>
      </el-card>
      </transition>
      <transition name="el-zoom-in-top">
      <el-card class="box-card transition-box" v-show="thirdStep">
        该集合的二元关系性质是:
      </el-card>
      </transition>
      <el-button type="danger" v-show="active >= 2" @tap="reset" size="small" round>重置</el-button>
      <el-button type="primary" icon="el-icon-caret-right" circle @tap="nextStep" size="small"></el-button>
    </view>
  </view>
</template>

<style  lang="less" scoped>
  .el-input{
    width:55%;
    margin-left:10upx;
  }
  .operation{
      width:98%;
      margin-top: 20px;
      .box-card{
        height: 200px;
        margin-bottom:5px;
        font-size:25upx;
        line-height:25upx;
        overflow:scroll;
          &:nth-child(1){
            height:80px;
          }
          &:nth-child(2){
            height:300px;
          }
        .relationMatrix{
          td{
            height:30px;
            width:30px;
            line-height:30px;
            text-align: center;
            background-color:rgb(231, 231, 231);
            &:hover{
              background-color:rgb(235, 221, 221);
            }
          }
        }
      }
      .el-button{
         float:right;
         margin-right:10upx;
      }
  }
</style>

<script>
  export default {
    data() {
      return {
        element:'',  //集合的元素
        relation:'', //集合的关系(直接输入)
        relationMatrix:[], //集合的关系(关系矩阵)
        active:0,   //当前进行到哪一步 0-2
        secondStep: false,
        thirdStep: false,
      }
    },
    methods: {
      /* 界面UI */
      nextStep:function(){
        if(this.active == 0) this.$options.methods.secondStepOperation.bind(this)()
        else if(this.active == 1) this.$options.methods.thirdStepOperation.bind(this)()
        else if(this.active == 2) this.active++
        //this.active++
      },
      secondStepOperation:function(){
        this.active = 1
        this.secondStep = true
        this.$options.methods.createMatrixGraph.bind(this)()
      },
      thirdStepOperation:function(){
        this.active = 2
        this.thirdStep = true
      },
      reset:function(){
        if (this.active >= 2) this.active = 0
        this.element = ''
        this.relation = ''
        this.secondStep = false
        this.thirdStep = false
        this.relationMatrix = []
      },
      /* 逻辑层 */
      createMatrixGraph:function(){        //统计集合的元素个数
        this.relationMatrix = []
        let length = this.element
        let item = []
        item.length = length
        for(let i = 0; i < length; i++){
          for(let j = 0;j < length; j++){
            item[j] = 0
          }
           this.relationMatrix.push(item)
        }
      },
      relationMatrixChange:function(item,index,jndex){
        console.log(item,index,jndex)
        //this.relationMatrix[1][jndex] = 5
        this.$set(this.relationMatrix[index],jndex,(1+item)%2)
        //console.log(this.relationMatrix[index+1])
        console.log(this.relationMatrix) 
      },
    }
  }
</script>