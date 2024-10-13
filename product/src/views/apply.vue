<template>
  <div>
    <el-card v-loading="showLoading">
      <h2 style="margin-bottom: 20px;">Apply for an Activity</h2>
      <el-form :model="form" ref="activityFormRef" :rules="rules" label-position="top" label-width="120px">
        <el-form-item label="Select Activity">
          <el-select v-model="form.id" autocomplete="off" @change="onSelect">
            <el-option v-for="(activity, i) in activitiesList" :key="i" :label="activity.title" :value="activity.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Start Time" prop="startTime">
          <el-date-picker style="width: 100%;" readonly v-model="form.startTime" type="datetime"
            placeholder="Auto fill after selecting the activity" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="End Time" prop="endTime">
          <el-date-picker style="width: 100%;" readonly v-model="form.endTime" type="datetime"
            placeholder="Auto fill after selecting the activity" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="Detail" prop="detail">
          <el-input readonly v-model="form.detail" type="textarea" :rows="10"
            placeholder="Auto fill after selecting the activity"></el-input>
        </el-form-item>
      </el-form>
      <div class="button-container">
        <el-button @click="cancelForm">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Submit</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import request from '@/utils/request';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
    const router = useRouter()
    const showLoading = ref(false)
    const activitiesList = ref([]);
    const form = ref({
      userId: '',
      title: '',
      startTime: '',
      endTime: '',
      detail: ''
    });

    const rules = {
      title: [{ required: true, message: 'Please input the title', trigger: 'blur' }],
      startTime: [{ required: true, message: 'Please select the start time', trigger: 'blur' }],
      endTime: [{ required: true, message: 'Please select the end time', trigger: 'blur' }],
      detail: [{ required: true, message: 'Please enter the detail', trigger: 'blur' }]
    };

    const activityFormRef = ref(null);

    const cancelForm = () => {
      form.title = '';
      form.startTime = '';
      form.endTime = '';
      form.detail = '';
    };

    const submitForm = () => {
      activityFormRef.value.validate(valid => {
        if (valid) {
          showLoading.value = true
          request.post('https://applies-fyoxpel6ba-uc.a.run.app', form.value).then(() => {
            alert('Activity submitted successfully!');
            showLoading.value = false
            cancelForm();
            router.push({ name: 'MyApply' })
          });
        }
      });
    };

    onMounted(async () => {
      showLoading.value = true
      await request.get('https://getallactivities-fyoxpel6ba-uc.a.run.app').then(data => {
        activitiesList.value = data
        showLoading.value = false
      });
    })

    return {
      form,
      rules,
      activityFormRef,
      cancelForm,
      submitForm,
      showLoading,
      activitiesList,
      onSelect: (id) => {
        form.value = {
          ...activitiesList.value.find(activity => activity.id === id),
          userId: userInfo.id
        };
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

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>