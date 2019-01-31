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
			<el-table-column prop="id" label="用户组编号" width="200"></el-table-column>
            <el-table-column prop="name" label="名称" width="300"></el-table-column>
            <el-table-column prop="type" label="分类"></el-table-column>
            <el-table-column label="操作" width="300">
				<template slot-scope="scope">
					<el-button type="success" @click="editGroupUserDialog(scope.row)" icon="el-icon-edit" size="mini">组用户</el-button>
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
			<el-dialog title="新增用户组" :visible.sync="addFormVisible" width="550px">
				<el-form :model="formData">
					<el-form-item label="Id" :label-width="'100px'">
						<el-input v-model="formData.id" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="分类" :label-width="'100px'">
						<template>
							<el-select v-model="formData.type" placeholder="请选择" style="float:left">
								<el-option
								v-for="item in groupTypes"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</template>
					</el-form-item>
					<el-form-item label="名称" :label-width="'100px'">
						<el-input v-model="formData.name" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addAction()">保 存</el-button>
				</span>
			</el-dialog>
			<el-dialog title="编辑用户组" :visible.sync="editFormVisible" width="550px">
				<el-form :model="formData">
					<el-form-item label="分类" :label-width="'100px'">
						<template>
							<el-select v-model="formData.type" placeholder="请选择" style="float:left">
								<el-option
								v-for="item in groupTypes"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</template>
					</el-form-item>
					<el-form-item label="名称" :label-width="'100px'">
						<el-input v-model="formData.name" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="editAction()">保 存</el-button>
				</span>
			</el-dialog>
			<!-- 组用户 -->
			<el-dialog title="组用户" :visible.sync="editGroupUserDialogVisible">
				<el-col :span="4" class="grid">
					<el-button type="success" @click="openSelectGroupUserDialog()" icon="el-icon-circle-plus-outline" size="mini" round>添加用户</el-button>
				</el-col>
				<el-col :span="2" class="grid">
					<el-button type="danger" @click="deleteGroupUserAction()" icon="el-icon-delete" size="mini" round>删除</el-button>
				</el-col>
				<br/>
				<el-table ref="multipleTable" :data="gridPage.data" tooltip-effect="dark" style="width: 100%" @selection-change="groupUserHandleSelectionChange" border>
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column property="id" label="用户编号" width="150"></el-table-column>
					<el-table-column property="firstName" label="姓名"></el-table-column>
				</el-table>
			</el-dialog>
			<!-- 选择用户 -->
			<el-dialog title="选择用户" :visible.sync="selectGroupUserDialogVisible" width="550px">
				<el-table ref="multipleTable" :data="userPage.data" tooltip-effect="dark" style="width: 100%" @selection-change="userHandleSelectionChange" border>
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="id" label="用户编号" width="120"></el-table-column>
					<el-table-column prop="firstName" label="姓名"></el-table-column>
				</el-table>
				<span slot="footer" class="dialog-footer">
					<el-button @click="selectGroupUserDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="addGroupUserAction()">保 存</el-button>
				</span>
				<el-pagination background layout="prev, pager, next" @current-change="userCurrentPageChanged" :current-page="userPage.start/pageSize+1" :page-size="pageSize" :total="userPage.total">
        		</el-pagination>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Group',
	components: {
	},
	data() {
		return {
			page:{start:0,size:10},
			gridPage:[],
			userPage:[],
			multipleSelectionUser:[],
			multipleSelectionGroupUser:[],
			currentEditGroupUserGroupId:'',
			input: '',
			addFormVisible:false,
			editFormVisible:false,
			editGroupUserDialogVisible:false,
			selectGroupUserDialogVisible:false,
			formData:{},
			pageSize:10,
			groupTypes: [{
				value: '1',
				label: '系统管理员'
				}, {
				value: '2',
				label: '经理'
				}, {
				value: '3',
				label: '员工'
			}],
			type:''
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
			getUserPageSearchParams(){
				return {start:this.userPage.start,size:this.pageSize}
			},
			userCurrentPageChanged(page){
				this.userPage.start = (page-1)*this.pageSize;
				this.loadUserData();
			},
			loadUserData(){
				var _this = this;
				this.http.get("/api/identity/users",{params:this.getUserPageSearchParams()}).then(function(response) {
					_this.userPage = response;
                });
			},
			userHandleSelectionChange(val) {
				this.multipleSelectionUser = val;
			},
			groupUserHandleSelectionChange(val) {
				this.multipleSelectionGroupUser = val;
			},
			loadGroupUserData(groupId){
				var _this = this;
				this.http.get("/api/identity/users?memberOfGroup="+groupId,{params:this.getSearchParams()}).then(function(response) {
					_this.gridPage = response;
                });
			},
			addGroupUserAction(){
				if(this.multipleSelectionUser.length==0){
					this.$message({showClose: true,message: '请选择用户',type: 'warning'});
					return;
				}
				var groupUsers = [];
				for(var i=0;i<this.multipleSelectionUser.length;i++){
					groupUsers.push({"userId":this.multipleSelectionUser[i].id});
				}
				var groupId = this.currentEditGroupUserGroupId;
				var _this = this;
				this.http.post("/api/identity/groups-support/"+groupId+"/members",groupUsers).then(function(response) {
					_this.selectGroupUserDialogVisible = false;
					_this.loadGroupUserData(groupId);
					_this.$message({showClose: true,message: '保存成功',type: 'success'});
                });
			},
			//编辑组用户
			editGroupUserDialog(group){
				this.editGroupUserDialogVisible = true;
				this.currentEditGroupUserGroupId = group.id;
				this.loadGroupUserData(group.id);
			},
			//删除组用户
			deleteGroupUserAction(){
				if(this.multipleSelectionGroupUser.length==0){
					this.$message({showClose: true,message: '请选择用户',type: 'warning'});
					return;
				}
				var groupUsers = [];
				for(var i=0;i<this.multipleSelectionGroupUser.length;i++){
					groupUsers.push({"userId":this.multipleSelectionGroupUser[i].id});
				}
				var groupId = this.currentEditGroupUserGroupId;
				var _this = this;
				this.$confirm('确认删除选中的用户?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						_this.http.delete("/api/identity/groups-support/"+groupId+"/members",{data:groupUsers}).then(function(response) {
							_this.loadGroupUserData(groupId);
							_this.$message({type: 'success',message: '删除成功!'});
						});
					}).catch(() => {});
			},
			openSelectGroupUserDialog(){
				this.selectGroupUserDialogVisible = true;
				this.loadUserData();
			}
    }
}

</script>