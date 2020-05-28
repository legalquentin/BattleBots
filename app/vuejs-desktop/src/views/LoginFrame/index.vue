<template src="./template.html">
    
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

import axios from 'axios';
import _ from 'lodash';

@Component
export default class LoginFrame extends Vue {
    loginFields: { [key: string]: string } = {
        username: '',
        password: '',
    };
    
    mounted() {
        localStorage.removeItem('jwt');
    }

    async login(): Promise<void> {
        try {
            const result = await axios.post('http://hardwar.ddns.net/api/users/login', _.clone(this.loginFields));
            const jwt = _.get(result, 'data.data.data');
            if (!_.size(jwt)) {
                throw 'No JWT token exception';
            }

            localStorage.setItem('jwt', jwt);
            this.$router.push({ name: 'MainFrame' });
        } catch (error) {
            console.error(error);
        }
    }
};

</script>