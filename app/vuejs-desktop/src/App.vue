<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">

body {
  box-sizing: border-box;
}

img[alt="www.000webhost.com"] {
  visibility: hidden;
}

.ui.progress .bar {
  min-width: 0em !important;
}

.bar {
  min-width: 0em !important;
}

#app {
  height: 100%;
  user-select: none;

  /*****************
   * Global Panels *
   *****************/

  #abstract-panel .body::-webkit-scrollbar-thumb {
    background-color: white;
  }

  #abstract-panel .body::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .huge-segment {
    background-color: rgb(66, 66, 66);
    color: white;
    margin-bottom: 0px;
    .sub.header {
      font-size: 16px;
    }
  }

  .footer .button {
    margin-right: 10px;
  }

  .body .row {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .rating {
    ::before {
      content: "\f1e2";
    }

    .active::before {
      color: #c0392b;
    }
    .icon {
      font-family: Icons;
    }
  }

  .card {
    overflow: hidden;
  }

  .card .image {
    object-fit: cover;
    height: 90px;
    min-width: 280px;
  }

  input,
  .card {
    // background-color: grey;
    border-radius: 5px;
    opacity: 0.6;
    box-shadow: 0 1px 3px 0 transparent, 0 0 0 1px transparent;
    transition: opacity linear 200ms;
  }

  .button {
    opacity: 0.6;
    transition: opacity linear 200ms;
    &:hover {
      opacity: 1;
    }
  }

  input:hover,
  .card:hover,
  .card.selected,
  input:focus {
    background-color: #f1f2f6;
    opacity: 1;
  }

  .logo img {
    color: red;
    visibility: visible;
    transition: visibility linear 2s;
  }

  @media (max-height: 540px) {
    .logo img {
      visibility: hidden;
    }
  }
}
</style>
