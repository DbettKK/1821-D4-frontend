<template>
<div class="img1">

  <div class="login_container">

  </div>
</div>

</template>

<script>
export default {
    data() {
      return {
        url: '../../assets/aut.jpg',
        urlList: [],
        timer: null
      }
    },
}
</script>

<style scoped>
    .img1{
      background-size: 100% 100%;
      background: url('../../assets/aut.jpg') center center no-repeat;
      height: 100%;
      position: fixed;
      width: 100%
  }
  .login_container {
  padding-top: 400px;
  padding-right: 400px;
  margin-right: 900px;
  background-color:#e4ddd0;
  
  opacity: 0.2;
  height:320px;
}
</style>