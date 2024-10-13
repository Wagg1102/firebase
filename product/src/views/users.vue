<template>
  <div>
    <el-card v-loading="showLoading">
      <div style="margin-bottom: 20px;">
        <el-space>
          <el-button @click="addNewUser" type="success">Add User</el-button>
          <el-button @click="exportCsv" type="warning">Export CSV</el-button>
          <el-space>
            <el-input v-model="query.search" placeholder="Search email"></el-input>
            <el-button @click="getUsers">search</el-button>
          </el-space>
        </el-space>
      </div>

      <el-table :data="users.data" style="width: 100%">
        <el-table-column align="center" prop="id" label="ID"></el-table-column>
        <el-table-column align="center" prop="email" label="Email"></el-table-column>
        <el-table-column align="center" prop="role" label="Role"></el-table-column>
        <el-table-column align="center" label="Actions">
          <template #default="{ row }">
            <el-button @click="editUser(row)" type="primary" size="small">Edit</el-button>
            <el-button @click="deleteUser(row.id)" type="danger" size="small">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px;">
        <el-pagination :current-page="users.page" :page-size="users.pageSize" :total="users.total"
          @current-change="onPage" background layout="prev, pager, next" />
      </div>

      <!-- Dialog for adding/editing users -->
      <el-dialog :title="formTitle" v-model="dialogVisible" width="30%">
        <el-form :model="form" ref="userFormRef" :rules="rules">
          <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Password" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Role" :label-width="formLabelWidth" prop="role">
            <el-select v-model="form.role" placeholder="role">
              <el-option label="admin" value="admin"></el-option>
              <el-option label="user" value="user"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitForm">Confirm</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import request from '@/utils/request';

export default {
  setup() {
    const showLoading = ref(false)
    const users = ref([]);
    const dialogVisible = ref(false);
    const form = reactive({
      id: null,
      name: '',
      email: ''
    });
    const formTitle = ref('Add User');
    const formLabelWidth = '120px';
    const rules = {
      password: [{ required: true, message: 'Please input the password', trigger: 'blur' }],
      email: [{ required: true, message: 'Please input the email', trigger: 'blur' }],
      role: [{ required: true, message: 'Please select the role', trigger: 'blur' }]
    };
    const query = reactive({
      page: 1,
      pageSize: 10,
      search_field: 'email'
    })
    const userFormRef = ref(null);

    const getUsers = () => {
      showLoading.value = true
      request.get('https://users-fyoxpel6ba-uc.a.run.app', { params: query }).then((res) => {
        users.value = res;
        showLoading.value = false
      });
    };

    const addUser = (user) => {
      request.post('https://users-fyoxpel6ba-uc.a.run.app', user).then(() => {
        getUsers();
        dialogVisible.value = false;
      });
    };

    const editUser = (user) => {
      form.id = user.id;
      form.role = user.role;
      form.email = user.email;
      form.password = user.password;
      formTitle.value = 'Edit User';
      dialogVisible.value = true;
    };

    const updateUser = () => {
      request.put('https://users-fyoxpel6ba-uc.a.run.app', form).then(() => {
        getUsers();
        dialogVisible.value = false;
      });
    };

    const deleteUser = (id) => {
      request.delete(`https://users-fyoxpel6ba-uc.a.run.app?id=${id}`).then(() => {
        getUsers();
      });
    };

    const addNewUser = () => {
      form.id = null;
      form.role = '';
      form.password = '';
      form.email = '';
      formTitle.value = 'Add User';
      dialogVisible.value = true;
    };

    const submitForm = () => {
      userFormRef.value.validate(valid => {
        if (valid) {
          if (form.id) {
            updateUser();
          } else {
            addUser(form);
          }
        }
      });
    };

    onMounted(() => {
      getUsers()
    })

    const onPage = (page) => {
      query.page = page
      getUsers()
    }

    return {
      query,
      getUsers,
      users,
      dialogVisible,
      form,
      formTitle,
      formLabelWidth,
      rules,
      userFormRef,
      editUser,
      deleteUser,
      addNewUser,
      submitForm,
      showLoading,
      onPage,
      exportCsv: () => {
        location.href = 'https://exportusers-fyoxpel6ba-uc.a.run.app'
      }
    };
  }
};
</script>

<style scoped>
.el-card {
  margin: 20px;
  padding: 20px;
}
</style>
