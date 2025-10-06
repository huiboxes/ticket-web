<script setup lang="ts">
import { ref, reactive, h, onMounted, onUnmounted } from 'vue';
import { LockOutlined, MobileOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { getGraphCaptcha, sendPhoneCaptcha, verifyPhoneCaptcha, memberLogin } from '@/api/member';
import { useRouter } from 'vue-router';

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

const router = useRouter();

const formState = reactive<LoginForm>({
  phone: '',
  code: '',
  captcha: '',
  captchaKey: '',
});

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入短信验证码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, validator: (_, value) => {
        if (showCaptcha.value && !value) {
          return Promise.reject('请输入图片验证码');
        }
        return Promise.resolve();
      }, trigger: 'blur' }
  ]
};

const getCode = async () => {
  console.log('点击获取验证码按钮');
  if (!formState.phone) {
    message.warning('请输入手机号');
    return;
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(formState.phone)) {
    message.warning('请输入正确的手机号');
    return;
  }

  try {
    const captchaData = {
      phoneNumber: formState.phone,
      businessType: 'LOGIN'
    };
    
    if (showCaptcha.value) {
      Object.assign(captchaData, {
        graphCaptchaUuid: formState.captchaKey,
        graphCaptchaCode: formState.captcha
      });
    }
    
    console.log('发送验证码请求数据:', captchaData);
    loading.value = true;
    const res = await sendPhoneCaptcha(captchaData);
    console.log('发送验证码响应:', res);
    if (!res.success) {
      return message.error(res.message || '验证码发送失败');
    }
    
    startCountdown();
     
    message.success(res.message || '验证码已发送，请注意查收短信');
  } catch (err: any) {
    console.error('发送验证码失败:', err);
    message.error(err.message || '发送验证码失败');
    
    if (err.message?.includes('图形验证码')) {
      showCaptcha.value = true;
      refreshCaptcha();
    }
  } finally {
    loading.value = false;
  }
};

const startCountdown = () => {
  countdown.value = 60;
  const expireTime = Date.now() + 60 * 1000;
  localStorage.setItem('captchaCountdownExpire', expireTime.toString());
  
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (countdownTimer) clearInterval(countdownTimer);
      localStorage.removeItem('captchaCountdownExpire');
    }
  }, 1000);
};

const refreshCaptcha = async () => {
  try {
    const response = await getGraphCaptcha();
    captchaImg.value = response.image || `https://dummyimage.com/120x40/000000/ffffff&text=${Math.random().toString(36).substring(2, 6)}`;
    formState.captchaKey = response.uuid || Math.random().toString(36).substring(2);
  } catch (err: any) {
    console.error('获取图形验证码失败:', err);
    message.error('获取图形验证码失败');
    formState.captchaKey = Math.random().toString(36).substring(2);
    captchaImg.value = `https://dummyimage.com/120x40/000000/ffffff&text=${Math.random().toString(36).substring(2, 6)}`;
  }
};

const onFinish = async (values: any) => {
  console.log('开始执行登录逻辑');
  console.log('Received values of form: ', values);
  console.log('Form state: ', formState);
  console.log('Form ref: ', formRef.value);
  loading.value = true;
  
  if (!formState.phone || !formState.code) {
    message.error('请填写完整的登录信息');
    loading.value = false;
    return;
  }
  
  performLogin();
};

const onFinishFailed = (errorInfo: any) => {
  console.log('登录表单验证失败:', errorInfo);
  message.error('请检查输入信息是否正确');
};

const performLogin = async () => {
  try {
    console.log('开始执行登录/注册');
    const response = await memberLogin({
      mobile: formState.phone,
      code: formState.code
    });
    console.log('登录/注册响应:', response);
    
    if (response.success) {
      message.success('登录成功');
      console.log('登录成功，用户ID:', response.content);
      router.push('/');
    } else {
      message.error(response.message || '登录失败');
    }
  } catch (err: any) {
    console.error('登录失败:', err);
    message.error(err.message || '登录失败');
  } finally {
    loading.value = false;
  }
};

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
          localStorage.removeItem('captchaCountdownExpire');
        }
      }, 1000);
    } else {
      localStorage.removeItem('captchaCountdownExpire');
    }
  }
};

onMounted(() => {
  checkSavedCountdown();
});

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
        @finishFailed="onFinishFailed"
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