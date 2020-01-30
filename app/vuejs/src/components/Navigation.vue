<template lang="html">
    
    <div id="navigation">
        <SuiContainer id="nav-container">
            <div id="nav-overlay">
            </div>

            <SuiMenu pointing inverted id="menu">
                <SuiMenuItem>
                    Test
                </SuiMenuItem>

                <SuiMenuItem>
                    Test 2
                </SuiMenuItem>


                <SuiMenuMenu position="right">
                    <SuiMenuItem>
                        <SuiButton color="brown">Hello world</SuiButton>
                    </SuiMenuItem>

                    <SuiMenuItem>
                        <SuiButton color="blue">Hello world</SuiButton>
                    </SuiMenuItem>
                </SuiMenuMenu>
            </SuiMenu>
            
        </SuiContainer>
    </div>

</template>

<script lang="ts">
import Vue from 'vue'

class Navigation extends Vue
{
    public mounted()
    {

    }
}

export default Navigation;
</script>

<style scoped lang="postcss">
    #navigation
    {
        margin-top: 15px;
    }

    #navigation #menu
    {
        height: 60px;
        background-color: rgb(101,67,33, 0.45);
        margin-bottom: 70px;
        padding-right: 40px;
        border-radius: 5px;
        border-bottom: 4px solid rgb(101,67,33, 0.5);
        position: relative;

        
    }

    #navigation .item {
    color: rgba(255,255,255,.9);
    background-color: rgb(139, 40, 0);
    height: 60px;
    margin-top: 23px;
    border-radius: 0px 0px 4px 4px;
    border-left: none;
    border-bottom: 2px solid orangered;
    border-top: 2px solid rgb(101,67,33, 0.5);
    box-shadow: 0 8px 18px black;
    margin-left: 40px;
    }

    #navigation .button {
        background-image: url(https://www.transparenttextures.com/patterns/rocky-wall.png);
        filter: saturate(0.6);
    }

    #navigation .button:hover {
        filter: saturate(1);
        transition: filter .5s ease-in-out;
    }

    #navigation .item::before
    {
        content: ' ';
        width: 10px;
        height: 10px;
        position: absolute;
        left: -6px;
        top: -6px;
        background-image: radial-gradient(rgb(255,215,0) 0%, rgb(255,165,0) 40%);
        box-shadow: 5px 5px 13px rgba(0, 0, 0, 0.9);
        border-radius: 10px;
    }
    
    #navigation .item::after {
        content: ' ';
        width: 10px;
        height: 10px;
        position: absolute;
        left: 100%;
        right: 6px;
        top: -2px;
        border:none;
        z-index: 1;
        background-image: radial-gradient(rgb(255,215,0) 0%, rgb(255,165,0) 40%);
        box-shadow: 5px 5px 13px rgba(0, 0, 0, 0.9);
        border-radius: 10px;
        visibility: visible;
    }

    #navigation .item:first-child {
    }

    #navigation #nav-container
    {
        position: relative;
    }
</style>
