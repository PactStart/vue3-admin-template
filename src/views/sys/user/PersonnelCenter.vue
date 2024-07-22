<template>
  <div style="padding-left: 24px;">
    <a-tabs>
      <a-tab-pane key="basic" tab="个人信息">
        <a-descriptions title="个人信息" :column=1 size="middle" bordered>
          <a-descriptions-item label="账号ID">{{user.id}}</a-descriptions-item>
          <a-descriptions-item label="登录用户名">{{user.username}}</a-descriptions-item>
          <a-descriptions-item label="已绑定手机号">{{user.phone}}</a-descriptions-item>
          <a-descriptions-item label="真实姓名">{{user.realName}}</a-descriptions-item>
          <a-descriptions-item label="昵称">
            <span v-show="showEditNickname">
              <a-input v-model:value="perfectInfoForm.nickname" style="width: 250px;"/>
              <a-button @click="onBasicInfoConfirmClick('nickname')" type="primary">确定</a-button>
              <a-button @click="onBasicInfoCancelClick('nickname')">取消</a-button>
            </span>
            <span v-show="!showEditNickname">{{user.nickname}}</span>
            <edit-outlined v-show="!showEditNickname" style="padding-left: 16px;" @click="onBasicInfoEditClick('nickname')" />
          </a-descriptions-item>
          <a-descriptions-item label="头像">
            <ImgUpload :imageUrl="user.avatar" :onUploadSuccess="updateUserAvatar"/>
          </a-descriptions-item>
          <a-descriptions-item label="微信号">
            <span v-show="showEditWechat">
              <a-input v-model:value="perfectInfoForm.wechat" style="width: 250px;"/>
              <a-button @click="onBasicInfoConfirmClick('wechat')" type="primary">确定</a-button>
              <a-button @click="onBasicInfoCancelClick('wechat')">取消</a-button>
            </span>
            <span v-show="!showEditWechat">{{user.wechat}}</span>
            <edit-outlined v-show="!showEditWechat" style="padding-left: 16px;" @click="onBasicInfoEditClick('wechat')" />
            <!-- <div style="color: red; padding-top:12px; font-size: 12px;">
            </div> -->
          </a-descriptions-item>
          <a-descriptions-item label="微信昵称">
            <span v-show="showEditWechatNickname">
              <a-input v-model:value="perfectInfoForm.wechatNickname" style="width: 250px;"/>
              <a-button @click="onBasicInfoConfirmClick('wechatNickname')" type="primary">确定</a-button>
              <a-button @click="onBasicInfoCancelClick('wechatNickname')">取消</a-button>
            </span>
            <span v-show="!showEditWechatNickname">{{user.wechatNickname}}</span>
            <edit-outlined v-show="!showEditWechatNickname" style="padding-left: 16px;" @click="onBasicInfoEditClick('wechatNickname')" />
          </a-descriptions-item>
          <a-descriptions-item label="微信二维码">
            <ImgUpload :imageUrl="user.wechatQrCode" :onUploadSuccess="updateWechatQrCode"/>
            <!-- <div style="color: red; padding-top:12px; font-size: 12px;">
            </div> -->
          </a-descriptions-item>
          <a-descriptions-item label="最近登录时间">{{formatTimestamp(user.lastLoginTime)}}</a-descriptions-item>
          <a-descriptions-item label="最近登录ip">{{user.lastLoginIp}}</a-descriptions-item>
          <a-descriptions-item label="我的角色">
            <span v-if="user.superAdmin">超级管理员</span>
            <span v-else>
              <span v-for="role in roles">
              {{role}}&nbsp;&nbsp;
            </span>
            </span>
          </a-descriptions-item>
        </a-descriptions>
      </a-tab-pane>
      <a-tab-pane key="security" tab="安全设置">
        <a-table :dataSource="dataSource" :columns="columns">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'value'">
                    <span v-if="record.name === 'email'">
                      {{ !!record.value ? '当前邮箱: '+record.value : '您尚未绑定邮箱'}}
                    </span>
                    <span v-if="record.name === 'phone'">
                      {{ !!record.value ? '您当前的手机号是 '+record.value : '您尚未绑定手机'}}
                    </span>
                    <span v-if="record.name === 'passwordResetTime'">
                      {{ !!record.value ? '上次更改密码时间: '+ formatTimestamp(record.value) : '您尚未修改过密码'}}
                    </span>
                    <span v-if="record.name === 'isBindMfaDevice'">
                      {{ record.value ? '虚拟 MFA 设备已经绑定' : '启用通过 Google Authenticator 应用程序生成的动态代码验证您的身份'}}
                    </span>
                    <span v-if="record.name === 'openId'">
                      {{ !!record.value ? '已绑定': '未绑定'}}
                    </span>
                    <span v-if="record.name === 'enableMFA'">
                      {{ record.value ? '已开启': '关闭'}}
                    </span>
                </template>
                <template v-if="column.key === 'action'">
                  <span v-if="record.name === 'email'">
                    <a @click="onSecurityInfoEditClick(record)">{{ record.value ? '修改' : '绑定'}}</a>
                  </span>
                    <span v-if="record.name === 'phone'">
                    <a @click="onSecurityInfoEditClick(record)">{{ record.value ? '修改' : '绑定'}}</a>
                  </span>
                    <span v-if="record.name === 'passwordResetTime'">
                    <a @click="onSecurityInfoEditClick(record)">修改</a>
                  </span>
                  <span v-if="record.name === 'isBindMfaDevice'">
                      <a @click="onSecurityInfoEditClick(record)">{{ record.value ? '解绑' : '绑定'}}</a>
                  </span>
                  <span v-if="record.name === 'openId'">
                    <a @click="onSecurityInfoEditClick(record)">{{ record.value ? '解绑' : '绑定'}}</a>
                  </span>
                  <span v-if="record.name === 'enableMFA'">
                    <a @click="onSecurityInfoEditClick(record)">切换</a>
                  </span>
                </template>
            </template>
        </a-table>
      </a-tab-pane>
  </a-tabs>
  <a-modal v-model:visible="showUpdatePwdModal" title="修改密码" @ok="handleUpdatePwd" ok-text="提交"
        cancel-text="取消">
      <a-form :model="updatePwdForm" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
          autocomplete="off">
          <a-form-item label="新密码" name="password" :rules="[{ required: true, message: 'Please input password!' }]">
              <a-input-password v-model:value="updatePwdForm.password" />
          </a-form-item>

          <a-form-item label="确认新密码" name="confirmPassword"
              :rules="[{ required: true, message: 'Please input confirmPassword!' }]">
              <a-input-password v-model:value="updatePwdForm.confirmPassword" />
          </a-form-item>
      </a-form>
  </a-modal>
  <a-modal v-model:visible="showBindEmailModal" title="绑定邮箱" @ok="handleBindEmail" ok-text="提交"
        cancel-text="取消">
      <a-form :model="bindEmailForm" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
          autocomplete="off">
          <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: 'Please input email!' }]">
              <a-input v-model:value="bindEmailForm.email" />
          </a-form-item>
          <a-form-item label="验证码" name="code" :rules="[{ required: true, message: 'Please input code!' }]">
              <div class="input-wrapper">
                  <a-input v-model:value="bindEmailForm.code" size="large" class="input-field" />
                  <a-button type="primary" size="large" @click="onSendEmailCodeBtnClick">发送</a-button>
              </div>
          </a-form-item>
      </a-form>
  </a-modal>
  <a-modal v-model:visible="showBindPhoneModal" title="绑定手机" @ok="handleBindPhone" ok-text="提交"
        cancel-text="取消">
      <a-form :model="bindPhoneForm" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
          autocomplete="off">
          <a-form-item label="手机号" name="phone" :rules="[{ required: true, message: 'Please input phone!' }]">
              <a-input v-model:value="bindPhoneForm.phone" />
          </a-form-item>
          <a-form-item label="验证码" name="code" :rules="[{ required: true, message: 'Please input code!' }]">
              <div class="input-wrapper">
                  <a-input v-model:value="bindPhoneForm.code" size="large" class="input-field" />
                  <a-button type="primary" size="large" @click="onSendPhoneCodeBtnClick">发送</a-button>
              </div>
          </a-form-item>
      </a-form>
  </a-modal>
  <a-modal v-model:visible="showBindMFAModal" title="绑定MFA" @ok="handleBindMFA" ok-text="提交"
        cancel-text="取消" style="width: 800px;">
        <a-row :gutter="24">
          <a-col span="6">
            <vue-qrcode :value="mfaDevice.url" :options="{ width: 200 }"></vue-qrcode>
          </a-col>
          <a-col span="18">
            <div style="margin-bottom: 12px;">
              1、请打开或下载两步验证工具(<a rel="noopener noreferrer" target="_blank" href="https://googleauthenticator.net">Google Authenticator</a> 或 <a rel="noopener noreferrer" target="_blank" href="https://authy.com/download">Authy</a>)，扫描左侧二维码，或复制下方密钥，手动添加验证器账号。
            </div>
            <div class="secret">
              <span >{{ mfaDevice.secret }}&nbsp;&nbsp;<copy-outlined type="copy" @click="copy"/></span>
            </div>
            <div style="margin-bottom: 12px;">
              2、绑定账号后，在下方输入你的认证账号生成的验证码，在控制台进行敏感操作时勾选是否开启两步验证。
            </div>
            <div style="margin-bottom: 12px;">
              <a-input v-model:value="bindMFAForm.code" placeholder="6位动态验证码"/>
            </div>
            <div style="margin-bottom: 12px;">
              <a-checkbox v-model:checked="bindMFAForm.enableMFA" />启用保护验证
            </div>
          </a-col>
        </a-row>
  </a-modal>
  <a-modal v-model:visible="showOauth2UrlModal" title="绑定微信" @ok="completeScanOauth2Url" ok-text="完成扫码">
    <a-row type="flex" justify="space-around">
      <vue-qrcode :value="oauth2Url" :options="{ width: 200 }"></vue-qrcode>
    </a-row>
    <a-row type="flex" justify="space-around">
      请使用微信扫码上方二维码
    </a-row>
  </a-modal>
  <CheckIdentity :count="count" :operation="operation" :onSuccess="onCheckIdentitySuccess" />
  </div>
