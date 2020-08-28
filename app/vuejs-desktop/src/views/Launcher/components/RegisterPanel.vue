<template>
  <AbstractPanel name="ListGamesPanel">
    <template #header>
      <SuiGridRow>
        <SuiGridColumn>
          <SuiHeader inverted size="huge">Rejoindre Battlebots</SuiHeader>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #body>
      <SuiGridRow verticalAlign="middle" align="left" id="create-game-panel-body">
        <SuiGridColumn class="huge-column">
          <SuiSegment class="huge-segment" raised stacked="tall">
            <!-- <SuiHeader sub inverted style="margin-bottom: 15px">Ouvertes</SuiHeader> -->
            <sui-form inverted>
              <sui-form-field>
                <label>A provos de vous</label>
                <sui-form-fields fields="three">
                  <sui-form-field>
                    <SuiInput v-model="formModel.firstname" size="big" type="text" name="shipping[first-name]" placeholder="Prenom">
                    </SuiInput>
                  </sui-form-field>
                  <sui-form-field>
                    <SuiInput size="big" v-model="formModel.lastname" type="text" name="shipping[last-name]" placeholder="Nom" />
                  </sui-form-field>
                  <sui-form-field>
                    <SuiInput size="big" v-model="formModel.age" type="number" name="shipping[last-name]" placeholder="Age" />
                  </sui-form-field>
                </sui-form-fields>
              </sui-form-field>

              <sui-form-field>
                <label>Informations de connexion</label>
                <sui-form-fields fields="three">
                  <sui-form-field>
                    <SuiInput size="big" v-model="formModel.pseudo" type="text" name="shipping[first-name]" placeholder="Nom d'utilisateur / pseudo" />
                  </sui-form-field>
                  <sui-form-field>
                    <SuiInput size="big" v-model="formModel.password" type="password" name="shipping[last-name]" placeholder="Mot de passe" />
                  </sui-form-field>
                  <sui-form-field>
                    <SuiInput size="big" v-model="formModel.passwordConf" type="password" name="shipping[last-name]" placeholder="Confirmation du mot de passe" />
                  </sui-form-field>
                </sui-form-fields>
              </sui-form-field>
              <sui-form-field>
                <label>Pour vous contacter</label>
                <sui-form-fields>
                  <sui-form-field width="ten">
                    <SuiInput size="big" v-model="formModel.email" type="text" name="shipping[address]" placeholder="adresse@eemail.com" />
                  </sui-form-field>
                  <sui-form-field width="six">
                    <SuiInput size="big" v-model="formModel.address" type="text" name="shipping[address-2]" placeholder="10 rue du pont Paris" />
                  </sui-form-field>
                </sui-form-fields>
              </sui-form-field>
            </sui-form>
          </SuiSegment>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #footer>
      <SuiGridRow :columns="2">
        <SuiGridColumn align="right" :width="12">
          <SuiButton @click="$router.push({ name: 'LoginPanel' })" basic inverted style="box-shadow: none !important">
            Deja un compte ?
          </SuiButton>
        </SuiGridColumn>
        <SuiGridColumn align="right" :width="4">
          <SuiButton
            @click="register"
            size="huge"
            style="border: 2px solid rgb(21,77,117); color: white; background: background: rgb(8,73,177);
background: linear-gradient(180deg, rgba(8,73,177,1) 0%, rgba(39,115,134,1) 43%, rgba(39,115,134,1) 49%, rgba(39,115,134,1) 55%, rgba(22,51,128,1) 100%);"

          >S'inscrire</SuiButton>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
  </AbstractPanel>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import AbstractPanel from "./AbstractPanel.vue";
import { Global } from "@/Global";
import _ from 'lodash';

@Component({ components: { AbstractPanel } })
export default class RegisterPanel extends Vue {
  private $store!: Global;
  private formModel: {
    firstname: string;
    lastname: string;
    pseudo: string;
    age: number|null;
    password: string;
    passwordConf: string;
    email: string;
    address: string;
  } = {
    firstname: '',
    lastname: '',
    pseudo: '',
    age: null,
    password: '',
    passwordConf: '',
    email: '',
    address: '',
  }
  private isCreateGame: boolean|string = false;

  created(): void {
    this.$store = this.$global;
  }

  mounted(): void {
    this.isCreateGame = !!this.$route.params.isCreateGame;
  }

  async register(): Promise<void> {
    this.isCreateGame = this.$route.params.isCreateGame;
    await this.$api.register(_.clone(this.formModel));
    this.$router.push({ name: 'LoginPanel', params: { isCreateGame: this.isCreateGame as string } });
  }
}
</script>

<style lang="less">
#list-games-panel-body-closed {
  margin-top: 10px;

  
}

#create-game-panel-body,
#list-games-panel-body-closed {
  .card .ui.grid {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .rating {
    margin-left: 20px;
  }

  @media (max-width: 807px) {
    .card .ui.grid .column {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    .rating {
      margin-left: 0px;
    }
  }
}
</style>

<style lang="less" scoped>
  .huge-segment {
    padding-top: 0px !important;
  }
  label {
    margin-top: 30px !important
  }
</style>