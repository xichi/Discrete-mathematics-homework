<template>
    <view>
        <!-- 方式一：直接输入 -->
        <text>请输入表达式(或运算 | , 与运算 & ,单条件 -> ,双条件 <=> ,非运算 !):</text>
        <input class="uni-input" @focus="combinedFormula='(p->q)&(q|r)<=>!r'" placeholder="示例：(p->q)&(q|r)<=>!r" v-model="combinedFormula"/>
        <button type="primary" size="mini" @tap="calculate">确定</button>
        <form action="">        
            <ol v-for="item in trueValue" :key="item.id"></ol>
            <ul>
                <li></li>
            </ul>
        </form>
        <!-- 方式二：输入可视化 -->
    </view>
</template>

<script>
export default{
    data(){
        return{
           combinedFormula:'', //合式公式
           trueValue:[],  //真值（命题变元）,数组长度是变元数量
           trueValueV:[],
           infixExp:[],        //存放中缀表达式字符
           tempExp:[],      //存放临时字符(栈)
           postfixExp:[],   //存放后缀表达式字符（出栈）
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
            console.log('命题变元'+this.trueValue) 
        },
        canInto: function(out){               //判断优先级
            var into = this.tempExp[this.tempExp.length-1]
            var i = 0, o = 0
            switch(into){
                case '(': i = 8; break;
                case '!': i = 2; break;
                case '&': i = 3; break;
                case '|': i = 4; break;
                case '-': i = 6; break;
                case '<': i = 7; break;
                case ')': i = 1; break;
            }
            switch(out){
                case '(': o = 1; break;
                case '!': o = 2; break;
                case '&': o = 3; break;
                case '|': o = 4; break;
                case '-': o = 6; break;
                case '<': o = 7; break;
                case ')': o = 8; break;
            }
            if(o < i){
                return true
            }
            else{
                return false
            }
        },
        infixTopostfix: function(){           //中缀表达式转为后缀表达式
            var item
            for (var i = 0; i < this.infixExp.length; i++) {
                if(this.infixExp[i]>='a' && this.infixExp[i]<='z') { //遇到操作数
                    this.postfixExp.push(this.infixExp[i])
                }
                else if(this.infixExp[i] === ')' ){       //遇到右括号
                       while (this.tempExp.length != 0){
                            item = this.tempExp.pop();
                            if(item === '('){
                                break
                            }
                            this.postfixExp.push(item);
                        }  
                }
                else{ //遇到运算符和'('
                        if (this.tempExp.length == 0) {
                            this.tempExp.push(this.infixExp[i])
                        }
                        else if (this.$options.methods.canInto.bind(this)(this.infixExp[i])) {
                            this.tempExp.push(this.infixExp[i])
                        }
                        else if (!this.$options.methods.canInto.bind(this)(this.infixExp[i])) {
                            while (this.tempExp.length != 0){
                                item = this.tempExp.pop()
                                this.postfixExp.push(item)
                                if(this.$options.methods.canInto.bind(this)(this.infixExp[i])){
                                    this.tempExp.push(this.infixExp[i])
                                    break;
                                }
                            } 
                            this.tempExp.push(this.infixExp[i])
                        }
               }
            }
            while (this.tempExp.length != 0) {
                this.postfixExp.push(this.tempExp.pop());
            }  
        },
     cal:function(postfixExp,trueTable){       //对赋值后的后缀表达式进行计算
           var tempExp = []
           var a1 = []
           var t1,t2
           for (var i = 0; i < postfixExp.length; i++) {
                if (postfixExp[i]>='a' && postfixExp[i]<='z') {
                    tempExp.push(postfixExp[i]);
                }
                else {
                    switch (postfixExp[i]) {
                        case '!':
                            t1 = tempExp.pop()
                            tempExp.push(!t1)
                            break
                        case '&':
                            t1 = tempExp.pop()
                            t2 = tempExp.pop()
                            tempExp.push( t1 && t2 )
                            break
                        case '|':
                            t1 = tempExp.pop()
                            t2 = tempExp.pop()
                            tempExp.push( t1 || t2 )
                            break
                        case '-':
                           t1 = tempExp.pop()
                           t2 = tempExp.pop()
                           if(t1==0&&t2==1)  tempExp.push(0)
                           else       tempExp.push(1)
                            break
                        case '<':
                            t1 = tempExp.pop()
                            t2 = tempExp.pop()
                            tempExp.push( t1 == t2 )
                            break
                        default:
                            alert("运算符号出错,请重新输入");
                    }
                }
            }  
            tempExp = tempExp.toString()
            if(!tempExp) tempExp = '0'
            else if(tempExp) tempExp = '1'
            return tempExp       
        },
        judege:function(){
            
        },
        createTrueTable:function(){        //生成真值表
            //命题变元赋值
            var expressions = new Array()
            var trueTable = new Array()
            var len = this.trueValue.length
            var s = ''
            for(var i=0; i<len; i++)   s += '0'
            for(var t = 0;t < Math.pow(2,this.trueValue.length);t++){
                expressions[t]= (s+parseInt(t).toString(2)).slice(-len)
            }
            for(var j = 0;j < Math.pow(2,this.trueValue.length);j++){
                trueTable[j] = new Array()
                trueTable[j] = expressions[j].split('')
                this.trueTable = trueTable
            //合式公式计算  
                this.trueTable[j].push(this.$options.methods.cal.bind(this)(this.postfixExp,this.trueTable[j]))      
            }           
            console.log('真值表',this.trueTable)          
        }, 
        calculate:function(){           //合式公式开始计算
           this.$options.methods.clear.bind(this)() 
           this.$options.methods.createTrueValue.bind(this)()             //bind(this)可以让this指针回顾正常
           console.log('中缀表达式'+this.infixExp)
           this.$options.methods.infixTopostfix.bind(this)() 
           console.log('后缀表达式'+this.postfixExp)
           this.$options.methods.createTrueTable.bind(this)()       
        },
        clear:function(){        //重新加载
           this.tempExp.length = 0
           this.postfixExp.length = 0
           this.trueValue.length = 0
           this.infixExp.length = 0
           this.trueTable.length = 0
           this.xqfs.length = 0 
           this.hqfs.length = 0
        }
    }
}
</script>

<style lang="less" scoped>

</style>