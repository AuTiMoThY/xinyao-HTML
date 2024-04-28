const { ref, watch, onMounted, computed } = Vue;
const PROJECT_NAME = "xinyao";

export const InputField = {
    props: {
        'label': String,
        'id': String,
        'isrequired': Number,
        'placeholder': String,
        'modelValue': String,
        'error': String,
    },
    emits: ['update:modelValue'],
    template: `
    <module-field :class="[projectNameClass + '_field', projectNameClass + '_field-v', { 'required': isrequired }, {'js-focus': isFocused}]">
        <label :for="id" :class="projectNameClass + '_field-label'">{{label}}</label>
        <div :class="projectNameClass + '_field-block'">
            <div :class="[projectNameClass + '_field-ctrler']" >
                <input type="text" :id="id" :name="id" v-model.trim="value" class="form-control" :placeholder="placeholder" @input="handleInput" @focus="handleFocus" @blur="handleBlur">
            </div>
            <div class="error-msg" v-if="error">{{error}}</div> <!-- 顯示錯誤信息 -->
        </div>
    </module-field>
    `,
    setup(props, { emit }) {
        const value = ref(props.modelValue);
        watch(() => props.modelValue, newVal => {
            value.value = newVal;
        });
        const handleInput = () => {
            emit('update:modelValue', value.value);
        };

        const isFocused = ref(false);
        // 處理input聚焦事件
        const handleFocus = () => {
            isFocused.value = true; // 設置焦點狀態為true
        };

        // 處理input失焦事件
        const handleBlur = () => {
            isFocused.value = false; // 設置焦點狀態為false
        };

        const projectNameClass = `${PROJECT_NAME}`;


        return {
            projectNameClass,
            value, handleInput, handleFocus, handleBlur, isFocused
        };
    }
};


export const PasswordField = {
    props: {
        'label': String,
        'id': String,
        'isrequired': Number,
        'placeholder': String,
        'modelValue': String,
        'error': String
    },
    emits: ['update:modelValue'],
    template: `
    <module-field id="password_field" :class="[projectNameClass + '_field', projectNameClass + '_field-v', 'password_field', { 'required': isrequired }, {'js-focus': isFocused}]">
        <label :for="id" :class="projectNameClass + '_field-label'">密碼</label>
        <div :class="projectNameClass + '_field-block'">
            <div :class="projectNameClass + '_field-ctrler'">
                <input :type="fieldType" :id="id" :name="id" v-model="value" class="form-control" :placeholder="placeholder" @input="handleInput" @focus="handleFocus" @blur="handleBlur">
                <button type="button" class="toggle_password_btn" @click="togglePassword()">
                    <i class="fa-solid fa-eye" v-if="fieldType === 'password'"></i>
                    <i class="fa-solid fa-eye-slash" v-if="fieldType === 'text'"></i>
                </button>
            </div>
            <div class="error-msg" v-if="error">{{error}}</div> <!-- 顯示錯誤信息 -->
        </div>
    </module-field>
    `,
    setup(props, { emit }) {
        const value = ref(props.modelValue);
        const handleInput = () => {
            emit('update:modelValue', value.value);
        };
        const fieldType = ref("password");
        const togglePassword = () => {
            return fieldType.value = (fieldType.value === "password") ? "text" : "password";
        }

        const isFocused = ref(false);
        // 處理input聚焦事件
        const handleFocus = () => {
            isFocused.value = true; // 設置焦點狀態為true
        };

        // 處理input失焦事件
        const handleBlur = () => {
            isFocused.value = false; // 設置焦點狀態為false
        };

        const projectNameClass = `${PROJECT_NAME}`;
        return {
            projectNameClass,
            value, handleInput, handleFocus, handleBlur, isFocused,
            fieldType, togglePassword
        };
    }
};

