<template>
  <div>
    <el-card v-loading="showLoading">
      <div style="margin-bottom: 20px;">
        <el-space>
          <el-button @click="$router.push({ name: 'Apply' })" type="success">Add Apply</el-button>
          <div>The total average score of participation was: {{ avgRating.toFixed(2) }}</div>
        </el-space>
      </div>

      <el-table :data="applies.data" style="width: 100%">
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
        <el-table-column align="center" label="Rating">
          <template #default="{ row }">
            {{ row.rating || 0 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Actions">
          <template #default="{ row }">
            <el-button @click="ratingApply(row)" type="primary" size="small">Rating</el-button>
            <el-button @click="deleteApply(row.id)" type="danger" size="small">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px;">
        <el-pagination :current-page="applies.page" :page-size="applies.pageSize" :total="applies.total"
          @current-change="onPage" background layout="prev, pager, next" />
      </div>

      <el-dialog :title="formTitle" v-model="dialogVisible" width="30%">
        <el-form :model="form" ref="applyFormRef" :rules="rules">
          <el-form-item label="Rating" :label-width="formLabelWidth" prop="rating">
            <el-rate v-model="form.rating"></el-rate>
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
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
    const showLoading = ref(false);
    const applies = ref([]);
    const dialogVisible = ref(false);
    const avgRating = ref(0);
    const query = reactive({
      page: 1,
      pageSize: 10
    })
    const form = reactive({
      id: null,
      title: '',
      startTime: '',
      endTime: '',
      detail: ''
    });
    const formTitle = ref('Add Apply');
    const formLabelWidth = '120px';
    const rules = {
      rating: [{ required: true, message: 'Please select rating', trigger: 'blur' }]
    };

    const applyFormRef = ref(null);

    const getActivities = async() => {
      showLoading.value = true;
      applies.value = await request.get('https://applies-fyoxpel6ba-uc.a.run.app', { params: { ...query, search_field: 'userId', search: userInfo.id } })
      const mAllApplys = await request.get('https://getallapplys-fyoxpel6ba-uc.a.run.app', { params: { userId: userInfo.id } })
      let mAllRating = 0
      for (const apply of mAllApplys) {
        if (apply.rating) {
          mAllRating += apply.rating
        }
      }
      
      avgRating.value = mAllRating / mAllApplys.length
      showLoading.value = false;
    };

    const addApply = (apply) => {
      request.post('https://applies-fyoxpel6ba-uc.a.run.app', apply).then(() => {
        getActivities();
        dialogVisible.value = false;
      });
    };

    const ratingApply = (apply) => {
      form.id = apply.id
      form.title = apply.title
      form.startTime = apply.startTime
      form.endTime = apply.endTime
      form.detail = apply.detail
      dialogVisible.value = true
    };

    const updateApply = () => {
      request.put('https://applies-fyoxpel6ba-uc.a.run.app', form).then(() => {
        getActivities();
        dialogVisible.value = false;
      });
    };

    const deleteApply = (id) => {
      request.delete(`https://applies-fyoxpel6ba-uc.a.run.app?id=${id}`).then(() => {
        getActivities();
      });
    };

    const addNewApply = () => {
      form.id = null;
      form.title = '';
      form.startTime = '';
      form.endTime = '';
      form.detail = ''; // 清空 detail
      formTitle.value = 'Add Apply';
      dialogVisible.value = true;
    };

    const submitForm = () => {
      applyFormRef.value.validate(valid => {
        if (valid) {
          if (form.id) {
            updateApply();
          } else {
            addApply(form);
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
      applies,
      dialogVisible,
      form,
      formTitle,
      formLabelWidth,
      rules,
      applyFormRef,
      ratingApply,
      deleteApply,
      addNewApply,
      submitForm,
      showLoading,
      onPage,
      avgRating
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