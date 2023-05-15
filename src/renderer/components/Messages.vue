<template>
  <ul>
  <transition-group name="messages-fade">
    <li v-for="(notification,i) in store.notifications" 
    :key="notification.id" 
    :style="`background-color:var(--${notification.message.type}-col); top: ${Math.min(i/3,1)*3}em;z-index:${5-i}`">
      <div class="inner">
        <p>{{ notification.message.text }}</p>
        <span @click="notification.kill()">x</span>
      </div>
      <div :class="{bg:true, isFirst:notification.isFirst}" v-if="notification.life" :style="`--duration:${notification.life/1000}s`"></div>
    </li>
  </transition-group>
  </ul>
</template>

<script>
import store from '../store'
export default {
  
  data(){
    return{
      store
    }
  },
  mounted(){
    // const notifications = [
    //   {type:'Warning',message:'Your Layout is not loaded'},
    //   {type:'Success',message:'Font uploaded'},
    //   {type:'Warning',message:'Your Layout is missing a Font'},
    //   {type:'Neutral',message:'No Font selected'},
    //   {type:'Error',message:'No Font selected'},
    //   ]
    // let ind = 0;
    // setInterval(()=>{
    //   if(ind > 6) return;
    //   const m = notifications[ind % notifications.length];
    //   this.store.notify(m.type,m.message);
    //   ind++;
    //   },1000);
  }
}
</script>

<style scoped>
 ul{
  list-style: none;
  position: absolute;
  margin: 0;
  padding:0;
  right:var(--site-padding);
  width: 20em;
  z-index: 200;
 }

 li{
  position: absolute;
  transform: translateY(0);
  border-radius:1em;
  /* min-width:100%; */
  padding: 0 1em;
  right:0;
  transition: top .2s ease;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  box-sizing: border-box;
  overflow: hidden;
 }

 li .inner{
  display: flex;
  align-items: center;
 }

 .inner p{
  flex:1;
  white-space: nowrap;
 }

 .inner span{
  cursor: pointer;
  flex:0;
  padding-left: .5em;
 }

 .bg{
  background-color: rgba(0,0,0,0.05);
  position: absolute;
  bottom:0;
  left:0;
  right:0;
  top:0;
  transform-origin: left center;
  animation: bg-fade var(--duration) linear;
  animation-play-state: paused;
 }

 .isFirst{
  animation-play-state: running;
 }

 @keyframes bg-fade {
  0%{
    transform: scaleX(0);
  }
  100%{
    transform: scaleX(1);
  }
 }

 .messages-fade-enter-active,
  .messages-fade-leave-active {
    transition: transform .3s ease, opacity .2s ease;
  }

  .messages-fade-enter-from,
  .messages-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  .messages-fade-enter-to,
  .messages-fade-leave-from {
    backdrop-filter: translateX(0);
    opacity: 1;
  }
</style>