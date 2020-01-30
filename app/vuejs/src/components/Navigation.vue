<template lang="html">
    
    <div id="navigation">
        <SuiContainer>
            <SuiMenu pointing inverted>
            <SuiMenuItem>
                Test
            </SuiMenuItem>
            <SuiMenuMenu position="right">
                <SuiMenuItem>
                <SuiInput inverted transparent icon="search" placeholder="Search..." />
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

    #navigation .ui.menu
    {
        border-radius: .28571429rem;
        border: 1px solid #f2711c;
        box-shadow: 0 0 8px #f2711c;
    }
</style>
