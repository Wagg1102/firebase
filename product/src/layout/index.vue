<template>
  <el-container class="app-container">
    <!-- Header -->
    <el-header class="app-header">
      <h2 class="app-title">Welcome to use firebase cloud functions</h2>
      <div class="header-actions">
        <div>Welcome：{{ userInfo.email }}, Your role: {{ userInfo.role }}</div>
        <el-button type="danger" size="small" @click="logoutHandler">Logout</el-button>
      </div>
    </el-header>

    <el-container class="main-container">

      <el-aside width="200px" class="sidebar">
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @select="handleSelect">
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span slot="title">Home</span>
          </el-menu-item>
          <el-menu-item v-if="userInfo.role === 'admin'" index="/users">
            <i class="el-icon-user"></i>
            <span slot="title">Users Admin</span>
          </el-menu-item>
          <el-menu-item v-if="userInfo.role === 'admin'" index="/activities">
            <i class="el-icon-menu"></i>
            <span slot="title">Activities Admin</span>
          </el-menu-item>
          <el-menu-item v-if="userInfo.role === 'user'" index="/apply">
            <i class="el-icon-menu"></i>
            <span slot="title">Apply Activitiy</span>
          </el-menu-item>
          <el-menu-item v-if="userInfo.role === 'user'" index="/myApply">
            <i class="el-icon-menu"></i>
            <span slot="title">My Apply</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Content Area -->
      <el-main class="content-area">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem('user_info') || '{}')
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(key);
    },
    logoutHandler() {
      localStorage.clear()
      this.$router.push({ name: 'Login' })
    }
  },
  mounted() {
    if (!this.userInfo.id) {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  border-radius: 8px;
}


.app-header {
  background-color: #409eff;
  /* 使用Element UI的主题色作为背景 */
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  /* 稍微加点内边距 */
}

.app-title {
  margin: 0;
  font-size: 18px;
  margin-right: auto;
  /* 让标题居左，按钮居右 */
}

.header-actions {
  display: flex;
}

.header-actions .el-button {
  margin-left: 10px;
  /* 按钮间稍微隔开 */
}

.header {
  background-color: #f5f7fa;
  padding: 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.sidebar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-menu-vertical-demo .el-menu-item:hover {
  background-color: #eef1f6;
}

.content-area {
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>