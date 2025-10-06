import request from '@/utils/request';

// 获取图形验证码
export const getGraphCaptcha = () => {
  return request.get('/member/captcha/graph');
};

// 检查是否需要图形验证码
export const needGraphCaptcha = () => {
  return request.get('/member/captcha/need-graph');
};

// 发送手机验证码
export const sendPhoneCaptcha = (data: {
  phoneNumber: string;
  businessType: string;
  graphCaptchaUuid?: string;
  graphCaptchaCode?: string;
}) => {
  return request.post('/member/captcha/phone', data);
};

// 验证手机验证码
export const verifyPhoneCaptcha = (data: {
  phoneNumber: string;
  code: string;
  businessType: string;
}) => {
  return request.post('/member/captcha/verify-phone', data);
};

// 用户注册
export const memberRegister = (data: {
  mobile: string;
}) => {
  return request.post('/member/member/register', data);
};

// 用户登录
export const memberLogin = (data: {
  mobile: string;
}) => {
  return request.post('/member/member/login', data);
};