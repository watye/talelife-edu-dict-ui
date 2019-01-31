<template>
	<div id="app">
		<el-container>
			<el-header style="padding:0">
				<!--导航条-->
				<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
						background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="1"><router-link to="/course" tag="li">课程</router-link></el-menu-item>
          <el-menu-item index="2"><router-link to="/dict" tag="li">单词</router-link></el-menu-item>
				</el-menu>
			</el-header>
			<el-container>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
export default {
  data() {
      return {
          //查询输入框数据
          input: '',
          //导航条默认选项
          activeIndex: '1'
      }
  },
  methods: {
     handleSelect(key, keyPath) {
        console.log(key, keyPath);
    },
    startHacking () {
      this.$notify({
        title: 'It works!',
        type: 'success',
        message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
        duration: 5000
      })
    },
    ajaxData () {
      var url = '/api/try/ajax/demo_get.php'; // 这里就是刚才的config/index.js中的/api
            this.http.get(url)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
body,header{
	padding:0;
	margin:0;
}
</style>
