<template>
  <div class="content">
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-button type="primary" @click="handleAdd" size="small">新增菜单</el-button>
        <el-button type="primary" @click="handGetAll" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tabla-box">
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="Id"
        height="500"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="title"
          label="菜单名称"
          width="180">
   
        </el-table-column>

        <el-table-column
          prop="meta.icon"
          label="图标"
          width="180">
          <template slot-scope="scope">
            <!--            <i :class="scope.row.meta.icon"></i>-->
          </template>

        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          prop="component"
          label="文件路径">
        </el-table-column>

        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDeleteDialog(scope.$index, scope.row)">删除
            </el-button>
            <el-button type="primary"
                       size="mini"
                       plain
                       @click="handleAdd(scope.row)"
            >新增
            </el-button>
<!--            <el-button type="success"-->
<!--                       size="mini"-->
<!--                       plain-->
<!--                       @click="sortVisible = true"-->
<!--            >排序-->
<!--            </el-button>-->

          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog :title="editTitle" :visible.sync="dialogFormVisible">
      <el-form :model="formData">
        <el-form-item label="菜单标题" :label-width="formLabelWidth">
          <el-input v-model="formData.meta.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="formData.meta.icon" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="路径" :label-width="formLabelWidth">
          <el-input v-model="formData.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件路径" :label-width="formLabelWidth">
          <el-input v-model="formData.component" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" :label-width="formLabelWidth">
          <el-select v-model="formData.parentId" placeholder="请选择">
            <el-option
              v-for="item in allData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="formData.sort" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="是否外链" :label-width="formLabelWidth">
          <el-radio-group v-model="formData.isLink">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>

          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAffEdit()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>确定删除当前菜单？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleAffdelete()">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="菜单排序(可拖拽排序)"
      :visible.sync="sortVisible"
      width="30%"
      :before-close="handleCloseSort"
    >
      <el-tree
        :data="tableData"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">
      </el-tree>
      <el-button @click="sortVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleAffsort()">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getMenu } from '@/api/admin/menu'
export default {
  name: "index",
  data() {
    return {
      radio: '1',
      allData: [],
      tableData: [],
      dialogFormVisible: false,
      menudialogFormVisible: false,
      dialogVisible: false,

      sortVisible: false,
      formData: {
        id: 0,
        name: '',
        icon: '',
        path: '',
        sort: 0,
        component: '',
        isLink: 0,
        parentId: 0,
        meta: {
          icon: "",
          title: "",
          menuId: 0
        }
      },
      pageForm: {
        name: '',
        page: 1,
        size: 10
      },
      sortdata: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      },
        {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2',
            children: [{
              id: 11,
              label: '三级 3-2-1'
            }, {
              id: 12,
              label: '三级 3-2-2'
            }, {
              id: 13,
              label: '三级 3-2-3'
            }]
          }]
        },
        {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2',
            children: [{
              id: 11,
              label: '三级 3-2-1'
            }, {
              id: 12,
              label: '三级 3-2-2'
            }, {
              id: 13,
              label: '三级 3-2-3'
            }]
          }]

        },

      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      formLabelWidth: '120px',
      editTitle: "",
      delete: {
        id: ''
      }
    }

  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$post(this.$api.deleteMenu, this.delete).then(responce => {
            if (responce.code === 200) {
              this.$message.success(responce.msg);
              this.handGetAll()
            } else {
              this.$message.error(responce.msg)
            }
          })
        })
        .catch(_ => {
        });
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    handleEdit(index, row) {
      console.log(row)
      this.delete = row.id
      this.editTitle = "编辑菜单"
      this.formData = row
      console.log( this.formData)
      this.dialogFormVisible = true

    },
    handleDeleteDialog(index, row) {
      this.dialogVisible = true
      this.delete.id = row.id

    },
    handleAdd(row) {
      this.menudialogFormVisible = true
      this.dialogFormVisible = true;
      if (row != null) {
        this.formData.parentId = row.id

      } else {
        this.formData.parentId = 0
      }
      this.editTitle = "新增菜单"
      this.formData.sort = 0
      this.formData.meta.icon = ''
      this.formData.meta.title = ''
      this.formData.component = ''
      this.formData.id = 0
      this.formData.name = ''
    },
    async handleAffdelete() {
      this.dialogVisible = false
      await this.$store.dispatch('menu/deleteById', this.delete.id)
      this.handGetAll()
    },
    //新增菜单
    handleAffAdd() {
      this.dialogFormVisible = false
      this.menudialogFormVisible = true

    },
    //编辑菜单
    handleAffEdit() {

      this.dialogFormVisible = false
      this.menudialogFormVisible = false
      this.$store.dispatch("menu/saveOrUp", this.formData).then(response => {
        this.handGetAll()
      })
    },
    //获取全部菜单

    handGetAll() {
      this.loading = true
      // this.getMenu();
      // getMenu(this.pageForm)
      // this.$store.dispatch('admin/getrule', this.pageForm)
      getMenu(this.pageForm).then(responce => {
        this.tableData = responce.data.data
        this.allData = responce.data.data
      })

    },

    //排序
    handleAffsort() {

      // this.sortVisible = false
    },
    handleCloseSort() {
      this.sortVisible = false
    },
    handleDragStart(node, ev) {

    },
    handleDragEnter(draggingNode, dropNode, ev) {

    },
    handleDragLeave(draggingNode, dropNode, ev) {

    },
    handleDragOver(draggingNode, dropNode, ev) {

    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {

    },
    handleDrop(draggingNode, dropNode, dropType, ev) {


    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.name === '二级 3-1') {
        return type !== 'inner';
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.name.indexOf('三级 3-2-2') === -1;
    }

  },
  created: function () {
    // this.getMenu();
    this.handGetAll();
  },
}


</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.handle-box {
  margin-bottom: 10px;
}

.tabla-box {
  overflow: hidden;
}
</style>