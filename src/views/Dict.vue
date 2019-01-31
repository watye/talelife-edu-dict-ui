<template>
	<div id="Group">
	 	<!--搜索框-->
        <el-row>
			<el-col :span="2" class="grid">
                <treeselect v-model="query.courseId" :multiple="false" :options="courseTree" :searchable="true" placeholder="请选择课程"/>
            </el-col>
            <el-col :span="2" class="grid">
                <el-input v-model="query.dictName" placeholder="英文" size="medium"></el-input>
            </el-col>
            <el-col :span="1" class="grid">
                <el-button type="success" icon="el-icon-search" size="medium" @click="queryAction()">搜索</el-button>
            </el-col>
        </el-row>
        <br>
        <!--表格数据及操作-->
        <el-table :data="page.data" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
            <!--勾选框-->
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="dictName" label="英文" width="200"></el-table-column>
			<el-table-column prop="ukSoundmark" label="音标(英)" width="150"></el-table-column>
			<el-table-column prop="usaSoundmark" label="音标(美)" width="150"></el-table-column>
			<el-table-column prop="chineseMeaning" label="中文"></el-table-column>
			<!--<el-table-column prop="usaPronounceUrl" label="发音(英)" width="200"></el-table-column>
            <el-table-column prop="ukPronounceUrl" label="发音(美)"></el-table-column>-->
            <el-table-column label="操作" width="200">
				<template slot-scope="scope">
                    <el-button type="success" @click="editForm(scope.row)" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" @click="deleteAction(scope.row.dictId)" icon="el-icon-delete" size="mini">删除</el-button>
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
				<el-form :model="formData" ref="addForm">
					<el-form-item label="课程" :label-width="'100px'" prop="courseId" :rules="[{ required: true, message: '课程不能为空'}]">
						<treeselect v-model="formData.courseId" :multiple="false" :options="courseTree" :searchable="true" placeholder="请选择" />
					</el-form-item>
					<el-form-item label="英文" :label-width="'100px'" prop="dictName" :rules="[{ required: true, message: '单词不能为空'}]">
						<el-input v-model="formData.dictName" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="音标(英)" :label-width="'100px'" prop="ukSoundmark" :rules="[{ required: true, message: '英式音标不能为空'}]">
						<el-input v-model="formData.ukSoundmark" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="美式(美)" :label-width="'100px'" prop="usaSoundmark" :rules="[{ required: true, message: '美式音标不能为空'}]">
						<el-input v-model="formData.usaSoundmark" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="中文" :label-width="'100px'" prop="chineseMeaning" :rules="[{ required: true, message: '中文不能为空'}]">
						<el-input v-model="formData.chineseMeaning" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="发音(英)" :label-width="'100px'">
						<el-input v-model="formData.usaPronounceUrl" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="发音(美)" :label-width="'100px'">
						<el-input v-model="formData.ukPronounceUrl" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="序号" :label-width="'100px'" prop="sort" :rules="[{ required: true, message: '序号不能为空'}]">
						<el-input-number v-model="formData.sort" :min="0" :max="10000" auto-complete="off"></el-input-number>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addAction()">保 存</el-button>
				</span>
			</el-dialog>
			<el-dialog title="编辑单词" :visible.sync="editFormVisible" width="550px">
				<el-form :model="formData" ref="editForm">
					<el-form-item label="课程" :label-width="'100px'" prop="courseId" :rules="[{ required: true, message: '课程不能为空'}]">
						<treeselect v-model="formData.courseId" :multiple="false" :options="courseTree" :searchable="true" placeholder="请选择" />
					</el-form-item>
					<el-form-item label="英文" :label-width="'100px'" prop="dictName" :rules="[{ required: true, message: '单词不能为空'}]">
						<el-input v-model="formData.dictName" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="音标(英)" :label-width="'100px'" prop="ukSoundmark" :rules="[{ required: true, message: '英式音标不能为空'}]">
						<el-input v-model="formData.ukSoundmark" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="美式(美)" :label-width="'100px'" prop="usaSoundmark" :rules="[{ required: true, message: '美式音标不能为空'}]">
						<el-input v-model="formData.usaSoundmark" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="中文" :label-width="'100px'" prop="chineseMeaning" :rules="[{ required: true, message: '中文不能为空'}]">
						<el-input v-model="formData.chineseMeaning" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="发音(英)" :label-width="'100px'">
						<el-input v-model="formData.usaPronounceUrl" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="发音(美)" :label-width="'100px'">
						<el-input v-model="formData.ukPronounceUrl" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="序号" :label-width="'100px'" prop="sort" :rules="[{ required: true, message: '序号不能为空'}]">
						<el-input-number v-model="formData.sort" :min="0" :max="10000" auto-complete="off"></el-input-number>
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
			page:{pageNum:0,pageSize:10},
			query:{dictName:'',courseId:null},
			addFormVisible:false,
			editFormVisible:false,
			formData:{sort:0},
			pageSize:10,
			type:'',
			courseTree:[],
			formValid:false
		}
    },
	mounted:function(){
		this.loadData();
		this.loadCourseTree();
	},
	filters:{
		
	},
	methods: {
		/**************************************** curd start ******************************************************************************/
			getSearchParams(){
				return {pageNum:this.page.pageNum,pageSize:this.pageSize,query:this.query}
			},
			loadData(){
				var _this = this;
				this.http.post("/api/web/dict/page",this.getSearchParams()).then(function(response) {
					_this.page = response.data;
                });
			},
			currentPageChanged(page){
				this.page.pageNum = (page-1)*this.pageSize;
				this.loadData();
			},
			addForm(){
				this.addFormVisible = true;
				this.formData = {};
				 this.$refs["addForm"].resetFields();
			},
			editForm(item){
				this.editFormVisible = true;
				var _this = this;
				this.http.get("/api/web/dict/"+item.dictId).then(function(response) {
					_this.formData = response.data;
                });
			},
			addAction(){
				var _this = this;
				var isValid = true;
				this.$refs["addForm"].validate((valid) => {
					_this.formValid = valid;
				});

				if(this.formValid){
					this.http.post("/api/web/dict/add",_this.formData).then(function(response) {
						_this.addFormVisible = false;
						_this.loadData();
						_this.$message({showClose: true,message: '新增成功',type: 'success'});
					});
				}
				
			},
			editAction(){
				var _this = this;
				var isValid = true;
				this.$refs["addForm"].validate((valid) => {
					_this.formValid = valid;
				});
				if(this.formValid){
					this.http.put("/api/web/dict/"+_this.formData.dictId,_this.formData).then(function(response) {
					_this.editFormVisible = false;
					_this.loadData();
					_this.$message({showClose: true,message: '保存成功',type: 'success'});
                });
				}
				
			},
			deleteAction(dictId){
				var _this = this;
				this.$confirm('确认删除该单词?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						_this.http.delete("/api/web/dict/"+dictId).then(function(response) {
							_this.loadData();
							_this.$message({type: 'success',message: '删除成功!'});
						});
					}).catch(() => {});
			},
			queryAction(){
				this.page.pageNum = 0;
				this.loadData();
			},
		/**************************************** curd end ******************************************************************************/	
		loadCourseTree(){
			var _this = this;
			this.http.get("/api/web/course/tree").then(function(response) {
				_this.courseTree = response.data;
			});
		},
    }
}

</script>