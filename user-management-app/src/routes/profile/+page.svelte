<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  let editingEmail = false;
  let editingPassword = false;
  let user = {};
  let dataLoaded = false;
  let emailStatusMessage = '';
  let emailStatusColor = '';
  let passwordStatusMessage = '';
  let passwordStatusColor = '';

  function toggleEditEmail() {
    editingEmail = !editingEmail;
    passwordStatusColor = '';
    passwordStatusMessage = '';
    emailStatusMessage = '';
    emailStatusColor = '';
  }

  function toggleEditPassword() {
    editingPassword = !editingPassword;
    passwordStatusColor = '';
    passwordStatusMessage = '';
    emailStatusMessage = '';
    emailStatusColor = '';
  }

  async function saveEmailChanges() {
    try {
      console.log(user);
      const url = `http://localhost:3000/api/user/updateUserEmail/admin`;
      const headers = {
        'Content-Type': 'application/json'
      };
      await axios.put(url, user, { headers }).then(response => {
        if (response.status === 200) {
          toggleEditEmail();
          emailStatusMessage = response.data.message;
          emailStatusColor = 'green';
        }
      })
    } catch(error) {
      emailStatusMessage = error;
      emailStatusColor = 'red';
    }
  }

  async function savePasswordChanges() {
    try {
      console.log(user);
      const url = `http://localhost:3000/api/user/updateUserPassword/admin`;
      const headers = {
        'Content-Type': 'application/json'
      };
      await axios.put(url, user, { headers }).then(response => {
        console.log(response)
        if (response.status === 200) {
          toggleEditPassword();
          passwordStatusMessage = response.data.message;
          passwordStatusColor = 'green';
        }
      })
    } catch(error) {
      console.log(error.response.data.message);
      passwordStatusMessage = error.response.data.message;
      passwordStatusColor = 'red';
    }
  }

  async function getUser() {
    try {
      console.log('get user')
      const url = `http://localhost:3000/api/user/getByUsername/admin`;
      const headers = {
        'Content-Type': 'application/json'
      };
      await axios.get(url, { headers }).then(response => {
        if (response.status === 200) {
          user = response.data.data;
        }
      })
      // users = response.data.data;
    } catch(error) {
      console.log(error);
    }
  }

  onMount(async () => {
    try {
      await getUser();
      dataLoaded = true;
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  });

</script>

<div>
  <h1 style="text-align:center;">Profile</h1>

  {#if dataLoaded}
    <div>
      <div class="field-container">
        <span style="margin-right:20px">Email: </span>
        {#if editingEmail}
          <input type="email" id="email" bind:value={user.email} />
          <button style="margin-left:20px;" on:click={saveEmailChanges}>Confirm</button>
        {:else}
          <div>{user.email}</div>
          <button style="margin-left:20px;" on:click={toggleEditEmail}>Edit Email</button>
        {/if}
        <p style="margin-left:20px;color: {emailStatusColor}">{emailStatusMessage}</p>
      </div>
      <div class="field-container">
        <span style="margin-right:20px">Password: </span>
        {#if editingPassword}
          <input type="password" id="password" bind:value={user.password} />
          <button style="margin-left:20px;" on:click={savePasswordChanges}>Confirm</button>
        {:else}
          <div>{user.password}</div>
          <button style="margin-left:20px;" on:click={toggleEditPassword}>Edit Password</button>
        {/if}
        <pre style="margin-left:20px;color: {passwordStatusColor}">{passwordStatusMessage}</pre>
      </div>

    </div>
  {/if}

</div>

<style>
  .field-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }

  .field-container input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
</style>
