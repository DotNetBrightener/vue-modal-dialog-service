<template>
  <div class="modal-content dnb-confirm-dialog">
    <div class="modal-header" v-if="!!title">
      <h5 class="modal-title">
        {{ title }}
      </h5>
    </div>
    <div class="modal-body" v-html="message"></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary btn-yes" @click="yes">
        {{ yesText || $t("Button.Yes") }}
      </button>
      <button type="button" class="btn btn-light" @click="no">
        {{ noText || $t("Button.No") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["message", "title", "yesText", "noText"],
  methods: {
    yes () {
      this.closeModal(true);
    },
    no () {
      this.closeModal(false);
    }
  }
};
</script>

<style lang="scss" scoped>
.dnb-confirm-dialog {
  .modal-title {
    color: #0062bd;
  }
  .modal-header {
    border-bottom: 0 !important;
    padding-bottom: 0 !important;
  }

  .modal-body {
    padding: 15px !important;
  }

  .modal-footer {
    border-top: 0 !important;
    padding-top: 0 !important;

    button {
      padding: 4px 8px !important;
    }

    .btn-yes {
      background-color: #0062bd !important;
    }
  }
}
</style>
