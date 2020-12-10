<template>
    <div class="modal-content dnb-confirm-dialog">
        <div class="modal-header" v-if="!!title">
        <h5 class="modal-title">
            Your 'title' props will display here {{ title }}
        </h5>
        </div>
        <div class="modal-body">
            This is content of custom dialog
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-primary btn-yes" @click="button1Clicked">
            Button 1
        </button>
        <button type="button" class="btn btn-light" @click="button2Clicked">
            Button 2
        </button>
        </div>
    </div>
</template>
<script>
export default {
    props: [
        'title',
        'customContent'
    ],
    methods: {
        button1Clicked() {
            alert('you clicked button 1. It will not close the dialog');
        },

        button2Clicked() {
            alert('you clicked button 2. Now it will close the dialog');
            this.closeModal('this is response from custom dialog');
        }
    }
};
</script>