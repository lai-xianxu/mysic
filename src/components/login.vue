<template>
  <el-dialog title="登录" :visible.sync="dialogVisible" width="500px">
    <!-- 手机号登录 -->
    <el-form
      v-if="!qrCodeLock"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="手机号" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item v-if="passwordLock" label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item v-else label="验证码" prop="captcha">
        <el-input placeholder="请输入验证码" v-model="ruleForm.captcha">
          <el-button
            @click.stop="getCaptcha"
            :disabled="capDisabled"
            slot="append"
            >{{ capDisabled ? auth_time : '获取验证码' }}</el-button
          >
          <template slot="append">
            <div></div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="fsbc">
          <el-link
            :underline="false"
            @click.stop="passwordLock = !passwordLock"
            >{{ passwordLock ? '验证码登录' : '密码登录' }}</el-link
          >
          <el-checkbox v-model="ruleForm.checked" disabled
            >自动登录</el-checkbox
          >
        </div>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="ruleForm.fwCheck"></el-checkbox>
        <span class="ml10">
          同意<el-link
            :underline="false"
            type="primary"
            target="_block"
            href="https://st.music.163.com/official-terms/service"
            >《服务条款》</el-link
          ><el-link
            :underline="false"
            type="primary"
            target="_block"
            href="https://st.music.163.com/official-terms/privacy "
            >《隐私政策》</el-link
          ><el-link
            :underline="false"
            type="primary"
            target="_block"
            href="https://st.music.163.com/official-terms/children"
            >《儿童隐私政策》</el-link
          >
        </span>
      </el-form-item>
    </el-form>
    <span v-if="!qrCodeLock" slot="footer" class="dialog-footer">
      <div class="fsbc">
        <el-link :underline="false" @click="switchLogin('qr')">
          切换扫码登录</el-link
        >
        <el-button type="primary" size="mini" @click="onLogin">登 录</el-button>
      </div>
    </span>

    <!-- 扫码登录 -->
    <div v-else class="fsc fdc">
      <div class="fcs">
        <img
          class="left_img"
          src="https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/9643571155/525c/faac/2dc6/fe695c03c7c358ddaa4651736b26a55f.png"
          alt=""
        />
        <div class="fsc fdc ml40 qr_box">
          <p>扫码登录</p>
          <img class="qr_code_img mt15" :src="qrImg" alt="" />
          <p class="mt15">
            使用 <span class="c_main">网易云音乐APP</span> 扫码登录
          </p>
          <div class="fcc fdc sx_box" v-if="sxRQCode">
            <p class="mb10">二维码已失效</p>
            <el-button plain size="mini" type="danger" @click="loginQrKey"
              >点击刷新</el-button
            >
          </div>
          <div class="fcc fdc sx_box" v-if="sqQRLoding">
            <p class="c_main2">授权中...</p>
          </div>
        </div>
      </div>
      <div class="mt20 mb20">
        <el-button plain size="mini" @click="switchLogin('phone')"
          >选择其他登录方式</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  LoginPhone,
  sentCaptcha,
  loginQrKey,
  loginQrCreat,
  loginQrCheck,
  captchaVerify,
  loginStatus,
} from '@/api/login';
export default {
  name: 'Login',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      passwordLock: false,
      capDisabled: false,
      qrCodeLock: true,
      auth_time: 0,
      ruleForm: {
        name: '15623123216',
        password: '',
        checked: true,
        captcha: '',
        fwCheck: false,
      },
      rules: {
        name: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        fwCheck: [
          {
            required: true,
            message: '请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》',
            trigger: 'change',
          },
        ],
      },
      qrKey: '',
      qrImg: '',
      timmer: '',
      sxRQCode: false,
      sqQRLoding: false,
    };
  },
  watch: {
    show(nv, ov) {
      if (nv) this.dialogVisible = true;
    },
    dialogVisible(nv, ov) {
      if (nv) {
        this.loginQrKey();
      }
      if (!nv) {
        this.timmer = null;
        this.$emit('update:show', false);
      }
    },
  },
  methods: {
    // 获取登录状态
    loginStatus() {
      loginStatus().then((res) => {
        localStorage.setItem('user_info', JSON.stringify(res.data.profile));
        this.$store.commit('USER_INFO', JSON.stringify(res.data.profile));
      });
    },
    // 获取验证码
    getCaptcha() {
      if (!this.ruleForm.name) {
        this.$refs.ruleForm.validate();
        return;
      }
      sentCaptcha({ phone: this.ruleForm.name }).then((res) => {
        if (res.code != 200) {
          this.$message.error(res.message);
          return;
        }
        this.$message.success('验证码获取成功');
        this.onCountDown(60);
      });
    },
    // 验证码倒计时
    onCountDown(m) {
      this.capDisabled = true;
      this.auth_time = m;
      let auth_timetimer = setInterval(() => {
        this.auth_time--;
        if (this.auth_time <= 0) {
          this.capDisabled = false;
          clearInterval(auth_timetimer);
        }
      }, 1000);
    },
    // 登录接口
    onLogin() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (!this.ruleForm.fwCheck) {
            this.$message.warning(
              '请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》'
            );
            return;
          }
          const data = {
            phone: this.ruleForm.name,
          };
          if (this.passwordLock) {
            data['md5_password'] = encodeURIComponent(this.ruleForm.password);
          } else {
            const res = await captchaVerify({
              captcha: this.ruleForm.captcha,
              phone: this.ruleForm.name,
            });
            if (res.data) {
              data['captcha'] = this.ruleForm.captcha;
            } else {
              this.$message.error('验证码已过期，请重新请求');
            }
          }
          LoginPhone(data)
            .then((res) => {
              // 登录成功保存token，用于身份验证
              //       window.localStorage.setItem('token',res.data.data.token);
              if (res.code != 200) {
                this.$message.error(res.message ? res.message : '请刷新后重试');
              } else {
                this.loginStatus();
                this.$message.success('登录成功');
                this.dialogVisible = false;
              }
            })
            .catch(() => {
              this.$message.error('登录失败，请稍后或换一种方式登录');
            });
        } else {
          console.log('error submit!!');
        }
      });
    },
    // 切换登录方式
    switchLogin(e) {
      if (e == 'phone') {
        this.timmer = null;
        this.qrCodeLock = false;
      } else {
        this.loginQrKey();
        this.qrCodeLock = true;
      }
    },
    // // 刷新二维码
    // refreshQR(){
    //   this.loginQrKey()
    // },
    // 二维码key生成
    loginQrKey() {
      loginQrKey().then((res) => {
        this.qrKey = res.data.unikey;
        this.loginQrCreat();
      });
    },
    // 二维码生成
    loginQrCreat() {
      loginQrCreat({
        key: this.qrKey,
        qrimg: 'base64',
      }).then((res) => {
        this.qrImg = res.data.qrimg;
        this.sxRQCode = false;
        this.clickTim();
      });
    },
    // 点击调用轮循事件
    clickTim() {
      if (this.timmer !== null) {
        // 清除不为空的timmer定时器
        clearTimeout(this.timmer);
      }
      this.Cycle();
    },
    // 轮循方法
    Cycle() {
      this.timmer = setTimeout(() => {
        loginQrCheck({
          key: this.qrKey,
        }).then((res) => {
          if (res.code == 800) {
            this.sqQRLoding = false;
            this.sxRQCode = true;
            this.timmer = null;
          } else if (res.code == 802) {
            this.sxRQCode = false;
            this.sqQRLoding = true;
          } else if (res.code == 803) {
            this.loginStatus();
            this.timmer = null;
            this.$message.success('登录成功');
            this.dialogVisible = false;
            this.sxRQCode = false;
            this.sqQRLoding = false;
            return;
          }
          if (this.timmer !== null) this.Cycle();
        });
      }, 700);
    },
  },
  mounted() {
    this.loginStatus();
  },
};
</script>

