<template>
	<div id="Group">
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
			<el-table-column prop="id" label="编号" width="200"></el-table-column>
            <el-table-column prop="name" label="名称" width="150"></el-table-column>
			<el-table-column prop="usaPronounceUrl" label="英式发音" width="200"></el-table-column>
            <el-table-column prop="ukPronounceUrl" label="美式发音"></el-table-column>
            <el-table-column label="操作" width="300">
				<template slot-scope="scope">
                    <el-button type="success" @click="editForm(scope.row)" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" @click="deleteAction(scope.row.id)" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <!--新增按钮-->
        <el-col :span="1" class="grid">
            <el-button type="success" @click="addForm()" icon="el-icon-circle-plus-outline" size="mini" round>新增</el-button>
        </el-col>
        <!--全删按钮-->
        <el-col :span="1" class="grid">
            <el-button type="danger" icon="el-icon-delete" size="mini" round>全删</el-button>
        </el-col>
        <br>
        <!--分页条-->
        <el-pagination background layout="prev, pager, next" @current-change="currentPageChanged" :current-page="page.start/pageSize+1" :page-size="pageSize" :total="page.total">
        </el-pagination>
		<div>
			<el-dialog title="新增单词" :visible.sync="addFormVisible" width="550px">
				<el-form :model="formData">
					<el-form-item label="分类" :label-width="'100px'">
						<template>
							<treeselect v-model="treeValue" :multiple="false" :options="courseTree" :searchable="true" placeholder="请选择" />
						</template>
					</el-form-item>
					<el-form-item label="名称" :label-width="'100px'">
						<el-input v-model="formData.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="英式发音" :label-width="'100px'">
						<el-input v-model="formData.usPronounceUrl" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="美式发音" :label-width="'100px'">
						<el-input v-model="formData.ukPronounceUrl" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addAction()">保 存</el-button>
				</span>
			</el-dialog>
			<el-dialog title="编辑单词" :visible.sync="editFormVisible" width="550px">
				<el-form :model="formData">
					<el-form-item label="分类" :label-width="'100px'">
						<template>
							<treeselect v-model="treeValue" :multiple="false" :options="courseTree" :searchable="true" placeholder="请选择" />
						</template>
					</el-form-item>
					<el-form-item label="名称" :label-width="'100px'">
						<el-input v-model="formData.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="英式发音" :label-width="'100px'">
						<el-input v-model="formData.usPronounceUrl" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="美式发音" :label-width="'100px'">
						<el-input v-model="formData.ukPronounceUrl" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="editAction()">保 存</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
	name: 'Group',
	components: {
		Treeselect
	},
	data() {
		return {
			page:{start:0,size:10},
			input: '',
			addFormVisible:false,
			editFormVisible:false,
			formData:{},
			pageSize:10,
			type:'',
			treeValue:null,
			courseTree:[
				{
					id:1,
					label: '一级 1',
					children: [{
						id:2,
						label: '二级 1-1'
					}]
				}
			]
		}
    },
	mounted:function(){
		this.loadData();
	},
	filters:{
		
	},
	methods: {
		/**************************************** curd start ******************************************************************************/
			getSearchParams(){
				return {start:this.page.start,size:this.pageSize}
			},
			loadData(){
				var _this = this;
				this.http.get("/api/identity/groups",{params:this.getSearchParams()}).then(function(response) {
					_this.page = response;
                });
			},
			currentPageChanged(page){
				this.page.start = (page-1)*this.pageSize;
				this.loadData();
			},
			addForm(){
				this.addFormVisible = true;
				this.formData = {};
			},
			editForm(item){
				this.editFormVisible = true;
				this.formData = item;
			},
			addAction(){
				var _this = this;
				this.http.post("/api/identity/groups",_this.formData).then(function(response) {
					_this.addFormVisible = false;
					_this.loadData();
					_this.$message({showClose: true,message: '新增成功',type: 'success'});
                });
			},
			editAction(){
				var _this = this;
				var data = {"type":_this.formData.type,"name":_this.formData.name};
				this.http.put("/api/identity/groups/"+_this.formData.id,_this.formData).then(function(response) {
					_this.editFormVisible = false;
					_this.loadData();
					_this.$message({showClose: true,message: '保存成功',type: 'success'});
                });
			},
			deleteAction(groupId){
				var _this = this;
				this.$confirm('确认删除该用户组?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						_this.http.delete("/api/identity/groups/"+groupId).then(function(response) {
							_this.loadData();
							_this.$message({type: 'success',message: '删除成功!'});
						});
					}).catch(() => {});
			},
		/**************************************** curd end ******************************************************************************/	
    }
}

</script>