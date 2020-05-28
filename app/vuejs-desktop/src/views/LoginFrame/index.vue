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
        localStorage.removeItem('userId');
    }

    async login(): Promise<void> {
        try {
            const result = await axios.post('http://hardwar.ddns.net/api/users/login', _.clone(this.loginFields));
            const jwt = _.get(result, 'data.data.data');
            if (!_.size(jwt)) {
                throw 'No JWT token exception';
            }

            localStorage.setItem('jwt', jwt);
            const Authorization = `Bearer ${jwt}`;
            const profile = await axios.get('http://hardwar.ddns.net/api/users/profile', { headers:  { Authorization }});

            localStorage.setItem('userId', _.get(profile, 'data.data.id'));
            this.$router.replace({ name: 'GamesListFrame' });
        } catch (error) {
            alert("Nom de compte ou mot de passe incorrect");
        }
    }
};

</script>