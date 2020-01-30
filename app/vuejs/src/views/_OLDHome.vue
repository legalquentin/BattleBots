<template>
  <div id="home">

    <div class="ui inverted segment">
      <div class="ui page grid center aligned">
        <div class="one column row center aligned">
          <div class="column" v-if="joinGameFormDisplay">
            <h1 class="ui red huge header">Rejoindre une partie</h1>
          </div>
          <div class="column" v-else>
            <h1 class="ui red header">La partie va commencer ...</h1>
          </div>
        </div>
        <div v-if="joinGameFormDisplay" class="two column row center aligned">
          <div class="column center aligned">
            
            <SuiForm @submit.prevent inverted>
              <div class="ui field">
                <label style="color: white; text-align: left">Identifiant de la partie</label>
                <input type="text" placeholder="Identifiant de la partie" v-model="ref.gameid">
              </div>
              
              <button id="join-btn" class="ui red huge button" @click="connect">Rejoindre la partie</button>
            </SuiForm>

          </div>
          
        </div>

        <!-- <div v-else class="two column row"> -->
          <div class="column twelve wide">
            <!-- Game player -->
            <canvas ref="videoCanvas" id="videoCanvas" width="640" height="512" style="background-color: #85858573">
              <p>
                Please use a browser that supports the Canvas Element, like
                <a href="http://www.google.com/chrome">Chrome</a>,
                <a href="http://www.mozilla.com/firefox/">Firefox</a>,
                <a href="http://www.apple.com/safari/">Safari</a> or Internet Explorer 10
              </p>
            </canvas>

          </div>
          <div class="column four wide">
            
            <div class="ui large yellow progress">
              <div class="bar" :style="{width: batteryPercent + '%'}"></div>
              <div class="label" style="color: white">Energie</div>
            </div>
            <button id="terminate-btn" class="ui red button" @click="terminate">Terminer la partie</button>
          <!-- </div> -->
        </div>
    </div>
    </div>
    <SuiGrid>

      <SuiGridRow verticalAlign="top">
        <SuiGridColumn align="left" style="width: fit-content;">
          <!-- <canvas v-if="!joinGameFormDisplay" ref="videoCanvas" id="videoCanvas" width="640" height="512" style="background-color: #85858573">
            <p>
              Please use a browser that supports the Canvas Element, like
              <a href="http://www.google.com/chrome">Chrome</a>,
              <a href="http://www.mozilla.com/firefox/">Firefox</a>,
              <a href="http://www.apple.com/safari/">Safari</a> or Internet Explorer 10
            </p>
          </canvas> -->
          
          <!-- TODO : pass as component -->
          <br /><br />
        </SuiGridColumn>
      </SuiGridRow>
    </SuiGrid>    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import SocketService from '../utils/SocketService';
import Progress from '../templates/_ProgressBarTemplate.vue';
import jsmpeg from 'jsmpeg';
import Axios, {AxiosInstance} from 'axios';
const https = require('https');

interface Iref {
    gameid: string;
    userid: string;
    token: string;
};

type keyOpt = {
    [key: string]: boolean
}

@Component({
  components: {
    HelloWorld,
    Progress
  },

  props: [
    'gameData'
  ]
})
export default class Home extends Vue
{


  private ref: Iref ={
    gameid: '',
    userid: '',
    token: '',
  };

  private userId: number = 5;
  private joinGameFormDisplay: boolean = true;

  private videoCanvas?: HTMLCanvasElement = undefined;
  private videoCanvas2DContext?: CanvasRenderingContext2D | null = undefined;
  private socket: SocketService = new SocketService();
  private player?: string;
  private keys: keyOpt = {
    ArrowUp : false,
    ArrowDown : false,
    ArrowLeft : false,
    ArrowRight : false,
    Space: false  
  };

  private batteryPercent = 100;

  private id?: number;
  private secret?: string;
  private token?: string;

  public mounted()
  {
    const gameData: any = this.$route.params.gameData;
    console.log('GAMEDATA', gameData);
    if (gameData) {
      this.ref.gameid =gameData.data.id

      /*const parsedJson = JSON.parse(gameData.message);
      this.secret = parsedJson.secret;
      this.token = parsedJson.token;
      */
      this.joinGameFormDisplay = false;
      this.connect();
    }
  }