</template>
<script setup >
import { getPersonalInfo, perfectInfo, changePassword, sendVerifyEmail,bindEmail,bindPhone,generateMFA,bindMFA,unbindMFA,switchEnableMFA,getAuthorizeUrl } from '@/api/user';
import { sendSms } from '@/api/sms';
import { reactive, ref, onMounted, computed } from 'vue';
import { formatTimestamp } from '@/utils/time';
import { EditOutlined, CopyOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import CheckIdentity from "@/components/CheckIdentity.vue";
import useClipboard from 'vue-clipboard3'
import { useStore } from 'vuex';
import ImgUpload from '@/components/ImgUpload.vue';


const store = useStore();

const { toClipboard } = useClipboard()
const copy = async () => {
  try {
    await toClipboard(mfaDevice.value.secret)
    message.success('复制成功')
  } catch (e) {
    console.error(e)
  }
}

const user = ref({});
const roles = ref([]);

const dataSource = computed(() => {
  let arr = [
    {label:'邮箱',name:'email',value:user.value.email},
    {label:'手机',name:'phone',value:user.value.phone},
    {label:'密码',name:'passwordResetTime',value:user.value.passwordResetTime},
    {label:'MFA设备',name:'isBindMfaDevice',value:user.value.isBindMfaDevice},
    {label:'绑定微信',name:'openId',value:user.value.openId},
    {label:'两步验证',name:'enableMFA',value:user.value.enableMFA}
  ]
  return arr
});

const columns = reactive([
    {
        title: '安全设置',
        dataIndex: 'label',
        key: 'label',
    },
    {
        title: '状态',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: '操作',
        key: 'action',
    }
]);

const operation = ref(null)
const count = ref(1)

const showEditNickname = ref(false)
const showEditWechat = ref(false)
const showEditWechatNickname = ref(false)
const perfectInfoForm = ref({})

const showUpdatePwdModal = ref(false);
const updatePwdForm = ref({
    oldPassword: null,
    password: null,
    confirmPassword: null,
});

const showBindEmailModal = ref(false);
const bindEmailForm = ref({
    email: user.value.email,
    code: null,
});

const showBindPhoneModal = ref(false);
const bindPhoneForm = ref({
    phone: user.value.phone,
    code: null,
});

const showBindMFAModal = ref(false);
const bindMFAForm = ref({
  secret: null,
  code: null,
  enableMFA: false
});
const mfaDevice = ref({
  url: 'https://xiaoxixijz.com',
  secret: ''
})
const showOauth2UrlModal = ref(false)
const oauth2Url = ref('')

const refreshPersonelInfo = ()=> {
  getPersonalInfo({}).then((res) => {
    if (!res.code) {
      user.value = res.data.user;
      roles.value = res.data.roles;
      perfectInfoForm.value = {
        id: user.value.id,
        nickname: user.value.nickname,
        avatar: user.value.avatar,
        wechat: user.value.wechat,
        wechatNickname: user.value.wechatNickname
      }
      bindPhoneForm.value.phone = user.value.phone
      bindPhoneForm.value.email = user.value.email

      if(!res.code) {
          store.commit('setUser',res.data.user);
          store.commit('setRoles',res.data.roles);
          store.commit('setPermissions',res.data.permissions);
      }
    }
  })
}
const onBasicInfoEditClick = (field) => {
  if (field == 'nickname') {
    showEditNickname.value = true
  } else if (field == 'wechat') {
    showEditWechat.value = true
  } else if (field == 'wechatNickname') {
    showEditWechatNickname.value = true
  }
}
const onBasicInfoCancelClick = (field) => {
  if (field == 'nickname') {
    showEditNickname.value = false
  } else if (field == 'wechat') {
    showEditWechat.value = false
  } else if (field == 'wechatNickname') {
    showEditWechatNickname.value = false
  }
}
const onBasicInfoConfirmClick = (field) => {
  perfectInfo(perfectInfoForm.value).then(res => {
    if(!res.code) {
        refreshPersonelInfo()
        if (field == 'nickname') {
          showEditNickname.value = false
        } else if (field == 'wechat') {
          showEditWechat.value = false
        } else if (field == 'wechatNickname') {
          showEditWechatNickname.value = false
        }
    }
  })
}

const updateUserAvatar = url => {
  perfectInfoForm.value.avatar = url
  perfectInfo(perfectInfoForm.value).then(res => {
    
  });
}

const updateWechatQrCode = url => {
  perfectInfoForm.value.wechatQrCode = url
  perfectInfo(perfectInfoForm.value).then(res => {
    
  });
}

const handleUpdatePwd = () => {
  if(updatePwdForm.value.password != updatePwdForm.value.confirmPassword) {
      message.error('两次密码输入不一致')
  }
  changePassword({
      ...updatePwdForm.value
  }).then(res => {
      if(!res.code) {
          message.success('修改密码成功');
          showUpdatePwdModal.value = false;
          refreshPersonelInfo()
      }
  })
}

const onSendEmailCodeBtnClick = (e) => {
  if(!bindEmailForm.value.email) {
    message.warn("请先填写邮箱")
    return
  }
  var button = e.currentTarget;
  button.disabled = true;
  sendVerifyEmail({
      email: bindEmailForm.value.email,
      scene: 'BindEmail'
  }).then(res => {
    if(!res.code) {
      message.success('发送成功')
      var countdown = 60;
      var timer =  setInterval(()=> {
          countdown = countdown - 1;
          button.innerText = countdown+'s';
          if (countdown <= 0) {
              clearInterval(timer);
              button.disabled = false; // 启用按钮
              button.innerText= '发送';
          }
      },1000)
    } else {
      button.disabled = false;
    }
  })
}

const handleBindEmail = () => {
  bindEmail({
    ...bindEmailForm.value
  }).then(res => {
    if(!res.code) {
      message.success('绑定成功')
      refreshPersonelInfo()
      showBindEmailModal.value = false;
    }
  })
}

const onSendPhoneCodeBtnClick = (e) => {
  if(!bindPhoneForm.value.phone) {
    message.warn("请先填写手机号")
    return
  }
  var button = e.currentTarget;
  button.disabled = true;
  sendSms({
      phone: bindPhoneForm.value.phone,
      scene: 'BindPhone'
  }).then(res => {
    if(!res.code) {
      message.success('发送成功')
      var countdown = 60;
      var timer =  setInterval(()=> {
          countdown = countdown - 1;
          button.innerText = countdown+'s';
          if (countdown <= 0) {
              clearInterval(timer);
              button.disabled = false; // 启用按钮
              button.innerText= '发送';
          }
      },1000)
    } else {
      button.disabled = false;
    }
  })
}

const handleBindPhone = () => {
  bindPhone({
    ...bindPhoneForm.value
  }).then(res => {
    if(!res.code) {
      message.success('绑定成功')
      refreshPersonelInfo()
      showBindPhoneModal.value = false;

    }
  })
}

const handleBindMFA = () => {
  bindMFA({
    ...bindMFAForm.value
  }).then(res => {
    if(!res.code) {
      message.success('绑定成功')
      refreshPersonelInfo()
      showBindMFAModal.value = false;
    }
  })
}

const onSecurityInfoEditClick = (record) => {
  if(record.name == 'passwordResetTime') {
    operation.value = 'change_password'
  } else if(record.name == 'email') {
    operation.value = 'change_email'
  } else if(record.name == 'phone') {
    operation.value = 'change_phone'
  } else if(record.name == 'isBindMfaDevice') {
    operation.value =  record.isBindMfaDevice ? 'bind_mfa_device' : 'unbind_mfa_device'
  } else if(record.name == 'enableMFA') {
    operation.value = 'switch_enable_mfa'
  } else if (record.name == 'openId') {
    operation.value = record.openId ? 'unbind_wechat' : 'bind_wechat'
  }
  //触发属性变化
  count.value = count.value+1
  console.log(count.value)
}

const onCheckIdentitySuccess = () => {
  if(operation.value == 'change_password') {
    showUpdatePwdModal.value = true;
  } else if(operation.value == 'change_email') {
    showBindEmailModal.value = true;
  } else if(operation.value == 'change_phone') {
    showBindPhoneModal.value = true;
  } else if(operation.value == 'bind_mfa_device') {
    generateMFA().then(res => {
      if(!res.code) {
        bindMFAForm.value.secret = res.data.secret
        mfaDevice.value = res.data
      }
    })
    showBindMFAModal.value = true;
  } else if(operation.value == 'unbind_mfa_device') {
    unbindMFA().then(res => {
      if (!res.code) {
        message.success("解绑成功")
        refreshPersonelInfo()
      }
    })
  } else if(operation.value == 'switch_enable_mfa') {
    switchEnableMFA().then(res => {
      if (!res.code) {
        message.success("切换成功")
        refreshPersonelInfo()
      }
    })
  } else if (operation.value == 'bind_wechat') {
    getAuthorizeUrl().then(res => {
      if(!res.code) {
        oauth2Url.value = res.data.url
        showOauth2UrlModal.value = true
      }
    })
  } else if (operation.value == 'unbind_wechat') {
    unbinWechat().then(res => {
      if(!res.code) {
        message.success("解绑成功")
        refreshPersonelInfo()
      }
    })
  }
}

const completeScanOauth2Url = () => {
  refreshPersonelInfo()
  showOauth2UrlModal.value = false
}

onMounted(() => {
  refreshPersonelInfo()
});
</script>
<style lang='less' scoped>
  .input-wrapper {
      display: flex;
      align-items: center;
  }
  .input-field {
      margin-right: 0;
  }
  .secret {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    background: #f5f5f5;
    padding: 5px 12px;
  }
</style>