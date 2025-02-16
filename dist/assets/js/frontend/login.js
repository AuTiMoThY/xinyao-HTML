import { submitBtn, InputField, PasswordField } from '../vue-components.js';
import { useFormValidation } from '../vue-validation.js';
import { useGlobalStateStore } from '../globalState.js';

const {ref, createApp} = Vue;
const { createPinia } = Pinia;
const loginPageSetup = {
    components: {
        'input-field': InputField,
        'password-field': PasswordField,
        'submit-btn': submitBtn
    },
    setup() {
        const globalState = useGlobalStateStore();
        const isMobile = ref(globalState.isMobile);
        console.log(isMobile.value);
        const isdisabled = ref(false);
        const user_id = ref('');
        const user_pw = ref('');
        const fields = [
            { name: 'user_id', ref: user_id, label: '帳號' },
            { name: 'user_pw', ref: user_pw, label: '密碼' },
        ];
        // 表單驗證
        const { fieldErrors, validate } = useFormValidation(fields);
        const frmError = ref('');

        // form submit
        // 按下登入按鈕後 觸發submit事件
        const login = async (e) => {
            xinyao.log("login");
            isdisabled.value = true;
            frmError.value = '';
            console.log(baseUrl);

            if (!validate()) {
                console.error('驗證失敗:', fieldErrors.value);
                isdisabled.value = false;
                return;
            }

            // 帳密皆有填寫
            if(user_id.value != '' && user_pw.value != '') {
                // try {
                //     xinyao.log('try');
                //     const api_response = await axios.post(baseUrl + 'api/login', {
                //         user_id: user_id.value.trim(),
                //         user_pw: user_pw.value.trim()
                //     });

                //     xinyao.log('Login response: ', api_response);

                //     if (api_response.status == 200){
                //         // isdisabled.value = false;
                //         window.location.href = `${baseUrl}`;
                //     }

                // }
                // catch (error) {
                //     console.error('Login failed', error);
                //     isdisabled.value = false;
                //     // frmError.value = error.message;
                //     // frmError.value = '帳號或密碼輸入錯誤';
                //     frmError.value = '請重新整理頁面';
                // }

                // 登入成功後，若是手機版導頁至選單頁；若是電腦版，導頁至心藥目錄頁
                if (isMobile.value) {
                    window.location.href = `${baseUrl}home.html`;
                }
                else {
                    window.location.href = `${baseUrl}xinyao-1.html`;
                }
            }
            else {
                isdisabled.value = false;
            }
        };

        return {
            isdisabled,
            user_id,
            user_pw,
            login,
            fieldErrors,
            frmError
        }
    }

}

const loginPage = createApp(loginPageSetup);
const pinia = createPinia();
loginPage.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-')
}
loginPage.use(pinia);
loginPage.mount("#loginApp");
