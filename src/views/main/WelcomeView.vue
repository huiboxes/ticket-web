<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="logo">
        <div class="logo-circle">
          <span class="logo-text">12306</span>
        </div>
      </div>
      <h1 class="welcome-title">欢迎使用12306售票系统</h1>
      <p class="welcome-subtitle">便捷、高效、安全的铁路出行服务平台</p>
      <div class="features">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
      <div class="cta-section">
        <button class="cta-button" @click="goToBooking" disabled>开始购票</button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    
    const features = [
      {
        icon: '🚄',
        title: '快速购票',
        description: '简洁的购票流程，几秒钟完成订票'
      },
      {
        icon: '🕒',
        title: '实时信息',
        description: '准确的列车时刻表和座位信息'
      },
      {
        icon: '🛡️',
        title: '安全保障',
        description: '多重安全验证，保护您的信息安全'
      }
    ];
    
    const goToBooking = () => {
      router.push('/booking');
    };
    
    return {
      features,
      goToBooking
    };
  },
});
</script>

<style scoped>
.welcome-container {
  //min-height: 100vh;
  background-color: #EFEFEF;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-content {
  width: 100%;
  text-align: center;
  background-color: #FFFFFF;
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.logo-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.logo-text {
  color: #FFFFFF;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
}

.welcome-title {
  color: #000000;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.welcome-subtitle {
  color: #333333;
  font-size: 20px;
  margin-bottom: 50px;
  font-weight: 300;
}

.features {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 50px;
}

.feature-card {
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  background-color: #FFFFFF;
  border-radius: 15px;
  padding: 30px 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 20px;
}

.feature-title {
  color: #000000;
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-description {
  color: #666666;
  font-size: 16px;
  line-height: 1.6;
}

.cta-section {
  margin-top: 30px;
}

.cta-button {
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 50px;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.cta-button:hover {
  background-color: #333333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .welcome-content {
    padding: 40px 20px;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .welcome-subtitle {
    font-size: 18px;
  }
  
  .features {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-card {
    width: 100%;
    max-width: 100%;
  }
}
</style>