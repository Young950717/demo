<!-- TableBodyRow.svelte -->
<script>
  import MultiSelect from 'svelte-multiselect';
  import axios from 'axios';

  let status = '';
  let statusColor = '';
  let selectedDisabled;
  export let user = {};
  export let groups = [];
  export let availableGroups = [];

  console.log(availableGroups);
  console.log(groups);

  let isEditing = false;

  function toggleEdit() {
    isEditing = !isEditing;
    status = '';
    statusColor = '';
  }

  async function editUser() {
    try {
      const url = `http://localhost:3000/api/user/adminUpdateUser`;
      const headers = {
        'Content-Type': 'application/json'
      };
      console.log(user);
      await axios.put(url, user, { headers }).then(response => {
      if (response.status === 200) {
        addUserGroup(user);
        selectedDisabled = user.disabled;
        status = response.data.message;
        statusColor = 'green';
        isEditing = false; 
      }
      })
    } catch(error) {
      status = error.response.data.message;
      statusColor = 'red';
    }
  }

  async function addUserGroup(user) {
    try {
      console.log('addUserGroup')
      const url = `http://localhost:3000/api/group/addUserGroup`;
      const headers = {
        'Content-Type': 'application/json'
      };
      const userGroup = {
        username: user.username,
        groups: user.groups
      }
      console.log(userGroup)
      await axios.post(url, userGroup, { headers }).then(response => {
        console.log(response)
      })
    } catch (error) {
      console.log(error)
    }
  }

  function handleGroupChange() {
    console.log('handle group change')
  }
</script>

<tr>
  {#if isEditing}
    <td>{user.username}</td>
    <td><input type="text" bind:value={user.email} /></td>
    <td><input type="password" bind:value={user.password} /></td>
    <td>
      <MultiSelect
        id="group"
        options={availableGroups.map(group => group.groupname)}
        allowUserOptions="append"
        selected={groups}
        on:change={handleGroupChange}
        on:add={handleGroupChange} />
    </td>
    <td>
      <select bind:value={selectedDisabled}>
        <option value="0">Enabled</option>
        <option value="1">Disabled</option>
      </select>
    </td>
    <td style="color: {statusColor}"><pre>{status}</pre></td>
    <td><button on:click={editUser}>Save</button></td>
  {:else}
    <td>{user.username}</td>
    <td>{user.email}</td>
    <td>{user.password}</td>
    <td>{user.groupnames}</td>
    <td>{user.disabled === 1 ? 'Disabled' : 'Enabled'}</td>
    <td style="color: {statusColor}"><pre>{status}</pre></td>
    <td><button on:click={toggleEdit}>Edit</button></td>
  {/if}
</tr>
