// validation.js
const { ref, computed } = Vue;

export const useFormValidation = (fields) => {
    const fieldErrors = ref({});

    const validate = () => {
        fieldErrors.value = {};

        fields.forEach((field) => {
            const value = field.ref.value.trim();
            if (value === '') {
                fieldErrors.value[field.name] = `${field.label} 是必填項目`;
            }

            // 添加其他驗證規則，例如郵箱格式驗證等
        });

        return Object.keys(fieldErrors.value).length === 0;
    };

    return {
        fieldErrors,
        validate,
    };
};
