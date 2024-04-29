// 這是從常用調理帖頁面過來的
// 會帶入點選的常用調理帖資料
import { InputField, amountField, SelectField, notification } from '../vue-components.js';
import { useFormValidation } from '../vue-validation.js';
import { useOpenSearch, useNotification } from '../vue-composable.js';
import { useGlobalStateStore } from '../globalState.js';

const { ref, createApp, computed, onMounted, watchEffect } = Vue;
const { createPinia } = Pinia;
const cartSetup = {
    components: {
        'input-field': InputField,
        'amount-field': amountField,
        'select-field': SelectField,
        notification
    },
    setup() {
        const { showNotification, notificationTitle, notificationCnt, showNoti, closeNoti } = useNotification();
        const { isOpenSearch } = useOpenSearch();
        const globalState = useGlobalStateStore();


        const eventBus = window.eventBus;
        const isNodata = ref(false);
        const selectedItems = ref(JSON.parse(localStorage.getItem('replay') || '[]'));
        xinyao.log("localStorage selectedItems", selectedItems.value);

        // 帶入點選的常用調理帖資料
        const replay = ref(JSON.parse(localStorage.getItem('replay') || '[]'));
        xinyao.log("localStorage replay", replay.value);

        const isMobile = ref(globalState.isMobile);

        const p_name = ref('');
        const p_time_options = ref([]);
        for (let i = 1; i <= 10; i++) {
            p_time_options.value.push({
                label: `${i}小時`,
                value: `${i}`
            });
        }
        const p_time = ref(p_time_options.value[0].value);

        // const u_name = ref('');
        // const u_addr = ref('');
        // const u_phone = ref('');


        console.log(replay.value.length);
        if (replay.value.length !== 0) {
            p_name.value = replay.value.p_name;
            p_time.value = replay.value.p_time;
            // u_name.value = replay.value.u_name;
            // u_addr.value = replay.value.u_addr;
            // u_phone.value = replay.value.u_phone;
            selectedItems.value = replay.value.p_detail.map(item => ({
                name: item.item_name,
                amount: parseInt(item.item_amount)
            }));

            xinyao.log("selectedItems.value", selectedItems.value);
        }

        const fields = [
            { name: 'p_name', ref: p_name, label: '調理帖名稱' },
            { name: 'p_time', ref: p_time, label: '調理帖運行時數' },
        ];
        const { fieldErrors, validate } = useFormValidation(fields);
        const frmError = ref('');

        const showAddFavBtn = ref(true);




        // 調理值計算
        const amount_sum = computed(() => {
            return selectedItems.value.reduce((sum, item) => sum + item.amount, 0);
        });

        // 按鈕是否可點擊&錯誤訊息
        // const isDisabled = ref(true);
        // const isOverAmountSum = ref(false);
        const isDisabled = computed(() => {
            // 如果选中项目超过 5 个或总调理值超过 10，则禁用按钮
            return selectedItems.value.length > 5 || amount_sum.value > 10;
        });

        const isOverAmountSum = computed(() => {
            // 如果总调理值超过 10，则标记为超过
            return amount_sum.value > 10;
        });

        const isOverItemsNum = computed(() => {
            return selectedItems.value.length > 5;
        });

        const updateSelectedItems = () => {
            // 可能需要执行一些逻辑来确定哪个项目的数量发生了变化
            // 然后更新 selectedItems 数组中相应项目的数量
            xinyao.log("selectedItems.value", selectedItems.value);
            xinyao.log("amount_sum", amount_sum.value);


            // 更新 localStorage
            // localStorage.setItem('selectedItems', JSON.stringify(selectedItems.value));


        };

        // 移除調理項目
        const removeItem = (index) => {
            // 移除选中的项
            selectedItems.value.splice(index, 1);

            // 更新 localStorage 中的 selectedItems
            // if(replay.value.length == 0) {
            // localStorage.setItem('selectedItems', JSON.stringify(selectedItems.value));
            // globalState.updateSelectedItemsCount();
            // eventBus.setSelectedItemsCount(selectedItems.value.length);
            // }
        }

        const addToFav = () => {
            showNoti('加入成功', `您可以到<a class="link" href="${baseUrl}favourite.html">常用調理帖</a>查看已加入的調理帖。`, () => {

            });
        }
        const sendCart = () => {
            showNoti('送出成功', `即將帶您至<a class="link" href="${baseUrl}history.html">調理帖紀錄</a>查看已送出的調理帖。`, () => {
                window.location.href = `${baseUrl}/history`;
            });
        }

        onMounted(() => {

            if (selectedItems.value.length === 0) {
                isNodata.value = true;
            }
        });

        // const isOpenSearch = ref(eventBus.state.isOpenSearch);
        // watchEffect(() => {
        //     isOpenSearch.value = eventBus.state.isOpenSearch;
        // });

        return {
            selectedItems, isNodata,
            p_name,
            p_time, p_time_options,
            // u_name,
            // u_addr,
            // u_phone,
            fieldErrors, frmError,
            amount_sum,
            updateSelectedItems,
            removeItem,
            isDisabled, isOverAmountSum, isOverItemsNum,
            isOpenSearch,
            showNotification, notificationTitle, notificationCnt,
            addToFav,
            sendCart,
            isMobile,
        }
    }

}

const cart = createApp(cartSetup);
const pinia = createPinia();
cart.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-')
}
cart.use(pinia);
cart.mount("#cart");
