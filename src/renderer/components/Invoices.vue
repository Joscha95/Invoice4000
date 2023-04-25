<template>
<div @click="store.newQuote(client)" class="button black" style="--bg-col:white;"> <span>+</span> </div>
<section v-for="(group, key) in invoicesGrouped" :key="key">
  <div class="sum">{{key}}: {{group.sum.toLocaleString('de-DE')}}E</div>
  <invoices-grid :invoices="group.invoices" :hideAdd="true"/>
</section>

    
</template>

<script>
    import store from '../store'
    import invoicesGrid from './subcomponents/invoices-grid.vue' 

    export default {
        data() {
            return {
                store,
                groupBy:1
            }
        },
        components: { invoicesGrid },
        computed:{
          invoicesGrouped(){
            const m = {};
            this.store.invoices.reverse().forEach(i => {
              const k = i.date.split('.')[this.groupBy+1];
              if(m[k]) {
                m[k].invoices.push(i);
                m[k].sum+=i.sum;
              } else{
                m[k] = {
                  invoices:[i],
                  sum:i.sum
                }
              }
            });
            return m;
          }
        }
    }
</script>

<style scoped>
section{
  margin-bottom: var(--site-padding);
}
.invoices{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
}
.sum{
  display: inline-block;
  height:2.5em;
  line-height: 2.5em;
  padding: 0 1em;
  box-sizing: border-box;
  background-color: var(--green-sum);
  /* border-radius: 1.5em; */
  font-family: diatype;
  margin: var(--site-padding) 0;
}

.button{
  float: right;
}

</style>