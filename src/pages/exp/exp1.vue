<template>
    <view>
        <!-- 方式一：直接输入 -->
        <text class='tips'>请输入表达式:<span>(或运算 | , 与运算 & ,单条件 -> ,双条件 <=> ,非运算 !)</span></text>
        <view style="overflow:hidden;">
            <el-input v-model="combinedFormula" placeholder="示例：((!!!p|q)<=>(a&b))->(r|(!b&c))"  @focus="combinedFormula='((!!!p|q)<=>(a&b))->(r|(!b&c))'" class="CFinput" @keypress="createTable" clearable prefix-icon="el-icon-edit">
            </el-input>
            <view class="mybutton" :animation="animationButton">
                <el-button class="checkbutton" type="primary" icon="el-icon-check" circle @tap="calculate"  size="small"></el-button>
            </view>
        </view>
        <!-- 方式二：输入可视化 -->
        <!-- 输出结果 -->
        <el-card class="box-card" v-show="trueValue.length != 0">
            <el-table
                :data="trueTableObj"
                height="400"
                style="width: 95%"
                stripe
                >
                <el-table-column
                v-for="item in trueValue"
                :key="item.id"
                :prop="item"
                :label="item"
                width="90">
                </el-table-column>
                <el-table-column
                :prop="trueCombinedFormula"
                :label="trueCombinedFormula"
                width="90">
                </el-table-column>
            </el-table>
            <view class="output">
                <view>主析取范式：<view class="outputT">{{xqfs}}</view></view>
                <view>主合取范式：<view class="outputT">{{hqfs}}</view></view>
            </view>
        </el-card>
    </view>
</template>

