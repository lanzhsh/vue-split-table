import SplitTable from './vue-split-table.vue';
export default SplitTable;
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('splitTable', SplitTable);
}
