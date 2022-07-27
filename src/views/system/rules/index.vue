<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="resetData">
        清空
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
       添加菜单
      </el-button>
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
      下载表格
      </el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        展开列表
      </el-checkbox>-->
      <br/> <br/>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="id" width="80px" align="center">
        <template slot-scope="{row}" >
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="父级id" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
     <el-table-column label="菜单名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

       <el-table-column label="页面路由" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pathname }}</span>
        </template>
      </el-table-column>

        <el-table-column label="菜单路由" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单图标" width="110px" align="center" >
        <template slot-scope="{row}">
<span><i :class="row.icon" width="100%"></i></span>
        </template>
      </el-table-column>
        <el-table-column label="菜单类型" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

       <el-table-column label="是否有子菜单" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ismenu }}</span>
        </template>
      </el-table-column>

       <el-table-column label="菜单排序" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.weigh }}</span>
        </template>
      </el-table-column>
       <el-table-column label="菜单状态" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createtime | parseTime('{Y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <!--<el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            详细
          </el-button>-->
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>-->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>




    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


  </div>
</template>
<script>
	//引入teacher.js文件
	import { getlist, delrules } from '@/api/admin/rules'  //.js可以省略
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'

	//核心代码
	export default{
  components: { Pagination }, //分页
  directives: { waves }, //点击水波纹
		// data:{
			
		// },  或使用下面的写法
		data(){  
			return{
      tableKey: 0,
      total: 0,
			list:null,  //接收接口返回的数据
      listLoading: true,
      listQuery: {
        limit: 10,
        page: 1,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
			}
		},
		created(){  //页面渲染之前执行，一般用于调用methods中定义的方法
			this.getList();
		},
		methods:{  //定义具体的方法，调用teacher.js中的方法
			getList(){  //不用写axios发送请求，vue进行了封装，直接调用api中的方法即可			
			    getlist(this.listQuery)
				.then(response=>{
					// console.log(response);
					this.list = response.data.listdata;
					this.total = response.data.totalnum;
                  setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
				})
				.catch(error=>{
					console.log(error);
				})
			},
			//清空条件，并查询所有
			resetData(){
				//清空表单数据
				this.listQuery = {
        limit: 10,
        page: 1,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
        };
				//空条件查询、
				this.getList()
			},
      handleFilter() {
      this.listQuery.page = 1
      this.getList()
      },
      handleDelete(row, index) {
        
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },

		}
	}
</script>

<style>
</style>


