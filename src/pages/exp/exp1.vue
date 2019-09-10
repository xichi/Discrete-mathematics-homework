<template>
    <view>
        <!-- 方式一：直接输入 -->
        <text>请输入表达式:</text>
        <input class="uni-input" @focus="combinedFormula='(p->q)∧(q∨r)'" placeholder="示例：(p->q)∧(q∨r)" v-model="combinedFormula"/>
        <button type="primary" size="mini" @tap="calculate">确定</button>
        <!-- 方式二：输入可视化 -->
    </view>
</template>

<script>
export default{
    data(){
        return{
           combinedFormula:'', //合式公式
           trueValue:[],  //真值（命题变元）
           trueTable:[],  //真值表
           xqfs:[],       //主析取范式   
           hqfs:[],       //主合取范式
        }
    },
    mounted(){

    },
    methods:{
        createTrueValue:function(){        //统计命题变元,放入trueValue中
         var combinedFormulas = this.combinedFormula.split('')  //转化为数组
         var toughtrueValue = combinedFormulas.filter(item =>{  //未去重的命题变元（真值）
              return item>='a' && item<='z'
          }) 
         /* console.log(toughtrueValue)  */                 
         this.trueValue = [...new Set(toughtrueValue)]            //去重的命题变元
         /* console.log(this.trueValue)  */
        },
        createTrueTable:function(){        //生成真值表
            
        },
        calculate:function(){           //合式公式，开始计算
           this.$options.methods.createTrueValue.bind(this)()             //bind(this)可以让this指针回顾正常
        },
    }
}
</script>

<style lang="less" scoped>

</style>