<template src="./template.html">
    
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

import axios from 'axios';
import _ from 'lodash';

@Component
export default class RegisterFrame extends Vue {
    registerFields: { [key: string]: string } = {
        firstname: '',
        lastname: '',
        pseudo: '',
        email: '',
        address: '',
        password: '',
    };
    
    async register(): Promise<void> {
        try {
            const result = await axios.post('http://hardwar.ddns.net/api/users', _.clone(this.registerFields));
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
};

</script>