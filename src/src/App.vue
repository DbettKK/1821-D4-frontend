<template>
  <div id="app">
    <router-view v-if="isRouterActive"></router-view>
    <Footer/>
  </div>
</template>

<script>
import Footer from './components/Footer.vue';
export default {
  components:{
    Footer
  },
  provide(){
    return{
      reload: this.reload
    }
  },
  data(){
    return{
      isRouterActive: true
    }
  },
  created: function(){
    document.title = this.$route.meta.title || this.$route.meta.pathName
  },
  watch:{
    $route(){
      document.title = this.$route.meta.title || this.$route.meta.pathName
    }
  },
  methods: {
    reload(){
      this.isRouterActive = false;
      this.$nextTick(function () {
        this.isRouterActive = true;
      })
    }
  }
}
</script>

<style>

</style>