  private handleKeyEvents() {
    const allowed = Object.keys(this.keys);
    window.addEventListener('keydown', (e) => {
      if (allowed.includes(e.code) && this.keys[e.code] == false) {
        this.keys[e.code] = true;
        this.socket.send(e.keyCode, true);
      }
    });

    window.addEventListener('keyup', (e) => {
       if (allowed.includes(e.code) && this.keys[e.code] == true) {
         this.keys[e.code] = false;
          this.socket.send(e.keyCode, false);
       }
    });
  }
  
  
  private async connect()
  {
      this.joinGameFormDisplay = false;

      this.videoCanvas = this.$refs.videoCanvas as HTMLCanvasElement;
      this.videoCanvas2DContext = this.videoCanvas.getContext('2d');
    
      const joinWorkerUri = 'https://127.0.0.1:443/api/game/join';
      const axios = Axios.create({ headers: { 'Content-Type': 'application/json'} ,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })

      const agent = new https.Agent({  
        rejectUnauthorized: false
      });

      const resp = await axios.post(joinWorkerUri, {
        GameID: this.ref.gameid.toString(),
        PlayerID: this.userId + '',
      },  { httpsAgent: agent }
      );

      console.log(this.id)
      console.log(this.userId)

      console.log('JOIN RESP', resp);
      
      const token = resp.data.Token;

      const addr_cam = 'wss://127.0.0.1:443/api/bots/wscam?gameid='+this.ref.gameid+'&playerid='+this.userId+'&token='+token;
      const addr_ctrl = 'wss://127.0.0.1:443/api/bots/ws?gameid='+this.ref.gameid+'&playerid='+this.userId+'&token='+token;
      
      this.cam(addr_cam);
      this.socket.start(addr_ctrl).onerror = (event) => {
            this.joinGameFormDisplay = true;
            alert('SOCKET CONNECTION FAILED');
      };
      this.socket.getEventListener().on('message', (data) => {
          console.log(data);
      });
      this.socket.getEventListener().on('close', (e)=> {
        console.log('/The socket connection has been closed', e);
      });
      this.socket.getEventListener().on('open', (e)=> {
        console.log('/The socket connection has been established', e);
      });
      this.handleKeyEvents();

      
  }

  public cam(addr: string) {
     // TODO: change theses statics values with stuff recovered from game creation
    const client: WebSocket = new WebSocket(addr);
    this.player = new jsmpeg(client, { canvas: this.videoCanvas });
  }

  public async terminate() {
    if (this.ref.gameid == '') {
      return
    }
      const terminate = 'http://127.0.0.1/battle/' + this.ref.gameid;
      const axios = Axios.create({ headers: { 'Content-Type': 'application/json'} ,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })

      const agent = new https.Agent({  
        rejectUnauthorized: false
      });

      const resp = await axios.delete(terminate, { headers: {Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjUsInJvbGUiOiJST0xFX1VTRVIifQ.USstzodwyIxpFBHGY9tARQewcafO099sASMQMPfYhn0'}, httpsAgent: agent });
      this.$router.push('/');
  }
}
</script>

<style scoped lang="scss">
  #home {
    min-height: calc(100vh - 90px);
    background: linear-gradient(346deg, #616161, #000000);
    padding-top: 170px;

    .ui.inverted.segment {
      padding-top: 70px;
      padding-bottom: 70px
    }

    #join-btn {
      margin-top: 20px;
    }
  }

  
  #home video
  {
    background-color: dark;
    border: 1px solid #f2711c;
    box-shadow: 0 0 10px #f2711c; 
    background-color: black;
    width: 100%;

    border-radius: .28571429rem;
  }

  #home .ui.header
  {
    text-transform: uppercase;
  }

  #home .ui.segments
  {
    border: 1px solid #f2711c;
    box-shadow: 0 0 8px #f2711c;
  }

 .ui.inverted.orange.button
  {
    box-shadow: 0 0 8px #f2711c !important; 
  }

   .ui.inverted.yellow.button
  {
    box-shadow: 0 0 8px #f3d81c !important; 
  }

   .ui.inverted.red.button
  {
    box-shadow: 0 0 8px #db2828 !important; 
  }

   .ui.inverted.green.button
  {
    box-shadow: 0 0 8px #21ba45 !important; 
  }

  .ui.buttons {
    margin: 10px;
  }
</style>

