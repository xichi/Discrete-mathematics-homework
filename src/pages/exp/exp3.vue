<template>
  <view>
    <view class="inputBox">
      <el-input
        class="inputBox-item"
        v-model="myInteger"
        placeholder="请输入一个正整数"
        @keyup.enter.native="calFactors"
        clearable
      ></el-input>
    </view>
    <view class="outputBox">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>输出结果</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >操作按钮</el-button
          >
        </div>
        <div>该数的因子是：</div>
        <div v-for="item in factors" :key="item">
          {{ item + " ," }}
        </div>
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
      matrixs: []
    };
  },
  methods: {
    calFactors: function() {
      this.$options.methods.clear.bind(this)()
      for (let i = 1; i <= this.myInteger / 2; ++i) {
        if (this.myInteger % i == 0) {
          this.factors[this.count++] = i;
        }
      }
      this.factors[this.count] = parseInt(this.myInteger);
      this.myInteger = "";
    },
    cover: function(){
	//关系矩阵初始化
	for(int i = 0; i <= count; ++i){
		for(int j = 0; j <= count; ++j){
			if(factors[j] % factors[i] == 0){  //如果满足整除关系，就设为 1
				matrixs[i][j] = 1;
			}
		}
	}
	//开始判断
	for(int i = 0; i <= count; ++i){
		for(int j = 0; j <= count; ++j){
			for(int k = 0; k <= count; ++k){
				matrixs[k][k] = 0;  //先去掉自反性
				if(matrixs[i][j] && matrixs[j][k]){
					matrixs[i][k] = 0;  //再去掉传递性
				}
			}
		}
	}
	cout << "The cover is: {";
	for(int i = 0; i <= count; ++i){
		for(int j = 0; j <= count; ++j){
			if(matrixs[i][j]){  //除去前面去掉的，其他就满足盖住关系了
				cout << " <" << factors[i] << "," << factors[j] << ">";
			}
		}
	}
	cout << " }" << endl;

    },
    clear: function(){
      this.count = 0;
      this.factors = [];
      this.matrixs = [];
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