export const SelectField = {
    props: {
        'label': String,
        'id': String,
        'options': Array,
        'modelValue': [String, Number],
        'error': String
    },
    emits: ['update:modelValue'],
    template: `
    <module-field :class="[
        projectNameClass + '_field', 
        projectNameClass + '_field-v', 
        projectNameClass + '_field-select', 
        {'js-focus': isFocused}
    ]">
        <label :for="id" :class="projectNameClass + '_field-label'">{{label}}</label>
        <div :class="projectNameClass + '_field-block'">
            <div :class="[projectNameClass + '_field-ctrler']" >
                <svg :data-src="svgSrc"></svg>
                <select ref="selectRef"
                    class="form-control" 
                    :id="id" 
                    :value="modelValue">
                    <option v-for="(option, index) in options" :key="index" :value="option.value">{{option.label}}</option>
                </select>
            </div>
            <div class="error-msg" v-if="error">{{error}}</div> <!-- 顯示錯誤信息 -->
        </div>
    </module-field>
    `,
    setup(props, { emit }) {
        const value = ref(props.modelValue);

        const isFocused = ref(false);
        // 處理input聚焦事件
        const handleFocus = () => {
            isFocused.value = true; // 設置焦點狀態為true
        };

        const selectRef = ref(null);
        onMounted(() => {
            if (selectRef.value) {
                selectRef.value.addEventListener('change', (event) => {
                    emit('update:modelValue', event.target.value);
                });
            }
        });


        const projectNameClass = `${PROJECT_NAME}`;
        const svgSrc = `${baseUrl}assets/images/arrow-down.svg`
        return {
            projectNameClass,
            svgSrc,
            value,
            handleFocus, isFocused,
            selectRef,
        };
    }
}



export const amountField = {
    props: {
        'id': String,
        'modelValue': Number, // 確保modelValue接收的是數字類型
    },
    emits: ['update:modelValue', 'amount-changed'],
    template: `
    <module-field :id="id" :class="[projectNameClass + '_field', projectNameClass + '_field-v', projectNameClass + '_field-amount']">
        <div :class="projectNameClass + '_field-block'">
            <div :class="projectNameClass + '_field-ctrler'">
                <button type="button" class="ctrl_number" @click="decrementValue"> <i class="fa-solid fa-minus"></i> </button>
                <input type="number" :id="id" :name="id" v-model.number="value" class="form-control" @input="handleInput">
                <button type="button" class="ctrl_number" @click="incrementValue"> <i class="fa-solid fa-plus"></i> </button>
            </div>
        </div>
    </module-field>
    `,
    setup(props, { emit }) {
        const value = ref(props.modelValue);

        // 監聽 modelValue 變化，以確保組件內部 state 同步更新
        watch(() => props.modelValue, (newValue) => {
            value.value = newValue;
        });

        const handleInput = () => {
            emit('update:modelValue', value.value);
        };

        // 增加數量的函數
        const incrementValue = () => {
            value.value++;
            emit('update:modelValue', value.value);
            emit('amount-changed');
        };

        // 減少數量的函數
        const decrementValue = () => {
            if (value.value > 1) {
                value.value--;
                emit('update:modelValue', value.value);
                emit('amount-changed');
            }
        };

        const projectNameClass = `${PROJECT_NAME}`;

        return {
            projectNameClass,
            value, handleInput, incrementValue, decrementValue
        };
    }
}

export const submitBtn = {
    props: {
        'default_txt': String,
        'sending_txt': String,
        'isdisabled': Boolean
    },
    template: `
    <button type="submit" :class="projectNameClass + '_btn'" :disabled="isdisabled">{{isdisabled ? sending_txt : default_txt}}</button>
    `,
    setup(props, { emit }) {
        const projectNameClass = `${PROJECT_NAME}`;
        return { projectNameClass };
    }
};


export const notification = {
    props: {
        show: Boolean,
        msgtitle: String,
        msgcnt: String,
    },
    template: `
        <div class="notification" v-if="show">
            <div class="notification-block">
                <div class="notification-icon">
                    <svg :data-src="svgSrc"></svg>
                </div>
                <div class="notification-title">{{ msgtitle }}</div>
                <div class="notification-cnt" v-html="msgcnt"></div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const svgSrc = `${baseUrl}assets/images/icon-check_circle.svg`
        return { svgSrc };
    }
}