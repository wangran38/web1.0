<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="父级id" width="80px" align="center">
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





    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


  </div>
</template>
<script>
	//引入teacher.js文件
	import { getlist } from '@/api/admin/rules'  //.js可以省略
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
	//核心代码
	export default{
		// data:{
			
		// },  或使用下面的写法
		data(){  
			return{
      tableKey: 0,
      total: 0,
			list:null,  //接收接口返回的数据
      listLoading: true,
      listQuery: {
        limit: 20,
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
				this.teacherQuery = {};
				//空条件查询、
				this.getList()
			}
		}
	}
</script>

<style>
</style>

<!-- <script>
	//引入teacher.js文件
	import getlist from '@/api/admin/rules'  //.js可以省略
	//核心代码
	export default{
		// data:{
			
		// },  或使用下面的写法
		data(){  
			return{
      // tableKey: 0,
			list:null,  //接收接口返回的数据
      total: 0,
      listLoading: true,
      listQuery: {
        limit: 10,
        page: 1,
        title: undefined,
      }
			}
		},
		created(){  //页面渲染之前执行，一般用于调用methods中定义的方法
			this.getList();
		},
		methods:{  //定义具体的方法，调用teacher.js中的方法
    getList() {
      this.listLoading = true
      getlist(this.listQuery).then(response=>{
					console.log(response);
					this.list = response.data.listdata;
					this.total = response.data.totalnum;
				}).catch(error=>{
					console.log(error);
				})
    },
			//清空条件，并查询所有
			// resetData(){
			// 	//清空表单数据
			// 	this.listQuery = {};
			// 	//空条件查询、
			// 	this.getList()
			// }
		}
	}
</script> -->

