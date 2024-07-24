<script>
  import UserRow from '../../../src/lib/components/userRow.svelte';
	import CreateUserRow from '../../../src/lib/components/createUserRow.svelte';
	import axios from 'axios';
  import { onMount } from 'svelte';

  let groupName = '';
  let groupCreateStatus = '';
  let statusColor = '';
  let availableGroups;
  let showNewUserRow = true;
  let users;

  function handleUserCreated(event) {
    console.log(event)
    if (event.detail.success) {
      console.log('User creation succeeded!');
      showNewUserRow = true;
      // Handle success (e.g., show a success message, update UI)
    } else {
      console.error('User creation failed!');
      // Handle failure (e.g., show an error message, revert UI)
    }
    getAllGroups();
    getAllUsers();
  }

  async function createGroup() {
     try {
      const url = `http://localhost:3000/api/group/creategroup`;
      const headers = {
        'Content-Type': 'application/json'
      };
       if (!groupName) {
        groupCreateStatus = 'groupName is empty or undefined';
        statusColor = 'red';
      }
      await axios.post(url, {groupname: groupName}, { headers }).then(response => {
        console.log(response)
        if (response.status === 200) {
          groupCreateStatus = response.data.message;
          statusColor = 'green';
        }
      })
    } catch (error) {
      if (error) {
        groupCreateStatus = error.response.data.message;
        statusColor = 'red';
      }
    }
    getAllGroups();
    getAllUsers();
  }

  function handleInput(event) {
    groupName = event.target.value; 
  }

  async function getAllGroups() {
    try {
      const url = `http://localhost:3000/api/group/getAllGroups`;
      const headers = {
        'Content-Type': 'application/json'
      };
      await axios.get(url, { headers }).then(response => {
        console.log('get groups')
        console.log(response)
        if (response.status === 200) {
          availableGroups = response.data.data;
        }
      })
    } catch(error) {
      console.log(error);
    }
  }

  $: { 
    console.log('reactive statement')
    console.log(showNewUserRow) 
  }

  async function getAllUsers() {
    try {
      console.log('get users')
      const url = `http://localhost:3000/api/user/getAllUsers`;
      const headers = {
        'Content-Type': 'application/json'
      };
      await axios.get(url, { headers }).then(response => {
        if (response.status === 200) {
          users = response.data.data;
        }
      })
    } catch(error) {
      console.log(error);
    }
  }


  let dataLoaded = false;
  
  onMount(async () => {
    try {
      await getAllGroups();
      await getAllUsers();
      dataLoaded = true;
      console.log(users);
      console.log('All groups fetched:', availableGroups);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  });

</script>

<div>
  <h1 style="text-align:center;">User Management</h1>
  <div>
   <span>Enter Group Name: </span> 
   <input type="text" bind:value={groupName}> 
   <button on:click={createGroup} on:input={handleInput}>+ Create Group</button>
   <pre style="color: {statusColor}">{groupCreateStatus}</pre>
  </div>

<table style="border: 1px black solid; margin-top: 20px; text-align: center;">
  <thead>
    <tr>
      <th>Username</th>
      <th>Email</th>
      <th>Password</th>
      <th>Group</th>
      <th>Disabled</th>
      <th>Status</th>
      <th>Edit</th>
    </tr>
  </thead>
  <tbody>
    {#if dataLoaded}
      {#each users as user }
        <UserRow groups={user.groupnames} user={user} availableGroups={availableGroups}></UserRow>
      {/each}
  
      {#if showNewUserRow}
        <CreateUserRow on:userCreated={handleUserCreated} availableGroups={availableGroups}></CreateUserRow>
      {/if}
  
    {/if}
  </tbody>
</table>
</div>
