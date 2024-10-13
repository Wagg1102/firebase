<template>
  <div class="login-register-container">
    <el-tabs v-loading="showLoading" v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="Login" name="login">
        <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="email"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="role">
            <el-select v-model="loginForm.role" placeholder="role">
              <el-option label="admin" value="admin"></el-option>
              <el-option label="user" value="user"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitLoginForm">Login</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Register" name="register">
        <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" class="register-form">
          <el-form-item prop="email">
            <el-input v-model="registerForm.email" placeholder="email"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="registerForm.password" placeholder="password"
              autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input type="password" v-model="registerForm.confirmPassword" placeholder="confirm Password"
              autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="role">
            <el-select v-model="registerForm.role" placeholder="role">
              <el-option label="admin" value="admin"></el-option>
              <el-option label="user" value="user"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitRegisterForm">Register</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import { useRouter } from 'vue-router'
import request from '@/utils/request'
const showLoading = ref(false)
// 切换Tab时的处理函数
const activeName = ref('login');
const router = useRouter()

const handleTabClick = (tab, event) => {
  console.log(tab, event);
};

// 登录表单数据
const loginForm = reactive({
  email: '',
  password: ''
});

const loginFormRef = ref(null);

// 登录表单验证规则
const loginRules = reactive({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'blur' }
  ]
});

// 提交登录表单
const submitLoginForm = () => {
  if (!loginFormRef.value) return;
  loginFormRef.value.validate((valid) => {
    if (valid) {
      showLoading.value = true
      request.post('https://login-fyoxpel6ba-uc.a.run.app', loginForm)
        .then(response => {
          showLoading.value = false
          // 处理登录成功后的逻辑
          console.log('登录成功:', response);
          localStorage.setItem('user_info', JSON.stringify(response))
          ElMessage.success('登录成功');
          router.push({ name: 'Home' })
        })
        .catch(error => {
          showLoading.value = false
          ElMessage.error('登录失败，请检查邮箱或密码');
          console.error('登录失败:', error);
        });
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};

// 注册表单数据
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
});

const registerFormRef = ref(null);

// 注册表单验证规则
const registerRules = reactive({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      }, trigger: 'blur'
    }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'blur' }
  ]
});

// 提交注册表单
const submitRegisterForm = () => {
  if (!registerFormRef.value) return;
  registerFormRef.value.validate((valid) => {
    if (valid) {
      showLoading.value = true
      request.post('https://register-fyoxpel6ba-uc.a.run.app', registerForm)
        .then(response => {
          // 处理注册成功后的逻辑
          console.log('注册成功:', response.data);
          showLoading.value = false
          ElNotification({
            title: '成功',
            message: '注册成功',
            type: 'success'
          });
          activeName.value = 'login';
        })
        .catch(error => {
          showLoading.value = false
          ElNotification({
            title: '失败',
            message: '注册失败，请检查输入的信息',
            type: 'error'
          });
          console.error('注册失败:', error);
        });
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
</script>

<style lang="less" scoped>
.login-register-container {
  width: 400px;
  margin: 150px auto;
  box-shadow: 0 0 4px 1px #ccc;
  padding: 20px;
}

.login-form,
.register-form {
  margin-top: 20px;
}
</style>