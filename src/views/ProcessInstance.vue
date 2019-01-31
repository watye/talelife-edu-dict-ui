<template>
	<div id="ProcessDefinition">
	 	<!--搜索框-->
        <el-row>
            <el-col :span="3" class="grid">
                <el-input v-model="input" placeholder="请输入内容" size="mini"></el-input>
            </el-col>
            <el-col :span="1" class="grid">
                <el-button type="success" icon="el-icon-search" size="mini">搜索</el-button>
            </el-col>
        </el-row>
        <br>
        <!--表格数据及操作-->
        <el-table :data="page.data" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
            <!--勾选框-->
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="name" label="流程实例标题" width="300"></el-table-column>
            <el-table-column prop="processDefinitionKey" label="流程名称" width="220" sortable></el-table-column>
			<el-table-column prop="businessKey" label="业务主键" width="100"></el-table-column>
			<el-table-column prop="ended" label="实例状态" width="100" :formatter="formatEndStatus"></el-table-column>
			<el-table-column prop="id" label="流程实例ID" width="100"></el-table-column>
			<el-table-column prop="lastUpdateTime" label="实例结束时间" width="120"></el-table-column>
			<el-table-column prop="lastUpdateTime" label="持续时间" width="100"></el-table-column>
            <el-table-column prop="lastUpdateTime" label="创建日期"></el-table-column>
			<el-table-column label="操作" width="300">
                <template slot-scope="scope">
					 <el-button @click="openProcessDiagramDialog(scope.row.id)" size="mini">流程图</el-button>
                    <el-button type="success" @click="suspendOrActiveProcessInstance(scope.row)" size="mini">{{scope.row.suspended?"激活":"暂停"}}</el-button>
                    <el-button type="danger" @click="deleteProcessInstance(scope.row.id)" size="mini">删除</el-button>
                </template>
            </el-table-column>
			
        </el-table>
        <br>
        <!--全删按钮-->
        <el-col :span="1" class="grid">
            <el-button type="danger" icon="el-icon-delete" size="mini" round>全删</el-button>
        </el-col>
        <br>
        <!--分页条-->
        <el-pagination background layout="prev, pager, next" @current-change="currentPageChanged" :current-page="page.start/pageSize+1" :page-size="pageSize" :total="page.total">
        </el-pagination>
		<!-- 对话框 -->
		<div>
			<el-dialog :visible.sync="processDiagramDialogVisible" width="70%" height="auto">
				<el-form :model="processDiagramFormData">
					<img :src="processDiagramFormData.url" />
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="processDiagramDialogVisible = false">关 闭</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ProcessInstance',
	components: {
	},
	data() {
		return {
			page:{start:0,size:10},
			input: '',
			processDiagramDialogVisible:false,
			processDiagramFormData:{},
			formData:{},
			pageSize:10
		}
    },
	mounted:function(){
		this.loadData();
	},
	filters:{
		
	},
	methods: {
			getSearchParams(){
				return {start:this.page.start,size:this.pageSize}
			},
			loadData(){
				var _this = this;
				this.http.get("/api/runtime/process-instances",{params:this.getSearchParams()}).then(function(response) {
					_this.page = response;
                });
			},
			currentPageChanged(page){
				this.page.start = (page-1)*this.pageSize;
				this.loadData();
			},
			formatEndStatus: function(item){
				return item.isEnded?"已结束":(item.suspended?"暂停":"运行中");
			},
			suspendOrActiveProcessInstance(item){
				var action = item.suspended?"activate":"suspend";
				var _this = this;
				this.http.put("/api/runtime/process-instances/"+item.id,{"action":action}).then(function(response) {
					_this.loadData();
					_this.$message({showClose: true,message: '操作成功',type: 'success'});
                });
			},
			deleteProcessInstance(processInstanceId){
				var _this = this;
				this.$prompt('','提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /[\w{10}]/,
					inputErrorMessage: '请填写原因',
					inputPlaceholder:'请填写原因',
					}).then(({ value }) => {
						_this.http.delete("/api/runtime/process-instances/"+processInstanceId,{params:{"deleteReason":value}}).then(function(response) {
							_this.loadData();
							_this.$message({type: 'success',message: '删除成功!'});
						});
					});
			},
			openProcessDiagramDialog(processInstanceId){
				this.processDiagramDialogVisible = true;
				this.processDiagramFormData.url="/api/runtime/process-instances/"+processInstanceId+"/diagram";
			}
        }
}

</script>