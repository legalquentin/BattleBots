<template>
  <sui-modal basic v-model="isOpen" scrolling>
    <sui-modal-header>Replay</sui-modal-header>
    <sui-modal-content scrolling>
      <sui-modal-description style="color: black">
        <SuiSegment raised inverted secondary compact style="padding: 2px; padding-right: 1px; padding-bottom: 0px; margin: 0 auto">
          <SuiGrid textAlign="center">
            <SuiGridRow>
              <SuiGridColumn>
                
                  <canvas
                    class="ui segment raised"
                    ref="videoCanvas"
                    id="videoCanvas"
                    width="622"
                    height="370"
                    style="background-color: #85858573; width: 622px; height: 370px; margin: 0 auto"
                  >
                    <p>
                      Please use a browser that supports the Canvas Element, like
                      <a
                        href="http://www.google.com/chrome"
                      >Chrome</a>,
                      <a href="http://www.mozilla.com/firefox/">Firefox</a>,
                      <a href="http://www.apple.com/safari/">Safari</a> or Internet Explorer 10
                    </p>
                  </canvas>
                
              </SuiGridColumn>
            </SuiGridRow>
          </SuiGrid>
        </SuiSegment>
      </sui-modal-description>
    </sui-modal-content>
    <sui-modal-actions>
      <sui-button @click.native="isOpen = false">Fermer</sui-button>
    </sui-modal-actions>
  </sui-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import AVue from "../../views/AVue";
import jsmpeg from 'jsmpeg';

@Component
export default class ReplayModal extends AVue {
  @Prop({ default: false }) isOpen!: Boolean;
  energy = 100;
  interval: any = null;

  displayed(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      if (this.energy === 0) {
        this.energy = 100;
      }
      if (this.isOpen) {
        this.energy -= 5;
      }
    }, 1000);
  }

  @Watch("isOpen")
  onChange() {
    if (!this.isOpen) {
      this.$emit("update:isOpen", false);
    }
  }

  @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;
  disconnectModal: boolean = false;
  
  mounted() {
    console.log("EndOfGameFrame > mounted");
    const player = new jsmpeg('https://qlg-demo-bucket.s3.eu-central-1.amazonaws.com/a14f5f9f-cf0c-4400-95e3-ba645adf5b48.ts?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWN2ZPWNZAA5KB57X%2F20200618%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20200618T125647Z&X-Amz-Expires=7200&X-Amz-Signature=590dade779a64bc000339249e226f5d5a5c649b45f3914f6fce3485b2fa26f37&X-Amz-SignedHeaders=host', {canvas: this.videoCanvas, seekable: true});
  }
}
</script>