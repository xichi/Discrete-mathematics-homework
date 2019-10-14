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
            <el-tab-pane label="矩阵图">
                <table class="relationMatrix">
                  <tbody>
                    <tr v-for="(i,index) in relationMatrix" :key="index">
                      <td  v-for="(item,jndex) in i" :key="jndex"   @tap="relationMatrixChange(item,index,jndex)">
                        {{item}}
                        <!-- <input type='text' placeholder="0"/> -->
                      </td>
                    </tr>
                  </tbody>
                </table>
            </el-tab-pane>
            <el-tab-pane label="直接输入">
              该集合的关系是:
              <el-tooltip class="item" effect="light" content="示例:<1,3>,<2,2>,<3,2>,..." placement="bottom-end">
                <el-input v-model="relation" class="directInput" type="textarea" clearable @keyup.enter.native="thirdStepOperation"></el-input>
             </el-tooltip>
            </el-tab-pane>
        </el-tabs>
      </el-card>
      </transition>
      <transition name="el-zoom-in-top">
      <el-card class="box-card transition-box" v-show="thirdStep">
        该集合的二元关系性质是:
        <view id="relation-nature-box"></view>
      </el-card>
      </transition>
      <el-button type="danger" v-show="active >= 2" @tap="reset" size="small" round>重置</el-button>
      <el-button type="primary" icon="el-icon-caret-right" circle @tap="nextStep" size="small"></el-button>
    </view>
  </view>
</template>

<style lang="less">
  .el-tabs__content{
      overflow-x: scroll !important;
    }
</style>
<style lang="less" scoped>
  .el-input{
    width:55%;
    margin-left:10upx;
  }
  .operation{
      width:98%;
      margin-top: 20px;
      .box-card{
        height: 100px;
        margin-bottom:5px;
        font-size:25upx;
        line-height:25upx;
        overflow:scroll scroll;
          &:nth-child(1){
            height:80px;
          }
          &:nth-child(2){
            height:300px;
          }
        .relationMatrix{
          overflow:scroll scroll;
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
        .directInput{
          margin-top:5px;
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
        relationNature:{}, //集合关系的性质
        active:0,   //当前进行到哪一步 0-2
        secondStep: false,
        thirdStep: false,
      }
    },
    watch:{
       relation(){                              //实现直接输入与矩阵关系图动态联动
        if(window.lazy){                        //节流
          window.clearTimeout(window.lazy)
        }
        window.lazy = window.setTimeout(()=>{
          this.$options.methods.createMatrixGraph.bind(this)()
          let relations = this.relation.concat(',').replace(/</g,'').split('>,')
          for(let i=0;i<relations.length-1;i++){
            relations[i] = relations[i].split(',')
            this.$set(this.relationMatrix[relations[i][0]-1],relations[i][1]-1,1)
          }
          //console.log(this.relationMatrix)
        },400)
       }
    },
    methods: {
      /* 界面UI */
      nextStep:function(){      //下一步
        if(this.active == 0) this.$options.methods.secondStepOperation.bind(this)()
        else if(this.active == 1) this.$options.methods.thirdStepOperation.bind(this)()
        else if(this.active == 2) this.active++
      },
      secondStepOperation:function(){  //第二步
        this.active = 1
        this.secondStep = true
        this.$options.methods.createMatrixGraph.bind(this)()
        this.$notify.info({
          title: '提示',
          message: '矩阵关系和直接输入已实现动态联动了哦~~',
          duration: 5000
        });
      },
      thirdStepOperation:function(){  //第三步
        this.active = 2
        this.thirdStep = true
        this.$options.methods.creatRelationNature.bind(this)(this.relationMatrix,this.relationNature)
      },
      reset:function(){      //重置
        if (this.active >= 2) this.active = 0
        this.element = ''
        this.relation = ''
        this.secondStep = false
        this.thirdStep = false
        this.relationMatrix = []
      },
      /* 逻辑层 */
      createMatrixGraph:function(){        //初始化矩阵关系
        let length = this.element
        let item = new Array()
        for(let i = 0; i < length; i++){
          item[i]=new Array()
          for(let j = 0;j < length; j++){
            item[i][j] = 0
          }
        }
        this.relationMatrix = item
      },
      relationMatrixChange:function(item,index,jndex){   //矩阵关系
        this.$set(this.relationMatrix[index],jndex,(1+item)%2)
        if(this.relationMatrix[index][jndex] == 1){      //实现矩阵关系图与直接输入动态联动
          if(this.relation == '')  this.relation += '<' + (index+1) + ',' + (jndex+1) + '>'
          else  this.relation += ',<' + (index+1) + ',' + (jndex+1) + '>'
        }
        else{
          if(this.relation.length == 5)    this.relation = this.relation.replace('<'+(index+1)+','+(jndex+1)+'>','')
          else  this.relation = this.relation.replace(',<'+(index+1)+','+(jndex+1)+'>','')
        }

      },
      creatRelationNature:function(relationMatrix,relationNature){
        let length = this.element
        //对称性
        let sym = true
        for(let i = 0 ; i < length; ++i){
          for(let j = 0; j < length; ++j){
            if(relationMatrix[i][j] != relationMatrix[j][i]){  //只要有一对对称元素不相等：即不满足对称性
              sym = false
              break
            }
          }
        }
        relationNature['对称性'] = sym
        //自反性
        let ref = true
        for(let i = 0; i < length; ++i){
          if(relationMatrix[i][i] != 1){  //只要有一个对角线元素为 0：即不满足
            ref = false
            break
          }
        }
        relationNature['自反性'] = ref
       //反对称性
        let anti_sym = false
        for(let i = 0 ; i < length; ++i){
          for(let j = 0; j < length; ++j){
            if(relationMatrix[i][j] == relationMatrix[j][i] && i == j){  //只要有一对对称元素相等：即不满足反对称性
              anti_sym = true
              break
            }
          }
        }
        relationNature['反对称性'] = anti_sym
      //反自反性
        let anti_ref = true
        for(let i = 0; i < length; ++i){
          if(relationMatrix[i][i] == 1){  //只要有一个对角线元素为 1：即不满足
            anti_ref = false
            break
          }
        }
        relationNature['反自反性'] = anti_ref
      //传递性
        let tra = true
        for(let i = 0; i < length; ++i){
          for(let j = 0; j < length; ++j){
            for(let k = 0; k < length; ++k){
              if(relationMatrix[i][j] && relationMatrix[j][k] && !relationMatrix[i][k]){  //前两个为 1，第三个为 0，则不具有传递性
                tra = false
                break
              }
            }
          }
        }
        relationNature['传递性'] = tra
        //console.log(relationNature)
        let dom = document.getElementById('relation-nature-box')
        dom.innerHTML = ''
        for(let key  in relationNature){
            if(relationNature[key]) 
                dom.innerHTML += '<p style="text-indent:1em;">满足' + key + '</p>'
            if(!relationNature[key])
                dom.innerHTML += '<p style="text-indent:1em;">不满足' + key + '</p>'
        }
      },
    }
  }
</script>