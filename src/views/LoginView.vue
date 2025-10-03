<script setup lang="ts">
import { ref, reactive, h, onMounted, onUnmounted } from 'vue';
import { LockOutlined, MobileOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';

interface LoginForm {
  phone: string;
  code: string;
  captcha: string;
  captchaKey?: string;
}

const formRef = ref<FormInstance>();
const loading = ref(false);
const showCaptcha = ref(false);
const captchaImg = ref('');
const countdown = ref(0);
let countdownTimer: number | null = null;

const formState = reactive<LoginForm>({
  phone: '',
  code: '',
  captcha: '',
  captchaKey: '',
});

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入短信验证码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入图片验证码', trigger: 'blur' }
  ]
};

// 获取验证码
const getCode = () => {
  if (!formState.phone) {
    message.warning('请输入手机号');
    return;
  }
  
  // 验证手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(formState.phone)) {
    message.warning('请输入正确的手机号');
    return;
  }

  // 开始倒计时
  startCountdown();
  
  // 模拟发送验证码请求
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    message.success('验证码已发送，请注意查收短信');
    // 这里应该调用实际的发送验证码接口
    console.log('发送验证码到:', formState.phone);
    
    // 模拟后端返回需要显示验证码的逻辑
    // 在实际应用中，应该根据后端返回决定是否显示验证码
    // 这里为了演示，我们在第二次及之后获取验证码时显示
    if (countdown.value < 50) { // 模拟后端决定需要验证码
      showCaptcha.value = true;
      refreshCaptcha();
    }
  }, 1000);
};

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60;
  // 保存倒计时结束时间到localStorage
  const expireTime = Date.now() + 60 * 1000;
  localStorage.setItem('captchaCountdownExpire', expireTime.toString());
  
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (countdownTimer) clearInterval(countdownTimer);
      // 清除localStorage中的倒计时
      localStorage.removeItem('captchaCountdownExpire');
    }
  }, 1000);
};

// 刷新图片验证码
const refreshCaptcha = () => {
  // 生成一个随机的验证码键值
  formState.captchaKey = Math.random().toString(36).substring(2);
  // 在实际应用中，这里应该是获取验证码图片的接口
  captchaImg.value = `https://dummyimage.com/120x40/000000/ffffff&text=${Math.random().toString(36).substring(2, 6)}`;
};

// 提交登录
const onFinish = (values: any) => {
  console.log('Received values of form: ', values);
  loading.value = true;
  
  // 模拟登录过程
  setTimeout(() => {
    loading.value = false;
    message.success('登录成功');
    // 这里应该处理实际的登录逻辑
  }, 1500);
};

// 检查是否有保存的倒计时
const checkSavedCountdown = () => {
  const expireTimeStr = localStorage.getItem('captchaCountdownExpire');
  if (expireTimeStr) {
    const expireTime = parseInt(expireTimeStr, 10);
    const remainingTime = Math.floor((expireTime - Date.now()) / 1000);
    
    if (remainingTime > 0) {
      countdown.value = remainingTime;
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = window.setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          if (countdownTimer) clearInterval(countdownTimer);
          // 清除localStorage中的倒计时
          localStorage.removeItem('captchaCountdownExpire');
        }
      }, 1000);
    } else {
      // 时间已过期，清除localStorage
      localStorage.removeItem('captchaCountdownExpire');
    }
  }
};

// 组件挂载时检查保存的倒计时
onMounted(() => {
  checkSavedCountdown();
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-header">
        <h2>用户登录</h2>
        <p>欢迎使用票务系统</p>
      </div>
      
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        class="login-form-content"
        @finish="onFinish"
      >
        <a-form-item name="phone">
          <a-input 
            v-model:value="formState.phone" 
            size="large"
            placeholder="请输入手机号"
            :prefix="h(MobileOutlined)"
          />
        </a-form-item>

        <a-form-item name="code">
          <div style="display: flex; gap: 10px;">
            <a-input
              v-model:value="formState.code"
              size="large"
              placeholder="短信验证码"
              :prefix="h(LockOutlined)"
              style="flex: 1;"
            />
            <a-button 
              size="large" 
              @click="getCode"
              :disabled="countdown > 0 || loading"
            >
              {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
            </a-button>
          </div>
        </a-form-item>

        <transition name="slide-fade">
          <a-form-item v-show="showCaptcha" name="captcha">
            <div style="display: flex; gap: 10px;">
              <a-input
                v-model:value="formState.captcha"
                size="large"
                placeholder="图片验证码"
                :prefix="h(SafetyCertificateOutlined)"
                style="flex: 1;"
              />
              <img 
                v-if="captchaImg" 
                :src="captchaImg" 
                alt="captcha" 
                class="captcha-img"
                @click="refreshCaptcha"
              />
            </div>
          </a-form-item>
        </transition>

        <a-form-item>
          <a-button 
            type="primary" 
            html-type="submit" 
            size="large" 
            block 
            :loading="loading"
            class="login-button"
          >
            登录
          </a-button>
          <div class="login-hint">首次登录将自动注册账号</div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #EFEFEF;
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin-bottom: 10px;
  color: #000000;
  font-weight: 500;
}

.login-header p {
  color: #999999;
  font-size: 14px;
}

.captcha-img {
  height: 40px;
  cursor: pointer;
  border-radius: 4px;
}

.login-button {
  background: #000000;
  border-color: #000000;
}

.login-button:hover,
.login-button:focus {
  background: #333333;
  border-color: #333333;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.login-hint {
  text-align: center;
  margin-top: 10px;
  color: #999999;
  font-size: 12px;
}
</style>