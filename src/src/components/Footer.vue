<template>
  <div class="footer">
    <p class="lh">
      <a class="text-color" target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802038310">
        <img src="../assets/beian.png" alt="" style="vertical-align:middle;"/>京公网安备11010802038310号
      </a>
    </p>
    <p class="lh"><a class="text-color" href="https://beian.miit.gov.cn" target="_blank">京ICP备2021037624号</a></p>
    <p class="lh"><span class="text-color">©2021&nbsp;个人学习测试&nbsp;</span></p>
    <p class="lh"><span class="text-color">Powered By <a class="text-color" target=_blank href="https://github.com/vuejs/vue">Vue</a></span></p>
  </div>
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
  background: #000;
  height: 25px;
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
