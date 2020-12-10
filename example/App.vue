<template src="./templates/app.template.html"></template>
<style src="./app.style.css" lang="css"></style>

<script>
export default {
  name: 'app',
  components: {
  },
  data: function () {
    return {
      isLoading: false
    };
  },
  methods: {
    async displayAlertModal() {
      await this.$modalDialogService.showAlert(`This is alert message`,
      `This is alert title`);
    },

    async displayConfirmationModal() {
      const confirmed = await this.$modalDialogService.showConfirmation(`This is confirmation message`,
      `This is confirmation title`, 
      {
        yesText: 'Yes',
        noText: 'No'
      });


      await this.$modalDialogService.showAlert(`You have selected ${confirmed ? 'Yes' : 'No'} button`,
      `Your Selection`);
    },

    async displayCustomModal() {
      const dialogComponent = await import('./dialog-components/custom-dialog-component.vue').then(_ => _.default);

      const dialogResult = await this.$modalDialogService.showModalDialog(dialogComponent, {
        isCenter: true,
        title: 'This is custom props'
      });

      await this.$modalDialogService.showAlert(`The dialog result is: '${dialogResult}'`, `Dialog Closed`);
    },
  }
}
</script>
