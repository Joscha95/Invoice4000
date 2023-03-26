<template>
	<label class="toggle" :title="bool ? tooltipOn : tooltipOff">
		<input type="checkbox" :checked="bool" @change="$emit('update:modelValue', $event.target.checked)">
		<span class="slider round">
			<span :class="bool ? '':'active'">
				<span>{{ off }}</span>
			</span>
			<span :class="bool ? 'active':''">
				<span>{{ on }}</span>
			</span>
		</span>
	</label>
</template>

<script>
export default {
	props: ['bool','on','off','tooltipOn','tooltipOff']
};
</script>
<style scoped>
.toggle {
	position: relative;
	display: inline-block;
	width: auto;
	user-select: none;
	vertical-align: top;
	color: inherit;
	margin-bottom: 0;
}
.iconToggle {
	line-height: 0;
}
.toggle input {
	display: none;
}
.slider {
	position: relative;
	cursor: pointer;
	overflow: hidden;
	box-sizing: border-box;
	display: block;
	height: 100%;
  background-color: white;
}
.round{
  border-radius:var(--border-radius-small);
}
.slider:hover {
	opacity: var(--hover-opacity);
}
.slider:after {
	position: absolute;
	content: '';
	height: 100%;
	width: 50%;
	left: 0;
	top: 0;
	background-color: black;
	transition: left .2s;
	z-index: 0;
	box-sizing: border-box;
	box-shadow: 0 0 5px rgba(0,0,0,0.5);
	border-right: var(--border);
}
.slider:hover:after, input:checked + .slider:hover:after {
	border-color: black;
}
.slider>span{
	position: relative;
	z-index: 1;
	padding: .5em 1em;
	display: inline-block;
	margin-right: -1px;
	box-sizing: content-box;
}
.slider span:not(.icon) {
	height: 100%;
}
.iconToggle .slider span:not(.icon) {
	padding: .7em 1em;
}
.slider>span.active{
	color: white;
}
input:checked + .slider:after {
	left: 50%;
}
</style>