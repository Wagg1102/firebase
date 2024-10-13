<template>
  <div>
    <el-card v-loading="showLoading">
      <div style="margin-bottom: 20px;">
        <el-space>
          <el-button @click="addNewActivity" type="success">Add Activity</el-button>
          <el-button @click="exportCsv" type="warning">Export CSV</el-button>
          <el-space>
            <el-input v-model="query.search" placeholder="Search title"></el-input>
            <el-button @click="getActivities">search</el-button>
          </el-space>
        </el-space>
      </div>

      <el-table :data="activities.data" style="width: 100%">
        <el-table-column align="center" prop="id" label="ID"></el-table-column>
        <el-table-column align="center" prop="title" label="Title"></el-table-column>
        <el-table-column align="center" prop="startTime" label="Start Time"></el-table-column>
        <el-table-column align="center" prop="endTime" label="End Time"></el-table-column>
        <!-- 添加 Detail 列 -->
        <el-table-column align="center" label="Detail">
          <template #default="{ row }">
            <el-popover placement="top" width="300" trigger="hover">
              <p>{{ row.detail }}</p>
              <template #reference>
                <el-tag type="info">Detail</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Actions">
          <template #default="{ row }">
            <el-button @click="editActivity(row)" type="primary" size="small">Edit</el-button>
            <el-button @click="deleteActivity(row.id)" type="danger" size="small">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px;">
        <el-pagination :current-page="activities.page" :page-size="activities.pageSize" :total="activities.total"
          @current-change="onPage" background layout="prev, pager, next" />
      </div>

      <!-- Dialog for adding/editing activities -->
      <el-dialog :title="formTitle" v-model="dialogVisible" width="30%">
        <el-form :model="form" ref="activityFormRef" :rules="rules">
          <el-form-item label="Title" :label-width="formLabelWidth" prop="title">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Start Time" :label-width="formLabelWidth" prop="startTime">
            <el-date-picker v-model="form.startTime" type="datetime"
              placeholder="Select date and time"></el-date-picker>
          </el-form-item>
          <el-form-item label="End Time" :label-width="formLabelWidth" prop="endTime">
            <el-date-picker v-model="form.endTime" type="datetime" placeholder="Select date and time"></el-date-picker>
          </el-form-item>
          <!-- 添加 Detail 输入框 -->
          <el-form-item label="Detail" :label-width="formLabelWidth" prop="detail">
            <el-input v-model="form.detail" type="textarea" :rows="4" placeholder="Enter detail here"></el-input>
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
    const showLoading = ref(false);
    const activities = ref([]);
    const dialogVisible = ref(false);
    const query = reactive({
      page: 1,
      pageSize: 10,
      search_field: 'title'
    })
    const form = reactive({
      id: null,
      title: '',
      startTime: '',
      endTime: '',
      detail: '' // 新增 detail 属性
    });
    const formTitle = ref('Add Activity');
    const formLabelWidth = '120px';
    const rules = {
      title: [{ required: true, message: 'Please input the name', trigger: 'blur' }],
      startTime: [{ required: true, message: 'Please select the start time', trigger: 'blur' }],
      endTime: [{ required: true, message: 'Please select the end time', trigger: 'blur' }],
      detail: [{ required: true, message: 'Please enter the detail', trigger: 'blur' }] // 验证 detail 字段
    };

    const activityFormRef = ref(null);

    const getActivities = () => {
      showLoading.value = true;
      request.get('https://activities-fyoxpel6ba-uc.a.run.app', { params: query }).then(res => {
        activities.value = res;
        showLoading.value = false;
      });
    };

    const addActivity = (activity) => {
      request.post('https://activities-fyoxpel6ba-uc.a.run.app', activity).then(() => {
        getActivities();
        dialogVisible.value = false;
      });
    };

    const editActivity = (activity) => {
      form.id = activity.id;
      form.title = activity.title;
      form.startTime = activity.startTime;
      form.endTime = activity.endTime;
      form.detail = activity.detail; // 设置 detail 值
      formTitle.value = 'Edit Activity';
      dialogVisible.value = true;
    };

    const updateActivity = () => {
      request.put('https://activities-fyoxpel6ba-uc.a.run.app', form).then(() => {
        getActivities();
        dialogVisible.value = false;
      });
    };

    const deleteActivity = (id) => {
      request.delete(`https://activities-fyoxpel6ba-uc.a.run.app?id=${id}`).then(() => {
        getActivities();
      });
    };

    const addNewActivity = () => {
      form.id = null;
      form.title = '';
      form.startTime = '';
      form.endTime = '';
      form.detail = ''; // 清空 detail
      formTitle.value = 'Add Activity';
      dialogVisible.value = true;
    };

    const submitForm = () => {
      activityFormRef.value.validate(valid => {
        if (valid) {
          if (form.id) {
            updateActivity();
          } else {
            addActivity(form);
          }
        }
      });
    };

    onMounted(() => {
      getActivities();
    });

    const onPage = (page) => {
      query.page = page
      getActivities()
    }

    return {
      query,
      activities,
      dialogVisible,
      form,
      formTitle,
      formLabelWidth,
      rules,
      activityFormRef,
      editActivity,
      deleteActivity,
      addNewActivity,
      submitForm,
      showLoading,
      onPage,
      getActivities,
      exportCsv: () => {
        location.href = 'https://exportactivities-fyoxpel6ba-uc.a.run.app'
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