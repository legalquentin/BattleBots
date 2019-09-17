<template>
  <div id="home">
    
    <SuiGrid>

      <SuiGridRow verticalAlign="middle">
        <SuiGridColumn align="right">
          <canvas ref="videoCanvas" id="videoCanvas" width="640" height="512" style="background-color: #85858573">
            <p>
              Please use a browser that supports the Canvas Element, like
              <a href="http://www.google.com/chrome">Chrome</a>,
              <a href="http://www.mozilla.com/firefox/">Firefox</a>,
              <a href="http://www.apple.com/safari/">Safari</a> or Internet Explorer 10
            </p>
          </canvas>
          
          <!-- TODO : pass as component -->
          <br /><br />
          <div is="sui-button-group">
            <sui-button inverted color="orange" icon="microphone"></sui-button>
            <sui-button inverted color="orange" icon="expand" labelPosition="right">Plein écran</sui-button>
          </div>

        </SuiGridColumn>
      </SuiGridRow>

      <SuiGridRow verticalAlign="top" :columns="2">
        <SuiGridColumn :size="10">
          <SuiSegments>
            <SuiSegment inverted>
              <SuiHeader inverted color="orange" size="small">Je suis un titre</SuiHeader>
            </SuiSegment>
            <SuiSegment emphasis="secondary" color="orange">Je peux afficher ce que je veux ici</SuiSegment>
          </SuiSegments>
        </SuiGridColumn>
        <SuiGridColumn :size="6">
          <SuiSegments>
            <SuiSegment inverted>
              <SuiHeader inverted color="orange" size="small">Je suis un titre</SuiHeader>
            </SuiSegment>
            <SuiSegment emphasis="secondary" color="orange">Je peux afficher ce que je veux ici</SuiSegment>
          </SuiSegments>
        </SuiGridColumn>
      </SuiGridRow>

    </SuiGrid>
    

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import jsmpeg from '../types/Jsmpeg';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue
{
  private videoCanvas?: HTMLCanvasElement = undefined;
  private videoCanvas2DContext?: CanvasRenderingContext2D | null = undefined;

  private player?: string;

  public mounted()
  {
    this.videoCanvas = this.$refs.videoCanvas as HTMLCanvasElement;
    this.videoCanvas2DContext = this.videoCanvas.getContext('2d');

    this.connect();
  }

  private connect()
  {
    const client: WebSocket = new WebSocket('ws://109.18.98.238:8084/');
    this.player = new jsmpeg(client, { canvas: this.videoCanvas });
  }
}
</script>

<style scoped>
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

  #home .ui.buttons
  {
    box-shadow: 0 0 8px #f2711c;
  }
</style>