<script>
export default{
    data(){
        return{
           combinedFormula:'', //合式公式
           trueCombinedFormula:'', //为了element的UI好看
           trueValue:[],  //真值（命题变元）,数组长度是变元数量
           infixExp:[],        //存放中缀表达式字符
           tempExp:[],      //存放临时字符(栈)
           postfixExp:[],   //存放后缀表达式字符（出栈）
           trueTable:[],  //真值表
           trueTableObj:[],  //为了element的组件而修改的真值表
           xqfs:'',       //主析取范式   
           hqfs:'',       //主合取范式
           animationButton: {}, //button的动画
        }
    },
    mounted(){
          //console.log(this.tempExp.pop())
    },
    methods:{
        createTrueValue:function(){        //统计命题变元,预处理
            this.infixExp = this.combinedFormula.replace(/->/g,'-').replace(/<=>/g,'<').split('')
            var toughtrueValue = this.combinedFormula.split('').filter(item =>{  //未去重的命题变元（真值）
                return item>='a' && item<='z' || item>='A' && item<='Z'
            })               
            this.trueValue = [...new Set(toughtrueValue)]            //去重的命题变元
            console.log('命题变元'+this.trueValue)
        },
        canInto: function(out){               //判断优先级
            var into = this.tempExp[this.tempExp.length-1]
            var i = 0, o = 0
            switch(into){     //栈内
                case '(': i = 12; break;
                case '!': i = 3; break;
                case '&': i = 5; break;
                case '|': i = 7; break;
                case '-': i = 9; break;
                case '<': i = 11; break;
                case ')': i = 1; break; 
            }
            switch(out){      //栈外
                case '(': o = 1; break;
                case '!': o = 2; break;
                case '&': o = 4; break;
                case '|': o = 6; break;
                case '-': o = 8; break;
                case '<': o = 10; break;
                case ')': o = 12; break; 
            }
            if(i > o){      //栈外优先级大于栈内
                return true
            }
            else{
                return false
            }
        },
        infixTopostfix: function(){           //中缀表达式转为后缀表达式
            var item
            for (var i = 0; i < this.infixExp.length; i++) {
                if(this.infixExp[i]>='a' && this.infixExp[i]<='z' || this.infixExp[i]>='A' && this.infixExp[i]<='Z' ) { //遇到操作数
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
                else{ //遇到运算符和左括号
                        if (this.tempExp.length == 0) {
                            this.tempExp.push(this.infixExp[i])
                        }
                        else if (this.$options.methods.canInto.bind(this)(this.infixExp[i])) {     //当前操作符大于栈顶
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
                            //this.tempExp.push(this.infixExp[i])
                        }
               }
            }
            while (this.tempExp.length != 0) {
                this.postfixExp.push(this.tempExp.pop());
            }  
        },
     cal:function(postfixExp,trueTable){       //对赋值后的后缀表达式进行计算
           var tempExp = []
           var item
           var t1,t2          
           for (var i = 0; i < postfixExp.length; i++) {
                if (postfixExp[i]>='a' && postfixExp[i]<='z' || postfixExp[i]>='A' && postfixExp[i]<='Z') {
                   item = postfixExp[i]
                    for(var j = 0;j < this.trueValue.length;j++){          //把真值表的值赋给命题变元
                       if(item == this.trueValue[j]){
                           item = trueTable[j]
                           tempExp.push(item)
                           break
                       }
                    }
                    //console.log(postfixExp)
                }
                else {
                    switch (postfixExp[i]) {
                        case '!':
                            t1 = tempExp.pop()
                            if(t1==0)  tempExp.push(1)
                            else if(t1==1)      tempExp.push(0) 
                            break
                        case '&':
                            t1 = tempExp.pop()
                            t2 = tempExp.pop()
                            if(t1==1&&t2==1) tempExp.push(1)
                            else   tempExp.push(0)
                            break
                        case '|':
                            t1 = tempExp.pop()
                            t2 = tempExp.pop()
                            if(t1==0&&t2==0)  tempExp.push(0)
                            else       tempExp.push(1)
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
                            if(t1==t2)  tempExp.push(1)
                            else       tempExp.push(0)
                            break
                    }
                }
            }  
            tempExp = tempExp.toString()
            if(tempExp == 'true') {tempExp = '0'}
            else if(tempExp == 'false') {tempExp = '1'} 
            return tempExp       
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
            this.$options.methods.transform.bind(this)()
            console.log('真值表',this.trueTable)          
        }, 
        clear:function(){        //重新加载
           this.tempExp.length = 0
           this.postfixExp.length = 0
           this.trueValue.length = 0
           this.infixExp.length = 0
           this.trueTable.length = 0
           this.xqfs = ''
           this.hqfs = ''
        },
        transform: function(){         //把0转化成F,把1转化成T
            for(var a=0;a<this.trueTable.length;a++){
                for(var b=0;b<this.trueTable[a].length;b++){
                      if(this.trueTable[a][b] == '1')  this.trueTable[a][b] = 'T'
                      else if(this.trueTable[a][b] == '0')  this.trueTable[a][b] = 'F'
                }
            }
        },
        createXqfs:function(){        //析取范式，T的指派
           var item = []
           for(var a=0;a<this.trueTable.length;a++){
               if(this.trueTable[a][this.trueValue.length] == 'T'){
                   item.push('(')
                   for(var b=0;b<(this.trueTable[a].length-1);b++){
                       if(this.trueTable[a][b] == 'T'){
                            item.push(this.trueValue[b])     
                       }  
                       else if(this.trueTable[a][b] == 'F'){
                            item.push('┐'+this.trueValue[b])
                       }
                       item.push('∧')
                   }
                   item.pop()
                   item.push(')')
                   item.push('∨')
               }
           }
           item.pop()
           this.xqfs = item.join('')
           console.log('主析取范式:'+this.xqfs) 
        },
        createHqfs:function(){       //合取范式，F的指派
           var item = []
           for(var a=0;a<this.trueTable.length;a++){
               if(this.trueTable[a][this.trueValue.length] == 'F'){
                   item.push('(')
                   for(var b=0;b<(this.trueTable[a].length-1);b++){
                       if(this.trueTable[a][b] == 'F'){
                            item.push(this.trueValue[b])     
                       }  
                       else if(this.trueTable[a][b] == 'T'){
                            item.push('┐'+this.trueValue[b])
                       }
                       item.push('∨')
                   }
                   item.pop()
                   item.push(')')
                   item.push('∧')
               }
           }
           item.pop()
           this.hqfs = item.join('')
           console.log('主合取范式:'+this.hqfs) 
        },
        calculate:function(){           //合式公式开始计算
           this.$options.methods.UIanimation.bind(this)()
           this.trueCombinedFormula = this.combinedFormula
           this.$options.methods.clear.bind(this)() 
           this.$options.methods.createTrueValue.bind(this)()             //bind(this)可以让this指针回顾正常
           console.log('中缀表达式'+this.infixExp)
           this.$options.methods.infixTopostfix.bind(this)() 
           console.log('后缀表达式'+this.postfixExp)
           this.$options.methods.createTrueTable.bind(this)()
           this.$options.methods.createXqfs.bind(this)()
           this.$options.methods.createHqfs.bind(this)()
           this.$options.methods.UItransform.bind(this)()
           //console.log(this.trueTable.length)       
        },
        createTable:function(){
            if (event.keyCode == 13) {
                   this.$options.methods.calculate.bind(this)()
            }
        },
        /* 以下是ui美化 */
        UItransform:function(){      //为了迎合element的表格，修改数组结构
           var objArray = []
           var trueValue = this.trueValue
           var trueTable = this.trueTable
           var trueCombinedFormula = this.trueCombinedFormula
           for(var i=0;i<trueTable.length;i++){
               var obj = {}
               for(var j=0;j<trueValue.length;j++){
                    obj[trueValue[j]] = trueTable[i][j]
               }
               obj[trueCombinedFormula] = trueTable[i][j]
               objArray.push(obj)
           }
           this.trueTableObj = objArray   
        },
        UIanimation:function(){
            var animation = uni.createAnimation({
                duration: 600,
                timingFunction: 'ease',
            })
            this.animationButton = animation

            animation.rotate(360).step()         //uni-app的bug机制，动画只能实现一次（除非输入随机数）
            this.animationButton = animation.export()
        }
    }
}
</script>

<style scoped>
 uni-page-body{
   padding:10upx;
 }
 .box-card{
    margin-top:10upx;
 }
 .el-table{
    margin:0 auto
 }
 .el-table-column:nth-child(1){
    background-color:blue;
 }
 .checkbutton{
    float:right;
    margin-top:10upx;
 }
 .CFinput{
    float:left;
    width:88%;
 }
 .mybutton{
    float:left;
    margin-left:5upx;
 }
 .tips span{
   font-size:30upx;
   color:#5d5d5d;
 }
 .output view{
    word-break: break-all; 
    word-wrap: break-word;
    font-size:30upx;
 }
 .output .outputT{
    font-size:20upx;
    background-color:rgb(245, 245, 245);
 }
</style>