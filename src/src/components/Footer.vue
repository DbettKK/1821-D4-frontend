<template>
  <div class="footer">
    <p class="lh"><a class="text-color" href="https://beian.miit.gov.cn" target="_blank">京ICP备2021037624号</a></p>
    <p class="lh"><span class="text-color">©2021&nbsp;个人学习测试&nbsp;</span></p>
    <p class="lh"><span class="text-color">Powered By <a class="text-color" target=_blank href="https://github.com/vuejs/vue">Vue</a></span></p>
  </div>
<!--  <footer id="footer" class="inner">-->
<!--    -->
<!--    &copy; 2021&nbsp;-&nbsp; 个人学习测试 &nbsp;-&nbsp;-->
<!--    <a target="_blank" rel="nofollow noopener"-->
<!--        href="http://www.miitbeian.gov.cn/"-->
<!--        style="color: #666"-->
<!--    >京ICP备2021037624号</a>-->
<!--    <br> Powered by&nbsp;-->
<!--    <a target=_blank href="https://github.com/vuejs/vue">Vue2</a>-->
<!--  </footer>-->

</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style>
.footer {
  text-align: center;
  display: block;
  background: #fff;
  height: 39px;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding-top: 1px;
}
.lh {
  display: inline;
  margin-right: 20px;
  font-family: Consolas;
  color: #99a9bf;
}
.text-color {
  color: #99a9bf;
}
</style>
