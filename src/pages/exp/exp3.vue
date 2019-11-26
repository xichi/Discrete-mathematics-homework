<template>
  <view>
    <view class="inputBox">
      <el-input
        class="inputBox-item"
        v-model="myInteger"
        placeholder="请输入一个正整数"
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
        <div>该数的因子是：</div>
        <div v-for="item in factors" :key="item">
          {{ item + " ," }}
        </div>
        <div>盖住关系是：</div>
        <div>
          {{ coveringRelation }}
        </div>
        <div>{{ complementedLattice }}</div>
      </el-card>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      myInteger: "",
      factors: [],
      matrixs: [[]],
      coveringRelation: "",
      complementedLattice: ""
    };
  },
  methods: {
    calFactors: function() {
      for (let i = 1; i <= this.myInteger / 2; ++i) {
        if (this.myInteger % i == 0) {
          this.factors[this.count++] = i;
        }
      }
      this.factors[this.count] = parseInt(this.myInteger);
      this.myInteger = "";
    },
    calCover: function(factors, matrixs, count){
      //关系矩阵初始化
      for(let i = 0; i <= count; ++i){
        matrixs[i] = new Array();
        for(let j = 0; j <= count; ++j){
          matrixs[i][j] = 0;
          if(factors[j] % factors[i] == 0){  //如果满足整除关系，就设为 1
            matrixs[i][j] = 1;
          }
        }
      }
      //开始判断
      for(let i = 0; i <= count; ++i){
        for(let j = 0; j <= count; ++j){
          for(let k = 0; k <= count; ++k){
            matrixs[k][k] = 0;  //先去掉自反性
            if(matrixs[i][j] && matrixs[j][k]){
              matrixs[i][k] = 0;  //再去掉传递性
            }
          }
        }
      }
      for(let i = 0; i <= count; ++i){
        for(let j = 0; j <= count; ++j){
          if(matrixs[i][j]){
            this.coveringRelation += " <" + factors[i] + "," + factors[j] + ">";
          }
        }
      }
    },
    gcd: function(num1, num2){            //求最大公约数
      let temp;
      //辗转相除法
      while(temp != 0){
        temp = num1 % num2;
        num1 = num2;
        num2 = temp;
      }
      return num1;
    },
    calComplementedLattice: function(factors, count){
      let flag, Gcd, Lcm;
      for(let i = 1; i < count; i++)
      {
        flag = false;
        for(let j = 1; j < count; j++)
        {
          if(i == j)
            continue;
          Gcd = this.$options.methods.gcd.bind(this)(factors[i], factors[j]); //最大公约数，即最大下界
          Lcm = factors[i] / Gcd * factors[j];  //最小公倍数，即最小上界
          if(Gcd == factors[0] && Lcm == factors[count])  //最大下界为 1，最小上界为 n
          {
            flag = true;
            break;
          }
          if(!flag)
          {
            this.complementedLattice = "这不是有补格!";
            return;
          }
        }
      }
      this.complementedLattice = "这是有补格!";
    },
    clear: function(){
      this.count = 0;
      this.factors = [];
      this.matrixs = [];
      this.coveringRelation = "";
      this.complementedLattice = "";
    },
    mainCal: function(){
      this.$options.methods.clear.bind(this)();
      this.$options.methods.calFactors.bind(this)();
      this.$options.methods.calCover.bind(this)(this.factors, this.matrixs, this.count);
      this.$options.methods.calComplementedLattice.bind(this)(this.factors, this.count);
    }
  }
};
</script>

<style lang="less">
.inputBox {
  text-align: center;
  padding: 10upx 0;
  .inputBox-item {
    width: 50%;
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
