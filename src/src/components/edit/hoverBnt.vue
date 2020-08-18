
<template>
	<div>
		<button @dblclick="onClick" @mousedown="down" @touchstart="down" @mousemove="move" @touchmove="move" @mouseup="end" @touchend="end"  ref="fu" class="float">
			<i style="font-size: 40px;" class="el-icon-info"></i>
		</button>
	</div>
</template>
<script>
export default {
	name:'',
	data () {
		return {
			flags: false,//控制使用
			position: {
				x: 0,
				y: 0
			},
			nx: '',
			ny: '',
			dx: '',
			dy: '',
			xPum: '',
			yPum: ''
		}
	},
	methods:{
		down() {
			this.flags = true;
			var touch;
			if (event.touches) {
				touch = event.touches[0];
			} else {
				touch = event;
			}
			this.position.x = touch.clientX;
			this.position.y = touch.clientY;
			this.dx = this.$refs.fu.offsetLeft;
			this.dy = this.$refs.fu.offsetTop;
		},
		move() {
			if (this.flags) {
				var touch;
				if (event.touches) {
					touch = event.touches[0];
				} else {
					touch = event;
				}
				this.nx = touch.clientX - this.position.x;
				this.ny = touch.clientY - this.position.y;
				this.xPum = this.dx + this.nx;
				this.yPum = this.dy + this.ny;
				let width=window.innerWidth - this.$refs.fu.offsetWidth//屏幕宽度减去自身控件宽度
				let height=window.innerHeight - this.$refs.fu.offsetHeight//屏幕高度减去自身控件高度
				this.xPum < 0 && (this.xPum = 0)
				this.yPum < 0 && (this.yPum = 0)
				this.xPum > width && (this.xPum = width)
				this.yPum > height && (this.yPum = height)
				// if (this.xPum >= 0 && this.yPum >= 0 && this.xPum<= width &&this.yPum<= height) {
					this.$refs.fu.style.left = this.xPum + 'px';
					this.$refs.fu.style.top = this.yPum + 'px';
				// }
				//阻止页面的滑动默认事件
				document.addEventListener(
					'touchmove',
					function() {
						event.preventDefault();
					},
					false
				);
			}
		},
		//鼠标释放时候的函数
		end() {
			this.flags = false;
		},
		onClick(){
			//在这里我是作为子组件来使用的
			this.$emit('click1')
		}
	}
}
</script>

//这里使用了stylus的语法
<style scoped>
.float{
    position: absolute;
    right: 40px;
    top: 30%;
    touch-action: none ;
    display:flex;
    justify-content:center;
    align-items:center;
    width: 48px;
    height: 48px;
    border-radius: 24px;
    border-color: #F2F6FC;
    outline-color: #F2F6FC;
    line-height: 10px;
    background: rgba(147, 147, 243, 0.88);
    color: white;
    
  }
</style>

