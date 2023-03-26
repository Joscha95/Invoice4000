<template>
  <div>
    <h1>First Steps</h1>
    <h2>Import your Layout</h2>
    <p>To be able to export invoices as PDF you will need to import a layout first. You can do so like so:</p>
    <ol>
      <li>In Figma checkout <a href="">this Plugin</a> to create a default invoice and a qoute form. You can start with this to create your custom Invoice Layout.<br>Be sure to maintain the basic Layer-structure.</li>
      <li>Once you have created the layouts you will need the fileId from yor layout-file and fill it in the 'Figma File ID' Field in the settings</li>
      <li>Also you have to create a 'Figma Access token' in Figma. <a href="https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens">Checkout the figma Docs on how to do that.</a> Paste the token in the settings-field as well.</li>
      <li>Click 'load layout' and see if there are any errors. Be sure to keep the basic groups inside your figmnal file as specified in the Default Layout.</li>
      <li>Now you need to upload the font files and map them onto the fonts in the Layout</li>
      <li>And that's it! Now you can create and export invoices</li>
    </ol>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>