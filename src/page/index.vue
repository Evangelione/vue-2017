<template>
  <div style="height: 100%">
    <div class="sidebar">
      <div style="height: 100px; background: black; line-height: 100px; text-align: center; color: white; font-size: 22px;">
        Vue
      </div>
      <div style="height: calc(100% - 100px); background: #3D3630;">
        <el-tree id="mytree" :data="treedata" :props="defaultProps" :default-expanded-keys="[1]" highlight-current node-key="id" accordion @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'index',
  data: function() {
    return {
      treedata: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    this.$router.push('Content')
  },
  methods: {
    handleNodeClick(node) {
      console.log(node.label)
    }
  }
}

</script>
<style scoped>
.sidebar {
  float: left;
  width: 170px;
  height: 100%;
}

.el-tree {
  background: #3D3630;
  border: none;
  color: #7F7A74;
}

.el-tree-node__content {
  /*padding-left: 10px !important;*/
}

.el-tree-node__content:hover {
  background: #796D5F;
  color: #DFDED9;
}

.el-tree-node__children {
  /*padding-left: 10px;*/
}

.el-tree-node__expand-icon {
  visibility: hidden;
  margin-right: 4px !important;
}

</style>
