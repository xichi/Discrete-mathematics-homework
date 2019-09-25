<template>
  <view>
     <!-- 进度框 -->
    <view style="height:700upx; float:left; width:25%; margin-left:20upx; padding-top:20upx;">
      <el-steps direction="vertical" :active="active" style=""> 
        <el-step title="步骤 1" icon="el-icon-lollipop"></el-step>
        <el-step title="步骤 2" description="两种输入方式都可以哦" icon="el-icon-cherry"></el-step>
        <el-step title="步骤 3" description="我们是冠军(^o^)/~" icon="el-icon-trophy-1"></el-step>
      </el-steps>
    </view>
    <!-- 操作界面 -->
    <view class="operation">
      <el-card class="box-card">
        该集合的元素是:<el-input v-model="element" placeholder="hello" clearable prefix-icon="el-icon-edit" @keyup.enter.native="secondStepOperation"></el-input>
      </el-card>
      <transition name="el-zoom-in-top">
      <el-card class="box-card transition-box" v-show="secondStep">
         <el-tabs tab-position="top">
            <el-tab-pane label="直接输入">
              该集合的关系是:<el-input v-model="relation"  clearable prefix-icon="el-icon-edit"  @keyup.enter.native="thirdStepOperation"></el-input>
            </el-tab-pane>
            <el-tab-pane label="矩阵图">

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
      margin-top: 50upx;
      .box-card{
        height: 200upx;
        margin-bottom:20upx;
        font-size:25upx;
        line-height:25upx;
          &:nth-child(1){
            height:150upx;
          }
          &:nth-child(2){
            height:400upx;
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
        relation:'', //集合的关系
        active:0,   //当前进行到哪一步 0-2
        secondStep: false,
        thirdStep: false,
      }
    },
    methods: {
      nextStep:function(){
        this.active++
        if(this.active == 1) this.secondStep = true
        if(this.active == 2) this.thirdStep = true
      },
      secondStepOperation:function(){
        this.active = 1
        this.secondStep = true
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
      }
    }
  }
</script>