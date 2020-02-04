<template>
    <div>

        <input v-model="merlin" type="text" name="Merlin" placeholder="Coucou" />
        <button @click="onFuirClick($event)" :value="merlin">Fuir</button>
        <!-- <Gerard :age="characterAge" /> -->
    </div>
</template>


<script>
    import { Vue, Component, Watch } from 'vue-property-decorator';
    // import Gerard from '../components/Gerard';

    @Component({
        // props: {  },
        // components: { Gerard }
    })
    export default class CocoAstictot extends Vue {
        merlin = "Salut";
        
        mounted() {
            this.merlin = "Salut";
        }

        @Watch('merlin')      
        watchMerlin(valeur, prev) {
            console.log(this.merlin);
        }

        onFuirClick() {
            alert("Je fuis !");
        }

    }



</script>