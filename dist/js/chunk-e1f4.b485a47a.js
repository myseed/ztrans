(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e1f4"],{"09d1":function(t,e,n){"use strict";n.d(e,"a",function(){return i});var a=n("9bd2");function i(t){return Object(a["a"])({url:"/demo/business/table/1",method:"post",data:t})}},bb81:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("d2-container",[n("page-header",{ref:"header",attrs:{slot:"header"},on:{submit:t.handleSubmit},slot:"header"}),n("page-main",{attrs:{"table-data":t.table,loading:t.loading}}),n("page-footer",{attrs:{slot:"footer",current:t.page.current,size:t.page.size,total:t.page.total},on:{change:t.handlePaginationChange},slot:"footer"})],1)},i=[],o=n("c93e"),r=n("09d1"),l={name:"quotation-citywide",components:{PageHeader:function(){return n.e("8f61").then(n.bind(null,"8f61"))},PageMain:function(){return n.e("e532").then(n.bind(null,"e532"))},PageFooter:function(){return n.e("1454").then(n.bind(null,"1454"))}},data:function(){return{table:[],loading:!1,page:{current:1,size:100,total:0}}},methods:{handlePaginationChange:function(t){var e=this;this.$notify({title:"分页变化",message:"当前第".concat(t.current,"页 共").concat(t.total,"条 每页").concat(t.size,"条")}),this.page=t,this.$nextTick(function(){e.$refs.header.handleFormSubmit()})},handleSubmit:function(t){var e=this;this.loading=!0,this.$notify({title:"开始请求模拟表格数据"}),Object(r["a"])(Object(o["a"])({},t,{page:this.page})).then(function(t){e.loading=!1,e.$notify({title:"模拟表格数据请求完毕"}),e.table=t.list,e.page=t.page}).catch(function(t){e.loading=!1,e.$notify({title:"模拟表格数据请求异常"}),console.log("err",t)})}}},c=l,u=n("2877"),s=Object(u["a"])(c,a,i,!1,null,null,null);s.options.__file="index.vue";e["default"]=s.exports}}]);
//# sourceMappingURL=chunk-e1f4.b485a47a.js.map