<style scoped>
.form_item {
  margin: 0 0 10px 100px;
}
.left_img {
  width: 125px;
  height: 220px;
}
.qr_box {
  position: relative;
}
.sx_box {
  position: absolute;
  top: 46px;
  left: 33px;
  width: 123px;
  height: 123px;
  background: rgba(255, 255, 255, 0.9);
}
.qr_code_img {
  width: 148px;
  height: 148px;
}
.c_main2 {
  color: #fa2909;
}
.c_main {
  color: #723a32;
}
::v-deep .el-dialog__header {
  background-color: #723a32;
}
::v-deep .el-dialog__title,
::v-deep .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
::v-deep .el-dialog__body {
  padding-bottom: 0;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid rgb(182, 181, 181);
  background: #f7f7f7;
}
::v-deep .el-button--primary {
  color: #fff;
  border-color: #723a32;
  background: #723a32;
}

::v-deep .el-button--primary:hover,
::v-deep .el-button--primary:active,
::v-deep .el-button--primary:focus {
  color: #fff;
  border-color: #723a32;
  background: #723a32;
  opacity: 0.8;
}
::v-deep .el-input-group__append {
  cursor: pointer;
}
::v-deep .el-input-group__append button.el-button,
.el-input-group__append div.el-select .el-input__inner,
.el-input-group__append div.el-select:hover .el-input__inner,
.el-input-group__prepend button.el-button,
.el-input-group__prepend div.el-select .el-input__inner,
.el-input-group__prepend div.el-select:hover .el-input__inner {
  width: 112px;
}
</style>
