<template>
<div>
<table class="split-big-table">
    <thead>
      <tr>
        <th v-if="checkFlag">
          <input 
            class="table-check" 
            v-model="checkTotal"  
            type="checkbox" 
            @click="checkTotalSwitch(checkTotal)"/>
        </th>
        <th v-for="(item,index) in headData" :key="index">{{item}}</th>
        <th v-if="operFlag">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,index) in bodyData" :key="index">
        <td v-if="checkFlag">
          <input 
            class="table-check" 
            v-model="checkArr[index]"  
            type="checkbox" 
            @click="checkSwitch(checkArr,index)"/>
        </td>
        <td v-for="(itemTd,indexTd) in item" :key="indexTd">
          <span v-if="!(itemTd instanceof Array)">
            <input 
              v-if="tableEditFlag" 
              type="text" 
              class="table-inp" 
              :value="itemTd" 
              @blur="blurEditInp(index,indexTd,false,$event)"/>
            <span v-else>{{itemTd}}</span>
          </span>
          <table v-else class="split-samll-table">
            <tr v-for="(smallItem,smallIndex) in itemTd" :key="smallIndex">
              <input 
                v-if="tableEditFlag" 
                type="text" 
                class="table-inp" 
                :value="smallItem" 
                @blur="blurEditInp(index,indexTd,smallIndex,$event)"/>
              <span v-else>{{smallItem}}</span>
            </tr>
          </table>
        </td>
        <td class="table-operate" v-if="operFlag">
          <slot name="operate" :rowData="item"></slot>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
export default{
name:'splitTable',

props:{
  headData:{
    required:true,
    type:Array,
    default:[]
  },

  bodyData:{
    required:true,
    type:Array,
    default:[]
  },

  checkFlag:{
    type:Boolean,
    default:true
  },

  tableEditFlag:{
    type:Boolean,
    default:true
  },

  operFlag:{
    type:Boolean,
    default:true
  },
},

data(){
return{
  checkTotal:false,
  checkArr:[],
  multipleData:[],
  multipleIndex:[]
}
},

created(){
  this.headData.map((item,index)=>{
    this.checkArr.push(false)
  })
},

methods:{
  // 总的check切换
  checkTotalSwitch(val){
    setTimeout(()=>{
    this.checkArr.map((item,index)=>{
      this.$set(this.checkArr,index,this.checkTotal);
    });
    //判断是否全选
    if(this.checkTotal){
      this.multipleData=this.bodyData;
    }else{
      this.multipleData=[];
    }
    //将multipleData值传入父组件
    this.$emit('multipleData',this.multipleData);
    },2)
  },

  // 单个check切换
  checkSwitch(val,valIndex){
    setTimeout(()=>{
      this.checkTotal=val.every(item=>{
        return item===true;
      })
    //将选中的项取出来,通过索引取项
    if(val[valIndex]){
      this.multipleIndex.push(valIndex);
      this.multipleIndex=this.multipleIndex.sort();
    }else{
      this.multipleIndex.splice(valIndex,1);
    }
    this.multipleIndex.map((item,index)=>{
      this.$set(this.multipleData,index,this.bodyData[item])
    })
    //将multipleData值传入父组件
    this.$emit('multipleData',this.multipleData);
    },0)
  },

  //编辑失焦
  blurEditInp(index,key,arrIndex,e){
    if(arrIndex!==false){
      this.$set(this.bodyData[index][key],arrIndex,e.target.value);
    }else{
      this.bodyData[index][key]=e.target.value;
    }
    //将编辑的值传入父组件
    this.$emit('editData',this.bodyData);
  }
}

}
</script>

<style scoped>
.split-big-table,.split-samll-table {
  width: 100%;
  border: 1px solid #dfe6ec;
  border-collapse: collapse;
}

th{
  padding:12px 5px;
  line-height: 23px;
  background:#F5F7FA;
  color: #909399;
  font-weight: 500;
}

tr{
  color: #606266;
}

tr:hover{
  cursor:pointer;
  background:#F5F7FA;
}

td,th{
  text-align:left;
  border: 1px solid #dfe6ec;
}

.split-samll-table{
  margin:-1px;
  border:none;    
}

.split-samll-table tr{
  line-height: 23px;
  border-bottom: 1px solid #dfe6ec;
}

.split-samll-table tr:last-child{
  border-bottom: none;
}

/* 编辑输入框 */
.table-inp{
  margin:5px 0;
  padding:5px;
  border: 1px solid #ffffff;
}

tr:hover .table-inp{
  border: 1px solid #dfe6ec;
}

/* 操作列 */
.table-operate span{
  margin-left:10px;
  color: #409eff;
}
</style>