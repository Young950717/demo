<!-- TableBodyRow.svelte -->
<script>
  import MultiSelect from 'svelte-multiselect';
  import { createEventDispatcher } from 'svelte';
  import axios from 'axios';

  export let username = '';
  export let email = '';
  export let password = '';
  export let groups = [];
  export let disabled = false;
  export let availableGroups = [];

  let status = '';
  let statusColor = '';
  // const availableGroups = ['Admin', 'Moderator', 'User', 'Guest'];

  const dispatch = createEventDispatcher();

  async function createUser() {
    try {
      status = '';
      statusColor = '';
      const url = `http://localhost:3000/api/user/createUser`;
      const headers = {
        'Content-Type': 'application/json'
      };
      const user = {
        username: username,
        password: password,
        email: email,
        groups: groups,
        disabled: disabled
      }

      const response = await axios.post(url, user, {headers});
      const userGroupResponse = await addUserGroup(user);

      if (response.status === 200 && userGroupResponse.status === 200) {
          dispatch('userCreated', { success: true });
          status = response.data.message;
          statusColor = 'green';
      } else {
        status = response.data.message;
        statusColor = 'red';
      }
    } catch(error) {
      status = error.response.data.message
      statusColor = 'red';
      console.log(error)
    }
  }

  async function addUserGroup(user) {
    try{
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
      const response = await axios.post(url, userGroup, { headers });
      return response;
    } catch (error) {
      console.log(response)
      return error;
    }
  }

  function handleGroupChange(event) {
    let newGroup = event.detail.option;
    if (!groups.includes(newGroup)) {
      groups.push(newGroup);
    }
  }

  function handleGroupRemove(event) {
    let groupToRemove = event.detail.option;
    groups = groups.filter(item => item !== groupToRemove);
  }
</script>

<tr>
  <td><input type="text" bind:value={username} /></td>
  <td><input type="text" bind:value={email} /></td>
  <td><input type="password" bind:value={password} /></td>
  <td>
    <MultiSelect
    id="group"
    options={availableGroups.map(group => group.groupname)}
    selected={groups}
    on:add={(event) => {
      handleGroupChange(event)
    }}
    on:remove={(event) => {
      handleGroupRemove(event)
    }}
   />
  </td>
  <td>
    <select bind:value={disabled}>
        <option value="true">Disabled</option>
        <option value="false">Enabled</option>
    </select>
  </td>
  <td style="color: {statusColor}"><pre>{status}</pre></td>
  <td><button on:click={createUser}>Create User</button></td>
</tr>
