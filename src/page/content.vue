<template>
  <div>
    <div class="content">
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :xs="24" :sm="14" :md="10" :lg="8">
          <el-input placeholder="姓名搜索" icon="search" v-model="searchInput" :on-icon-click="handleIconClick"></el-input>
        </el-col>
        <el-col :xs="24" :sm="10" :md="14" :lg="16">
          <el-col :xs="4" :sm="4" :md="4" :lg="2">
            <el-button type="primary" icon="plus" @click="addTb">新增</el-button>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="2">
            <el-button type="primary" icon="edit" @click="editTb">修改</el-button>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="2">
            <el-button type="primary" icon="delete" @click="deleteTb">删除</el-button>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="3">
            <el-button type="primary" icon="upload2" @click="exportTb">导出Excel</el-button>
          </el-col>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" @row-click="rowCheck" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="150">
        </el-table-column>
        <el-table-column prop="orgid" label="机构名称" width="300">
        </el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="formatSex" width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="isvalid" label="是否有效" :formatter="formatValid" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
          </el-pagination>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'index',
  data: function() {
    return {
      visible: false,
      searchInput: '',
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentNode: '4',
      tableData: [],
      multipleSelection: [],
      pageIndex: 1,
      pageSize: 10,
      totalSize: 0,
      insertTableVisible: false,
      insertTreeVisible: false,
      editTableVisible: false,
      insertTree: {
        name: '',
        num: '',
        region: ''
      },
      insertTableform: {
        username: '',
        isvalid: '',
        sex: '',
        orgid: ''
      },
      editTableform: {
        username: '',
        isvalid: '',
        sex: '',
        orgid: ''
      },
      formLabelWidth: '120px',
      tableType: '',
      treeType: '',
      sexOptions: [{
        value: 0,
        label: '男'
      }, {
        value: 1,
        label: '女'
      }],
      validOptions: [{
        value: 0,
        label: '无效'
      }, {
        value: 1,
        label: '有效'
      }],
      treeNode: {
        name: '研发一部'
      }
    }
  },
  mounted() {
    // this.initTable()
    // this.initTree()
  },
  methods: {
    formatSex(row, column) {
      if (row.sex != null) {
        return row.sex === 0 ? '男' : '女'
      }
    },
    formatValid(row, column) {
      if (row.isvalid != null) {
        return row.isvalid === 1 ? '生效' : '无效'
      }
    },
    initTable() {
      $.post('../../table/listByPageForSelect', {
        index: 1,
        size: 10
      }, function(res) {
        this.tableData = res.data
        this.pageIndex = res.index
        this.pageSize = res.size
        this.totalSize = res.total
      }.bind(this))
    },
    initTree() {
      $.post('../../tree/getTreeList', function(res) {
        console.log(this)
        this.treedata = res
      }.bind(this))
    },
    handleNodeClick(data) {
      this.treeNode = data
      $.post('../../table/listByPageForSelect', {
        orgid: data.name,
        index: this.pageIndex,
        size: this.pageSize
      }, function(res) {
        this.tableData = res.data
      }.bind(this))
    },
    handleIconClick(ev) {
      that = this
      var inputValue = this.searchInput
      if (inputValue !== '') {
        $.post('../../table/listByPageForSelect', {
          orgid: this.treeNode.name,
          username: this.searchInput,
          index: this.pageIndex,
          size: this.pageSize
        }, function(res) {
          this.tableData = res.data
        }.bind(this))
      } else {
        this.initTable()
      }
    },
    addTb() {
      this.tableType = '新增用户'
      this.insertTableVisible = true
    },
    editTb() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请至少选择一条数据',
          type: 'warning',
          customClass: 'msgCls'
        })
        return false
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          message: '不能选择超过1条数据',
          type: 'warning',
          customClass: 'msgCls'
        })
        return false
      } else if (this.multipleSelection[0].name === '') {
        this.$message({
          message: '请至少选择一条数据',
          type: 'warning',
          customClass: 'msgCls'
        })
        return false
      }
      // this.insertTableform = cloneObj(this.multipleSelection[0]);
      // this.updateForm.token = localStorage.getItem("token")
      console.log(this.multipleSelection)
      this.tableType = '修改用户'
      this.editTableform.username = this.multipleSelection[0].username
      this.editTableform.isvalid = this.multipleSelection[0].isvalid
      this.editTableform.sex = this.multipleSelection[0].sex
      this.editTableform.orgid = this.treeNode.name
      this.editTableVisible = true
    },
    deleteTb() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请至少选择一条数据',
          type: 'warning',
          customClass: 'msgCls'
        })
        return false
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          message: '不能删除多条',
          type: 'warning',
          customClass: 'msgCls'
        })
        return false
      }
      that = this
      this.$confirm('确认删除？', {
        customClass: 'confmCls'
      })
        .then(_ => {
          $.post('../../table/remove', {
            id: this.multipleSelection[0].userid
          }, function(res) {
            console.log(res)
            this.refresh()
          }.bind(this))
        })
        .catch(_ => {})
    },
    exportTb() {
      window.location.href = '../../table/exportExcel'
    },
    handleEdit(form) {
      console.log(form)
      if (this.tableType === '修改用户') {
        this.editTableform.userid = this.multipleSelection[0].userid
        console.log(this.editTableform)
        $.post('../../table/update', this.editTableform, function(res) {
          console.log(res)
          this.editTableVisible = false
          this.refresh()
        }.bind(this))
      } else {}
    },
    closeInsertPop() {
      this.handleClose('insertTableform')
    },
    editClose() {
      this.editTableVisible = false
    },
    handleClose(form, done) {
      this.$confirm('确认关闭？', {
        customClass: 'confmCls'
      })
        .then(_ => {
          this.insertTableVisible = false
          this.$refs[form].resetFields()
          this.refresh()
          done()
        })
        .catch(_ => {})
    },
    handleUpdata(form) {
      console.log(form)
      if (this.tableType === '新增用户') {
        this.insertTableform.userid = this.getUuid()
        this.insertTableform.orgid = this.treeNode.name
        console.log(this.insertTableform)
        $.post('../../table/save', this.insertTableform, function(res) {
          console.log(res)
          this.insertTableVisible = false
          this.$refs[form].resetFields()
          this.refresh()
        }.bind(this))
      } else {}
    },
    rowCheck(row, event, column) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.refresh()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.refresh()
    },
    refresh: function() {
      var that = this
      console.log(this.treeNode.name)
      $.post('http://localhost:8080/OrgUserDemo/table/listByPageForSelect', {
        orgid: this.treeNode.name,
        index: that.pageIndex,
        size: that.pageSize
      }, function(res) {
        this.tableData = res.data
        this.pageIndex = res.index
        this.pageSize = res.size
        this.totalSize = res.total
      }.bind(this))
    },
    renderContent(h, {
      node,
      data,
      store
    }) {
      return
    }
  }
}

</script>
<style scoped>
.content {
  float: right;
  width: calc(100% - 170px);
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.msgCls {
  margin-top: 35px;
}

.confmCls {
  margin-top: -280px;
}

</style>
