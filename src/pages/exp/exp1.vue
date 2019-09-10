<template>
    <view>
        <!-- 方式一：直接输入 -->
        <text>请输入表达式(或运算 | , 与运算 & ,单条件 -> ,双条件 <=> ,非运算 !):</text>
        <input class="uni-input" @focus="combinedFormula='(p->q)&(q|r)<=>!r'" placeholder="示例：(p->q)&(q|r)<=>!r" v-model="combinedFormula"/>
        <button type="primary" size="mini" @tap="calculate">确定</button>
        <!-- 方式二：输入可视化 -->
    </view>
</template>

<script>
export default{
    data(){
        return{
           combinedFormula:'', //合式公式
           trueValue:[],  //真值（命题变元）,数组长度是变元数量
           infixExp:[],        //存放中缀表达式字符
           postfixExp:[],      //存放后缀表达式字符 s2
           tempExp:[],      //存放临时字符 s1
           trueTable:[],  //真值表
           xqfs:[],       //主析取范式   
           hqfs:[],       //主合取范式
        }
    },
    mounted(){
          //console.log(this.tempExp.pop())
    },
    methods:{
        createTrueValue:function(){        //统计命题变元,预处理
            this.infixExp = this.combinedFormula.replace('->','-').replace('<=>','<').split('')
            var toughtrueValue = this.combinedFormula.split('').filter(item =>{  //未去重的命题变元（真值）
                return item>='a' && item<='z'
            })                
            this.trueValue = [...new Set(toughtrueValue)]            //去重的命题变元
        },
        canInto: function(out){               //判断优先级
            var into = this.tempExp.pop()
            var i = 0, o =0
            switch(into){
                case '#': i = 0; break;
                case '(': i = 12; break;
                case '!': i = 10; break;
                case '&': i = 8; break;
                case '|': i = 6; break;
                case '-': i = 4; break;
                case '<': i = 2; break;
                case ')': i = 1; break;
            }
            switch(out){
                case '#': o = 0; break;
                case '(': o = 1; break;
                case '!': o = 11; break;
                case '&': o = 9; break;
                case '|': o = 7; break;
                case '-': o = 5; break;
                case '<': o = 3; break;
                case ')': o = 12; break;
            }
            if(i < o){
                return true
            }
            else{
                return false
            }
        },
        infixTopostfix:function(){        //中缀转后缀表达式
            var item
            for (var i = 0; i < this.infixExp.length; i++) {
               if (this.infixExp[i]>='a' && this.infixExp[i]<='z') { //遇到操作数
                    this.postfixExp.push(this.infixExp[i])
                }
               else if(this.infixExp[i]=='!' ||this.infixExp[i]=='&' ||this.infixExp[i]=='|' ||this.infixExp[i]=='-' ||this.infixExp[i]=='<'){ //遇到运算符
                        if (this.tempExp.length == 0) {
                            this.tempExp.push(this.infixExp[i])
                        }
                        else if (this.$options.methods.canInto.bind(this)(this.infixExp[i])) {
                            this.tempExp.push(this.infixExp[i])
                        }
                        else if (!this.$options.methods.canInto.bind(this)(this.infixExp[i])) {
                            while (this.tempExp.length != 0) {
                                item = this.tempExp.pop();
                                this.postfixExp.push(item);
                                if(item == '('){
                                    this.tempExp.push(item);
                                    break;
                                }
                            }
                            this.tempExp.push(this.infixExp[i]);
                        }
               }
               else if(this.infixExp[i]=='(' ||this.infixExp[i]==')' ){       //遇到括号
                    if(this.infixExp[i]=='(')  this.tempExp.push(this.infixExp[i])
                    else if(this.infixExp[i]==')'){
                        while (1) {
                            item = this.tempExp.pop();
                            if(item == '('){
                                break;
                            }
                            this.postfixExp.push(item);
                        }
                    } 
               } 
            }
            while (this.tempExp.length != 0) {
                this.postfixExp.push(this.tempExp.pop());
            }
            
        },
        calculate:function(){           //合式公式开始计算
           this.$options.methods.createTrueValue.bind(this)()             //bind(this)可以让this指针回顾正常
           this.$options.methods.infixTopostfix.bind(this)() 
           console.log(this.postfixExp)
        },
        createTrueTable:function(){        //生成真值表
            
        },
    }
}
</script>

<style lang="less" scoped>

</style>